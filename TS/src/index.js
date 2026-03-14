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

// --- SETUP DA TELA ---
const screen = blessed.screen({
  smartCSR: true,
  title: 'Terminal Souls - The Echoes of Exile',
  fullUnicode: true
});

// --- COMPONENTES UI ---
const titleBox = blessed.box({
  top: 0, left: 'center', width: '100%', height: 3,
  content: chalk.bold.red(' TERMINAL SOULS: THE ECHOES OF EXILE '),
  align: 'center', border: { type: 'line', fg: 'red' }
});

const statusBox = blessed.box({
  top: 3, left: 0, width: '25%', height: 12,
  label: ' [ STATUS ] ', border: { type: 'line', fg: 'cyan' }
});

const mapBox = blessed.box({
  top: 3, left: '25%', width: '50%', height: 15,
  label: ' [ MAPA DA FENDA ] ', border: { type: 'line', fg: 'white' },
  tags: true
});

const combatVisualBox = blessed.box({
  top: 3, left: '25%', width: '50%', height: 15,
  label: ' [ COMBATE ] ', border: { type: 'line', fg: 'red' },
  hidden: true, tags: true
});

const logBox = blessed.log({
  top: 18, left: '25%', width: '75%', height: 10,
  label: ' [ CRÔNICAS ] ', border: { type: 'line', fg: 'yellow' },
  scrollable: true, alwaysScroll: true, mouse: true
});

const actionMenu = blessed.list({
  top: 15, left: 0, width: '25%', height: 13,
  label: ' [ AÇÕES ] ', border: { type: 'line', fg: 'green' },
  keys: true, vi: true, style: { selected: { bg: 'red', bold: true } }
});

const interactBox = blessed.box({
  top: 10, left: '30%', width: '40%', height: 5,
  label: ' [ INTERAÇÃO ] ', border: { type: 'line', fg: 'white' },
  hidden: true
});

const inputField = blessed.textbox({
  parent: interactBox, top: 1, left: 2, width: '90%', height: 1,
  inputOnFocus: true, style: { bg: 'blue' }
});

const inventoryBox = blessed.list({
  top: 3, left: '25%', width: '50%', height: 15,
  label: ' [ INVENTÁRIO ] ', border: { type: 'line', fg: 'cyan' },
  keys: true, vi: true, style: { selected: { bg: 'blue', bold: true } },
  hidden: true
});

const itemDetailBox = blessed.box({
  top: 18, left: 0, width: '25%', height: 10,
  label: ' [ DETALHES ] ', border: { type: 'line', fg: 'yellow' },
  tags: true
});

const equipVisualBox = blessed.box({
  top: 3, left: '75%', width: '25%', height: 15,
  label: ' [ EQUIPADO ] ', border: { type: 'line', fg: 'magenta' },
  tags: true
});

// --- ESTADO DO JOGO ---
let player = new Entity('Exilado', { hp: 150, sp: 100, mp: 100 });
let currentBlacksmith = new Blacksmith(1);
let currentAltar = new CraftingAltar();
let questBoard = new QuestBoard();
let currentDungeon = null;
let currentCombat = null;
let gameState = 'MENU'; // MENU, EXPLORING, COMBAT, PUZZLE, INVENTORY, NEXUS, TRADE_BUY, TRADE_SELL, ALTAR, QUESTS

// --- SISTEMA DE SAVE ---
function saveGame() {
  if (SaveSystem.save(player.serialize())) {
    log(chalk.green('💾 Alma vinculada ao receptáculo (Salvo).'));
  }
}

function loadGame() {
  const data = SaveSystem.load();
  if (data) {
    player = Entity.fromSave(data);
    log(chalk.cyan('✨ Reencarnação concluída. Almas recuperadas.'));
    updateStatus();
    showNexus();
  }
}

