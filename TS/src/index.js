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

const screen = blessed.screen({ smartCSR: true, title: 'Terminal Souls - The Echoes of Reason', fullUnicode: true, mouse: true });

// --- COMPONENTES UI ---
const titleBox = blessed.box({ top: 0, left: 'center', width: '100%', height: 3, content: chalk.bold.red(' TERMINAL SOULS: THE ECHOES OF REASON '), align: 'center', border: { type: 'line', fg: 'red' } });
const statusBox = blessed.box({ top: 3, left: 0, width: '20%', height: 13, label: ' [ STATUS ] ', border: { type: 'line', fg: 'cyan' } });
const synergyBox = blessed.box({ top: 16, left: 0, width: '20%', height: 8, label: ' [ SINERGIAS ] ', border: { type: 'line', fg: 'magenta' }, tags: true });
const legendBox = blessed.box({ top: 24, left: 0, width: '20%', height: '30%', label: ' [ LEGENDA ] ', border: { type: 'line', fg: 'white' }, tags: true });
const mapBox = blessed.box({ top: 3, left: '20%', width: '60%', height: '65%', label: ' [ MAPA DA FENDA ] ', border: { type: 'line', fg: 'white' }, tags: true, mouse: true });
const combatVisualBox = blessed.box({ top: 3, left: '20%', width: '60%', height: '65%', label: ' [ COMBATE ] ', border: { type: 'line', fg: 'red' }, hidden: true, tags: true });
const logBox = blessed.log({ top: '68%', left: '20%', width: '80%', height: '30%', label: ' [ CRÔNICAS ] ', border: { type: 'line', fg: 'yellow' }, scrollable: true, alwaysScroll: true, mouse: true });
const actionMenu = blessed.list({ top: '68%', left: 0, width: '20%', height: '30%', label: ' [ AÇÕES ] ', border: { type: 'line', fg: 'green' }, keys: true, vi: true, mouse: true, style: { selected: { bg: 'red', bold: true }, item: { hover: { bg: 'blue' } } } });
const interactBox = blessed.box({ top: 'center', left: 'center', width: '50%', height: 9, label: ' [ INTERAÇÃO ] ', border: { type: 'line', fg: 'white' }, hidden: true, tags: true });
const inputField = blessed.textbox({ parent: interactBox, top: 5, left: 2, width: '90%', height: 1, inputOnFocus: true, style: { bg: 'blue' } });
const inventoryBox = blessed.list({ top: 3, left: '20%', width: '60%', height: '65%', label: ' [ INVENTÁRIO ] ', border: { type: 'line', fg: 'cyan' }, keys: true, vi: true, mouse: true, style: { selected: { bg: 'blue', bold: true }, item: { hover: { bg: 'magenta' } } }, hidden: true });
const itemDetailBox = blessed.box({ top: '68%', left: '20%', width: '80%', height: '30%', label: ' [ DETALHES ] ', border: { type: 'line', fg: 'yellow' }, tags: true, hidden: true });
const equipVisualBox = blessed.box({ top: 3, left: '80%', width: '20%', height: '65%', label: ' [ EQUIPAMENTO ] ', border: { type: 'line', fg: 'magenta' }, tags: true, scrollable: true });

let player = null;
let currentBlacksmith = new Blacksmith(1);
let currentAltar = new CraftingAltar();
let questBoard = new QuestBoard();
let currentDungeon = null;
let currentCombat = null;
let gameState = 'MENU';

// --- SISTEMA DE SAVE ---
function saveGame() { if (SaveSystem.save(player.serialize())) log(chalk.green('💾 Alma vinculada (Salvo).')); }
function loadGame() {
  const data = SaveSystem.load();
  if (data) { player = Entity.fromSave(data); log(chalk.cyan('✨ Reencarnação concluída.')); updateStatus(); showNexus(); }
}

