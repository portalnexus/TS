const Entity = require('../entities/Entity');

class Tile {
  constructor(type, x, y, data = null) {
    this.type = type; // 'WALL', 'FLOOR', 'ENEMY', 'BOSS', 'TREASURE', 'PUZZLE', 'EXIT', 'REST'
    this.x = x;
    this.y = y;
    this.data = data;
    this.discovered = false;
  }
}

class Dungeon {
  constructor(floor = 1) {
    this.floor = floor;
    // Aumenta o mapa conforme o andar
    this.width = Math.min(60, 25 + floor * 2);
    this.height = Math.min(20, 10 + Math.floor(floor / 2));
    this.grid = [];
    this.playerPos = { x: 2, y: 2 };
    this.bossDefeated = false;

    const biomes = [
      { name: 'O Prisma de Newton', color: 'gray' },
      { name: 'A Singularidade de Hawking', color: 'cyan' },
      { name: 'O Motor de Turing', color: 'red' },
      { name: 'O Vazio de Noether', color: 'magenta' }
    ];
    this.biome = biomes[Math.floor(Math.random() * biomes.length)];

    this.generate();
  }

  generate() {
    for (let y = 0; y < this.height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x] = new Tile('WALL', x, y);
      }
    }

    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        this.grid[y][x].type = 'FLOOR';
      }
    }

    // Adiciona obstáculos aleatórios
    for (let i = 0; i < (this.width * this.height) / 8; i++) {
      const rx = Math.floor(Math.random() * (this.width - 2)) + 1;
      const ry = Math.floor(Math.random() * (this.height - 2)) + 1;
      if (rx !== this.playerPos.x || ry !== this.playerPos.y) {
        this.grid[ry][rx].type = 'WALL';
      }
    }

    this.addRandomObject('TREASURE', 2 + Math.floor(this.floor / 2));
    this.addRandomObject('PUZZLE', 2 + Math.floor(this.floor / 3));
    this.addRandomObject('REST', 1 + Math.floor(this.floor / 5));
    this.addRandomObject('ENEMY', 3 + Math.floor(this.floor / 2));
    this.addRandomObject('BOSS', 1);
  }

  addRandomObject(type, count) {
    let placed = 0;
    while (placed < count) {
      let rx = Math.floor(Math.random() * (this.width - 2)) + 1;
      let ry = Math.floor(Math.random() * (this.height - 2)) + 1;
      if (this.grid[ry][rx].type === 'FLOOR' && (rx !== this.playerPos.x || ry !== this.playerPos.y)) {
        let data = null;
        if (type === 'ENEMY' || type === 'BOSS') data = this.generateEnemyData(type === 'BOSS');
        this.grid[ry][rx].type = type;
        this.grid[ry][rx].data = data;
        placed++;
      }
    }
  }

  generateEnemyData(isBoss = false) {
    const templates = [
      { name: 'Esqueleto de Gauss', hp: 20, sp: 20, mp: 0 },
      { name: 'Lobo de Turing', hp: 15, sp: 40, mp: 0 },
      { name: 'Autômato de Pascal', hp: 30, sp: 30, mp: 0 },
      { name: 'Espectro de Noether', hp: 15, sp: 10, mp: 50 },
      { name: 'Sentinela de Maxwell', hp: 25, sp: 20, mp: 30 },
      { name: 'Gárgula de Euclides', hp: 40, sp: 15, mp: 0 }
    ];

    if (isBoss) {
      const bossName = this.floor === 10 ? 'SENHOR DA ASCENSÃO' : `CHEFE: O Arquiteto do Andar ${this.floor}`;
      return [new Entity(bossName, {
        hp: 100 + (this.floor * 30),
        sp: 80 + (this.floor * 15),
        mp: 80 + (this.floor * 15),
        level: this.floor + 1
      })];
    }

    const t = templates[Math.floor(Math.random() * templates.length)];
    // Multiplicador de Dificuldade Balanceado
    const difficultyMult = 1 + (this.floor * 0.1);
    return [new Entity(t.name, {
      hp: Math.floor((t.hp + (this.floor * 8)) * difficultyMult),
      sp: Math.floor((t.sp + (this.floor * 8)) * difficultyMult),
      mp: Math.floor((t.mp + (this.floor * 8)) * difficultyMult),
      level: this.floor
    })];
  }

  movePlayer(dx, dy) {
    const newX = this.playerPos.x + dx;
    const newY = this.playerPos.y + dy;
    const tile = this.getTile(newX, newY);
    if (tile && tile.type !== 'WALL') {
      this.playerPos.x = newX;
      this.playerPos.y = newY;
      return tile;
    }
    return null;
  }

  getTile(x, y) {
    if (this.grid[y] && this.grid[y][x]) return this.grid[y][x];
    return null;
  }
}

module.exports = Dungeon;
