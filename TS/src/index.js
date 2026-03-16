const blessed = require('blessed');
const chalk = require('chalk');
const Entity = require('./entities/Entity');
const Dungeon = require('./core/Dungeon');
const Combat = require('./combat/Combat');
const Puzzle = require('./core/Puzzle');
const Item = require('./items/Item');
const Sprites = require('./ui/Sprites');
const SaveSystem = require('./core/SaveSystem');
const Blacksmith = require('./items/Blacksmith');
const CraftingAltar = require('./items/CraftingAltar');
const QuestBoard = require('./core/QuestBoard');
const Nexus = require('./core/Nexus');

const screen = blessed.screen({ smartCSR: true, title: 'Terminal Souls - The Echoes of Reason', fullUnicode: true, mouse: false });

// --- COMPONENTES UI ---
const titleBox = blessed.box({ top: 0, left: 'center', width: '100%', height: 3, content: chalk.bold.red(' TERMINAL SOULS: THE ECHOES OF REASON '), align: 'center', border: { type: 'line', fg: 'red' } });
const statusBox = blessed.box({ top: 3, left: 0, width: '20%', height: 13, label: ' [ STATUS ] ', border: { type: 'line', fg: 'cyan' } });
const synergyBox = blessed.box({ top: 16, left: 0, width: '20%', height: 8, label: ' [ SINERGIAS ] ', border: { type: 'line', fg: 'magenta' }, tags: true });
const legendBox = blessed.box({ top: 24, left: 0, width: '20%', height: '30%', label: ' [ LEGENDA ] ', border: { type: 'line', fg: 'white' }, tags: true });
const mapBox = blessed.box({ top: 3, left: '20%', width: '60%', height: '65%', label: ' [ MAPA DA FENDA ] ', border: { type: 'line', fg: 'white' }, tags: true });
const combatVisualBox = blessed.box({ top: 3, left: '20%', width: '60%', height: '65%', label: ' [ COMBATE ] ', border: { type: 'line', fg: 'red' }, hidden: true, tags: true });
const logBox = blessed.log({ top: '68%', left: '20%', width: '80%', height: '30%', label: ' [ CRÔNICAS ] ', border: { type: 'line', fg: 'yellow' }, scrollable: true, alwaysScroll: true });
const actionMenu = blessed.list({ top: '68%', left: 0, width: '20%', height: '30%', label: ' [ AÇÕES ] ', border: { type: 'line', fg: 'green' }, keys: true, vi: true, style: { selected: { bg: 'red', bold: true } } });
const interactBox = blessed.box({ top: 'center', left: 'center', width: '50%', height: 9, label: ' [ INTERAÇÃO ] ', border: { type: 'line', fg: 'white' }, hidden: true, tags: true });
const inputField = blessed.textbox({ parent: interactBox, top: 5, left: 2, width: '90%', height: 1, inputOnFocus: true, style: { bg: 'blue' } });
const inventoryBox = blessed.list({ top: 3, left: '20%', width: '60%', height: '65%', label: ' [ LISTA ] ', border: { type: 'line', fg: 'cyan' }, keys: true, vi: true, style: { selected: { bg: 'blue', bold: true } }, hidden: true });
const itemDetailBox = blessed.box({ top: '68%', left: '20%', width: '80%', height: '30%', label: ' [ ANALISE DE DADOS ] ', border: { type: 'line', fg: 'yellow' }, tags: true, hidden: true });
const equipVisualBox = blessed.box({ top: 3, left: '80%', width: '20%', height: '65%', label: ' [ EQUIPAMENTO ] ', border: { type: 'line', fg: 'magenta' }, tags: true, scrollable: true });

let player = null;
let currentBlacksmith = new Blacksmith(1);
let currentAltar = new CraftingAltar();
let questBoard = new QuestBoard();
let currentDungeon = null;
let currentCombat = null;
let currentNexus = new Nexus();
let gameState = 'MENU';