// --- RENDERIZAÇÃO ---
function updateStatus() {
  if (!player) return;
  const hpColor = player.hp < player.maxHp * 0.3 ? chalk.red : chalk.green;
  statusBox.setContent(`${chalk.bold.cyan(player.name)}\n${chalk.gray(player.race + ' | ' + player.background)}\nLVL: ${player.level} | XP: ${player.xp}/${player.level * 100}\n\nHP: ${hpColor(player.hp + '/' + player.maxHp)}\nSP: ${chalk.yellow(player.sp + '/' + player.maxSp)}\nMP: ${chalk.blue(player.mp + '/' + player.maxMp)}\n\nSTR: ${player.strength} | DEX: ${player.dexterity} | INT: ${player.intelligence}\nORBES: ${chalk.yellow(player.orbs)}\nSKILLS: ${chalk.bold.magenta(player.skillPoints)}`);
  
  let synergyContent = '';
  if (player.background === 'Guerreiro') synergyContent += chalk.red('• +10% Dano Físico\n');
  if (player.background === 'Mago') synergyContent += chalk.blue('• +10% Dano Mágico\n');
  if (player.background === 'Arqueiro') synergyContent += chalk.yellow('• +10 Postura Máxima\n');
  if (player.background === 'Clérigo') synergyContent += chalk.green('• +10% Recuperação\n');
  synergyBox.setContent(synergyContent);

  let equipContent = `${chalk.bold('EQUIPADO:')}\n\n`;
  for (const [type, item] of Object.entries(player.equipment)) {
    equipContent += `${chalk.bold.underline(type)}: ${item ? item.getColorizedName() : chalk.gray('Vazio')}\n`;
    if (item) {
      for (const [s, v] of Object.entries(item.stats)) { if (typeof v === 'number') equipContent += ` ${chalk.green('+'+v)} ${s.toUpperCase()}\n`; }
      if (item.uniques.length > 0) equipContent += ` ${chalk.magenta('U: ' + item.uniques[0])}\n`;
    }
    equipContent += '\n';
  }
  equipVisualBox.setContent(equipContent);
  updateLegend();
  screen.render();
}

function updateLegend() {
  let content = '';
  if (gameState === 'EXPLORING' && currentDungeon) {
    content += `${Sprites.objects.player || chalk.bold.cyan('@ ')} : Voce\n${Sprites.objects.enemy} : Inimigo\n${Sprites.objects.boss} : Guardiao\n${Sprites.objects.treasure} : Tesouro\n${Sprites.objects.door} : Escada\n${Sprites.objects.puzzle} : Enigma\n${Sprites.objects.rest} : Descanso\n`;
  } else if (gameState === 'COMBAT' && currentCombat) {
    const enemy = currentCombat.enemies[0];
    content += `${chalk.bold.red('ALVO:')}\n${enemy.name}\nLvl: ${enemy.level}\n`;
    if (enemy.isStaggered) content += chalk.bgRed.white(' STAGGER ') + '\n';
  } else if (gameState === 'BESTIARY') {
    content += chalk.bold.cyan('ANALISE CIENTIFICA:\n') + chalk.gray('Passe o mouse ou\nfocalize um monstro\npara ver os dados.');
  } else {
    content += chalk.gray('Nenhuma informacao\nno momento.');
  }
  legendBox.setContent(content);
}

function showInventory() {
  gameState = 'INVENTORY'; mapBox.hide(); logBox.hide(); inventoryBox.show(); itemDetailBox.show();
  const items = player.inventory.map(it => `${it.getColorizedName()} (${it.type})`);
  inventoryBox.setItems(items); inventoryBox.focus();
  actionMenu.setItems([' [ENTER/F] Usar/Equipar', ' [V/ESC] Voltar']);
  if (player.inventory.length > 0) itemDetailBox.setContent(player.inventory[0].getDetails());
  screen.render();
}

inventoryBox.on('element mouseover', (el) => { const i = inventoryBox.getItemIndex(el); if (player.inventory[i]) { itemDetailBox.setContent(player.inventory[i].getDetails()); screen.render(); } });
inventoryBox.on('element focus', (el) => { const i = inventoryBox.getItemIndex(el); if (player.inventory[i]) { itemDetailBox.setContent(player.inventory[i].getDetails()); screen.render(); } });
inventoryBox.on('select', (item, index) => {
  const selectedItem = player.inventory[index]; if (!selectedItem) return;
  if (selectedItem.type === 'CONSUMÍVEL') player.useConsumable(selectedItem); else player.equipItem(selectedItem);
  updateStatus(); showInventory();
});

