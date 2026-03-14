const chalk = require('chalk');

const Sprites = {
  playerSprites: {
    'Humano': [
      chalk.cyan('      _____      '),
      chalk.cyan('     /     \\     '),
      chalk.cyan('    |  o o  |    '),
      chalk.cyan('    \\_  -  _/    '),
      chalk.cyan('      /| |\\      '),
      chalk.cyan('     / | | \\     '),
      chalk.cyan('      /   \\      ')
    ],
    'Elfo': [
      chalk.green('     /\\     /\\   '),
      chalk.green('    /  \\___/  \\  '),
      chalk.green('   |   o   o   | '),
      chalk.green('    \\_  -  _/    '),
      chalk.green('     /| |\\      '),
      chalk.green('    / | | \\     '),
      chalk.green('     /   \\      ')
    ],
    'Anão': [
      chalk.yellow('      _____      '),
      chalk.yellow('     /     \\     '),
      chalk.yellow('    |  - -  |    '),
      chalk.yellow('    |#######|    '),
      chalk.yellow('    \\_#####_/    '),
      chalk.yellow('     [|||||]     '),
      chalk.yellow('     /     \\     ')
    ],
    'Orc': [
      chalk.red('     /     \\     '),
      chalk.red('    |  ^ ^  |    '),
      chalk.red('    |  \\_/  |    '),
      chalk.red('    \\__VVV__/    '),
      chalk.red('     /|   |\\     '),
      chalk.red('    / |   | \\    '),
      chalk.red('     /     \\     ')
    ]
  },

  getPlayerSprite(race) {
    return this.playerSprites[race] || this.playerSprites['Humano'];
  },

  enemies: {
    'Esqueleto Maldito': [
      chalk.white('      .---.      '),
      chalk.white('     / x x \\     '),
      chalk.white('     \\_ x _/     '),
      chalk.white('      _|_|_      '),
      chalk.white('     |  |  |     '),
      chalk.white('     |__|__|     '),
      chalk.white('     /     \\     ')
    ],
    'Lobo Corrompido': [
      chalk.gray('    /\\___/\\    '),
      chalk.gray('   / o   o \\   '),
      chalk.gray('  ( == Y == )  '),
      chalk.gray('   )       (   '),
      chalk.gray('  /         \\  '),
      chalk.gray(' /           \\ ')
    ],
    'Guerreiro Caído': [
      chalk.red('     ._____.     '),
      chalk.red('     |#####|     '),
      chalk.red('     |#_#_#|     '),
      chalk.red('    _|_|_|_|_    '),
      chalk.red('   / |  X  | \\   '),
      chalk.red('  /  |_____|  \\  '),
      chalk.red('     |     |     ')
    ],
    'Senhor das Fendas': [
      chalk.magenta.bold('      .-------.      '),
      chalk.magenta.bold('     /  RIP    \\     '),
      chalk.magenta.bold('    |   _|_     |    '),
      chalk.magenta.bold('    |  | | |    |    '),
      chalk.magenta.bold('    |__| | |____|    '),
      chalk.magenta.bold('   /            \\    '),
      chalk.magenta.bold('  /   VOID-LORD  \\   '),
      chalk.magenta.bold(' /________________\\  ')
    ]
  },

  objects: {
    wall: chalk.bgWhite('  '),
    floor: chalk.hex('#1a1a1a')('··'),
    treasure: chalk.yellow('[$]'),
    enemy: chalk.bold.red('!!'),
    boss: chalk.bold.magenta('$$'),
    door: chalk.bold.white('>>'),
    puzzle: chalk.bold.blue('??'),
    rest: chalk.bold.green('++')
  },

  getEnemySprite(name) {
    return this.enemies[name] || [
      chalk.red('      ???      '),
      chalk.red('     ?????     '),
      chalk.red('      ???      '),
      chalk.red('       |       ')
    ];
  }
};

module.exports = Sprites;