// --- SISTEMA DE SAVE ---
function saveGame() { if (player && SaveSystem.save(player.serialize())) log(chalk.green('💾 Alma vinculada (Salvo).')); }
function loadGame() {
  const data = SaveSystem.load();
  if (data) { player = Entity.fromSave(data); log(chalk.cyan('✨ Reencarnação concluída.')); updateStatus(); showNexus(); }
}

// --- RENDERIZAÇÃO ---
function updateStatus() {
  if (!player) return;
  const hpColor = player.hp < player.maxHp * 0.3 ? chalk.red : chalk.green;
  const prestige = player.calculatePrestige();
  
  statusBox.setContent(`
  ${chalk.bold.cyan(player.name)}
  ${chalk.gray(player.race + ' | ' + player.background)}
  LVL: ${player.level} | XP: ${player.xp}/${player.level * 100}

  HP: ${hpColor(player.hp + '/' + player.maxHp)}
  SP: ${chalk.yellow(player.sp + '/' + player.maxSp)}
  MP: ${chalk.blue(player.mp + '/' + player.maxMp)}

  STR: ${player.strength} | DEX: ${player.dexterity} | INT: ${player.intelligence}
  ESTAB: ${player.posture}/${player.maxPosture}

  ${chalk.bold.yellow('ORBES:')} ${player.orbs}
  ${chalk.bold.magenta('SKILLS:')} ${player.skillPoints}
  
  ${chalk.bold.white('RENOME:')} ${chalk.bold.green(prestige)}
  `);
  
  let synergyContent = '';
  if (player.background === 'Guerreiro') synergyContent += chalk.red('• +10% Dano Físico\n');
  if (player.background === 'Mago') synergyContent += chalk.blue('• +10% Dano Mágico\n');
  if (player.background === 'Arqueiro') synergyContent += chalk.yellow('• +10 Postura Máxima\n');
  if (player.background === 'Clérigo') synergyContent += chalk.green('• +10% Recuperação\n');
  if (player.postureMode === 'INERCIA') synergyContent += chalk.cyan('• INÉRCIA: +100% Def\n');
  if (player.postureMode === 'MOMENTO') synergyContent += chalk.yellow('• MOMENTO: +50% Dmg\n');
  synergyBox.setContent(synergyContent);

  let equipContent = `${chalk.bold('EQUIPADO:')}\n\n`;
  for (const [type, item] of Object.entries(player.equipment)) {
    equipContent += `${chalk.bold.underline(type)}: ${item ? item.getColorizedName() : chalk.gray('Vazio')}\n`;
    if (item) { for (const [s, v] of Object.entries(item.stats)) { if (typeof v === 'number') equipContent += ` ${chalk.green('+'+v)} ${s.toUpperCase()}\n`; } }
    equipContent += '\n';
  }
  equipVisualBox.setContent(equipContent);
  updateLegend(); screen.render();
}

function updateLegend() {
  let content = '';
  if (gameState === 'EXPLORING' && currentDungeon) {
    content += `${Sprites.objects.player || '@ '} : Voce\n${Sprites.objects.enemy} : Inimigo\n${Sprites.objects.boss} : Guardiao\n${Sprites.objects.treasure} : Tesouro\n${Sprites.objects.door} : Escada\n${Sprites.objects.puzzle} : Enigma\n${Sprites.objects.rest} : Descanso\n`;
  } else if (gameState === 'COMBAT' && currentCombat) {
    const enemy = currentCombat.enemies[0];
    content += `${chalk.bold.red('ALVO:')}\n${enemy.name}\nLvl: ${enemy.level}\nEstabilidade: ${enemy.posture}\n`;
    if (enemy.isStaggered) content += chalk.bgRed.white(' COLAPSO ') + '\n';
  } else if (gameState === 'NEXUS') { content += chalk.bold.blue('NPCs NO HUB:\n') + 'Ada: Skills\nMarie Curie: Alquimia\nDarwin: Evolucao\nHalthor: Ferreiro'; }
  legendBox.setContent(content);
}