// --- RENDERIZAÇÃO ---
function updateStatus() {
  const hpColor = player.hp < player.maxHp * 0.3 ? chalk.red : chalk.green;
  statusBox.setContent(`
  ${chalk.bold.cyan(player.name)}
  LVL: ${player.level} | XP: ${player.xp}/${player.level * 100}

  HP: ${hpColor(player.hp + '/' + player.maxHp)}
  SP: ${chalk.yellow(player.sp + '/' + player.maxSp)}
  MP: ${chalk.blue(player.mp + '/' + player.maxMp)}

  STR: ${player.strength} | DEX: ${player.dexterity} | INT: ${player.intelligence}
  PONTOS: ${chalk.bold.green(player.attributePoints)}
  ORBES: ${chalk.yellow(player.orbs)}

  POSTURA: ${player.postureMode}
  S-BAR: [${'#'.repeat(Math.min(10, Math.floor(player.posture / 10)))}${'.'.repeat(Math.max(0, 10 - Math.floor(player.posture / 10)))}]

  ${player.isStaggered ? chalk.bgRed(' ATORDOADO ') : ''}
  `);

  // Render Visual Equip
  let paperDoll = `
      ${chalk.gray('  .---.  ')}
      ${chalk.gray('  |o_o|  ')}
  ${player.equipment.ARMA ? chalk.yellow('[/]') : chalk.gray(' | ')}${chalk.gray(' \\_/ ')}${chalk.gray(' | ')}
  ${chalk.gray('  | ')}${player.equipment.ARMADURA ? chalk.cyan('[#]') : chalk.gray('[ ]')}${chalk.gray(' |  ')}
      ${chalk.gray('  / \\   ')}
      ${chalk.gray(' _|_|_  ')}
  `;

  equipVisualBox.setContent(`
  ${paperDoll}
  ${chalk.bold('ARMA:')}
  ${player.equipment.ARMA ? player.equipment.ARMA.getColorizedName() : 'Vazio'}

  ${chalk.bold('ARMADURA:')}
  ${player.equipment.ARMADURA ? player.equipment.ARMADURA.getColorizedName() : 'Vazio'}
  `);

  screen.render();
}

function showProficiencies() {
  gameState = 'PROFICIENCIES';
  const items = Object.keys(player.proficiencies).map(tag => {
    return ` [${tag[0]}] ${tag}: LVL ${player.proficiencies[tag]} (+${player.proficiencies[tag] * 5}%)`;
  });
  items.push(' [ESC] Voltar');
  
  actionMenu.setItems(items);
  actionMenu.setLabel(` [ PROFICIÊNCIAS - PONTOS: ${player.proficiencyPoints} ] `);
  actionMenu.focus();
  updateStatus();
}

function handleProficiencyUpgrade(choice) {
  const tagMap = { 'C': 'CORTE', 'E': 'ESMAGAMENTO', 'F': 'FOGO', 'C': 'CHOQUE', 'V': 'VAZIO' };
  // Lógica de detecção por texto do item selecionado
  let targetTag = null;
  if (choice.includes('CORTE')) targetTag = 'CORTE';
  if (choice.includes('ESMAGAMENTO')) targetTag = 'ESMAGAMENTO';
  if (choice.includes('FOGO')) targetTag = 'FOGO';
  if (choice.includes('CHOQUE')) targetTag = 'CHOQUE';
  if (choice.includes('VAZIO')) targetTag = 'VAZIO';

  if (targetTag && player.upgradeProficiency(targetTag)) {
    log(chalk.green(`Mestria em ${targetTag} aumentada!`));
    showProficiencies();
  } else {
    log(chalk.red('Sem pontos de proficiência!'));
  }
}

function showAttributes() {
  gameState = 'ATTRIBUTES';
  actionMenu.setItems([
    ` [S] + FORÇA (${player.strength})`,
    ` [D] + DESTREZA (${player.dexterity})`,
    ` [I] + INTELIGÊNCIA (${player.intelligence})`,
    ' [ESC] Voltar'
  ]);
  actionMenu.focus();
  updateStatus();
}

function handleAttributeUpgrade(choice) {
  let success = false;
  if (choice.includes('FORÇA')) success = player.upgradeAttribute('STR');
  if (choice.includes('DESTREZA')) success = player.upgradeAttribute('DEX');
  if (choice.includes('INTELIGÊNCIA')) success = player.upgradeAttribute('INT');

  if (success) {
    log(chalk.green('Atributo aprimorado!'));
    showAttributes();
  } else {
    log(chalk.red('Sem pontos disponíveis!'));
  }
}

function showInventory() {
  gameState = 'INVENTORY';
  mapBox.hide();
  inventoryBox.show();

  const items = player.inventory.map(it => `${it.getColorizedName()} (${it.type})`);
  inventoryBox.setItems(items);
  inventoryBox.focus();

  actionMenu.setItems([' [ENTER] Equipar/Usar', ' [ESC] Voltar']);
  screen.render();
}

