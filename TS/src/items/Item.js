const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');

class Item {
  constructor(floor = 1, forceRarity = null) {
    this.id = uuidv4();
    this.floor = floor;
    this.rarity = forceRarity || this.rollRarity();
    this.type = this.rollType();
    this.name = this.generateName();
    this.stats = this.generateStats();
    this.tags = this.generateTags();
    this.uniques = [];

    if (this.rarity === 'LENDÁRIO') {
      this.generateUniqueEffect();
    }
  }

  rollRarity() {
    const roll = Math.random() * 100;
    if (roll > 95) return 'LENDÁRIO';
    if (roll > 80) return 'RARO';
    if (roll > 60) return 'MÁGICO';
    return 'COMUM';
  }

  rollType() {
    const types = ['ARMA', 'ARMADURA', 'ACESSÓRIO', 'CONSUMÍVEL'];
    return types[Math.floor(Math.random() * types.length)];
  }

  generateName() {
    const prefixes = {
      COMUM: ['Velho', 'Enferrujado', 'Simples', 'Gasto'],
      MÁGICO: ['Brilhante', 'Agudo', 'Firme', 'Abençoado'],
      RARO: ['Ancestral', 'Vingativo', 'Sombrio', 'Eterno'],
      LENDÁRIO: ['O Eco de', 'A Ruína de', 'O Suspiro de', 'O Legado de']
    };

    const bases = {
      ARMA: ['Espada', 'Machado', 'Daga', 'Cetro'],
      ARMADURA: ['Peitoral', 'Manto', 'Armadura', 'Túnica'],
      ACESSÓRIO: ['Anel', 'Amuleto', 'Bracelete', 'Talismã'],
      CONSUMÍVEL: ['Frasco de HP', 'Poção de SP', 'Elicir de MP']
    };

    const prefix = prefixes[this.rarity][Math.floor(Math.random() * prefixes[this.rarity].length)];
    const base = bases[this.type][Math.floor(Math.random() * bases[this.type].length)];

    return `${prefix} ${base}`;
  }

  generateStats() {
    const multiplier = 1 + (this.floor * 0.1);
    const rarityBonus = { COMUM: 1, MÁGICO: 1.5, RARO: 2.2, LENDÁRIO: 3.5 };
    const baseVal = 10 * multiplier * rarityBonus[this.rarity];

    if (this.type === 'CONSUMÍVEL') {
      return { recoverValue: Math.floor(baseVal * 2) };
    }

    const stats = {};
    if (this.type === 'ARMA') stats.physicalDamage = Math.floor(baseVal);
    if (this.type === 'ARMADURA') stats.defense = Math.floor(baseVal / 2);
    if (this.type === 'ACESSÓRIO') stats.maxMp = Math.floor(baseVal / 2);

    // Afixos extras para raridades superiores
    if (this.rarity !== 'COMUM') {
      stats.maxHp = Math.floor(Math.random() * baseVal);
      if (this.rarity === 'RARO' || this.rarity === 'LENDÁRIO') {
        stats.maxSp = Math.floor(Math.random() * baseVal / 2);
      }
    }

    return stats;
  }

  generateTags() {
    const possibleTags = ['CORTE', 'ESMAGAMENTO', 'FOGO', 'CHOQUE', 'VAZIO'];
    const tags = [];
    if (this.type === 'ARMA') {
      tags.push(possibleTags[Math.floor(Math.random() * 2)]); // Corte ou Esmagamento
      if (this.rarity === 'RARO' || this.rarity === 'LENDÁRIO') {
        tags.push(possibleTags[Math.floor(Math.random() * 3) + 2]); // Fogo, Choque ou Vazio
      }
    }
    return tags;
  }

  generateUniqueEffect() {
    const effects = [
      "Ataques básicos agora escalam com sua Mana Máxima.",
      "Causa 50% de dano extra contra alvos com <Sangramento>.",
      "Ignora 100% da Armadura Física do inimigo.",
      "Recupera 5% de HP ao quebrar a postura de um inimigo."
    ];
    this.uniques.push(effects[Math.floor(Math.random() * effects.length)]);
  }

  getColorizedName() {
    const colors = {
      COMUM: chalk.white,
      MÁGICO: chalk.cyan,
      RARO: chalk.yellow,
      LENDÁRIO: chalk.magenta.bold
    };
    return colors[this.rarity](this.name);
  }

  getDetails() {
    let details = `[${this.rarity}] ${this.name}
`;
    details += `Tipo: ${this.type}
`;
    for (const [stat, value] of Object.entries(this.stats)) {
      details += `  + ${value} ${stat}
`;
    }
    if (this.tags.length > 0) details += `Tags: <${this.tags.join('> <')}>
`;
    if (this.uniques.length > 0) {
      details += chalk.magenta(`Único: "${this.uniques[0]}"`);
    }
    return details;
  }
}

module.exports = Item;