// --- ATUALIZAÇÃO DINÂMICA DA SEÇÃO DE DETALHES ---
function updateDetailSection(listComponent) {
  const i = listComponent.selected;
  if (gameState === 'INVENTORY' && player.inventory[i]) {
    itemDetailBox.setContent(player.inventory[i].getDetails());
  } else if (gameState === 'SKILL_TREE') {
    const name = Object.keys(player.skillTree)[i];
    const s = player.skillTree[name];
    if (s) itemDetailBox.setContent(`${chalk.bold.cyan(name)}\n\nNivel: ${s.lvl}\nCusto de Mana: ${s.cost}\nDescricao: ${s.desc}\n\nUse [1-0] ou Enter para upar.`);
  } else if (gameState === 'BESTIARY') {
    const name = Object.keys(player.bestiary)[i];
    if (name) itemDetailBox.setContent(`${chalk.bold.red(name)}\n\nAbates: ${player.bestiary[name]}\nAnalise: Habitante das fendas.\nFraquezas: Em processamento...`);
  } else if (gameState === 'MARIE' && player.inventory[i]) {
    itemDetailBox.setContent(player.inventory[i].getDetails() + '\n\n' + chalk.magenta('Selecione para Reroll (20 Orbes).'));
  }
  screen.render();
}

inventoryBox.on('element focus', (el) => updateDetailSection(inventoryBox));
actionMenu.on('element focus', (el) => {
  if (gameState === 'NEXUS' || gameState === 'COMBAT') {
    const text = el.getText();
    itemDetailBox.setContent(chalk.bold.yellow('Acao Selecionada:\n\n') + text + '\n\nNavegue com Q/E ou 1-0.');
    screen.render();
  }
});

function showInventory() {
  gameState = 'INVENTORY'; mapBox.hide(); logBox.hide(); inventoryBox.show(); itemDetailBox.show();
  inventoryBox.setLabel(' [ INVENTÁRIO ] ');
  const items = player.inventory.map(it => `${it.getColorizedName()} (${it.type})`);
  inventoryBox.setItems(items); inventoryBox.focus();
  actionMenu.setItems([' [V/ESC] Voltar']);
  updateDetailSection(inventoryBox);
}

inventoryBox.on('select', (item, index) => {
  if (gameState === 'INVENTORY') { const it = player.inventory[index]; if (!it) return; if (it.type === 'CONSUMÍVEL') player.useConsumable(it); else player.equipItem(it); updateStatus(); showInventory(); }
  else if (gameState === 'SKILL_TREE') { const n = Object.keys(player.skillTree)[index]; if (player.upgradeSkill(n)) { log(chalk.green(`Up: ${n}`)); showPassives(); } }
  else if (gameState === 'MARIE') handleMarieAction(index);
});

function showPassives() {
  gameState = 'SKILL_TREE'; mapBox.hide(); logBox.hide(); inventoryBox.show(); itemDetailBox.show();
  const items = Object.keys(player.skillTree).map(n => ` [${player.skillTree[n].lvl}] ${n}`);
  inventoryBox.setItems(items); inventoryBox.setLabel(` [ ARVORE DE SKILLS - PONTOS: ${player.skillPoints} ] `); 
  inventoryBox.focus(); updateDetailSection(inventoryBox);
}

function showBestiary() {
  gameState = 'BESTIARY'; mapBox.hide(); logBox.hide(); inventoryBox.show(); itemDetailBox.show();
  const known = Object.keys(player.bestiary);
  const items = known.length > 0 ? known.map(name => `${chalk.red(name)} - Abates: ${player.bestiary[name]}`) : [chalk.gray('Nenhum dado.')];
  inventoryBox.setItems(items); inventoryBox.setLabel(' [ BESTIARIO ] '); inventoryBox.focus();
  actionMenu.setItems([' [V/ESC] Voltar']); updateDetailSection(inventoryBox);
}