inventoryBox.on('select', (item, index) => {
  const selectedItem = player.inventory[index];
  if (!selectedItem) return;

  if (selectedItem.type === 'CONSUMÍVEL') {
    player.useConsumable(selectedItem);
    log(`Usou: ${selectedItem.name}`);
  } else {
    player.equipItem(selectedItem);
    log(`Equipou: ${selectedItem.name}`);
  }

  updateStatus();
  showInventory(); // Refresh list
});

inventoryBox.on('element focus', (item) => {
  const index = inventoryBox.getItemIndex(item);
  const selectedItem = player.inventory[index];
  if (selectedItem) {
    itemDetailBox.setContent(selectedItem.getDetails());
  }
  screen.render();
}
);

function showNexus() {
  gameState = 'NEXUS';
  mapBox.setContent('\n\n    ' + chalk.bold.blue('[ O NEXUS ]') + '\n\n  Um lugar de paz temporária.\n  O vento sopra cinzas...\n\n  Halthor, o Ferreiro, martela ao longe.\n  Um antigo Altar brilha fraco.');
  actionMenu.setItems([
    ' [1] Entrar na Fenda',
    ' [2] Halthor (Ferreiro)',
    ' [3] Altar da Transmutação',
    ' [4] Quadro de Missões',
    ' [I] Inventário',
    ' [H] Atributos',
    ' [P] Proficiências',
    ' [ESC] Menu Principal'
  ]);
  actionMenu.focus();
  updateStatus();
}

function showAltar() {
  gameState = 'ALTAR';
  actionMenu.setLabel(` [ ALTAR - REROLL: ${currentAltar.reRollCost} ORBES ] `);
  const items = player.inventory.map(it => {
    return currentAltar.canReRoll(it) ? `${it.getColorizedName()} (${it.type})` : chalk.gray(`${it.name} (Incompatível)`);
  });
  items.push(' [ESC] Voltar');
  actionMenu.setItems(items);
  actionMenu.focus();
}

function handleAltar(choice, index) {
  if (choice.includes('Voltar')) {
    showNexus();
    return;
  }
  
  if (currentAltar.reRollItem(player, index)) {
    log(chalk.magenta('As energias do item foram reescritas!'));
    showAltar();
    updateStatus();
  } else {
    log(chalk.red('Falha: Item incompatível ou Orbes insuficientes.'));
  }
}

function showQuests() {
  gameState = 'QUESTS';
  actionMenu.setLabel(' [ QUADRO DE MISSÕES ] ');
  actionMenu.setItems(questBoard.getMenuOptions(player));
  actionMenu.focus();
}

function handleQuests(choice, index) {
  if (choice.includes('Voltar')) {
    showNexus();
    return;
  }

  if (choice.includes('ENTREGAR')) {
    if (questBoard.turnInQuest(player)) {
      log(chalk.green('Missão entregue! Recompensas recebidas.'));
      showQuests();
      updateStatus();
    }
  } else if (questBoard.acceptQuest(player, index)) {
    log(chalk.cyan('Nova missão aceita. Cumpra seu destino.'));
    showQuests();
  } else {
    log(chalk.red('Você já tem uma missão ativa ou a missão é inválida.'));
  }
}

function showBlacksmith() {
  gameState = 'TRADE_BUY';
  actionMenu.setLabel(` [ FERREIRO - ${player.orbs} ORBES ] `);
  actionMenu.setItems(currentBlacksmith.getMenuOptions());
  actionMenu.focus();
}

function showBlacksmithSell() {
  gameState = 'TRADE_SELL';
  const sellItems = player.inventory.map(it => `${it.getColorizedName()} (${chalk.yellow(Math.floor(it.getPrice() * 0.4) + ' Orbes')})`);
  sellItems.push(' [ESC] Voltar');
  actionMenu.setItems(sellItems);
  actionMenu.focus();
}