function showPassives() {
  gameState = 'SKILL_TREE'; const items = Object.keys(player.skillTree).map(n => ` [${player.skillTree[n].lvl}] ${n}`); items.push(' [ESC] Voltar');
  actionMenu.setItems(items); actionMenu.setLabel(` [ SKILLS - PONTOS: ${player.skillPoints} ] `); actionMenu.focus(); updateStatus();
}

function handleSkillUpgrade(choice) {
  let skillName = null; Object.keys(player.skillTree).forEach(n => { if (choice.includes(n)) skillName = n; });
  if (skillName && player.upgradeSkill(skillName)) { log(chalk.green(`Up: ${skillName}`)); showPassives(); } else log(chalk.red('Erro no upgrade!'));
}

function showBestiary() {
  gameState = 'BESTIARY'; mapBox.hide(); logBox.hide(); inventoryBox.show(); itemDetailBox.show();
  const known = Object.keys(player.bestiary);
  const items = known.length > 0 ? known.map(name => `${chalk.red(name)} - Abates: ${player.bestiary[name]}`) : [chalk.gray('Nenhum dado coletado.')];
  inventoryBox.setItems(items); inventoryBox.setLabel(' [ BESTIARIO CIENTIFICO ] '); inventoryBox.focus();
  actionMenu.setItems([' [V/ESC] Voltar']);
  screen.render();
}

inventoryBox.on('element focus', (el) => {
  if (gameState === 'BESTIARY') {
    const i = inventoryBox.getItemIndex(el);
    const name = Object.keys(player.bestiary)[i];
    if (name) {
      itemDetailBox.setContent(`${chalk.bold.red(name)}\n\nDados Coletados: ${player.bestiary[name]} espécimes.\nAnalise: Criatura que habita as fendas de razão.\nFraquezas: Desconhecidas (Em analise).`);
      screen.render();
    }
  }
});

function showAttributes() {
  gameState = 'ATTRIBUTES'; actionMenu.setItems([` [S] + FORÇA (${player.strength})`, ` [D] + DESTREZA (${player.dexterity})`, ` [I] + INTELIGÊNCIA (${player.intelligence})`, ' [ESC] Voltar']); actionMenu.focus(); updateStatus();
}

function handleAttributeUpgrade(choice) {
  let s = false; if (choice.includes('FORÇA')) s = player.upgradeAttribute('STR'); if (choice.includes('DESTREZA')) s = player.upgradeAttribute('DEX'); if (choice.includes('INTELIGÊNCIA')) s = player.upgradeAttribute('INT');
  if (s) { log(chalk.green('Atributo up!')); showAttributes(); } else log(chalk.red('Sem pontos!'));
}

function showProficiencies() {
  gameState = 'PROFICIENCIES'; const items = Object.keys(player.proficiencies).map(t => ` [${t}] LVL ${player.proficiencies[t]}`); items.push(' [ESC] Voltar');
  actionMenu.setItems(items); actionMenu.setLabel(` [ PROFICIÊNCIAS - PONTOS: ${player.proficiencyPoints} ] `); actionMenu.focus(); updateStatus();
}

function handleProficiencyUpgrade(choice) {
  const tags = ['CORTE', 'ESMAGAMENTO', 'FOGO', 'CHOQUE', 'VAZIO']; let target = null; tags.forEach(t => { if (choice.includes(t)) target = t; });
  if (target && player.upgradeProficiency(target)) { log(chalk.green(`Mestria ${target} up!`)); showProficiencies(); } else log(chalk.red('Sem pontos!'));
}