function showNexus() {
  gameState = 'NEXUS'; mapBox.show(); logBox.show(); inventoryBox.hide(); itemDetailBox.show();
  mapBox.setLabel(chalk.blue(' [ O NEXUS - VILA DO CONHECIMENTO ] '));
  mapBox.setContent(currentNexus.render());
  actionMenu.setItems([' [WASD] Mover', ' [7] Inventário', ' [8] Bestiário', ' [9] Skills', ' [ESC] Sair']);
  actionMenu.focus(); updateStatus();
}

function showAda() { gameState = 'ADA'; actionMenu.setLabel(' [ ADA: ALGORITMOS ] '); actionMenu.setItems([' [1] Compilar Skill (50 Orbes)', ' [ESC] Voltar']); actionMenu.focus(); }
function handleAda(c) { if (c.includes('Compilar')) { if (player.compileSkill(50)) { log(chalk.cyan('Skill Points +1.')); showNexus(); } else log(chalk.red('Sem orbes.')); } }

function showMarie() {
  gameState = 'MARIE'; actionMenu.setLabel(` [ MARIE: ALQUIMIA ] `);
  actionMenu.setItems([' [ESC] Voltar']);
  const items = player.inventory.map(it => `${it.getColorizedName()}`);
  inventoryBox.setItems(items); inventoryBox.show(); inventoryBox.focus(); mapBox.hide(); itemDetailBox.show();
  updateDetailSection(inventoryBox);
}

function handleMarieAction(index) { if (currentAltar.reRollItem(player, index)) { log(chalk.green('Realinhado!')); showMarie(); updateStatus(); } else log(chalk.red('Falha.')); }

function showDarwin() { gameState = 'DARWIN'; actionMenu.setLabel(' [ DARWIN: EVOLUCAO ] '); actionMenu.setItems([' [1] + FORÇA (30 Orbes)', ' [2] + DESTREZA (30 Orbes)', ' [3] + INTELIGÊNCIA (30 Orbes)', ' [ESC] Voltar']); actionMenu.focus(); }
function handleDarwin(c) {
  let s = false; if (c.includes('Força')) s = player.adaptAttribute('STR', 30); if (c.includes('Destreza')) s = player.adaptAttribute('DEX', 30); if (c.includes('Intelecto')) s = player.adaptAttribute('INT', 30);
  if (s) { log(chalk.green('Evoluído!')); updateStatus(); showNexus(); } else log(chalk.red('Sem orbes.'));
}

function showBlacksmith() { gameState = 'TRADE_BUY'; actionMenu.setLabel(' [ HALTHOR: FERREIRO ] '); actionMenu.setItems(currentBlacksmith.getMenuOptions()); actionMenu.focus(); }
function showBlacksmithSell() { gameState = 'TRADE_SELL'; const items = player.inventory.map(it => `${it.getColorizedName()} (${Math.floor(it.getPrice()*0.4)} Orbes)`); items.push(' [ESC] Voltar'); actionMenu.setItems(items); actionMenu.focus(); }
function handleTrade(c, index) {
  if (gameState === 'TRADE_BUY') { if (c.includes('VENDER')) showBlacksmithSell(); else if (currentBlacksmith.buyItem(player, index)) { log(chalk.green('Comprado!')); showBlacksmith(); updateStatus(); } else log(chalk.red('Sem orbes!')); }
  else if (gameState === 'TRADE_SELL') { if (c.includes('Voltar')) showBlacksmith(); else { const v = currentBlacksmith.sellItem(player, index); if (v) { log(chalk.green(`Vendido: ${v}`)); showBlacksmithSell(); updateStatus(); } } }
}