function handleTrade(choice, index) {
  if (gameState === 'TRADE_BUY') {
    if (choice.includes('VENDER')) {
      showBlacksmithSell();
    } else if (choice.includes('COMPRAR')) {
      if (currentBlacksmith.buyItem(player, index)) {
        log(chalk.green('Negócio fechado!'));
        showBlacksmith();
        updateStatus();
      } else {
        log(chalk.red('Orbes insuficientes!'));
      }
    }
  } else if (gameState === 'TRADE_SELL') {
    if (choice.includes('Voltar')) {
      showBlacksmith();
    } else {
      const value = currentBlacksmith.sellItem(player, index);
      if (value) {
        log(chalk.green(`Item vendido por ${value} Orbes.`));
        showBlacksmithSell();
        updateStatus();
      }
    }
  }
}

function renderMap() {
  if (!currentDungeon) return;
  let mapDisplay = '';
  for (let y = 0; y < currentDungeon.height; y++) {
    for (let x = 0; x < currentDungeon.width; x++) {
      if (x === currentDungeon.playerPos.x && y === currentDungeon.playerPos.y) {
        mapDisplay += chalk.bold.cyan('@ ');
      } else {
        const tile = currentDungeon.grid[y][x];
        switch(tile.type) {
          case 'WALL': mapDisplay += Sprites.objects.wall; break;
          case 'FLOOR': mapDisplay += Sprites.objects.floor; break;
          case 'TREASURE': mapDisplay += Sprites.objects.treasure; break;
          case 'ENEMY': mapDisplay += Sprites.objects.enemy; break;
          case 'PUZZLE': mapDisplay += Sprites.objects.puzzle; break;
          case 'EXIT': mapDisplay += Sprites.objects.door; break;
          case 'REST': mapDisplay += Sprites.objects.rest; break;
        }
      }
    }
    mapDisplay += '\n';
  }
  mapBox.setContent(mapDisplay);
  screen.render();
}

function renderCombat() {
  if (!currentCombat) return;
  const enemy = currentCombat.enemies[0];
  const enemySprite = Sprites.getEnemySprite(enemy.name);
  const playerSprite = Sprites.player;

  let combatDisplay = '\n';

  // Render Inimigo (Topo-Direita)
  enemySprite.forEach(line => {
    combatDisplay += ' '.repeat(45) + line + '\n';
  });
  combatDisplay += ' '.repeat(43) + chalk.bold.red(enemy.name) + '\n';
  const enemyHpPerc = Math.max(0, Math.floor(enemy.hp / enemy.maxHp * 10));
  combatDisplay += ' '.repeat(43) + `HP: [${'#'.repeat(enemyHpPerc)}${'.'.repeat(10 - enemyHpPerc)}]` + '\n';

  combatDisplay += '\n' + '-'.repeat(70) + '\n\n';

  // Render Player (Base-Esquerda)
  playerSprite.forEach(line => {
    combatDisplay += ' '.repeat(5) + line + '\n';
  });

  combatVisualBox.setContent(combatDisplay);
  screen.render();
}

function log(msg) {
  logBox.log(msg);
  screen.render();
}

// --- LOGICA DE JOGO ---
function startDungeon(floor = 1) {
  currentDungeon = new Dungeon(floor);
  gameState = 'EXPLORING';
  mapBox.setLabel(chalk[currentDungeon.biome.color](` [ ${currentDungeon.biome.name} - Andar ${floor} ] `));
  mapBox.show();
  combatVisualBox.hide();
  inventoryBox.hide();
  actionMenu.setLabel(' [ AÇÕES ] ');
  actionMenu.setItems([' [W,A,S,D] Mover', ' [I] Inventário', ' [H] Atributos', ' [Q] Fugir']);
  log(chalk.green(`Você adentrou no Andar ${floor} da fenda.`));
  
  if (player.activeQuest && player.activeQuest.type === 'FLOOR' && !player.activeQuest.completed) {
    if (floor >= player.activeQuest.target) {
      player.activeQuest.progress = player.activeQuest.target;
      player.activeQuest.completed = true;
      log(chalk.bold.yellow(' [!] MISSÃO CONCLUÍDA! Retorne ao Nexus.'));
    } else {
      player.activeQuest.progress = floor;
    }
  }

  renderMap();
}

function handleMove(dx, dy) {
  if (gameState !== 'EXPLORING') return;
  const tile = currentDungeon.movePlayer(dx, dy);
  if (tile) {
    if (tile.type !== 'FLOOR') {
      handleTileInteraction(tile);
    }
    renderMap();
  }
}