function showNexus() {
  gameState = 'NEXUS'; mapBox.setContent('\n\n    ' + chalk.bold.blue('[ O NEXUS ]') + '\n\n  Hub de Conhecimento.\n  Halthor martela ecos de Newton.\n  O Altar de Turing brilha.');
  actionMenu.setItems([' [1] Entrar na Fenda', ' [2] Halthor (Ferreiro)', ' [3] Altar de Turing', ' [4] Quadro de Missões', ' [I] Inventário', ' [H] Atributos', ' [B] Bestiário', ' [K] Árvore de Skills', ' [ESC] Menu Principal']);
  actionMenu.focus(); updateStatus();
}

function showAltar() {
  gameState = 'ALTAR'; actionMenu.setLabel(` [ ALTAR - ${currentAltar.reRollCost} ORBES ] `);
  const items = player.inventory.map(it => currentAltar.canReRoll(it) ? `${it.getColorizedName()}` : chalk.gray(`${it.name}`)); items.push(' [ESC] Voltar');
  actionMenu.setItems(items); actionMenu.focus();
}

function handleAltar(choice, index) {
  if (choice.includes('Voltar')) { showNexus(); return; }
  if (currentAltar.reRollItem(player, index)) { log(chalk.magenta('Realinhado!')); showAltar(); updateStatus(); } else log(chalk.red('Erro: Orbes/Item.'));
}

function showQuests() { gameState = 'QUESTS'; actionMenu.setLabel(' [ MISSÕES ] '); actionMenu.setItems(questBoard.getMenuOptions(player)); actionMenu.focus(); }
function handleQuests(choice, index) {
  if (choice.includes('Voltar')) { showNexus(); return; }
  if (choice.includes('ENTREGAR')) { if (questBoard.turnInQuest(player)) { log(chalk.green('Concluída!')); showQuests(); updateStatus(); } }
  else if (questBoard.acceptQuest(player, index)) { log(chalk.cyan('Aceita!')); showQuests(); } else log(chalk.red('Erro ao aceitar.'));
}

function showBlacksmith() { gameState = 'TRADE_BUY'; actionMenu.setLabel(` [ FERREIRO - ${player.orbs} ORBES ] `); actionMenu.setItems(currentBlacksmith.getMenuOptions()); actionMenu.focus(); }
function showBlacksmithSell() {
  gameState = 'TRADE_SELL'; const items = player.inventory.map(it => `${it.getColorizedName()} (${Math.floor(it.getPrice()*0.4)} Orbes)`); items.push(' [ESC] Voltar');
  actionMenu.setItems(items); actionMenu.focus();
}
function handleTrade(choice, index) {
  if (gameState === 'TRADE_BUY') { if (choice.includes('VENDER')) showBlacksmithSell(); else if (currentBlacksmith.buyItem(player, index)) { log(chalk.green('Comprado!')); showBlacksmith(); updateStatus(); } else log(chalk.red('Sem orbes!')); }
  else if (gameState === 'TRADE_SELL') { if (choice.includes('Voltar')) showBlacksmith(); else { const v = currentBlacksmith.sellItem(player, index); if (v) { log(chalk.green(`Vendido: ${v}`)); showBlacksmithSell(); updateStatus(); } } }
}

function renderMap() {
  if (!currentDungeon) return; let mapDisplay = '';
  for (let y = 0; y < currentDungeon.height; y++) {
    for (let x = 0; x < currentDungeon.width; x++) {
      if (x === currentDungeon.playerPos.x && y === currentDungeon.playerPos.y) mapDisplay += chalk.bold.cyan('@ ');
      else {
        const t = currentDungeon.grid[y][x];
        switch(t.type) {
          case 'WALL': mapDisplay += Sprites.objects.wall; break;
          case 'FLOOR': mapDisplay += Sprites.objects.floor; break;
          case 'TREASURE': mapDisplay += Sprites.objects.treasure; break;
          case 'ENEMY': mapDisplay += Sprites.objects.enemy; break;
          case 'BOSS': mapDisplay += Sprites.objects.boss; break;
          case 'PUZZLE': mapDisplay += Sprites.objects.puzzle; break;
          case 'EXIT': mapDisplay += Sprites.objects.door; break;
          case 'REST': mapDisplay += Sprites.objects.rest; break;
        }
      }
    }
    mapDisplay += '\n';
  }
  mapBox.setContent(mapDisplay); updateLegend(); screen.render();
}

