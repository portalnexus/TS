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
const titleBox = blessed.box({ top: 0, left: 'center', width: '100%', height: 5,
  content: chalk.bold.red('\n ⚔  T E R M I N A L   S O U L S  ⚔ \n') + chalk.gray(' ◈  The Echoes of Reason  ◈') + chalk.white('                                            v1.0.0'),
  align: 'center', border: { type: 'line', fg: 'red' } });
const statusBox = blessed.box({ top: 5, left: 0, width: '20%', height: 13, label: ' [ STATUS ] ', border: { type: 'line', fg: 'cyan' } });
const synergyBox = blessed.box({ top: 18, left: 0, width: '20%', height: 8, label: ' [ SINERGIAS ] ', border: { type: 'line', fg: 'magenta' }, tags: true });
const legendBox = blessed.box({ top: 26, left: 0, width: '20%', height: '30%', label: ' [ LEGENDA ] ', border: { type: 'line', fg: 'white' }, tags: true });
const mapBox = blessed.box({ top: 5, left: '20%', width: '60%', height: '65%', label: ' [ MAPA DA FENDA ] ', border: { type: 'line', fg: 'white' }, tags: true });
const combatVisualBox = blessed.box({ top: 5, left: '20%', width: '60%', height: '65%', label: ' [ COMBATE ] ', border: { type: 'line', fg: 'red' }, hidden: true, tags: true });
const logBox = blessed.log({ top: '68%', left: '20%', width: '80%', height: '30%', label: ' [ CRÔNICAS ] ', border: { type: 'line', fg: 'yellow' }, scrollable: true, alwaysScroll: true });
const actionMenu = blessed.list({ top: '68%', left: 0, width: '20%', height: '30%', label: ' [ AÇÕES ] ', border: { type: 'line', fg: 'green' }, keys: true, vi: true, style: { selected: { bg: 'red', bold: true } } });
const interactBox = blessed.box({ top: 'center', left: 'center', width: '50%', height: 9, label: ' [ INTERAÇÃO ] ', border: { type: 'line', fg: 'white' }, hidden: true, tags: true });
const inputField = blessed.textbox({ parent: interactBox, top: 5, left: 2, width: '90%', height: 1, inputOnFocus: true, style: { bg: 'blue' } });
const inventoryBox = blessed.list({ top: 5, left: '20%', width: '60%', height: '65%', label: ' [ LISTA ] ', border: { type: 'line', fg: 'cyan' }, keys: true, vi: true, style: { selected: { bg: 'blue', bold: true } }, hidden: true });
const itemDetailBox = blessed.box({ top: '68%', left: '20%', width: '80%', height: '30%', label: ' [ ANALISE DE DADOS ] ', border: { type: 'line', fg: 'yellow' }, tags: true, hidden: true });
const equipVisualBox = blessed.box({ top: 5, left: '80%', width: '20%', height: '65%', label: ' [ EQUIPAMENTO ] ', border: { type: 'line', fg: 'magenta' }, tags: true, scrollable: true });

let player = null;