function handleTileInteraction(tile) {
  switch(tile.type) {
    case 'ENEMY':
      startCombat(tile.data);
      tile.type = 'FLOOR';
      break;
    case 'EXIT':
      if (tile.data) {
        // tile.data já é um array [Entity] vindo de Dungeon.generateEnemyData
        startCombat(tile.data);
        tile.type = 'FLOOR';
      } else {
        startDungeon(currentDungeon.floor + 1);
      }
      break;
    case 'TREASURE':
      const loot = new Item(currentDungeon.floor);
      player.inventory.push(loot);
      log(chalk.yellow(`Loot: ${loot.getColorizedName()}`));
      tile.type = 'FLOOR';
      break;
    case 'PUZZLE':
      startPuzzle(tile);
      break;
    case 'REST':
      player.recover(0.5, 0.5, 0.5);
      log(chalk.green('Você descansou. Atributos restaurados.'));
      tile.type = 'FLOOR';
      break;
  }
}

function startCombat(enemies) {
  gameState = 'COMBAT';
  currentCombat = new Combat(player, enemies);
  mapBox.hide();
  combatVisualBox.show();
  renderCombat();

  actionMenu.setItems([
    ' [A] ATACAR',
    ' [S] MAGIA',
    ' [R] RECUPERAR',
    ' [P] POSTURA'
  ]);
  actionMenu.focus();
}

function handleCombatAction(choice) {
  if (currentCombat.isOver) return;

  if (choice.includes('ATACAR')) currentCombat.playerAction('ATTACK');
  if (choice.includes('MAGIA')) currentCombat.playerAction('SKILL');
  if (choice.includes('RECUPERAR')) currentCombat.playerAction('RECOVER');
  if (choice.includes('POSTURA')) {
    const modes = ['ATTACK', 'BALANCED', 'DEFENCE'];
    player.setPostureMode(modes[(modes.indexOf(player.postureMode) + 1) % 3]);
  }

  currentCombat.log.forEach(m => log(m));
  currentCombat.log = [];
  updateStatus();
  renderCombat();

  if (currentCombat.isOver) {
    if (currentCombat.result === 'WIN') {
      gameState = 'EXPLORING';
      combatVisualBox.hide();
      mapBox.show();
      
      const hasBoss = currentCombat.enemies.some(e => e.name.includes('CHEFE') || e.name.includes('SENHOR'));
      if (hasBoss) {
        log(chalk.bold.magenta('Você derrotou o guardião! A fenda se aprofunda...'));
        startDungeon(currentDungeon.floor + 1);
      } else {
        startDungeonNav();
        updateStatus();
      }
    } else {
      process.exit(0);
    }
  }
}

function startPuzzle(tile) {
  gameState = 'PUZZLE';
  const puzzle = new Puzzle('MATH', currentDungeon.floor);
  log(chalk.blue(`ENIGMA: ${puzzle.question}`));
  interactBox.show();
  inputField.focus();
  inputField.once('submit', (val) => {
    interactBox.hide();
    if (puzzle.checkAnswer(val)) {
      const xpReward = 50 * currentDungeon.floor;
      const leveledUp = player.addExperience(xpReward);
      log(chalk.green(`Sucesso! +${xpReward} XP.`));
      if (leveledUp) log(chalk.bold.cyan('>>> NÍVEL AUMENTADO! +3 PONTOS DE ATRIBUTO. <<<'));
      tile.type = 'FLOOR';
    } else {
      log(chalk.red('Falha! Armadilha disparada.'));
      player.takeDamage(20);
    }
    gameState = 'EXPLORING';
    startDungeonNav();
    updateStatus();
  });
}

function startDungeonNav() {
  actionMenu.setItems([' [W,A,S,D] Mover', ' [I] Inventário', ' [H] Atributos', ' [Q] Fugir']);
  actionMenu.focus();
  renderMap();
}

// --- INPUTS ---
screen.key(['w'], () => handleMove(0, -1));
screen.key(['s'], () => {
  if (gameState === 'EXPLORING') handleMove(0, 1);
  if (gameState === 'ATTRIBUTES') handleAttributeUpgrade('FORÇA');
});
screen.key(['a'], () => handleMove(-1, 0));
screen.key(['d'], () => {
  if (gameState === 'EXPLORING') handleMove(1, 0);
  if (gameState === 'ATTRIBUTES') handleAttributeUpgrade('DESTREZA');
});
screen.key(['i'], () => {
  if (gameState === 'EXPLORING') showInventory();
  if (gameState === 'ATTRIBUTES') handleAttributeUpgrade('INTELIGÊNCIA');
});
screen.key(['h'], () => {
  if (gameState === 'EXPLORING' || gameState === 'MENU') showAttributes();
});
screen.key(['p'], () => {
  if (gameState === 'EXPLORING' || gameState === 'MENU') showProficiencies();
});

