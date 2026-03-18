const chalk = require('chalk');

const Sprites = {
  playerSprites: {
    'Humano': [
      chalk.cyan('       .-------.      '),
      chalk.cyan('      /  (o o)  \\     '),
      chalk.cyan('     |   \\___/   |    '),
      chalk.cyan('     |   _____   |    '),
      chalk.cyan('      \\_/     \\_/     '),
      chalk.cyan('         |   |        '),
      chalk.cyan('     ____|   |____    '),
      chalk.cyan('    /    |   |    \\   '),
      chalk.cyan('   /     |   |     \\  '),
      chalk.cyan('  |      |   |      | '),
      chalk.cyan('  |______|   |______| '),
      chalk.cyan('         /   \\        ')
    ],
    'Elfo': [
      chalk.green('      /|       |\\    '),
      chalk.green('     / |_______| \\   '),
      chalk.green('    |  ^       ^  |  '),
      chalk.green('    |   \\_____/   |  '),
      chalk.green('     \\     |     /   '),
      chalk.green('          |   |      '),
      chalk.green('      ____|   |____  '),
      chalk.green('     /    |   |    \\ '),
      chalk.green('    /  /\\ |   | /\\  \\'),
      chalk.green('   |  /  \\|   |/  \\ |'),
      chalk.green('   | /    |   |    \\|'),
      chalk.green('   |/     |   |     |')
    ],
    'Anão': [
      chalk.yellow('        _______       '),
      chalk.yellow('       /#######\\      '),
      chalk.yellow('      |##_###_##|     '),
      chalk.yellow('      |##|___|##|     '),
      chalk.yellow('      |##|___|##|     '),
      chalk.yellow('       \\#######/      '),
      chalk.yellow('        [|||||]       '),
      chalk.yellow('       //|   |\\\\     '),
      chalk.yellow('      // |   | \\\\    '),
      chalk.yellow('     |#  |   |  #|   '),
      chalk.yellow('     |#__|   |__#|   '),
      chalk.yellow('        /|   |\\      ')
    ],
    'Orc': [
      chalk.red('       _/   \\_        '),
      chalk.red('      / V   V \\       '),
      chalk.red('     |   \\_/   |      '),
      chalk.red('     |  VVVVV  |      '),
      chalk.red('      \\_|VVV|_/       '),
      chalk.red('        |   |         '),
      chalk.red('    ____|   |____     '),
      chalk.red("   / `  |   |  ` \\   "),
      chalk.red("  / ``  |   |  `` \\  "),
      chalk.red(" |  `` /|   |\\ `` |  "),
      chalk.red(" | ``./ |   | \\.``|  "),
      chalk.red(' |___/  |   |  \\___|  ')
    ]
  },

  getPlayerSprite(race) {
    return this.playerSprites[race] || this.playerSprites['Humano'];
  },

  enemies: {
    // ─── Inimigos padrão ────────────────────────────────────────────
    'Esqueleto Maldito': [
      chalk.white('        .-----.       '),
      chalk.white('       / X   X \\      '),
      chalk.white('      |  \\___/  |     '),
      chalk.white('       \\__|_|__/      '),
      chalk.white('          |||         '),
      chalk.white('       ___|_|___      '),
      chalk.white('      /    |    \\     '),
      chalk.white('     |     |     |    '),
      chalk.white('     |_____|_____|    '),
      chalk.white('    /      |      \\   ')
    ],
    'Esqueleto de Gauss': [
      chalk.white('        .-----.       '),
      chalk.white('       / () () \\      '),
      chalk.white('      | _\\___/_ |     '),
      chalk.white('      |/  ~σ~  \\|     '),
      chalk.white('       \\_______/      '),
      chalk.white('          |||         '),
      chalk.white('       ___|_|___      '),
      chalk.white('      /  N(0,1) \\     '),
      chalk.white('     |___________|    '),
      chalk.white('    /             \\   ')
    ],
    'Lobo Corrompido': [
      chalk.gray('     __/\\___/\\__       '),
      chalk.gray('    /  o     o  \\      '),
      chalk.gray('   (   == W ==   )     '),
      chalk.gray('    \\    vvv    /      '),
      chalk.gray('     \\__/   \\__/       '),
      chalk.gray('      |       |        '),
      chalk.gray('    __|_     _|__      '),
      chalk.gray('   /   |     |   \\     '),
      chalk.gray('  /    |     |    \\    '),
      chalk.gray(' /_____|     |_____\\   ')
    ],
    'Lobo de Turing': [
      chalk.cyan('     __/\\___/\\__       '),
      chalk.cyan('    /  0     1  \\      '),
      chalk.cyan('   (   == X ==   )     '),
      chalk.cyan('    \\   10101   /      '),
      chalk.cyan('     \\__01010__/       '),
      chalk.cyan('      |       |        '),
      chalk.cyan('    __|_     _|__      '),
      chalk.cyan('   /01 |     | 10\\     '),
      chalk.cyan('  /010 |     | 101\\    '),
      chalk.cyan(' /0101_|     |_0101\\   ')
    ],
    'Guerreiro Caído': [
      chalk.red('       ._____.        '),
      chalk.red('       |#####|        '),
      chalk.red('       |##_##|        '),
      chalk.red('      _|#|X|#|_       '),
      chalk.red('     / |#####| \\      '),
      chalk.red('    /  |_____|  \\     '),
      chalk.red('   /   |     |   \\    '),
      chalk.red('  |    |     |    |   '),
      chalk.red('  |____|     |____|   '),
      chalk.red(' /            \\       ')
    ],
    'Autômato de Pascal': [
      chalk.yellow('      _________      '),
      chalk.yellow('     | [_] [_] |     '),
      chalk.yellow('     |  _____  |     '),
      chalk.yellow('     | |PASCAL||     '),
      chalk.yellow('     | |_____| |     '),
      chalk.yellow('     |_________|     '),
      chalk.yellow('      |__|  |__|     '),
      chalk.yellow('     /   \\  /   \\    '),
      chalk.yellow('    |     ||     |   '),
      chalk.yellow('    |_____|______|   ')
    ],
    'Eco de Noether': [
      chalk.magenta('        < * * >       '),
      chalk.magenta('       <   |   >      '),
      chalk.magenta('      < -- o -- >     '),
      chalk.magenta('       <   |   >      '),
      chalk.magenta('        < * * >       '),
      chalk.magenta('       <  / \\  >      '),
      chalk.magenta('      <  /   \\  >     '),
      chalk.magenta('     <  /     \\  >    '),
      chalk.magenta('      \\/       \\/     '),
      chalk.magenta('       \\       /      ')
    ],
    'Fractal de Mandelbrot': [
      chalk.magenta('      { @ # % }       '),
      chalk.magenta('    { % # @ & # }     '),
      chalk.magenta('   { @ & % @ & # }    '),
      chalk.magenta('    { % # @ & # }     '),
      chalk.magenta('      { @ # % }       '),
      chalk.magenta('     {  /   \\  }      '),
      chalk.magenta('    {  / |x| \\  }     '),
      chalk.magenta('   {  /  | |  \\  }    '),
      chalk.magenta('    { /  | |  \\ }     '),
      chalk.magenta('     {   | |   }      ')
    ],
    'Prisma de Pitágoras': [
      chalk.yellow('          /\\          '),
      chalk.yellow('         /  \\         '),
      chalk.yellow('        / a² \\        '),
      chalk.yellow('       /  +b²  \\      '),
      chalk.yellow('      /  = c²   \\     '),
      chalk.yellow('     /___________\\    '),
      chalk.yellow('    |      |      |   '),
      chalk.yellow('    |  /\\ | /\\  |   '),
      chalk.yellow('    |______|______|   '),
      chalk.yellow('   /               \\  ')
    ],
    'Matriz de Cayley': [
      chalk.blue('    ┌────────────┐    '),
      chalk.blue('    │  a   b   c │    '),
      chalk.blue('    │            │    '),
      chalk.blue('    │  d   e   f │    '),
      chalk.blue('    │  g   h   i │    '),
      chalk.blue('    └────────────┘    '),
      chalk.blue('     <──────────>     '),
      chalk.blue('        det A         '),
      chalk.blue('       [Vektor]       '),
      chalk.blue('    ────────────      ')
    ],
    'Coelho de Fibonacci': [
      chalk.white('        (\\  /)        '),
      chalk.white('        (o . o)       '),
      chalk.white('       C> 1,1 <D      '),
      chalk.white('        ( 2, 3 )      '),
      chalk.white('        ( 5, 8 )      '),
      chalk.white('       (13,  21 )     '),
      chalk.white('        \\  |  /       '),
      chalk.white('         \\_|_/        '),
      chalk.white('          /|\\         '),
      chalk.white('         / | \\        ')
    ],
    'Diferencial de Leibniz': [
      chalk.green('         dy           '),
      chalk.green('        ────          '),
      chalk.green('         dx           '),
      chalk.green('      ∫ f(x)dx        '),
      chalk.green('       ||   ||        '),
      chalk.green('     ──┴─────┴──      '),
      chalk.green('     /    |    \\      '),
      chalk.green('    /  ∫∫ | ∫∫  \\     '),
      chalk.green('   /_____|___|___\\    '),
      chalk.green('  /               \\   ')
    ],
    'Crivo de Eratóstenes': [
      chalk.red('   ┌─────────────────┐  '),
      chalk.red('   │[2][3][ ][5][ ]  │  '),
      chalk.red('   │[ ][7][ ][ ][11] │  '),
      chalk.red('   │[  ][13][  ][17] │  '),
      chalk.red('   │[19][  ][23][  ] │  '),
      chalk.red('   └─────────────────┘  '),
      chalk.red('   # # # PRIMES # # #   '),
      chalk.red('   ─────────────────    '),
      chalk.red('  /                  \\  '),
      chalk.red(' /____________________\\ ')
    ],

    // ─── Inimigos de bioma (Newton) ──────────────────────────────────
    'Prisma Refrator': [
      chalk.gray('        /\\            '),
      chalk.gray('       /  \\           '),
      chalk.gray('      /ROYGB\\         '),
      chalk.gray('     /──────\\         '),
      chalk.gray('    / ~~~~~~ \\        '),
      chalk.gray('   /  REFRAT  \\       '),
      chalk.gray('  /────────────\\      '),
      chalk.gray(' /              \\     ')
    ],
    'Corpo Gravitacional': [
      chalk.red('      .------.        '),
      chalk.red('     / G = m  \\       '),
      chalk.red('    | F=Gm1m2 |       '),
      chalk.red('    |   ─────  |      '),
      chalk.red('    |    r²    |      '),
      chalk.red('     \\________/       '),
      chalk.red('       |    |         '),
      chalk.red('    ___|    |___      ')
    ],
    'Arco Espectral': [
      chalk.cyan('      _______         '),
      chalk.cyan('     /~ROYGBV\\        '),
      chalk.cyan('    / λ λ λ λ \\       '),
      chalk.cyan('   | n = c/v   |      '),
      chalk.cyan('   |___________|      '),
      chalk.cyan('      |     |         '),
      chalk.cyan('    __|     |__       '),
      chalk.cyan('   /   |   |   \\     ')
    ],
    'Força Centrífuga': [
      chalk.yellow('    * * * * * *       '),
      chalk.yellow('   * _________ *      '),
      chalk.yellow('  * / F = mv² \\ *    '),
      chalk.yellow(' * |    ─────  | *   '),
      chalk.yellow('  * \\    r    / *    '),
      chalk.yellow('   * _________ *      '),
      chalk.yellow('    * * * * * *       '),
      chalk.yellow('    /         \\       ')
    ],

    // ─── Inimigos de bioma (Hawking) ─────────────────────────────────
    'Eco de Radiação': [
      chalk.cyan('    ~  ~~~  ~          '),
      chalk.cyan('   ~~ ~~~~~ ~~         '),
      chalk.cyan('  ~~~ (R) ~~~         '),
      chalk.cyan('   ~~ ~~~~~ ~~         '),
      chalk.cyan('  ~~~ ~~~~~ ~~~        '),
      chalk.cyan('   ~~ ~~~~~ ~~         '),
      chalk.cyan('    ~  ~~~  ~          '),
      chalk.cyan('    /        \\         ')
    ],
    'Singularidade Menor': [
      chalk.blue('      . . . .         '),
      chalk.blue('    .  (   )  .        '),
      chalk.blue('   .  ( XXX )  .       '),
      chalk.blue('  .  (  ███  )  .      '),
      chalk.blue('   .  ( XXX )  .       '),
      chalk.blue('    .  (   )  .        '),
      chalk.blue('      . . . .          '),
      chalk.blue('    /          \\       ')
    ],
    'Horizonte de Eventos': [
      chalk.magenta('   ─────────────      '),
      chalk.magenta('  /  nenhum escapa \\ '),
      chalk.magenta(' | ████  além  ████ | '),
      chalk.magenta(' | ████  daqui ████ | '),
      chalk.magenta('  \\  nenhum escapa / '),
      chalk.magenta('   ─────────────      '),
      chalk.magenta('       |   |          '),
      chalk.magenta('    ___|   |___       ')
    ],
    'Pulsar Binário': [
      chalk.white('    *  .  *  .  *     '),
      chalk.white('  . [A] ──── [B] .    '),
      chalk.white('    *  .  *  .  *     '),
      chalk.white('      ↺      ↻        '),
      chalk.white('    *  .  *  .  *     '),
      chalk.white('  . [B] ──── [A] .    '),
      chalk.white('    *  .  *  .  *     '),
      chalk.white('   /           \\      ')
    ],

    // ─── Inimigos de bioma (Turing) ──────────────────────────────────
    'Bomba de Colapso': [
      chalk.red('      _______         '),
      chalk.red('     /0101010\\        '),
      chalk.red('    | 1001001 |        '),
      chalk.red('    | COLAPSO |        '),
      chalk.red('    | 0110110 |        '),
      chalk.red('     \\_______/         '),
      chalk.red('        |||            '),
      chalk.red('       _|||_           ')
    ],
    'Daemon Binário': [
      chalk.cyan('    _____________      '),
      chalk.cyan('   | 01010101011|      '),
      chalk.cyan('   | 10 DAEMON 1|      '),
      chalk.cyan('   | 01 {:} 010 |      '),
      chalk.cyan('   | 10101010100|      '),
      chalk.cyan('   |_____________|     '),
      chalk.cyan('      |       |        '),
      chalk.cyan('    __|       |__     ')
    ],

    // ─── Inimigos de bioma (Noether) ─────────────────────────────────
    'Espectro de Noether': [
      chalk.magenta('      < ◇ ◇ >        '),
      chalk.magenta('     < · | · >       '),
      chalk.magenta('    < ─── ─── >      '),
      chalk.magenta('   <   (SIMETRIA)  > '),
      chalk.magenta('    < ─── ─── >      '),
      chalk.magenta('     < · | · >       '),
      chalk.magenta('      < ◇ ◇ >        '),
      chalk.magenta('       /   \\         ')
    ],
    'Vazio Simétrico': [
      chalk.gray('                      '),
      chalk.gray('   .  .  VAZIO  .  .  '),
      chalk.gray('    . . . . . . . .    '),
      chalk.gray('   .   [SIMETRIA]  .  '),
      chalk.gray('    . . . . . . . .    '),
      chalk.gray('   .  .  VAZIO  .  .  '),
      chalk.gray('                      '),
      chalk.gray('    /           \\     ')
    ],
    'Sombra da Simetria': [
      chalk.blue('      |  |  |         '),
      chalk.blue('     _|__|__|_         '),
      chalk.blue('    /  SOMBRA  \\       '),
      chalk.blue('   | · · | · · |       '),
      chalk.blue('   |─────|─────|       '),
      chalk.blue('    \\   |   |  /       '),
      chalk.blue('      __|   |__        '),
      chalk.blue('     /   | |   \\      ')
    ],
    'Tensor de Tensão': [
      chalk.red('    ┌───────────┐      '),
      chalk.red('    │ T¹¹ T¹²  │      '),
      chalk.red('    │           │      '),
      chalk.red('    │ T²¹ T²²  │      '),
      chalk.red('    └───────────┘      '),
      chalk.red('       σ = F/A         '),
      chalk.red('      |       |        '),
      chalk.red('    __|       |__      ')
    ],

    // ─── Bosses nomeados ─────────────────────────────────────────────
    'Euler (Arquiteto da Identidade)': [
      chalk.yellow.bold('      .-----------.      '),
      chalk.yellow.bold('     / e^iπ + 1=0 \\     '),
      chalk.yellow.bold('    |  .───────.  |      '),
      chalk.yellow.bold('    |  |  (Σ)  |  |      '),
      chalk.yellow.bold('    |  |  /|\\  |  |      '),
      chalk.yellow.bold('    |  | / | \\ |  |      '),
      chalk.yellow.bold('    |  |___|___|  |      '),
      chalk.yellow.bold('    |  /   |   \\  |      '),
      chalk.yellow.bold('     \\/    |    \\/       '),
      chalk.yellow.bold('      |   ─┼─   |        '),
      chalk.yellow.bold('      |  / | \\  |        '),
      chalk.yellow.bold('      | /  |  \\ |        '),
      chalk.yellow.bold('     /─────────────\\     '),
      chalk.yellow.bold('    /_______________\\    ')
    ],
    'Lovelace (Tecelã da Lógica)': [
      chalk.green.bold('      .-----------.      '),
      chalk.green.bold('     / [1 0 1 0 1] \\    '),
      chalk.green.bold('    |  .───────.  |      '),
      chalk.green.bold('    |  | {LOOP}|  |      '),
      chalk.green.bold('    |  | for(;;)  |      '),
      chalk.green.bold('    |  | [=====]  |      '),
      chalk.green.bold('    |  |________| |      '),
      chalk.green.bold('    |  /   |   \\  |      '),
      chalk.green.bold('     \\/    |    \\/       '),
      chalk.green.bold('      |   ─┼─   |        '),
      chalk.green.bold('      |  /[#]\\  |        '),
      chalk.green.bold('      | /[###]\\ |        '),
      chalk.green.bold('     /─────────────\\     '),
      chalk.green.bold('    /_______________\\    ')
    ],
    'Riemann (Guardião da Hipótese)': [
      chalk.blue.bold('      .-----------.      '),
      chalk.blue.bold('     /  ζ(s) = 0   \\    '),
      chalk.blue.bold('    |  .───────.  |      '),
      chalk.blue.bold('    |  |    ∞   |  |      '),
      chalk.blue.bold('    |  |    Σ   |  |      '),
      chalk.blue.bold('    |  |   1/nˢ |  |      '),
      chalk.blue.bold('    |  |_______|  |      '),
      chalk.blue.bold('    |  /   |   \\  |      '),
      chalk.blue.bold('     \\/    |    \\/       '),
      chalk.blue.bold('      |   ─┼─   |        '),
      chalk.blue.bold('      |  /  ζ \\ |        '),
      chalk.blue.bold('      | /   |   \\|        '),
      chalk.blue.bold('     /─────────────\\     '),
      chalk.blue.bold('    /_______________\\    ')
    ],
    'Newton (Arquiteto da Gravidade)': [
      chalk.red.bold('      .-----------.      '),
      chalk.red.bold('     /   F = ma    \\     '),
      chalk.red.bold('    |  .───────.  |      '),
      chalk.red.bold('    |  |  [G]  |  |      '),
      chalk.red.bold('    |  |       |  |      '),
      chalk.red.bold('    |  | ( O ) |  |      '),
      chalk.red.bold('    |  |_______|  |      '),
      chalk.red.bold('    |  /   |   \\  |      '),
      chalk.red.bold('     \\/    |    \\/       '),
      chalk.red.bold('      |   ─┼─   |        '),
      chalk.red.bold('      |  / F \\  |        '),
      chalk.red.bold('      | / =ma \\ |        '),
      chalk.red.bold('     /─────────────\\     '),
      chalk.red.bold('    /_______________\\    ')
    ],
    'Hawking (Senhor da Singularidade)': [
      chalk.blue.bold('      .-----------.      '),
      chalk.blue.bold('     /  (  ···  )  \\    '),
      chalk.blue.bold('    |  .───────.  |      '),
      chalk.blue.bold('    |  | (███) |  |      '),
      chalk.blue.bold('    |  |  (·)  |  |      '),
      chalk.blue.bold('    |  |  ─ ─  |  |      '),
      chalk.blue.bold('    |  |_______|  |      '),
      chalk.blue.bold('    |  /   |   \\  |      '),
      chalk.blue.bold('     \\/    |    \\/       '),
      chalk.blue.bold('      |   ─┼─   |        '),
      chalk.blue.bold('      |  · | ·  |        '),
      chalk.blue.bold('      | ·  |  · |        '),
      chalk.blue.bold('     /─────────────\\     '),
      chalk.blue.bold('    /_______________\\    ')
    ],
    'Maxwell (Tecelão do Eletromagnetismo)': [
      chalk.cyan.bold('      .-----------.      '),
      chalk.cyan.bold('     /  ~ ~ ~ ~ ~  \\    '),
      chalk.cyan.bold('    |  .───────.  |      '),
      chalk.cyan.bold('    |  | E──►B  | |      '),
      chalk.cyan.bold('    |  | ~~~~~~ | |      '),
      chalk.cyan.bold('    |  | (zap) | |      '),
      chalk.cyan.bold('    |  |________| |      '),
      chalk.cyan.bold('    |  /   |   \\  |      '),
      chalk.cyan.bold('     \\/    |    \\/       '),
      chalk.cyan.bold('      |   ─┼─   |        '),
      chalk.cyan.bold('      | ~E | B~ |        '),
      chalk.cyan.bold('      | ~~  | ~~ |        '),
      chalk.cyan.bold('     /─────────────\\     '),
      chalk.cyan.bold('    /_______________\\    ')
    ],
    'Senhor das Fendas': [
      chalk.magenta.bold('      .-----------.      '),
      chalk.magenta.bold('     /  V O I D   \\     '),
      chalk.magenta.bold('    |  .───────.  |      '),
      chalk.magenta.bold('    |  |  _|_  |  |      '),
      chalk.magenta.bold('    |  | | | | |  |      '),
      chalk.magenta.bold('    |  |_|_|_|_|  |      '),
      chalk.magenta.bold('    |  |_______|  |      '),
      chalk.magenta.bold('    |  /   |   \\  |      '),
      chalk.magenta.bold('     \\/    |    \\/       '),
      chalk.magenta.bold('      |VOID─┼─LORD|      '),
      chalk.magenta.bold('      |  /  |  \\  |      '),
      chalk.magenta.bold('      | / \\ | / \\ |      '),
      chalk.magenta.bold('     /─────────────\\     '),
      chalk.magenta.bold('    /_______________\\    ')
    ]
  },

  objects: {
    wall:     chalk.bgWhite('  '),
    floor:    chalk.hex('#1a1a1a')('· '),
    treasure: chalk.yellow.bold('¤ '),
    enemy:    chalk.bold.red('!!'),
    boss:     chalk.bold.magenta('$$'),
    door:     chalk.bold.white('>>'),
    puzzle:   chalk.bold.blue('??'),
    rest:     chalk.bold.green('++')
  },

  getEnemySprite(name) {
    // Correspondência exata
    if (this.enemies[name]) return this.enemies[name];
    // Correspondência parcial para bosses de bioma e chefe final
    if (name.includes('Newton') || name.includes('Gravitacional'))  return this.enemies['Newton (Arquiteto da Gravidade)'];
    if (name.includes('Hawking') || name.includes('Singularidade')) return this.enemies['Hawking (Senhor da Singularidade)'];
    if (name.includes('Turing') || name.includes('Máquina') || name.includes('Implacável')) return this.enemies['Lovelace (Tecelã da Lógica)'];
    if (name.includes('Noether') || name.includes('Guardiã') || name.includes('Vazio')) return this.enemies['Senhor das Fendas'];
    if (name.includes('ASCENSÃO') || name.includes('SENHOR'))       return this.enemies['Senhor das Fendas'];
    if (name.includes('Euler'))    return this.enemies['Euler (Arquiteto da Identidade)'];
    if (name.includes('Riemann'))  return this.enemies['Riemann (Guardião da Hipótese)'];
    if (name.includes('Maxwell'))  return this.enemies['Maxwell (Tecelão do Eletromagnetismo)'];
    if (name.includes('Lovelace')) return this.enemies['Lovelace (Tecelã da Lógica)'];
    // Fallback genérico (10 linhas para consistência com sprites expandidos)
    return [
      chalk.red('        .-----.       '),
      chalk.red('       /  ???  \\      '),
      chalk.red('      | ??????? |     '),
      chalk.red('      |  ?   ?  |     '),
      chalk.red('       \\_______/      '),
      chalk.red('          |||         '),
      chalk.red('       ___|_|___      '),
      chalk.red('      /    |    \\     '),
      chalk.red('     |     |     |    '),
      chalk.red('    /      |      \\   ')
    ];
  }
};

module.exports = Sprites;