// Gera barra de progresso ASCII colorida
function makeBar(current, max, length = 8) {
  const ratio = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(ratio * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

let currentBlacksmith = new Blacksmith(1);
let currentAltar = new CraftingAltar();
let questBoard = new QuestBoard();
let currentDungeon = null;
let currentCombat = null;
let currentNexus = new Nexus();
let gameState = 'MENU';
let creationData = {};
let bossRushWave = 0;
let bossRushScore = 0;
const BOSS_RUSH_SEQUENCE = [
  { floor: 5,  name: 'BOSS RUSH: Isaac Newton Corrompido',       mult: 1.0 },
  { floor: 10, name: 'BOSS RUSH: Sombra de Hawking',             mult: 1.1 },
  { floor: 15, name: 'BOSS RUSH: A Máquina Implacável',          mult: 1.2 },
  { floor: 20, name: 'BOSS RUSH: Guardiã do Vazio',              mult: 1.3 },
  { floor: 25, name: 'BOSS RUSH: Euler, Arquiteto da Identidade',mult: 1.4 },
  { floor: 30, name: 'BOSS RUSH: Lovelace, Tecelã da Lógica',   mult: 1.5 },
  { floor: 50, name: 'BOSS RUSH: SENHOR DA ASCENSÃO — Forma Pura', mult: 2.0 }
];

// --- SISTEMA DE SAVE ---
function saveGame() { if (player && SaveSystem.save(player.serialize())) log(chalk.green('💾 Alma vinculada (Salvo).')); }
function loadGame() {
  const data = SaveSystem.load();
  if (data) { player = Entity.fromSave(data); log(chalk.cyan('✨ Reencarnação concluída.')); updateStatus(); showNexus(); }
}

// --- RENDERIZAÇÃO ---
function updateStatus() {
  if (!player) return;
  const prestige = player.calculatePrestige();

  // Cores por limiar de HP
  const hpRatio = player.hp / player.maxHp;
  const hpColor = hpRatio < 0.25 ? chalk.red : hpRatio < 0.55 ? chalk.yellow : chalk.green;
  const spColor = player.sp < player.maxSp * 0.3 ? chalk.red : chalk.yellow;
  const mpColor = player.mp < player.maxMp * 0.3 ? chalk.red : chalk.blue;

  // Cor de acento por classe
  const classColors = { Guerreiro: chalk.red, Mago: chalk.blue, Arqueiro: chalk.yellow, Clérigo: chalk.green };
  const accent = classColors[player.background] || chalk.cyan;

  // Barras de recursos
  const hpBar  = hpColor(makeBar(player.hp, player.maxHp));
  const spBar  = spColor(makeBar(player.sp, player.maxSp));
  const mpBar  = mpColor(makeBar(player.mp, player.maxMp));
  const stBar  = chalk.cyan(makeBar(player.posture, player.maxPosture));

  // XP bar
  const xpBar  = chalk.gray(makeBar(player.xp, player.level * 100, 8));

  // Postura mode badge
  const modeBadge = player.postureMode === 'DEFESA' ? chalk.cyan('[DEF]')
                  : player.postureMode === 'ATAQUE' ? chalk.yellow('[ATK]')
                  : chalk.gray('[NEU]');

  statusBox.setContent(
    `\n  ${accent.bold(player.name)}\n` +
    `  ${chalk.gray(player.race + ' · ' + player.background)}\n` +
    `  ${chalk.gray('Lv')}${chalk.white(player.level)} ${xpBar} ${chalk.gray(player.xp+'/'+(player.level*100))}\n\n` +
    `  ${chalk.bold('HP')} ${hpBar} ${hpColor(player.hp+'/'+player.maxHp)}\n` +
    `  ${chalk.bold('SP')} ${spBar} ${spColor(player.sp+'/'+player.maxSp)}\n` +
    `  ${chalk.bold('MP')} ${mpBar} ${mpColor(player.mp+'/'+player.maxMp)}\n` +
    `  ${chalk.bold('ES')} ${stBar} ${chalk.cyan(player.posture)} ${modeBadge}\n\n` +
    `  ${chalk.red('STR')} ${chalk.white(player.strength)}  ${chalk.cyan('DEX')} ${chalk.white(player.dexterity)}  ${chalk.blue('INT')} ${chalk.white(player.intelligence)}\n\n` +
    `  ${chalk.bold.yellow('◈')} ${chalk.yellow(player.orbs)} Orbes  ${chalk.bold.magenta('✦')} ${chalk.magenta(player.skillPoints)} Skills\n` +
    `  ${chalk.bold.white('RENOME')} ${chalk.bold.green(prestige)}\n` +
    (player.activeQuest ? `  ${chalk.bold.yellow('►')} ${chalk.yellow(player.activeQuest.desc.slice(0,18)+'…')} ${chalk.white(player.activeQuest.progress+'/'+player.activeQuest.target)}\n` : '')
  );

  // Sinergias + status ativos
  const classIcons = { Guerreiro: chalk.red('⚔ '), Mago: chalk.blue('✦ '), Arqueiro: chalk.yellow('→ '), Clérigo: chalk.green('✝ ') };
  let synergyContent = (classIcons[player.background] || '') + accent.bold(player.background + '\n');
  if (player.background === 'Guerreiro') synergyContent += chalk.red('• +10% Dano Físico\n');
  if (player.background === 'Mago')      synergyContent += chalk.blue('• +10% Dano Mágico\n');
  if (player.background === 'Arqueiro')  synergyContent += chalk.yellow('• +10 Postura Máx.\n');
  if (player.background === 'Clérigo')   synergyContent += chalk.green('• +10% Recuperação\n');
  if (player.postureMode === 'DEFESA')  synergyContent += chalk.cyan('• DEFESA: ×2 Def, +12% SP/turno\n');
  if (player.postureMode === 'ATAQUE') synergyContent += chalk.yellow('• ATAQUE: +60% Dmg, -10% SP/turno\n');
  if (player.isStaggered)               synergyContent += chalk.bgRed.white('! COLAPSO !\n');

  // Status ativos
  if (player.activeStatuses && player.activeStatuses.length > 0) {
    synergyContent += chalk.gray('─────────\n');
    const statusIcons = { SANGRAMENTO: chalk.red('⬤'), COMBUSTÃO: chalk.keyword('orange')('⬤'), CHOQUE: chalk.yellow('⚡'), CONGELAMENTO: chalk.cyan('❄'), EVASÃO: chalk.white('◎'), IMUNIDADE: chalk.cyan('⬡') };
    player.activeStatuses.forEach(s => {
      const icon = statusIcons[s.name] || chalk.gray('•');
      synergyContent += `${icon} ${chalk.white(s.name)} ${chalk.gray('('+s.duration+'t)')}\n`;
    });
  }
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
  } else if (gameState === 'CREATION_RACE') {
    const raceDetails = {
      'Humano':  'HUMANO — Versátil\n\n+2 STR | +2 DEX | +2 INT\n\nEquilibrado em tudo. Funciona com\nqualquer classe. Ideal para iniciantes\nou builds híbridas.',
      'Elfo':    'ELFO — Feiticeiro Nato\n\n+5 INT\n\nPoder mágico superior. Combina com\nMago para máximo dano elemental.\nFraco em combate corpo a corpo.',
      'Anão':    'ANÃO — Fortaleza Viva\n\n+5 STR\n\nResistência e força bruta. Melhor com\nGuerreiro ou Clérigo. SP alto e dano\nfísico máximo.',
      'Orc':     'ORC — Predador Ágil\n\n+5 DEX\n\nReflexos e velocidade superiores.\nSinérgico com Arqueiro. Evade ataques\ne golpeia com precisão letal.'
    };
    const key = el.getText().trim().split(/\s+/)[0];
    itemDetailBox.setContent(raceDetails[key] || '');
    itemDetailBox.show(); screen.render();
  } else if (gameState === 'CREATION_CLASS') {
    const classDetails = {
      'Guerreiro': 'GUERREIRO — Força e Impacto\n\nAtributo: STR\nEstilo: Tanque agressivo\n\nSkills iniciais:\n• Impacto de Newton — Golpe massivo\n• Inércia de Galileu — Recupera SP\n\nUse DEFESA para tankar, ATAQUE\npara explosões de dano.',
      'Mago':      'MAGO — Poder Elemental\n\nAtributo: INT\nEstilo: Dano em área, efeitos\n\nSkills iniciais:\n• Raio de Maxwell — Choque elétrico\n• Chama de Lavoisier — Fogo/combustão\n\nAltíssimo dano, baixa resistência.',
      'Arqueiro':  'ARQUEIRO — Precisão e Velocidade\n\nAtributo: DEX\nEstilo: Controle e mobilidade\n\nSkills iniciais:\n• Flecha de Hawking — Projétil preciso\n• Óptica de Euclides — Aumenta alcance\n\nEvita dano, ataca a distância.',
      'Clérigo':   'CLÉRIGO — Suporte e Cura\n\nAtributo: INT/STR híbrido\nEstilo: Sustentação e resistência\n\nSkills iniciais:\n• Cura de Hipócrates — Restaura HP\n• Sopro de Gaia — Cura de emergência\n\nBônus +10% em todas as recuperações.'
    };
    itemDetailBox.setContent(classDetails[el.getText().trim()] || '');
    itemDetailBox.show(); screen.render();
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
  if (gameState === 'INVENTORY') { const it = player.inventory[index]; if (!it) return; if (it.type === 'CONSUMÍVEL' || it.type === 'TOMO') { player.useConsumable(it); log(chalk.green(`Usado: ${it.name}`)); } else player.equipItem(it); updateStatus(); showInventory(); }
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
  gameState = 'MARIE';
  const config = currentAltar.getMasteryConfig(player.craftingMastery);
  actionMenu.setLabel(currentAltar.getMenuLabel(player));
  const menuItems = [' [ESC] Voltar'];
  if (config.upgradeLabel) menuItems.unshift(` [U] ${config.upgradeLabel}`);
  actionMenu.setItems(menuItems);
  itemDetailBox.setContent(
    chalk.bold.magenta(`\n  Maestria: ${config.label} (Nível ${player.craftingMastery || 0})\n`) +
    chalk.white(`  Efeito: ${config.effectDesc}\n`) +
    chalk.yellow(`  Custo de Transmutação: ${config.cost} Orbes\n`) +
    chalk.gray(`  Elegíveis: ${config.rarityReq.join(', ')}\n\n`) +
    chalk.gray('  Selecione um item do inventário para transmutar.')
  );
  const items = player.inventory.map(it => `${it.getColorizedName()}`);
  inventoryBox.setItems(items); inventoryBox.show(); inventoryBox.focus(); mapBox.hide(); itemDetailBox.show();
  updateDetailSection(inventoryBox);
}

function handleMarieAction(index) {
  const result = currentAltar.reRollItem(player, index);
  if (result && result.success) {
    if (result.promoted) log(chalk.bold.yellow('PROMOÇÃO! Item elevado para RARO!'));
    else log(chalk.green('Transmutação concluída!'));
    showMarie(); updateStatus();
  } else {
    log(chalk.red('Falha: Orbes insuficientes ou item inelegível.'));
  }
}

function showDarwin() { gameState = 'DARWIN'; actionMenu.setLabel(' [ DARWIN: EVOLUCAO ] '); actionMenu.setItems([' [1] + FORÇA (30 Orbes)', ' [2] + DESTREZA (30 Orbes)', ' [3] + INTELIGÊNCIA (30 Orbes)', ' [ESC] Voltar']); actionMenu.focus(); }
function handleDarwin(c) {
  let s = false;
  if (c.includes('FORÇA')) s = player.adaptAttribute('STR', 30);
  else if (c.includes('DESTREZA')) s = player.adaptAttribute('DEX', 30);
  else if (c.includes('INTELIGÊNCIA')) s = player.adaptAttribute('INT', 30);
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
      if (x === currentDungeon.playerPos.x && (y === currentDungeon.playerPos.y || y === currentDungeon.playerPos.y + 1)) { d += chalk.bold.cyan('@@'); continue; }
      const t = currentDungeon.grid[y][x];
      if (!t.discovered) { d += chalk.gray('░░'); continue; }
      switch(t.type) {
        case 'WALL':     d += Sprites.objects.wall; break;
        case 'FLOOR':    d += Sprites.objects.floor; break;
        case 'TREASURE': d += Sprites.objects.treasure; break;
        case 'ENEMY':    d += Sprites.objects.enemy; break;
        case 'BOSS':     d += Sprites.objects.boss; break;
        case 'PUZZLE':   d += Sprites.objects.puzzle; break;
        case 'EXIT':     d += Sprites.objects.door; break;
        case 'REST':     d += Sprites.objects.rest; break;
        default:         d += Sprites.objects.floor; break;
      }
    }
    d += '\n';
  }
  mapBox.setContent(d); updateLegend(); screen.render();
}