// Teclas de Seleção Alternativas
screen.key(['space'], () => {
  if (gameState === 'MENU' || gameState === 'INVENTORY' || gameState === 'COMBAT' || gameState === 'ATTRIBUTES' || gameState === 'PROFICIENCIES') {
    actionMenu.emit('select', actionMenu.getItem(actionMenu.selected), actionMenu.selected);
  }
});

// Hotkeys de Combate
screen.key(['1', 'z'], () => {
  if (gameState === 'COMBAT') handleCombatAction('ATACAR');
});
screen.key(['2', 'x'], () => {
  if (gameState === 'COMBAT') handleCombatAction('MAGIA');
});

actionMenu.on('select', (item, index) => {
  const choice = item.getText().trim();
  if (gameState === 'MENU') {
    if (choice.includes('Entrar')) startDungeon();
    if (choice.includes('Carregar')) loadGame();
    if (choice.includes('Sair')) process.exit(0);
  } else if (gameState === 'NEXUS') {
    if (choice.includes('Entrar')) startDungeon();
    if (choice.includes('Halthor')) showBlacksmith();
    if (choice.includes('Altar')) showAltar();
    if (choice.includes('Missões')) showQuests();
    if (choice.includes('Inventário')) showInventory();
    if (choice.includes('Atributos')) showAttributes();
    if (choice.includes('Proficiências')) showProficiencies();
    if (choice.includes('Menu Principal')) {
      gameState = 'MENU';
      const menuItems = [' [1] Entrar na Fenda'];
      if (SaveSystem.hasSave()) menuItems.push(' [2] Carregar Jogo');
      menuItems.push(' [Q] Sair');
      actionMenu.setItems(menuItems);
    }
  } else if (gameState === 'COMBAT') {
    handleCombatAction(choice);
  } else if (gameState === 'ATTRIBUTES') {
    handleAttributeUpgrade(choice);
  } else if (gameState === 'PROFICIENCIES') {
    handleProficiencyUpgrade(choice);
  } else if (gameState === 'ALTAR') {
    handleAltar(choice, index);
  } else if (gameState === 'QUESTS') {
    handleQuests(choice, index);
  } else if (gameState === 'TRADE_BUY' || gameState === 'TRADE_SELL') {
    handleTrade(choice, index);
  }
});

screen.key(['escape', 'q'], () => {
  if (gameState === 'MENU') process.exit(0);
  if (gameState === 'INVENTORY' || gameState === 'ATTRIBUTES' || gameState === 'PROFICIENCIES' || gameState === 'TRADE_BUY' || gameState === 'TRADE_SELL' || gameState === 'ALTAR' || gameState === 'QUESTS') {
    if (gameState.includes('TRADE') || gameState === 'ALTAR' || gameState === 'QUESTS') {
      showNexus();
      return;
    }
    inventoryBox.hide();
    mapBox.show();
    if (currentDungeon) {
      gameState = 'EXPLORING';
      startDungeonNav();
    } else {
      showNexus();
    }
    actionMenu.setLabel(' [ AÇÕES ] ');
    return;
  }

  // Ao fugir da fenda
  if (gameState === 'EXPLORING' || gameState === 'COMBAT') {
    saveGame();
    currentDungeon = null;
    showNexus();
    return;
  }
});

// --- INIT ---
screen.append(titleBox); screen.append(statusBox); screen.append(mapBox);
screen.append(combatVisualBox); screen.append(inventoryBox); screen.append(itemDetailBox);
screen.append(equipVisualBox); screen.append(logBox); screen.append(actionMenu); screen.append(interactBox);

const initialMenu = [' [1] Entrar na Fenda'];
if (SaveSystem.hasSave()) initialMenu.push(' [2] Carregar Jogo');
initialMenu.push(' [Q] Sair');

actionMenu.setItems(initialMenu);
actionMenu.focus();
updateStatus();
log(chalk.gray('Bem-vindo ao Terminal Souls. Selecione uma opção.'));
screen.render();