function renderCombat() {
  if (!currentCombat) return; const enemy = currentCombat.enemies[0]; const es = Sprites.getEnemySprite(enemy.name); const ps = Sprites.getPlayerSprite(player.race);
  let d = '\n'; es.forEach(l => { d += ' '.repeat(35) + l + '\n'; });
  d += ' '.repeat(33) + chalk.bold.red(enemy.name) + '\n';
  const hpP = Math.min(10, Math.max(0, Math.floor(enemy.hp / enemy.maxHp * 10))); const eH = Math.max(0, 10-hpP);
  d += ' '.repeat(33) + `HP: [${'#'.repeat(hpP)}${'.'.repeat(eH)}]\n\n` + ' '.repeat(5) + '-'.repeat(50) + '\n\n';
  ps.forEach(l => { d += ' '.repeat(5) + l + '\n'; });
  combatVisualBox.setContent(d); updateLegend(); screen.render();
}

function log(msg) { logBox.log(msg); screen.render(); }

function startDungeon(floor = 1) {
  currentDungeon = new Dungeon(floor); gameState = 'EXPLORING'; mapBox.setLabel(chalk[currentDungeon.biome.color](` [ ${currentDungeon.biome.name} - ${floor} ] `));
  mapBox.show(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.hide(); logBox.show();
  actionMenu.setLabel(' [ AÇÕES ] '); actionMenu.setItems([' [W,A,S,D] Mover', ' [I] Inventário', ' [H] Atributos', ' [V/ESC] Fugir']);
  log(chalk.green(`Andar ${floor}.`)); renderMap();
}

function handleMove(dx, dy) { if (gameState === 'EXPLORING') { const t = currentDungeon.movePlayer(dx, dy); if (t) { if (t.type !== 'FLOOR') handleTileInteraction(t); renderMap(); } } }
function handleTileInteraction(t) {
  switch(t.type) {
    case 'ENEMY': case 'BOSS': startCombat(t.data); t.type = 'FLOOR'; break;
    case 'EXIT': startDungeon(currentDungeon.floor + 1); break;
    case 'TREASURE': const l = new Item(currentDungeon.floor); player.inventory.push(l); log(chalk.yellow(`Loot: ${l.name}`)); t.type = 'FLOOR'; break;
    case 'PUZZLE': startPuzzle(t); break;
    case 'REST': player.recover(0.5, 0.5, 0.5); log(chalk.green('Descansou.')); t.type = 'FLOOR'; break;
  }
}

function startCombat(e) { gameState = 'COMBAT'; currentCombat = new Combat(player, e); mapBox.hide(); combatVisualBox.show(); renderCombat(); actionMenu.setItems([' [A] ATACAR', ' [S] SKILLS', ' [R] RECUPERAR', ' [P] POSTURA']); actionMenu.focus(); }
function handleCombatAction(c) {
  if (currentCombat.isOver) return; if (c.includes('ATACAR')) currentCombat.playerAction('ATTACK');
  else if (c.includes('SKILLS')) { const l = player.getLearnedSkills(); if (l.length === 0) log(chalk.red('Sem skills!')); else { gameState = 'COMBAT_SKILLS'; actionMenu.setItems([...l, ' [ESC] Voltar']); actionMenu.focus(); return; } }
  else if (c.includes('RECUPERAR')) currentCombat.playerAction('RECOVER');
  else if (c.includes('POSTURA')) { const m = ['ATTACK', 'BALANCED', 'DEFENCE']; player.setPostureMode(m[(m.indexOf(player.postureMode)+1)%3]); }
  processCombatTurn();
}

function processCombatTurn(s = null) {
  if (s) currentCombat.playerAction('SKILL', 0, s);
  currentCombat.log.forEach(m => log(m)); currentCombat.log = []; updateStatus(); renderCombat();
  if (currentCombat.isOver) {
    if (currentCombat.result === 'WIN') {
      gameState = 'EXPLORING'; combatVisualBox.hide(); mapBox.show();
      if (currentCombat.enemies.some(e => e.name.includes('CHEFE'))) { log(chalk.magenta('GUARDIÃO CAIU!')); const t = currentDungeon.getTile(currentDungeon.playerPos.x, currentDungeon.playerPos.y); if (t) t.type = 'EXIT'; renderMap(); }
      else startDungeonNav();
    } else { log(chalk.red('MORTE.')); SaveSystem.deleteSave(); setTimeout(() => process.exit(0), 3000); }
  } else if (gameState === 'COMBAT_SKILLS') { gameState = 'COMBAT'; actionMenu.setItems([' [A] ATACAR', ' [S] SKILLS', ' [R] RECUPERAR', ' [P] POSTURA']); }
}

function startPuzzle(t) {
  gameState = 'PUZZLE'; const p = new Puzzle(null, currentDungeon.floor); log(chalk.blue(`ENIGMA: ${p.question}`)); interactBox.show(); inputField.focus(); inputField.setValue(''); screen.render();
  inputField.once('submit', (v) => {
    interactBox.hide();
    if (p.checkAnswer(v)) { player.addExperience(50*currentDungeon.floor); log(chalk.green('Sucesso!')); t.type = 'FLOOR'; } else { log(chalk.red('Falha!')); player.takeDamage(20); }
    gameState = 'EXPLORING'; startDungeonNav(); updateStatus();
  });
}

function startDungeonNav() { actionMenu.setItems([' [W,A,S,D] Mover', ' [I] Inventário', ' [H] Atributos', ' [B] Bestiário', ' [V/ESC] Fugir']); actionMenu.focus(); renderMap(); }

function startCreation() {
  gameState = 'CREATION_NAME'; interactBox.setLabel(' [ NOME ] '); interactBox.show(); inputField.focus(); inputField.setValue(''); screen.render();
  inputField.once('submit', (n) => {
    if (!n || n.trim() === '') n = 'Exilado';
    gameState = 'CREATION_RACE'; interactBox.hide(); actionMenu.setLabel(' [ RAÇA ] '); actionMenu.setItems([' Humano', ' Elfo', ' Anão', ' Orc']); actionMenu.focus(); screen.render();
    actionMenu.once('select', (i) => {
      const r = i.getText().trim();
      gameState = 'CREATION_CLASS'; actionMenu.setLabel(' [ CLASSE ] '); actionMenu.setItems([' Guerreiro', ' Mago', ' Arqueiro', ' Clérigo']); actionMenu.focus(); screen.render();
      actionMenu.once('select', (c) => {
        player = new Entity(n, { race: r, background: c.getText().trim() }); showNexus();
      });
    });
  });
}

screen.key(['w'], () => handleMove(0, -1)); screen.key(['s'], () => { if (gameState === 'EXPLORING') handleMove(0, 1); if (gameState === 'ATTRIBUTES') handleAttributeUpgrade('FORÇA'); });
screen.key(['a'], () => handleMove(-1, 0)); screen.key(['d'], () => { if (gameState === 'EXPLORING') handleMove(1, 0); if (gameState === 'ATTRIBUTES') handleAttributeUpgrade('DESTREZA'); });
screen.key(['i'], () => { if (gameState === 'EXPLORING') showInventory(); if (gameState === 'ATTRIBUTES') handleAttributeUpgrade('INTELIGÊNCIA'); });
screen.key(['h'], () => { if (gameState === 'EXPLORING' || gameState === 'MENU' || gameState === 'NEXUS') showAttributes(); });
screen.key(['k'], () => { if (gameState === 'EXPLORING' || gameState === 'MENU' || gameState === 'NEXUS') showPassives(); });
screen.key(['p'], () => { if (gameState === 'EXPLORING' || gameState === 'MENU' || gameState === 'NEXUS') showProficiencies(); });
screen.key(['b'], () => { if (gameState === 'EXPLORING' || gameState === 'MENU' || gameState === 'NEXUS') showBestiary(); });
screen.key(['q'], () => { if (actionMenu.focused) actionMenu.up(1); if (inventoryBox.focused) inventoryBox.up(1); screen.render(); });
screen.key(['e'], () => { if (actionMenu.focused) actionMenu.down(1); if (inventoryBox.focused) inventoryBox.down(1); screen.render(); });
screen.key(['f', 'space'], () => { if (actionMenu.focused) actionMenu.emit('select', actionMenu.getItem(actionMenu.selected), actionMenu.selected); else if (inventoryBox.focused) inventoryBox.emit('select', inventoryBox.getItem(inventoryBox.selected), inventoryBox.selected); });

actionMenu.on('select', (item, index) => {
  const c = item.getText().trim();
  if (gameState === 'MENU') { if (c.includes('Novo Jogo')) startCreation(); if (c.includes('Carregar')) loadGame(); if (c.includes('Sair')) process.exit(0); }
  else if (gameState === 'NEXUS') { if (c.includes('Entrar')) startDungeon(); if (c.includes('Halthor')) showBlacksmith(); if (c.includes('Altar')) showAltar(); if (c.includes('Missões')) showQuests(); if (c.includes('Inventário')) showInventory(); if (c.includes('Atributos')) showAttributes(); if (c.includes('Proficiências')) showProficiencies(); if (c.includes('Bestiário')) showBestiary(); if (c.includes('Skills')) showPassives(); if (c.includes('Menu Principal')) { gameState = 'MENU'; actionMenu.setItems([' [1] Novo Jogo', ' [2] Carregar Jogo', ' [ESC] Sair']); } }
  else if (gameState === 'COMBAT') handleCombatAction(c);
  else if (gameState === 'COMBAT_SKILLS') { if (c.includes('Voltar')) { gameState = 'COMBAT'; actionMenu.setItems([' [A] ATACAR', ' [S] SKILLS', ' [R] RECUPERAR', ' [P] POSTURA']); } else processCombatTurn(c); }
  else if (gameState === 'ATTRIBUTES') handleAttributeUpgrade(c);
  else if (gameState === 'PROFICIENCIES') handleProficiencyUpgrade(c);
  else if (gameState === 'SKILL_TREE') handleSkillUpgrade(c);
  else if (gameState === 'ALTAR') handleAltar(c, index);
  else if (gameState === 'QUESTS') handleQuests(c, index);
  else if (gameState === 'TRADE_BUY' || gameState === 'TRADE_SELL') handleTrade(choice, index);
});

screen.key(['escape', 'v'], () => {
  if (gameState === 'MENU') process.exit(0);
  if (gameState === 'INVENTORY' || gameState === 'ATTRIBUTES' || gameState === 'PROFICIENCIES' || gameState === 'SKILL_TREE' || gameState === 'BESTIARY' || gameState === 'TRADE_BUY' || gameState === 'TRADE_SELL' || gameState === 'ALTAR' || gameState === 'QUESTS' || gameState === 'COMBAT_SKILLS') {
    inventoryBox.hide(); itemDetailBox.hide(); mapBox.show(); logBox.show();
    if (currentDungeon) { if (gameState === 'COMBAT_SKILLS') { gameState = 'COMBAT'; actionMenu.setItems([' [A] ATACAR', ' [S] SKILLS', ' [R] RECUPERAR', ' [P] POSTURA']); return; } gameState = 'EXPLORING'; startDungeonNav(); }
    else showNexus();
    inventoryBox.setLabel(' [ INVENTÁRIO ] ');
    return;
  }
  if (gameState === 'EXPLORING' || gameState === 'COMBAT') { saveGame(); currentDungeon = null; showNexus(); }
});

screen.on('resize', () => screen.render());
screen.append(titleBox); screen.append(statusBox); screen.append(synergyBox); screen.append(legendBox); screen.append(mapBox);
screen.append(combatVisualBox); screen.append(inventoryBox); screen.append(itemDetailBox);
screen.append(equipVisualBox); screen.append(logBox); screen.append(actionMenu); screen.append(interactBox);
const initialMenu = [' [1] Novo Jogo']; if (SaveSystem.hasSave()) initialMenu.push(' [2] Carregar Jogo'); initialMenu.push(' [ESC] Sair'); actionMenu.setItems(initialMenu); actionMenu.focus(); updateStatus(); screen.render();
