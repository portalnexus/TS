const blessed = require('blessed');
const chalk = require('chalk');
const Entity = require('./entities/Entity');
const Dungeon = require('./core/Dungeon');
const Combat = require('./combat/Combat');
const Puzzle = require('./core/Puzzle');
const Item = require('./items/Item');
const Sprites = require('./ui/Sprites');

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
const player = new Entity('Exilado', { hp: 150, sp: 100, mp: 100 });
let currentDungeon = null;
let currentCombat = null;
let gameState = 'MENU'; // MENU, EXPLORING, COMBAT, PUZZLE, INVENTORY

// --- RENDERIZAÇÃO ---
function updateStatus() {
  const hpColor = player.hp < player.maxHp * 0.3 ? chalk.red : chalk.green;
  statusBox.setContent(`
  ${chalk.bold.cyan(player.name)}
  LVL: ${player.level} | XP: ${player.xp}

  HP: ${hpColor(player.hp + '/' + player.maxHp)}
  SP: ${chalk.yellow(player.sp + '/' + player.maxSp)}
  MP: ${chalk.blue(player.mp + '/' + player.maxMp)}

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
function startDungeon() {
  currentDungeon = new Dungeon(1);
  gameState = 'EXPLORING';
  mapBox.show();
  combatVisualBox.hide();
  actionMenu.setItems([' [W,A,S,D] Mover', ' [I] Inventário', ' [Q] Fugir']);
  log(chalk.green('Você adentrou na fenda. Use WASD para explorar.'));
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
    case 'EXIT':
      startCombat(tile.data);
      tile.type = 'FLOOR'; // Remove após combate
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
      startDungeonNav();
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
      log(chalk.green('Sucesso!'));
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
  actionMenu.setItems([' [W,A,S,D] Mover', ' [I] Inventário', ' [Q] Fugir']);
  actionMenu.focus();
  renderMap();
}

// --- INPUTS ---
screen.key(['w'], () => handleMove(0, -1));
screen.key(['s'], () => handleMove(0, 1));
screen.key(['a'], () => handleMove(-1, 0));
screen.key(['d'], () => handleMove(1, 0));
screen.key(['i'], () => {
  if (gameState === 'EXPLORING') showInventory();
});

// Teclas de Seleção Alternativas
screen.key(['space'], () => {
  if (gameState === 'MENU' || gameState === 'INVENTORY' || gameState === 'COMBAT') {
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

actionMenu.on('select', (item) => {
  const choice = item.getText().trim();
  if (gameState === 'MENU') {
    if (choice.includes('Entrar')) startDungeon();
    if (choice.includes('Sair')) process.exit(0);
  } else if (gameState === 'COMBAT') {
    handleCombatAction(choice);
  }
});

screen.key(['escape', 'q'], () => {
  if (gameState === 'MENU') process.exit(0);
  if (gameState === 'INVENTORY') {
    inventoryBox.hide();
    mapBox.show();
    gameState = 'EXPLORING';
    startDungeonNav();
    return;
  }
  gameState = 'MENU';
  mapBox.hide();
  combatVisualBox.hide();
  inventoryBox.hide();
  actionMenu.setItems([' [1] Entrar na Fenda', ' [2] Sair']);
  actionMenu.focus();
});

// --- INIT ---
screen.append(titleBox); screen.append(statusBox); screen.append(mapBox);
screen.append(combatVisualBox); screen.append(inventoryBox); screen.append(itemDetailBox);
screen.append(equipVisualBox); screen.append(logBox); screen.append(actionMenu); screen.append(interactBox);

actionMenu.setItems([' [1] Entrar na Fenda', ' [2] Sair']);
actionMenu.focus();
updateStatus();
log(chalk.gray('Bem-vindo ao Terminal Souls. Selecione uma opção.'));
screen.render();
