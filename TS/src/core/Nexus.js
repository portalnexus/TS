const chalk = require('chalk');
const { T } = require('../ui/Theme');

class Nexus {
  constructor() {
    this.width = 24;
    this.height = 12;
    this.playerPos = { x: 4, y: 5 };
    
    // Layout do Nexus: # = Parede, . = Chão, ~ = Água, T = Árvore/Deco, H = Halthor, A = Ada, M = Marie, D = Darwin, Ω = Fenda
    this.layout = [
      "########################",
      "#H. . . . . . . .A. . .#",
      "# . . . . . . . . . . .#",
      "### . . .~~~~~. . . .###",
      "# . . . .~ T ~ . . . . #",
      "# . . . .~ . ~ . . . .Ω#",
      "# . . . .~~~~~ . . . . #",
      "### . . . . . . . . .###",
      "# . . . . . . . . . . .#",
      "# . . . . .D. . .M. . .#",
      "# . . . . . . . . . . .#",
      "########################"
    ];

    this.npcs = [
      { name: 'Ada', x: 17, y: 1, char: 'A', color: 'cyan', dialogue: 'Ada Lovelace: "Os algoritmos estao em harmonia."' },
      { name: 'Marie Curie', x: 17, y: 9, char: 'M', color: 'magenta', dialogue: 'Marie Curie: "A radiacao revela a verdade dos itens."' },
      { name: 'Darwin', x: 11, y: 9, char: 'D', color: 'green', dialogue: 'Darwin: "Apenas os mais fortes evoluem no Exilio."' },
      { name: 'Halthor', x: 1, y: 1, char: 'H', color: 'yellow', dialogue: 'Halthor: "Aço e ciência, a combinação perfeita."' },
      { name: 'Fenda', x: 22, y: 5, char: 'Ω', color: 'red', dialogue: 'Uma fenda instavel para o desconhecido.' },
      { name: 'Arena', x: 22, y: 2, char: 'β', color: 'red', dialogue: 'A Arena dos Arquitetos pulsa com poder ancestral. [Boss Rush]' }
    ];
  }

  isWalkable(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return false;
    const char = this.layout[y][x];
    return char !== '#' && char !== '~' && char !== 'T';
  }

  movePlayer(dx, dy) {
    const newX = this.playerPos.x + dx;
    const newY = this.playerPos.y + dy;

    if (this.isWalkable(newX, newY)) {
      this.playerPos.x = newX;
      this.playerPos.y = newY;
    }

    return this.checkInteraction();
  }

  checkInteraction() {
    return this.npcs.find(n => n.x === this.playerPos.x && n.y === this.playerPos.y);
  }

  render() {
    let map = '';
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const npc = this.npcs.find(n => n.x === x && n.y === y);
        if (x === this.playerPos.x && y === this.playerPos.y) {
          map += T.tileNexusPlayer;
        } else if (npc) {
          map += T.npcChalk(npc.color)(npc.char + ' ');
        } else {
          const char = this.layout[y][x];
          switch(char) {
            case '#': map += chalk.bgWhite('  '); break;
            case '~': map += chalk.bgBlue('  '); break;
            case 'T': map += chalk.green('♦ '); break;
            case '.': map += T.neutral('· '); break;
            default: map += char + ' ';
          }
        }
      }
      map += '\n';
    }
    return map;
  }
}

module.exports = Nexus;