function renderCombat() {
  if (!currentCombat) return;
  const e = currentCombat.enemies[0];
  const es = Sprites.getEnemySprite(e.name);
  const ps = Sprites.getPlayerSprite(player.race);
  const boxW = Math.floor(screen.width * 0.60) - 4;
  const spriteW = 24;
  const enemyPad = Math.max(2, Math.floor(boxW * 0.60) - spriteW);
  const playerPad = Math.max(2, Math.floor(boxW * 0.04));
  const dividerLen = Math.min(boxW - playerPad, 55);
  let d = '\n';
  es.forEach(l => { d += ' '.repeat(enemyPad) + l + '\n'; });
  d += ' '.repeat(enemyPad) + chalk.bold.red(e.name) + '\n';
  const hpP = Math.min(10, Math.max(0, Math.floor(e.hp / e.maxHp * 10)));
  d += ' '.repeat(enemyPad) + `HP: [${'#'.repeat(hpP)}${'.'.repeat(10 - hpP)}]\n\n`;
  d += ' '.repeat(playerPad) + '-'.repeat(dividerLen) + '\n\n';
  ps.forEach(l => { d += ' '.repeat(playerPad) + l + '\n'; });
  d += ' '.repeat(playerPad) + chalk.bold.green(player.name) + '\n';
  d += ' '.repeat(playerPad) + `HP: ${makeBar(player.hp, player.maxHp, 12)} ${chalk.green(player.hp + '/' + player.maxHp)}\n`;
  combatVisualBox.setContent(d); updateLegend(); screen.render();
}