function showQuests() { gameState = 'QUESTS'; actionMenu.setLabel(' [ QUADRO DE MISSÕES ] '); actionMenu.setItems(questBoard.getMenuOptions(player)); actionMenu.focus(); }
function handleQuests(c, i) {
  if (c.includes('Voltar')) { showNexus(); return; }
  if (c.includes('ENTREGAR')) { if (questBoard.turnInQuest(player)) { log(chalk.green('Concluída!')); showQuests(); updateStatus(); } }
  else if (questBoard.acceptQuest(player, i)) { log(chalk.cyan('Aceita!')); showQuests(); } else log(chalk.red('Erro.'));
}

function renderMap() {
  if (!currentDungeon) return; let d = '';
  for (let y = 0; y < currentDungeon.height; y++) {
    for (let x = 0; x < currentDungeon.width; x++) {
      if (x === currentDungeon.playerPos.x && y === currentDungeon.playerPos.y) d += chalk.bold.cyan('@ ');
      else { const t = currentDungeon.grid[y][x]; switch(t.type) { case 'WALL': d += Sprites.objects.wall; break; case 'FLOOR': d += Sprites.objects.floor; break; case 'TREASURE': d += Sprites.objects.treasure; break; case 'ENEMY': d += Sprites.objects.enemy; break; case 'BOSS': d += Sprites.objects.boss; break; case 'PUZZLE': d += Sprites.objects.puzzle; break; case 'EXIT': d += Sprites.objects.door; break; case 'REST': d += Sprites.objects.rest; break; } }
    }
    d += '\n';
  }
  mapBox.setContent(d); updateLegend(); screen.render();
}

function renderCombat() {
  if (!currentCombat) return; const e = currentCombat.enemies[0]; const es = Sprites.getEnemySprite(e.name); const ps = Sprites.getPlayerSprite(player.race);
  let d = '\n'; es.forEach(l => { d += ' '.repeat(35) + l + '\n'; }); d += ' '.repeat(33) + chalk.bold.red(e.name) + '\n';
  const hpP = Math.min(10, Math.max(0, Math.floor(e.hp/e.maxHp*10))); d += ' '.repeat(33) + `HP: [${'#'.repeat(hpP)}${'.'.repeat(10-hpP)}]\n\n` + ' '.repeat(5) + '-'.repeat(50) + '\n\n';
  ps.forEach(l => { d += ' '.repeat(5) + l + '\n'; }); combatVisualBox.setContent(d); updateLegend(); screen.render();
}

function log(msg) { logBox.log(msg); screen.render(); }

