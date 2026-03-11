const Entity = require('../entities/Entity');

class Tile {
  constructor(type, x, y, data = null) {
    this.type = type; // 'WALL', 'FLOOR', 'ENEMY', 'TREASURE', 'PUZZLE', 'EXIT', 'REST'
    this.x = x;
    this.y = y;
    this.data = data;
    this.discovered = false;
  }
}

class Dungeon {
  constructor(floor = 1, width = 30, height = 12) {
    this.floor = floor;
    this.width = width;
    this.height = height;
    this.grid = [];
    this.playerPos = { x: 2, y: 2 };

    this.generate();
  }

  generate() {
    // Inicializa com paredes
    for (let y = 0; y < this.height; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x] = new Tile('WALL', x, y);
      }
    }

    // Cria área central (Floor)
    for (let y = 1; y < this.height - 1; y++) {
      for (let x = 1; x < this.width - 1; x++) {
        this.grid[y][x].type = 'FLOOR';
      }
    }

    // Adiciona obstáculos aleatórios (Paredes internas)
    for (let i = 0; i < (this.width * this.height) / 10; i++) {
      const rx = Math.floor(Math.random() * (this.width - 2)) + 1;
      const ry = Math.floor(Math.random() * (this.height - 2)) + 1;
      if (rx !== this.playerPos.x || ry !== this.playerPos.y) {
        this.grid[ry][rx].type = 'WALL';
      }
    }

    // Adiciona Objetos
    this.addRandomObject('TREASURE', 3);
    this.addRandomObject('PUZZLE', 2);
    this.addRandomObject('REST', 1);
    this.addRandomObject('ENEMY', 4 + this.floor);
    this.addRandomObject('EXIT', 1); // Boss / Saída
  }

  addRandomObject(type, count) {
    let placed = 0;
    while (placed < count) {
      let rx = Math.floor(Math.random() * (this.width - 2)) + 1;
      let ry = Math.floor(Math.random() * (this.height - 2)) + 1;

      if (this.grid[ry][rx].type === 'FLOOR' && (rx !== this.playerPos.x || ry !== this.playerPos.y)) {
        let data = null;
        if (type === 'ENEMY' || type === 'EXIT') data = this.generateEnemyData(type === 'EXIT');
        this.grid[ry][rx].type = type;
        this.grid[ry][rx].data = data;
        placed++;
      }
    }
  }

  generateEnemyData(isBoss = false) {
    const templates = [
      { name: 'Esqueleto Maldito', hp: 15, sp: 20, mp: 0, level: this.floor },
      { name: 'Lobo Corrompido', hp: 12, sp: 40, mp: 0, level: this.floor },
      { name: 'Guerreiro Caído', hp: 25, sp: 30, mp: 0, level: this.floor }
    ];

    if (isBoss) {
      return [new Entity('Senhor das Fendas', {
        hp: 80 + (this.floor * 20),
        sp: 60 + (this.floor * 10),
        mp: 60 + (this.floor * 10),
        level: this.floor + 1
      })];
    }

    const t = templates[Math.floor(Math.random() * templates.length)];
    return [new Entity(t.name, {
      hp: t.hp + (this.floor * 5),
      sp: t.sp + (this.floor * 5),
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
    if (this.grid[y] && this.grid[y][x]) {
      return this.grid[y][x];
    }
    return null;
  }
}

module.exports = Dungeon;