function log(msg) { logBox.log(msg); screen.render(); }

function startDungeon(floor = 1) {
  // Calcula quantos tiles cabem no mapBox (cada tile = 2 chars, descontar bordas)
  const availW = Math.max(20, Math.floor((screen.width * 0.60 - 4) / 2));
  const availH = Math.max(10, Math.floor(screen.height * 0.65 - 2));
  currentDungeon = new Dungeon(floor, availW, availH); gameState = 'EXPLORING'; mapBox.setLabel(chalk[currentDungeon.biome.color](` [ ${currentDungeon.biome.name} - ${floor} ] `));
  mapBox.show(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.show(); logBox.show();
  actionMenu.setLabel(' [ EXPLORACAO ] '); actionMenu.setItems([' [1] Norte', ' [2] Sul', ' [3] Oeste', ' [4] Leste', ' [5] Inv', ' [6] Skills', ' [ESC] Fugir']);
  log(chalk.green(`Fenda ${floor} aberta.`));

  // Auto-progresso de missão FLOOR
  if (player && player.activeQuest && player.activeQuest.type === 'FLOOR' && !player.activeQuest.completed) {
    player.activeQuest.progress = floor;
    if (floor >= player.activeQuest.target) {
      player.activeQuest.completed = true;
      log(chalk.bold.green(`>>> MISSÃO CONCLUÍDA! Andar ${floor} alcançado! <<<`));
    }
  }

  renderMap();
}

function handleMove(dx, dy) {
  if (gameState === 'EXPLORING') {
    const t = currentDungeon.movePlayer(dx, dy);
    if (t) {
      player.sp = Math.min(player.maxSp, player.sp + Math.floor(player.maxSp * 0.05));
      if (t.type !== 'FLOOR') handleTileInteraction(t);
      renderMap();
      updateStatus();
    }
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
      else if (interaction.name === 'Arena') showBossRush();
    }
    screen.render();
  }
}
function handleTileInteraction(t) {
  switch(t.type) {
    case 'ENEMY': case 'BOSS': startCombat(t.data); t.type = 'FLOOR'; break;
    case 'EXIT': startDungeon(currentDungeon.floor + 1); break;
    case 'TREASURE': {
      const l = new Item(currentDungeon.floor);
      player.inventory.push(l);
      log(chalk.yellow(`Loot: ${l.name}`));
      t.type = 'FLOOR';
      // Auto-progresso de missão ITEM
      if (player.activeQuest && player.activeQuest.type === 'ITEM' && !player.activeQuest.completed) {
        player.activeQuest.progress++;
        if (player.activeQuest.progress >= player.activeQuest.target) {
          player.activeQuest.completed = true;
          log(chalk.bold.green('>>> MISSÃO CONCLUÍDA! Retorne ao Quadro de Missões. <<<'));
        } else {
          log(chalk.yellow(`Missão: ${player.activeQuest.progress}/${player.activeQuest.target} itens coletados.`));
        }
      }
      break;
    }
    case 'PUZZLE': startPuzzle(t); break;
    case 'REST': player.recover(0.5, 0.5, 0.5); log(chalk.green('Descansou.')); t.type = 'FLOOR'; break;
  }
}

