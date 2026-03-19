const chalk = require('chalk');
const fs    = require('fs');
const path  = require('path');

const SETTINGS_PATH = path.join(__dirname, '../../saves/settings.json');

// ─────────────────────────────────────────────────────────────
// Paletas — cada propriedade é uma chalk instance ou string de
// cor do blessed. O Proxy T lê sempre do tema ativo.
// ─────────────────────────────────────────────────────────────
const THEMES = {

  // ── 1. DARK — Escuridão do Exílio (padrão) ──────────────────
  DARK: {
    label: 'Escuridão do Exílio',

    // Papéis semânticos
    danger:   chalk.red,
    success:  chalk.green,
    warning:  chalk.yellow,
    magic:    chalk.magenta,
    info:     chalk.blue,
    player:   chalk.cyan,
    neutral:  chalk.gray,
    bright:   chalk.white,

    // Fundo crítico (fase de boss, alerta de colapso)
    criticalBg: chalk.bold.bgRed.white,

    // Ícones de status
    iconBleed:    chalk.red,
    iconBurn:     chalk.hex('#FFA500'),
    iconShock:    chalk.yellow,
    iconFreeze:   chalk.cyan,
    iconEvade:    chalk.white,
    iconImmunity: chalk.cyan,

    // Tiles do mapa (strings pré-renderizadas por tema)
    tilePlayer:      chalk.bold.cyan('@ '),
    tileEnemy:       chalk.bold.red('!!'),
    tileBoss:        chalk.bold.magenta('$$'),
    tileTreasure:    chalk.yellow.bold('¤ '),
    tileDoor:        chalk.bold.white('>>'),
    tilePuzzle:      chalk.bold.blue('??'),
    tileRest:        chalk.bold.green('++'),
    tileWall:        chalk.bgWhite('  '),
    tileFloor:       chalk.hex('#1a1a1a')('· '),
    tileFog:         chalk.gray('░░'),
    tileNexusPlayer: chalk.bold.white('@ '),

    // Barras de recurso — função(ratio 0-1) → chalk fn
    hpColor: (r) => r < 0.25 ? chalk.red    : r < 0.55 ? chalk.yellow : chalk.green,
    spColor: (r) => r < 0.30 ? chalk.red    : chalk.yellow,
    mpColor: (r) => r < 0.30 ? chalk.red    : chalk.blue,

    // Raridades de item
    rarityComum:    chalk.white,
    rarityMagico:   chalk.cyan,
    rarityRaro:     chalk.yellow,
    rarityLendario: chalk.magenta.bold,

    // Cores de classe
    classGuerreiro: chalk.red,
    classMago:      chalk.blue,
    classArqueiro:  chalk.yellow,
    classClerigo:   chalk.green,

    // Mapeador de cor de NPC do Nexus (recebe string 'red', 'cyan'…)
    npcChalk: (c) => chalk.bold[c] || chalk.bold.white,

    // Cores de borda blessed (strings)
    borderTitle:     'red',
    borderStatus:    'cyan',
    borderSynergy:   'magenta',
    borderMap:       'white',
    borderCombat:    'red',
    borderLog:       'yellow',
    borderAction:    'green',
    borderInventory: 'cyan',
    borderEquip:     'magenta',
    borderInteract:  'white',

    // Estilo de item selecionado em listas
    selectedBg:          'red',
    inventorySelectedBg: 'blue',
  },

  // ── 2. LIGHT — Claridade da Razão ────────────────────────────
  LIGHT: {
    label: 'Claridade da Razão',

    danger:   chalk.redBright,
    success:  chalk.greenBright,
    warning:  chalk.yellowBright,
    magic:    chalk.magentaBright,
    info:     chalk.blueBright,
    player:   chalk.cyanBright,
    neutral:  chalk.white,
    bright:   chalk.whiteBright,

    criticalBg: chalk.bold.bgRedBright.black,

    iconBleed:    chalk.redBright,
    iconBurn:     chalk.hex('#FFA500'),
    iconShock:    chalk.yellowBright,
    iconFreeze:   chalk.cyanBright,
    iconEvade:    chalk.whiteBright,
    iconImmunity: chalk.cyanBright,

    tilePlayer:      chalk.bold.cyanBright('@ '),
    tileEnemy:       chalk.bold.redBright('!!'),
    tileBoss:        chalk.bold.magentaBright('$$'),
    tileTreasure:    chalk.yellowBright.bold('¤ '),
    tileDoor:        chalk.bold.whiteBright('>>'),
    tilePuzzle:      chalk.bold.blueBright('??'),
    tileRest:        chalk.bold.greenBright('++'),
    tileWall:        chalk.bgWhite('  '),
    tileFloor:       chalk.gray('· '),
    tileFog:         chalk.white('░░'),
    tileNexusPlayer: chalk.bold.whiteBright('@ '),

    hpColor: (r) => r < 0.25 ? chalk.redBright    : r < 0.55 ? chalk.yellowBright : chalk.greenBright,
    spColor: (r) => r < 0.30 ? chalk.redBright    : chalk.yellowBright,
    mpColor: (r) => r < 0.30 ? chalk.redBright    : chalk.blueBright,

    rarityComum:    chalk.whiteBright,
    rarityMagico:   chalk.cyanBright,
    rarityRaro:     chalk.yellowBright,
    rarityLendario: chalk.magentaBright.bold,

    classGuerreiro: chalk.redBright,
    classMago:      chalk.blueBright,
    classArqueiro:  chalk.yellowBright,
    classClerigo:   chalk.greenBright,

    npcChalk: (c) => {
      const map = { red: 'redBright', cyan: 'cyanBright', magenta: 'magentaBright',
                    green: 'greenBright', yellow: 'yellowBright', blue: 'blueBright' };
      return chalk.bold[map[c] || c] || chalk.bold.whiteBright;
    },

    borderTitle:     'magenta',
    borderStatus:    'cyan',
    borderSynergy:   'magenta',
    borderMap:       'white',
    borderCombat:    'magenta',
    borderLog:       'yellow',
    borderAction:    'green',
    borderInventory: 'cyan',
    borderEquip:     'magenta',
    borderInteract:  'white',

    selectedBg:          'magenta',
    inventorySelectedBg: 'cyan',
  },

  // ── 3. COLORBLIND — Espectro Acessível ───────────────────────
  // Deuteranopia + Protanopia: vermelho → laranja, verde → azul
  COLORBLIND: {
    label: 'Espectro Acessível',

    danger:   chalk.hex('#FFA500'),   // laranja em vez de vermelho
    success:  chalk.blue,             // azul em vez de verde
    warning:  chalk.yellow,
    magic:    chalk.magenta,
    info:     chalk.cyan,
    player:   chalk.cyan,
    neutral:  chalk.gray,
    bright:   chalk.white,

    criticalBg: chalk.bold.bgYellow.black,

    iconBleed:    chalk.hex('#FFA500'),
    iconBurn:     chalk.yellowBright,
    iconShock:    chalk.yellow,
    iconFreeze:   chalk.cyan,
    iconEvade:    chalk.white,
    iconImmunity: chalk.cyan,

    tilePlayer:      chalk.bold.cyan('@ '),
    tileEnemy:       chalk.bold.hex('#FFA500')('!!'),
    tileBoss:        chalk.bold.magenta('$$'),
    tileTreasure:    chalk.yellow.bold('¤ '),
    tileDoor:        chalk.bold.white('>>'),
    tilePuzzle:      chalk.bold.cyan('??'),
    tileRest:        chalk.bold.blue('++'),
    tileWall:        chalk.bgWhite('  '),
    tileFloor:       chalk.hex('#1a1a1a')('· '),
    tileFog:         chalk.gray('░░'),
    tileNexusPlayer: chalk.bold.white('@ '),

    hpColor: (r) => r < 0.25 ? chalk.hex('#FFA500') : r < 0.55 ? chalk.yellow : chalk.blue,
    spColor: (r) => r < 0.30 ? chalk.hex('#FFA500') : chalk.yellow,
    mpColor: (r) => r < 0.30 ? chalk.hex('#FFA500') : chalk.cyan,

    rarityComum:    chalk.white,
    rarityMagico:   chalk.cyan,
    rarityRaro:     chalk.yellow,
    rarityLendario: chalk.magenta.bold,

    classGuerreiro: chalk.hex('#FFA500'),
    classMago:      chalk.cyan,
    classArqueiro:  chalk.yellow,
    classClerigo:   chalk.blue,

    npcChalk: (c) => {
      if (c === 'red')   return chalk.bold.hex('#FFA500');
      if (c === 'green') return chalk.bold.blue;
      return chalk.bold[c] || chalk.bold.white;
    },

    borderTitle:     'yellow',
    borderStatus:    'cyan',
    borderSynergy:   'magenta',
    borderMap:       'white',
    borderCombat:    'yellow',
    borderLog:       'yellow',
    borderAction:    'cyan',
    borderInventory: 'cyan',
    borderEquip:     'magenta',
    borderInteract:  'white',

    selectedBg:          'yellow',
    inventorySelectedBg: 'cyan',
  },

  // ── 4. NO_RED — O Exílio sem Sangue ──────────────────────────
  // Nenhuma instância de vermelho — perigo → magenta
  NO_RED: {
    label: 'O Exílio sem Sangue',

    danger:   chalk.magenta,
    success:  chalk.green,
    warning:  chalk.yellow,
    magic:    chalk.blue,
    info:     chalk.blue,
    player:   chalk.cyan,
    neutral:  chalk.gray,
    bright:   chalk.white,

    criticalBg: chalk.bold.bgMagenta.white,

    iconBleed:    chalk.magenta,
    iconBurn:     chalk.yellow,
    iconShock:    chalk.yellow,
    iconFreeze:   chalk.cyan,
    iconEvade:    chalk.white,
    iconImmunity: chalk.cyan,

    tilePlayer:      chalk.bold.cyan('@ '),
    tileEnemy:       chalk.bold.magenta('!!'),
    tileBoss:        chalk.bold.blue('$$'),
    tileTreasure:    chalk.yellow.bold('¤ '),
    tileDoor:        chalk.bold.white('>>'),
    tilePuzzle:      chalk.bold.blue('??'),
    tileRest:        chalk.bold.green('++'),
    tileWall:        chalk.bgWhite('  '),
    tileFloor:       chalk.hex('#1a1a1a')('· '),
    tileFog:         chalk.gray('░░'),
    tileNexusPlayer: chalk.bold.white('@ '),

    hpColor: (r) => r < 0.25 ? chalk.magenta : r < 0.55 ? chalk.yellow : chalk.green,
    spColor: (r) => r < 0.30 ? chalk.magenta : chalk.yellow,
    mpColor: (r) => r < 0.30 ? chalk.magenta : chalk.blue,

    rarityComum:    chalk.white,
    rarityMagico:   chalk.cyan,
    rarityRaro:     chalk.yellow,
    rarityLendario: chalk.blue.bold,

    classGuerreiro: chalk.magenta,
    classMago:      chalk.blue,
    classArqueiro:  chalk.yellow,
    classClerigo:   chalk.green,

    npcChalk: (c) => {
      if (c === 'red') return chalk.bold.magenta;
      return chalk.bold[c] || chalk.bold.white;
    },

    borderTitle:     'magenta',
    borderStatus:    'cyan',
    borderSynergy:   'blue',
    borderMap:       'white',
    borderCombat:    'magenta',
    borderLog:       'yellow',
    borderAction:    'green',
    borderInventory: 'cyan',
    borderEquip:     'blue',
    borderInteract:  'white',

    selectedBg:          'magenta',
    inventorySelectedBg: 'blue',
  },
};

// ─────────────────────────────────────────────────────────────
// Estado e persistência
// ─────────────────────────────────────────────────────────────
let activeKey = 'DARK';

function loadSettings() {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const s = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf8'));
      if (s.theme && THEMES[s.theme]) activeKey = s.theme;
    }
  } catch (_) {}
}

function saveSettings() {
  try {
    const dir = path.dirname(SETTINGS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify({ theme: activeKey }));
  } catch (_) {}
}

function setTheme(key) {
  if (THEMES[key]) { activeKey = key; saveSettings(); }
}

function getActiveKey() { return activeKey; }

// Proxy T — delega sempre ao tema ativo; não precisa re-importar
const T = new Proxy({}, {
  get(_, prop) { return THEMES[activeKey][prop]; }
});

loadSettings();

const THEME_NAMES = Object.keys(THEMES);

module.exports = { T, setTheme, getActiveKey, THEME_NAMES, THEMES };
