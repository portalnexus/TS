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
  constructor(floor = 1, maxW = 40, maxH = 18) {
    this.floor = floor;
    // Aumenta o mapa conforme o andar, limitado pelo espaço disponível no terminal
    this.width = Math.min(maxW, 20 + floor * 2);
    this.height = Math.min(maxH, 10 + Math.floor(floor / 2));
    this.grid = [];
    this.playerPos = { x: 2, y: 2 };
    this.bossDefeated = false;

    const biomes = [
      { name: 'O Prisma de Newton', color: 'gray', key: 'newton' },
      { name: 'A Singularidade de Hawking', color: 'cyan', key: 'hawking' },
      { name: 'O Motor de Turing', color: 'red', key: 'turing' },
      { name: 'O Vazio de Noether', color: 'magenta', key: 'noether' }
    ];
    this.biome = biomes[Math.floor(Math.random() * biomes.length)];

    this.generate();
  }

  revealAround(x, y, radius = 4) {
    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const tile = this.getTile(x + dx, y + dy);
        if (tile) tile.discovered = true;
      }
    }
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
    // Revelar área inicial ao redor do jogador
    this.revealAround(this.playerPos.x, this.playerPos.y, 3);
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
    // Inimigos por bioma — cada bioma tem suas criaturas temáticas
    const biomeEnemies = {
      newton: [
        { name: 'Prisma Refrator', hp: 18, sp: 30, mp: 10 },
        { name: 'Corpo Gravitacional', hp: 35, sp: 15, mp: 0 },
        { name: 'Arco Espectral', hp: 20, sp: 20, mp: 20 },
        { name: 'Força Centrífuga', hp: 28, sp: 25, mp: 0 }
      ],
      hawking: [
        { name: 'Eco de Radiação', hp: 15, sp: 10, mp: 50 },
        { name: 'Singularidade Menor', hp: 40, sp: 5, mp: 30 },
        { name: 'Horizonte de Eventos', hp: 25, sp: 20, mp: 25 },
        { name: 'Pulsar Binário', hp: 22, sp: 35, mp: 10 }
      ],
      turing: [
        { name: 'Lobo de Turing', hp: 15, sp: 40, mp: 0 },
        { name: 'Autômato de Pascal', hp: 30, sp: 30, mp: 0 },
        { name: 'Bomba de Colapso', hp: 20, sp: 20, mp: 30 },
        { name: 'Daemon Binário', hp: 18, sp: 15, mp: 40 }
      ],
      noether: [
        { name: 'Espectro de Noether', hp: 15, sp: 10, mp: 50 },
        { name: 'Vazio Simétrico', hp: 25, sp: 15, mp: 35 },
        { name: 'Sombra da Simetria', hp: 20, sp: 20, mp: 30 },
        { name: 'Tensor de Tensão', hp: 35, sp: 10, mp: 20 }
      ]
    };

    // Fallback para inimigos genéricos se bioma não mapeado
    const genericEnemies = [
      { name: 'Esqueleto de Gauss', hp: 20, sp: 20, mp: 0 },
      { name: 'Sentinela de Maxwell', hp: 25, sp: 20, mp: 30 },
      { name: 'Gárgula de Euclides', hp: 40, sp: 15, mp: 0 },
      { name: 'Diferencial de Leibniz', hp: 22, sp: 22, mp: 22 }
    ];

    const pool = biomeEnemies[this.biome.key] || genericEnemies;

    if (isBoss) {
      // Bosses temáticos por bioma
      const bossNames = {
        newton: `CHEFE: Isaac Newton Corrompido`,
        hawking: `CHEFE: Sombra de Hawking`,
        turing: `CHEFE: A Máquina Implacável`,
        noether: `CHEFE: Guardiã do Vazio`
      };
      const bossName = this.floor >= 10
        ? `SENHOR DA ASCENSÃO — Andar ${this.floor}`
        : (bossNames[this.biome.key] || `CHEFE: O Arquiteto do Andar ${this.floor}`);
      // HP do boss: curva suave — mais acessível nos andares iniciais
      const bossHp = Math.floor(60 + (this.floor * 20) + (this.floor * this.floor * 1.5));
      return [new Entity(bossName, {
        hp: bossHp,
        sp: 60 + (this.floor * 10),
        mp: 60 + (this.floor * 10),
        level: this.floor + 1,
        strength: 8 + Math.floor(this.floor * 1.2),
        dexterity: 6 + Math.floor(this.floor * 0.8),
        intelligence: 6 + Math.floor(this.floor * 0.8)
      })];
    }

    const t = pool[Math.floor(Math.random() * pool.length)];
    // Curva suave: escala menor nos andares iniciais, mais agressiva nos tardios
    const difficultyMult = 1 + (this.floor * 0.08);
    const hpScale = Math.floor(this.floor * 5); // antes era *8 — menos HP inicial
    return [new Entity(t.name, {
      hp: Math.floor((t.hp + hpScale) * difficultyMult),
      sp: Math.floor((t.sp + hpScale) * difficultyMult),
      mp: Math.floor((t.mp + hpScale) * difficultyMult),
      level: this.floor,
      strength: 4 + Math.floor(this.floor * 0.4),
      dexterity: 4 + Math.floor(this.floor * 0.3)
    })];
  }

  movePlayer(dx, dy) {
    const newX = this.playerPos.x + dx;
    const newY = this.playerPos.y + dy;
    const tile = this.getTile(newX, newY);
    if (tile && tile.type !== 'WALL') {
      this.playerPos.x = newX;
      this.playerPos.y = newY;
      this.revealAround(newX, newY, 4);
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