function startCombat(e) { gameState = 'COMBAT'; currentCombat = new Combat(player, e); mapBox.hide(); combatVisualBox.show(); renderCombat(); actionMenu.setItems([' [1] ATACAR', ' [2] SKILLS', ' [3] RECUPERAR', ' [4] POSTURA', ' [ESC] Fugir']); actionMenu.focus(); }
function handleCombatAction(c) {
  if (currentCombat.isOver) return; if (c.includes('ATACAR')) currentCombat.playerAction('ATTACK');
  else if (c.includes('SKILLS')) { const l = player.getLearnedSkills(); if (l.length === 0) log(chalk.red('Sem skills!')); else { gameState = gameState === 'BOSS_RUSH' ? 'BOSS_RUSH_SKILLS' : 'COMBAT_SKILLS'; actionMenu.setItems([...l, ' [ESC] Voltar']); actionMenu.focus(); return; } }
  else if (c.includes('RECUPERAR')) currentCombat.playerAction('RECOVER');
  else if (c.includes('POSTURA')) { const m = ['NEUTRO', 'DEFESA', 'ATAQUE']; player.setPostureMode(m[(m.indexOf(player.postureMode)+1)%3]); log(chalk.cyan(`Postura: ${player.postureMode}`)); }
  processCombatTurn();
}

function processCombatTurn(s = null) {
  if (s) currentCombat.playerAction('SKILL', 0, s);
  currentCombat.log.forEach(m => logBox.log(m)); currentCombat.log = []; updateStatus(); renderCombat();
  if (!currentCombat.isOver) {
    const spDelta = { DEFESA: 0.12, NEUTRO: 0.05, ATAQUE: -0.10 };
    const rate = spDelta[player.postureMode] ?? 0;
    const delta = Math.floor(player.maxSp * Math.abs(rate));
    if (rate > 0) {
      player.sp = Math.min(player.maxSp, player.sp + delta);
      if (rate >= 0.10) log(chalk.cyan(`Postura DEFESA recuperou ${delta} SP.`));
    } else if (rate < 0) {
      player.sp = Math.max(0, player.sp - delta);
      log(chalk.yellow(`Postura ATAQUE consumiu ${delta} SP.`));
    }
  }
  if (currentCombat.isOver) {
    // Boss Rush: tratar separadamente sem afetar o save nem a dungeon normal
    if (gameState === 'BOSS_RUSH') {
      if (currentCombat.result === 'WIN') {
        bossRushScore += BOSS_RUSH_SEQUENCE[bossRushWave].floor * 100;
        bossRushWave++;
        player.recover(0.3, 0.3, 0.3);
        updateStatus();
        log(chalk.green(`Guardião derrotado! Recuperação concedida. Score: ${bossRushScore}`));
        if (bossRushWave >= BOSS_RUSH_SEQUENCE.length) { showBossRushVictory(); return; }
        startBossRushWave();
      } else {
        log(chalk.red(`Boss Rush encerrado na Onda ${bossRushWave + 1}.`));
        bossRushWave = 0; bossRushScore = 0;
        combatVisualBox.hide(); logBox.show();
        showNexus();
      }
      return;
    }

    if (currentCombat.result === 'WIN') {
      // Auto-progresso de missão KILL
      if (player.activeQuest && player.activeQuest.type === 'KILL' && !player.activeQuest.completed) {
        player.activeQuest.progress += currentCombat.enemies.length;
        if (player.activeQuest.progress >= player.activeQuest.target) {
          player.activeQuest.completed = true;
          log(chalk.bold.green('>>> MISSÃO CONCLUÍDA! Retorne ao Quadro de Missões. <<<'));
        } else {
          log(chalk.yellow(`Missão: ${player.activeQuest.progress}/${player.activeQuest.target} inimigos.`));
        }
      }
      gameState = 'EXPLORING'; combatVisualBox.hide(); mapBox.show();
      inventoryBox.hide(); itemDetailBox.hide(); logBox.show();
      actionMenu.setLabel(' [ EXPLORAÇÃO ] ');
      actionMenu.setItems([' [1] Norte', ' [2] Sul', ' [3] Oeste', ' [4] Leste', ' [5] Inv', ' [6] Skills', ' [ESC] Fugir']);
      actionMenu.focus();
      const isFinalBoss = currentCombat.enemies.some(e => e.name.includes('SENHOR DA ASCENSÃO'));
      if (isFinalBoss) {
        showVictory();
        return;
      }
      if (currentCombat.enemies.some(e => e.name.includes('CHEFE') || e.name.includes('SENHOR') || e.name.includes('ARQUITETO'))) {
        log(chalk.magenta('GUARDIÃO CAIU! A Escada se abre...'));
        const t = currentDungeon.getTile(currentDungeon.playerPos.x, currentDungeon.playerPos.y);
        if (t) t.type = 'EXIT';
        renderMap();
      }
    } else {
      const entry = {
        name: player.name, race: player.race, background: player.background,
        level: player.level, prestige: player.calculatePrestige(),
        floor: currentDungeon ? currentDungeon.floor : 1,
        date: new Date().toLocaleDateString('pt-BR')
      };
      const hall = SaveSystem.saveHallOfFame(entry);
      SaveSystem.deleteSave();
      showGameOver(entry, hall);
    }
  }
}

