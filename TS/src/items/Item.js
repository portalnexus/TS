const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');

class Item {
  constructor(floor = 1, forceRarity = null, data = null) {
    if (data) {
      // Rehidratação de item salvo
      this.id = data.id;
      this.floor = data.floor;
      this.rarity = data.rarity;
      this.type = data.type;
      this.name = data.name;
      this.stats = data.stats;
      this.tags = data.tags;
      this.uniques = data.uniques || [];
      this.flavorText = data.flavorText || "";
    } else {
      // Geração de novo item
      this.id = uuidv4();
      this.floor = floor;
      this.rarity = forceRarity || this.rollRarity();
      this.type = this.rollType();
      this.name = this.generateName();
      this.stats = this.generateStats();
      this.tags = this.generateTags();
      this.uniques = [];
      this.flavorText = this.generateFlavorText();

      if (this.rarity === 'LENDÁRIO') {
        this.generateUniqueEffect();
      }
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
      RARO: ['Ancestral de Gauss', 'Vingativo de Newton', 'Sombrio de Turing', 'Eterno de Noether'],
      LENDÁRIO: ['O Eco de Lovelace', 'A Ruína de Euler', 'O Suspiro de Hawking', 'O Legado de Pascal']
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

  generateFlavorText() {
    if (this.rarity === 'COMUM' || this.rarity === 'MÁGICO') return "";
    
    const lores = [
      "Newton previu que a força é proporcional à mudança de movimento.",
      "Lovelace viu poesia nos algoritmos desta relíquia.",
      "Euler encontrou a harmonia nos números que compõem este item.",
      "O crivo de Eratóstenes purifica a alma do portador.",
      "Noether provou que a simetria gera leis de conservação eternas.",
      "Gauss, o Príncipe, calculou a trajetória desta arma com perfeição.",
      "Turing decifrou os segredos ocultos na fenda para forjar isto.",
      "Hawking sentiu a radiação do vazio emanando desta peça."
    ];
    return lores[Math.floor(Math.random() * lores.length)];
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

  getPrice() {
    const rarityMult = { COMUM: 10, MÁGICO: 25, RARO: 75, LENDÁRIO: 300 };
    const base = rarityMult[this.rarity] * (1 + (this.floor * 0.2));
    return Math.floor(base);
  }

  getDetails() {
    let details = `[${this.rarity}] ${this.name}\n`;
    details += `Tipo: ${this.type}\n`;
    for (const [stat, value] of Object.entries(this.stats)) {
      details += `  + ${value} ${stat}\n`;
    }
    if (this.tags.length > 0) details += `Tags: <${this.tags.join('> <')}> \n`;
    if (this.uniques.length > 0) {
      details += chalk.magenta(`Único: "${this.uniques[0]}"\n`);
    }
    if (this.flavorText) {
      details += chalk.gray.italic(`\n"${this.flavorText}"`);
    }
    return details;
  }
}

module.exports = Item;