function startDungeon(floor = 1) {
  currentDungeon = new Dungeon(floor); gameState = 'EXPLORING'; mapBox.setLabel(chalk[currentDungeon.biome.color](` [ ${currentDungeon.biome.name} - ${floor} ] `));
  mapBox.show(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.show(); logBox.show();
  actionMenu.setLabel(' [ EXPLORACAO ] '); actionMenu.setItems([' [1] Norte', ' [2] Sul', ' [3] Oeste', ' [4] Leste', ' [5] Inv', ' [6] Skills', ' [ESC] Fugir']);
  log(chalk.green(`Fenda ${floor} aberta.`)); renderMap();
}

function handleMove(dx, dy) {
  if (gameState === 'EXPLORING') {
    const t = currentDungeon.movePlayer(dx, dy);
    if (t) { if (t.type !== 'FLOOR') handleTileInteraction(t); renderMap(); }
  } else if (gameState === 'NEXUS') {
    const interaction = currentNexus.movePlayer(dx, dy);
    mapBox.setContent(currentNexus.render());
    if (interaction) {
      log(chalk.cyan(interaction.dialogue));
      if (interaction.name === 'Ada') showAda();
      else if (interaction.name === 'Marie Curie') showMarie();
      else if (interaction.name === 'Darwin') showDarwin();
      else if (interaction.name === 'Halthor') showBlacksmith();
      else if (interaction.name === 'Fenda') startDungeon();
    }
    screen.render();
  }
}
function handleTileInteraction(t) {
  switch(t.type) {
    case 'ENEMY': case 'BOSS': startCombat(t.data); t.type = 'FLOOR'; break;
    case 'EXIT': startDungeon(currentDungeon.floor + 1); break;
    case 'TREASURE': const l = new Item(currentDungeon.floor); player.inventory.push(l); log(chalk.yellow(`Loot: ${l.name}`)); t.type = 'FLOOR'; break;
    case 'PUZZLE': startPuzzle(t); break;
    case 'REST': player.recover(0.5, 0.5, 0.5); log(chalk.green('Descansou.')); t.type = 'FLOOR'; break;
  }
}

function startCombat(e) { gameState = 'COMBAT'; currentCombat = new Combat(player, e); mapBox.hide(); combatVisualBox.show(); renderCombat(); actionMenu.setItems([' [1] ATACAR', ' [2] SKILLS', ' [3] RECUPERAR', ' [4] POSTURA', ' [ESC] Fugir']); actionMenu.focus(); }
function handleCombatAction(c) {
  if (currentCombat.isOver) return; if (c.includes('ATACAR')) currentCombat.playerAction('ATTACK');
  else if (c.includes('SKILLS')) { const l = player.getLearnedSkills(); if (l.length === 0) log(chalk.red('Sem skills!')); else { gameState = 'COMBAT_SKILLS'; actionMenu.setItems([...l, ' [ESC] Voltar']); actionMenu.focus(); return; } }
  else if (c.includes('RECUPERAR')) currentCombat.playerAction('RECOVER');
  else if (c.includes('POSTURA')) { const m = ['INERCIA', 'EQUILIBRIO', 'MOMENTO']; player.setPostureMode(m[(m.indexOf(player.postureMode)+1)%3]); log(chalk.cyan(`Postura: ${player.postureMode}`)); }
  processCombatTurn();
}

function processCombatTurn(s = null) {
  if (s) currentCombat.playerAction('SKILL', 0, s);
  currentCombat.log.forEach(m => logBox.log(m)); currentCombat.log = []; updateStatus(); renderCombat();
  if (currentCombat.isOver) {
    if (currentCombat.result === 'WIN') { gameState = 'EXPLORING'; combatVisualBox.hide(); mapBox.show(); if (currentCombat.enemies.some(e => e.name.includes('CHEFE'))) { log(chalk.magenta('GUARDIÃO CAIU!')); const t = currentDungeon.getTile(currentDungeon.playerPos.x, currentDungeon.playerPos.y); if (t) t.type = 'EXIT'; renderMap(); } }
    else { log(chalk.red('MORTE.')); SaveSystem.deleteSave(); setTimeout(() => process.exit(0), 3000); }
  }
}

function startPuzzle(t) {
  gameState = 'PUZZLE'; const p = new Puzzle(null, currentDungeon.floor); logBox.log(chalk.blue(`ENIGMA: ${p.question}`)); interactBox.show(); inputField.focus(); inputField.setValue(''); screen.render();
  inputField.once('submit', (v) => { interactBox.hide(); if (p.checkAnswer(v)) { player.addExperience(50*currentDungeon.floor); log(chalk.green('Sucesso!')); t.type = 'FLOOR'; } else { log(chalk.red('Falha!')); player.takeDamage(20); } gameState = 'EXPLORING'; updateStatus(); });
}

function startCreation() {
  gameState = 'CREATION_NAME'; interactBox.setLabel(' [ NOME ] '); interactBox.show(); inputField.focus(); inputField.setValue(''); screen.render();
  inputField.once('submit', (n) => {
    if (!n || n.trim() === '') n = 'Exilado';
    gameState = 'CREATION_RACE'; interactBox.hide(); actionMenu.setLabel(' [ RAÇA ] '); actionMenu.setItems([' Humano', ' Elfo', ' Anão', ' Orc']); actionMenu.focus(); screen.render();
    actionMenu.once('select', (i) => {
      const r = i.getText().trim();
      gameState = 'CREATION_CLASS'; actionMenu.setLabel(' [ CLASSE ] '); actionMenu.setItems([' Guerreiro', ' Mago', ' Arqueiro', ' Clérigo']); actionMenu.focus(); screen.render();
      actionMenu.once('select', (c) => { player = new Entity(n, { race: r, background: c.getText().trim() }); showNexus(); });
    });
  });
}

// --- ATALHOS NUMÉRICOS GLOBAIS (1-0) ---
const numKeys = ['1','2','3','4','5','6','7','8','9','0'];
numKeys.forEach((key, idx) => {
  screen.key([key], () => {
    const list = inventoryBox.visible ? inventoryBox : (actionMenu.focused ? actionMenu : null);
    if (list) {
      const realIdx = key === '0' ? 9 : idx;
      if (realIdx < list.items.length) {
        list.select(realIdx); list.emit('select', list.getItem(realIdx), realIdx);
        updateDetailSection(list); screen.render();
      }
    }
  });
});

screen.key(['w'], () => handleMove(0, -1)); screen.key(['s'], () => handleMove(0, 1));
screen.key(['a'], () => handleMove(-1, 0)); screen.key(['d'], () => handleMove(1, 0));
screen.key(['q'], () => { const l = inventoryBox.visible ? inventoryBox : actionMenu; l.up(1); updateDetailSection(l); });
screen.key(['e'], () => { const l = inventoryBox.visible ? inventoryBox : actionMenu; l.down(1); updateDetailSection(l); });

screen.key(['escape', 'v'], () => {
  if (gameState === 'MENU') process.exit(0);
  inventoryBox.hide(); itemDetailBox.hide(); mapBox.show(); logBox.show();
  if (gameState === 'EXPLORING' || gameState === 'COMBAT') { saveGame(); currentDungeon = null; showNexus(); }
  else if (gameState === 'CREATION_NAME') process.exit(0);
  else showNexus();
});

actionMenu.on('select', (item, index) => {
  const c = item.getText().trim();
  if (gameState === 'MENU') { if (c.includes('Novo Jogo')) startCreation(); if (c.includes('Carregar')) loadGame(); if (c.includes('Sair')) process.exit(0); }
  else if (gameState === 'NEXUS') {
    if (c.includes('Entrar')) startDungeon(); else if (c.includes('Ada')) showAda(); else if (c.includes('Marie')) showMarie(); else if (c.includes('Darwin')) showDarwin(); else if (c.includes('Halthor')) showBlacksmith(); else if (c.includes('Missões')) showQuests(); else if (c.includes('Inventário')) showInventory(); else if (c.includes('Bestiário')) showBestiary(); else if (c.includes('Skills')) showPassives(); else if (c.includes('Sair')) process.exit(0);
  }
  else if (gameState === 'ADA') handleAda(c);
  else if (gameState === 'DARWIN') handleDarwin(c);
  else if (gameState === 'COMBAT') handleCombatAction(c);
  else if (gameState === 'COMBAT_SKILLS') processCombatTurn(c);
  else if (gameState === 'ATTRIBUTES') { if (c.includes('FORÇA')) player.upgradeAttribute('STR'); if (c.includes('DESTREZA')) player.upgradeAttribute('DEX'); if (c.includes('INTELIGÊNCIA')) player.upgradeAttribute('INT'); updateStatus(); }
  else if (gameState === 'TRADE_BUY' || gameState === 'TRADE_SELL') handleTrade(c, index);
  else if (gameState === 'QUESTS') handleQuests(c, index);
});

screen.on('resize', () => screen.render());
screen.append(titleBox); screen.append(statusBox); screen.append(synergyBox); screen.append(legendBox); screen.append(mapBox);
screen.append(combatVisualBox); screen.append(inventoryBox); screen.append(itemDetailBox);
screen.append(equipVisualBox); screen.append(logBox); screen.append(actionMenu); screen.append(interactBox);
const initialMenu = [' [1] Novo Jogo', ' [2] Carregar Jogo', ' [3] Sair']; actionMenu.setItems(initialMenu); actionMenu.focus(); updateStatus();