function showGameOver(entry, hall) {
  gameState = 'GAME_OVER';
  combatVisualBox.hide(); mapBox.hide(); inventoryBox.hide(); logBox.show(); itemDetailBox.show();
  itemDetailBox.setLabel(' [ O EXÍLIO RECLAMA SUA ALMA ] ');
  const top5 = hall.slice(0, 5);
  const medals = ['◈', '✦', '★', '•', '·'];
  let content = chalk.bold.red('\n  ✦ GAME OVER ✦\n\n');
  content += chalk.white(`  ${entry.name} (${entry.race} ${entry.background}) sucumbiu no Andar ${entry.floor}.\n`);
  content += chalk.cyan(`  Renome Final: ${chalk.bold(entry.prestige)}\n\n`);
  content += chalk.bold.yellow('  ══ HALL OF FAME ══\n');
  top5.forEach((e, i) => {
    content += `  ${medals[i]} ${chalk.white(e.name)} ${chalk.gray(`(${e.race} ${e.background})`)} `;
    content += chalk.yellow(`Renome: ${e.prestige} `) + chalk.gray(`[Lv${e.level} — ${e.date}]\n`);
  });
  content += chalk.bold.red('\n  [ESC] Retornar ao Menu');
  itemDetailBox.setContent(content);
  actionMenu.setLabel(' [ GAME OVER ] ');
  actionMenu.setItems([' [ESC] Menu Principal']);
  actionMenu.focus(); screen.render();
}

