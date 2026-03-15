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
      chalk.green('     /|     |\\   '),
      chalk.green('    / |_____| \\  '),
      chalk.green('   |  ^     ^  | '),
      chalk.green('    \\_   -   _/  '),
      chalk.green('     --| |--     '),
      chalk.green('      /| |\\      '),
      chalk.green('     /     \\     ')
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
    'Esqueleto de Gauss': [
      chalk.white('      .---.      '),
      chalk.white('     / ( ) \\     '),
      chalk.white('    |  _|_  |    '),
      chalk.white('     \\_/_\\_/     '),
      chalk.white('      _|_|_      '),
      chalk.white('     |  |  |     '),
      chalk.white('     |__|__|     ')
    ],
    'Lobo Corrompido': [
      chalk.gray('    /\\___/\\    '),
      chalk.gray('   / o   o \\   '),
      chalk.gray('  ( == Y == )  '),
      chalk.gray('   )       (   '),
      chalk.gray('  /         \\  '),
      chalk.gray(' /           \\ ')
    ],
    'Lobo de Turing': [
      chalk.cyan('    /\\___/\\    '),
      chalk.cyan('   / 0   1 \\   '),
      chalk.cyan('  ( == X == )  '),
      chalk.cyan('   ) 10101 (   '),
      chalk.cyan('  / 0101010 \\  '),
      chalk.cyan(' / 101010101 \\ ')
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
    'Autômato de Pascal': [
      chalk.yellow('     _______     '),
      chalk.yellow('    | [ ] [ ] |    '),
      chalk.yellow('    |    ^    |    '),
      chalk.yellow('    |  [===]  |    '),
      chalk.yellow('    |_________|    '),
      chalk.yellow('     |_|   |_|     '),
      chalk.yellow('     |_|   |_|     ')
    ],
    'Eco de Noether': [
      chalk.magenta('     < * * >     '),
      chalk.magenta('    <   |   >    '),
      chalk.magenta('   <--- o --->   '),
      chalk.magenta('    <   |   >    '),
      chalk.magenta('     < * * >     '),
      chalk.magenta('      / | \\      '),
      chalk.magenta('     /  |  \\     ')
    ],
    'Fractal de Mandelbrot': [
      chalk.magenta('      { & % }     '),
      chalk.magenta('    { % # @ & }   '),
      chalk.magenta('   { & @ % # @ }  '),
      chalk.magenta('    { % # @ & }   '),
      chalk.magenta('      { & % }     ')
    ],
    'Prisma de Pitágoras': [
      chalk.yellow('        /\\       '),
      chalk.yellow('       /  \\      '),
      chalk.yellow('      /____\\     '),
      chalk.yellow('     | a²+b²|    '),
      chalk.yellow('     |  =c² |    '),
      chalk.yellow('     |______|    ')
    ],
    'Matriz de Cayley': [
      chalk.blue('     [ a  b ]    '),
      chalk.blue('     [ c  d ]    '),
      chalk.blue('     [ e  f ]    '),
      chalk.blue('      Vektor     '),
      chalk.blue('     <------>    ')
    ],
    'Coelho de Fibonacci': [
      chalk.white('      (\\_/)      '),
      chalk.white('      (o.o)      '),
      chalk.white('     (>1,1<)     '),
      chalk.white('      (2,3)      '),
      chalk.white('      (5,8)      ')
    ],
    'Diferencial de Leibniz': [
      chalk.green('      dy / dx     '),
      chalk.green('     ∫ (f(x))     '),
      chalk.green('    |   ||   |    '),
      chalk.green('    |   ||   |    '),
      chalk.green('     -------     ')
    ],
    'Crivo de Eratóstenes': [
      chalk.red('    [2][3][5]    '),
      chalk.red('    [7][11][13]  '),
      chalk.red('    [17][19][23] '),
      chalk.red('     # PRIMES #  '),
      chalk.red('     ##########  ')
    ],
    'Euler (Arquiteto da Identidade)': [
      chalk.yellow.bold('      .-------.      '),
      chalk.yellow.bold('     / e^iπ+1=0 \\     '),
      chalk.yellow.bold('    |   ( ∑ )   |    '),
      chalk.yellow.bold('    |   / | \\   |    '),
      chalk.yellow.bold('    |  /  |  \\  |    '),
      chalk.yellow.bold('   /   --|--   \\   '),
      chalk.yellow.bold('  /    /   \\    \\  '),
      chalk.yellow.bold(' /_______________\\  ')
    ],
    'Lovelace (Tecelã da Lógica)': [
      chalk.green.bold('      .-------.      '),
      chalk.green.bold('     / [10101] \\     '),
      chalk.green.bold('    |  { LOOP } |    '),
      chalk.green.bold('    |   ( < > ) |    '),
      chalk.green.bold('    |  /  |  \\  |    '),
      chalk.green.bold('   /   --|--   \\   '),
      chalk.green.bold('  /    /   \\    \\  '),
      chalk.green.bold(' /_______________\\  ')
    ],
    'Riemann (Guardião da Hipótese)': [
      chalk.blue.bold('      .-------.      '),
      chalk.blue.bold('     /  ζ(s)=0  \\     '),
      chalk.blue.bold('    |  (  ∞  )  |    '),
      chalk.blue.bold('    |   / | \\   |    '),
      chalk.blue.bold('    |  /  |  \\  |    '),
      chalk.blue.bold('   /   --|--   \\   '),
      chalk.blue.bold('  /    /   \\    \\  '),
      chalk.blue.bold(' /_______________\\  ')
    ],
    'Newton (Arquiteto da Gravidade)': [
      chalk.red.bold('      .-------.      '),
      chalk.red.bold('     /   [G]   \\     '),
      chalk.red.bold('    |  F = ma   |    '),
      chalk.red.bold('    |   ( O )   |    '),
      chalk.red.bold('    |  /  |  \\  |    '),
      chalk.red.bold('   /   --|--   \\   '),
      chalk.red.bold('  /    /   \\    \\  '),
      chalk.red.bold(' /_______________\\  ')
    ],
    'Hawking (Senhor da Singularidade)': [
      chalk.blue.bold('      .-------.      '),
      chalk.blue.bold('     /  (   )  \\     '),
      chalk.blue.bold('    |   ( X )   |    '),
      chalk.blue.bold('    |  (     )  |    '),
      chalk.blue.bold('    |   -----   |    '),
      chalk.blue.bold('   /     |     \\   '),
      chalk.blue.bold('  /    /   \\    \\  '),
      chalk.blue.bold(' /_______________\\  ')
    ],
    'Maxwell (Tecelão do Eletromagnetismo)': [
      chalk.cyan.bold('      .-------.      '),
      chalk.cyan.bold('     /  ~ ~ ~  \\     '),
      chalk.cyan.bold('    |  E -> B   |    '),
      chalk.cyan.bold('    |  (  ⚡  )  |    '),
      chalk.cyan.bold('    |  /  |  \\  |    '),
      chalk.cyan.bold('   /   --|--   \\   '),
      chalk.cyan.bold('  /    /   \\    \\  '),
      chalk.cyan.bold(' /_______________\\  ')
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