function showBossRush() {
  gameState = 'BOSS_RUSH_MENU';
  mapBox.show(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.show(); logBox.show();
  itemDetailBox.setLabel(' [ ARENA DOS ARQUITETOS ] ');
  itemDetailBox.setContent(
    chalk.bold.red('\n  ══ BOSS RUSH ══\n\n') +
    chalk.white('  Enfrente todos os Guardiões em sequência.\n') +
    chalk.yellow(`  ${BOSS_RUSH_SEQUENCE.length} ondas crescentes de dificuldade.\n`) +
    chalk.green('  Cada vitória restaura 30% HP/SP/MP.\n') +
    chalk.red('  Derrota encerra o desafio (save preservado).\n')
  );
  actionMenu.setLabel(' [ ARENA ] ');
  actionMenu.setItems([' [1] Iniciar Boss Rush', ' [ESC] Voltar']);
  actionMenu.focus(); screen.render();
}

function startBossRushWave() {
  const wave = BOSS_RUSH_SEQUENCE[bossRushWave];
  const bossHp = Math.floor((80 + wave.floor * 35 + wave.floor * wave.floor * 0.5) * wave.mult);
  const boss = new Entity(wave.name, {
    hp: bossHp, maxHp: bossHp,
    sp: Math.floor((80 + wave.floor * 8) * wave.mult),
    mp: Math.floor((80 + wave.floor * 8) * wave.mult),
    level: wave.floor + 1,
    strength:     8 + Math.floor(wave.floor * 1.0),
    dexterity:    6 + Math.floor(wave.floor * 0.6),
    intelligence: 6 + Math.floor(wave.floor * 0.6)
  });
  gameState = 'BOSS_RUSH';
  currentCombat = new Combat(player, [boss]);
  mapBox.hide(); combatVisualBox.show(); itemDetailBox.hide();
  log(chalk.bold.red(`=== ONDA ${bossRushWave + 1}/${BOSS_RUSH_SEQUENCE.length}: ${wave.name} ===`));
  renderCombat();
  actionMenu.setLabel(` [ BOSS RUSH — Onda ${bossRushWave + 1}/${BOSS_RUSH_SEQUENCE.length} ] `);
  actionMenu.setItems([' [1] ATACAR', ' [2] SKILLS', ' [3] RECUPERAR', ' [4] POSTURA']);
  actionMenu.focus();
}

function showBossRushVictory() {
  const bonus = Math.floor(bossRushScore * 0.1);
  player.orbs += bonus;
  SaveSystem.saveHallOfFame({
    name: player.name + ' [BOSS RUSH]', race: player.race, background: player.background,
    level: player.level, prestige: bossRushScore, floor: 0,
    date: new Date().toLocaleDateString('pt-BR')
  });
  saveGame();
  gameState = 'NEXUS';
  combatVisualBox.hide(); mapBox.show(); logBox.show(); itemDetailBox.show();
  itemDetailBox.setLabel(' [ ARENA: VITÓRIA TOTAL ] ');
  itemDetailBox.setContent(
    chalk.bold.yellow('\n  ✦ BOSS RUSH COMPLETO! ✦\n\n') +
    chalk.white(`  Todos os ${BOSS_RUSH_SEQUENCE.length} Guardiões foram derrotados.\n\n`) +
    chalk.cyan(`  Score: ${chalk.bold(bossRushScore)}\n`) +
    chalk.green(`  Bônus: +${bonus} Orbes\n`)
  );
  bossRushWave = 0; bossRushScore = 0;
  actionMenu.setLabel(' [ EXPLORAÇÃO ] ');
  actionMenu.setItems([' [WASD] Mover', ' [7] Inventário', ' [8] Bestiário', ' [9] Skills', ' [ESC] Sair']);
  updateStatus(); screen.render();
}

function showVictory() {
  gameState = 'VICTORY';
  const prestige = player.calculatePrestige();
  const bestiaryCount = Object.keys(player.bestiary).length;
  mapBox.hide(); combatVisualBox.hide(); inventoryBox.hide();
  logBox.show(); itemDetailBox.show();
  itemDetailBox.setLabel(' [ O FIM DO EXÍLIO ] ');
  itemDetailBox.setContent(
    chalk.bold.yellow('\n  ╔══════════════════════════════════╗\n') +
    chalk.bold.yellow('  ║   TERMINAL SOULS: CONCLUÍDO!     ║\n') +
    chalk.bold.yellow('  ╚══════════════════════════════════╝\n\n') +
    chalk.bold.white(`  ${player.name}, o Exilado, quebrou as Correntes do Nexus.\n\n`) +
    chalk.bold.cyan(`  RENOME FINAL: ${prestige}\n`) +
    chalk.green(`  Nível Alcançado: ${player.level}\n`) +
    chalk.green(`  Criaturas Catalogadas: ${bestiaryCount}\n`) +
    chalk.green(`  Orbes Acumulados: ${player.orbs}\n\n`) +
    chalk.gray('  "O conhecimento é a única arma que\n   o Exílio jamais poderá confiscar."\n\n') +
    chalk.bold.red('  [ESC] Retornar ao Menu Principal')
  );
  log(chalk.bold.yellow('=== O SENHOR DA ASCENSÃO FOI DERROTADO! ==='));
  log(chalk.bold.cyan(`=== RENOME ETERNO: ${prestige} ===`));
  actionMenu.setItems([' [ESC] Menu Principal']);
  actionMenu.focus();
  screen.render();
}

function startPuzzle(t) {
  gameState = 'PUZZLE'; const p = new Puzzle(null, currentDungeon.floor); logBox.log(chalk.blue(`ENIGMA: ${p.question}`)); interactBox.show(); inputField.focus(); inputField.setValue(''); screen.render();
  inputField.once('submit', (v) => { interactBox.hide(); if (p.checkAnswer(v)) { player.addExperience(50*currentDungeon.floor); log(chalk.green('Sucesso!')); t.type = 'FLOOR'; } else { log(chalk.red('Falha!')); player.takeDamage(20); } gameState = 'EXPLORING'; updateStatus(); });
}

function startCreation() {
  creationData = {};
  gameState = 'CREATION_NAME'; interactBox.setLabel(' [ NOME ] '); interactBox.show(); inputField.focus(); inputField.setValue(''); screen.render();
  inputField.once('submit', (n) => {
    if (!n || n.trim() === '') n = 'Exilado';
    creationData.name = n;
    gameState = 'CREATION_RACE'; interactBox.hide();
    actionMenu.setLabel(' [ RAÇA ] ');
    actionMenu.setItems([
      ' Humano       [+2 STR  +2 DEX  +2 INT]',
      ' Elfo         [+5 INT             ]',
      ' Anão         [+5 STR             ]',
      ' Orc          [+5 DEX             ]'
    ]);
    itemDetailBox.show(); actionMenu.focus(); screen.render();
    actionMenu.once('select', (i) => {
      const r = i.getText().trim().split(/\s+/)[0];
      creationData.race = r;
      gameState = 'CREATION_CLASS';
      actionMenu.setLabel(' [ CLASSE ] ');
      actionMenu.setItems([' Guerreiro', ' Mago', ' Arqueiro', ' Clérigo']);
      actionMenu.focus(); screen.render();
      actionMenu.once('select', (c) => {
        const cls = c.getText().trim();
        creationData.cls = cls;
        gameState = 'CREATION_CONFIRM';
        actionMenu.setLabel(' [ CONFIRMAR ] ');
        actionMenu.setItems([' [1] Começar Jornada', ' [2] Recomeçar']);
        itemDetailBox.setContent(
          chalk.bold.cyan(`\n  ${n} — ${r} ${cls}\n\n`) +
          chalk.gray('  Confirme seu exilado ou recomece\n  a criação do personagem.\n')
        );
        itemDetailBox.show(); actionMenu.focus(); screen.render();
      });
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
  if (gameState === 'GAME_OVER') {
    player = null; currentDungeon = null; currentCombat = null; gameState = 'MENU';
    mapBox.hide(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.hide(); logBox.show();
    actionMenu.setLabel(' [ AÇÕES ] '); actionMenu.setItems(initialMenu); actionMenu.focus();
    screen.render(); return;
  }
  inventoryBox.hide(); itemDetailBox.hide(); mapBox.show(); logBox.show();
  if (gameState === 'EXPLORING' || gameState === 'COMBAT') { saveGame(); currentDungeon = null; showNexus(); }
  else if (gameState === 'BOSS_RUSH' || gameState === 'BOSS_RUSH_SKILLS') {
    bossRushWave = 0; bossRushScore = 0; combatVisualBox.hide(); showNexus();
  }
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
  else if (gameState === 'BOSS_RUSH') handleCombatAction(c);
  else if (gameState === 'BOSS_RUSH_SKILLS') processCombatTurn(c);
  else if (gameState === 'BOSS_RUSH_MENU') {
    if (c.includes('Iniciar')) { bossRushWave = 0; bossRushScore = 0; startBossRushWave(); }
    else showNexus();
  }
  else if (gameState === 'MARIE') {
    if (c.includes('[U]')) {
      if (currentAltar.upgradeMastery(player)) {
        const cfg = currentAltar.getMasteryConfig(player.craftingMastery);
        log(chalk.bold.magenta(`Maestria evoluída: ${cfg.label}!`));
        showMarie(); updateStatus();
      } else log(chalk.red('Orbes insuficientes para evoluir Maestria.'));
    }
  }
  else if (gameState === 'ATTRIBUTES') { if (c.includes('FORÇA')) player.upgradeAttribute('STR'); if (c.includes('DESTREZA')) player.upgradeAttribute('DEX'); if (c.includes('INTELIGÊNCIA')) player.upgradeAttribute('INT'); updateStatus(); }
  else if (gameState === 'TRADE_BUY' || gameState === 'TRADE_SELL') handleTrade(c, index);
  else if (gameState === 'QUESTS') handleQuests(c, index);
  else if (gameState === 'EXPLORING') {
    if (c.includes('Inv')) showInventory();
    else if (c.includes('Skills')) showPassives();
  }
  else if (gameState === 'CREATION_CONFIRM') {
    if (c.includes('Começar')) {
      player = new Entity(creationData.name, { race: creationData.race, background: creationData.cls });
      showNexus();
    } else if (c.includes('Recomeçar')) {
      startCreation();
    }
  }
});

screen.on('resize', () => screen.render());
screen.append(titleBox); screen.append(statusBox); screen.append(synergyBox); screen.append(legendBox); screen.append(mapBox);
screen.append(combatVisualBox); screen.append(inventoryBox); screen.append(itemDetailBox);
screen.append(equipVisualBox); screen.append(logBox); screen.append(actionMenu); screen.append(interactBox);
const initialMenu = [' [1] Novo Jogo', ' [2] Carregar Jogo', ' [3] Sair']; actionMenu.setItems(initialMenu); actionMenu.focus(); updateStatus();
