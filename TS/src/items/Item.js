const { v4: uuidv4 } = require('uuid');
const chalk = require('chalk');
const { T } = require('../ui/Theme');

class Item {
  constructor(floor = 1, forceRarity = null, data = null) {
    if (data) {
      this.id = data.id; this.floor = data.floor; this.rarity = data.rarity; this.type = data.type;
      this.name = data.name; this.stats = data.stats; this.tags = data.tags; this.uniques = data.uniques || [];
      this.flavorText = data.flavorText || ""; this.consumableType = data.consumableType || null;
    } else {
      this.id = uuidv4(); this.floor = floor; this.rarity = forceRarity || this.rollRarity();
      this.type = this.rollType(); this.consumableType = this.rollConsumableType();
      this.name = this.generateName(); this.stats = this.generateStats();
      this.tags = this.generateTags(); this.uniques = []; this.flavorText = this.generateFlavorText();
      if (this.rarity === 'LENDÁRIO') this.generateUniqueEffect();
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
    const types = ['ARMA', 'ARMA', 'ARMADURA', 'ARMADURA', 'ACESSÓRIO', 'RELÍQUIA', 'CONSUMÍVEL', 'CONSUMÍVEL', 'TOMO'];
    return types[Math.floor(Math.random() * types.length)];
  }

  rollConsumableType() {
    if (this.type !== 'CONSUMÍVEL' && this.type !== 'TOMO') return null;
    if (this.type === 'TOMO') return 'TOMO';
    const types = ['HP', 'SP', 'MP', 'MISTO'];
    return types[Math.floor(Math.random() * types.length)];
  }

  generateName() {
    const prefixes = {
      COMUM:    ['Velho', 'Enferrujado', 'Instável', 'Simples', 'Gasto', 'Quebrado', 'Pesado', 'Rudimentar'],
      MÁGICO:   ['Brilhante', 'Polarizado', 'Reativo', 'Firme', 'Abençoado', 'Temperado', 'Cristalino', 'Oscilante'],
      RARO:     ['Isótopo de Curie', 'Vetor de Gauss', 'Constante de Planck', 'Eterno de Noether',
                 'Fio de Lovelace', 'Tensão de Faraday', 'Espiral de Fibonacci', 'Matriz de Cayley'],
      LENDÁRIO: ['O Horizonte de Hawking', 'A Singularidade de Penrose', 'O Cérebro de Boltzmann',
                 'O Legado de Pascal', 'A Equação de Euler', 'O Axioma de Gödel',
                 'A Hipótese de Riemann', 'O Princípio de Heisenberg']
    };
    const bases = {
      ARMA:      ['Catalisador', 'Bobina de Volta', 'Daga do Vácuo', 'Cetro de Plasma',
                  'Lâmina de Grafeno', 'Martelo de Quanta', 'Espada de Dispersão', 'Foice Fractal',
                  'Alabarda Cinética', 'Cajado de Dirac'],
      ARMADURA:  ['Revestimento de Fótons', 'Manto Quântico', 'Armadura de Grafeno', 'Túnica Esférica',
                  'Escudo de Faraday', 'Couraça de Polímero', 'Malha de Fibonacci', 'Veste de Entropia'],
      ACESSÓRIO: ['Anel de Moebius', 'Lente de Fresnel', 'Pêndulo de Foucault', 'Talismã do Vazio',
                  'Bracelete de Coriolis', 'Amuleto de Bernoulli', 'Colar de Boltzmann', 'Orbe de Maxwell'],
      RELÍQUIA:  ['Monolito de Cauchy', 'Engrenagem de Babbage', 'Prisma de Newton', 'Átomo de Bohr',
                  'Crânio de Descartes', 'Fóssil de Darwin', 'Bússola de Gauss', 'Pergaminho de Euclides'],
      CONSUMÍVEL: {
        HP:    ['Soro de Hemoglobina [HP]', 'Cataplasma de Darwin [HP]', 'Tônico Vital [HP]',
                'Ampola de Regeneração [HP]', 'Elixir Sanguíneo [HP]'],
        SP:    ['Estimulante Adrenal [SP]', 'Extrato Muscular [SP]', 'Composto de Stamina [SP]',
                'Dose de Adrenalina [SP]', 'Cristal de Fôlego [SP]'],
        MP:    ['Tinturas Arcanas [MP]', 'Concentrado Luminiféro [MP]', 'Infusão Quântica [MP]',
                'Éter Purificado [MP]', 'Frasco de Mana [MP]'],
        MISTO: ['Elixir de Aristóteles', 'Poção da Grande Teoria', 'Solução de Leibniz',
                'Destilado Universal', 'Fórmula de Avogadro']
      },
      TOMO: ['Tomo de Lovelace', 'Compêndio de Turing', 'Códice de Newton',
             'Manuscrito de Euler', 'Tratado de Noether', 'Grimório de Schrödinger']
    };

    const prefix = prefixes[this.rarity][Math.floor(Math.random() * prefixes[this.rarity].length)];

    let base;
    if (this.type === 'CONSUMÍVEL') {
      const pool = bases.CONSUMÍVEL[this.consumableType] || bases.CONSUMÍVEL.HP;
      base = pool[Math.floor(Math.random() * pool.length)];
      return base; // Consumíveis não usam prefixo
    }
    if (this.type === 'TOMO') {
      base = bases.TOMO[Math.floor(Math.random() * bases.TOMO.length)];
      return base;
    }
    base = bases[this.type][Math.floor(Math.random() * bases[this.type].length)];
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
      "Hawking sentiu a radiação do vazio emanando desta peça.",
      "Marie Curie sabia que o brilho desta peça era um aviso e um presente.",
      "Planck descobriu que a energia aqui contida é quantizada.",
      "Faraday imaginou campos que ninguém mais via — este item os conduz.",
      "Schrödinger disse: antes de abrir, está vivo e morto. Você sobreviveu.",
      "Heisenberg nos lembrou que precisão e certeza jamais coexistem.",
      "Dirac anteviu a antimatéria nesta estrutura cristalina.",
      "Maxwell unificou eletricidade e magnetismo — este item é o elo.",
      "Leibniz e Newton disputaram a criação do cálculo. Este item é o resultado.",
      "Bohr mapeou o átomo de dentro para fora. Cada elétron desta liga é calculado.",
      "Bernoulli provou que pressão e velocidade dançam juntas — aqui estão aprisionadas.",
      "Von Neumann não distinguia guerra de matemática. Este item também não.",
      "Descartes duvidou de tudo, exceto do poder deste artefato."
    ];
    return lores[Math.floor(Math.random() * lores.length)];
  }

  generateStats() {
    const multiplier = 1 + (this.floor * 0.1);
    const rarityBonus = { COMUM: 1, MÁGICO: 1.5, RARO: 2.2, LENDÁRIO: 3.5 };
    const baseVal = 10 * multiplier * rarityBonus[this.rarity];

    if (this.type === 'TOMO') {
      return {
        recoverHp: Math.floor(baseVal * 0.5),
        recoverSp: Math.floor(baseVal * 0.5),
        recoverMp: Math.floor(baseVal * 0.5)
      };
    }

    if (this.type === 'CONSUMÍVEL') {
      switch (this.consumableType) {
        case 'HP':   return { recoverHp: Math.floor(baseVal * 2.5) };
        case 'SP':   return { recoverSp: Math.floor(baseVal * 2.5) };
        case 'MP':   return { recoverMp: Math.floor(baseVal * 2.5) };
        case 'MISTO': return {
          recoverHp: Math.floor(baseVal),
          recoverSp: Math.floor(baseVal),
          recoverMp: Math.floor(baseVal)
        };
        default: return { recoverHp: Math.floor(baseVal * 2) };
      }
    }

    const stats = {};
    if (this.type === 'ARMA') {
      stats.physicalDamage = Math.floor(baseVal);
      if (this.rarity === 'LENDÁRIO') stats.magicDamage = Math.floor(baseVal * 0.4);
    }
    if (this.type === 'ARMADURA') {
      stats.defense = Math.floor(baseVal / 2);
      if (this.rarity !== 'COMUM') stats.maxHp = Math.floor(baseVal * 0.8);
    }
    if (this.type === 'ACESSÓRIO') {
      stats.maxMp = Math.floor(baseVal / 2);
      if (this.rarity !== 'COMUM') stats.maxSp = Math.floor(baseVal / 3);
    }
    if (this.type === 'RELÍQUIA') {
      const attrs = ['strength', 'dexterity', 'intelligence'];
      const count = this.rarity === 'LENDÁRIO' ? 2 : 1;
      attrs.sort(() => Math.random() - 0.5).slice(0, count).forEach(attr => {
        stats[attr] = Math.max(1, Math.floor(baseVal / 4));
      });
    }

    // Bônus de Atributos extras por raridade
    if (this.rarity !== 'COMUM' && this.type !== 'RELÍQUIA') {
      const attrs = ['strength', 'dexterity', 'intelligence'];
      const count = this.rarity === 'MÁGICO' ? 1 : (this.rarity === 'RARO' ? 2 : 3);
      for (let i = 0; i < count; i++) {
        const attr = attrs[Math.floor(Math.random() * attrs.length)];
        stats[attr] = (stats[attr] || 0) + Math.floor(Math.random() * (this.floor + 2)) + 1;
      }
    }
    return stats;
  }

  generateTags() {
    const weaponTags = ['CORTE', 'ESMAGAMENTO', 'FOGO', 'CHOQUE', 'VAZIO'];
    const armorTags  = ['ESCUDO', 'REFLEXO', 'ABSORÇÃO'];
    const tags = [];
    if (this.type === 'ARMA') {
      tags.push(weaponTags[Math.floor(Math.random() * 2)]);
      if (this.rarity === 'RARO' || this.rarity === 'LENDÁRIO') {
        tags.push(weaponTags[Math.floor(Math.random() * 3) + 2]);
      }
      if (this.rarity === 'LENDÁRIO') tags.push(weaponTags[Math.floor(Math.random() * weaponTags.length)]);
    }
    if (this.type === 'ARMADURA' && this.rarity !== 'COMUM') {
      tags.push(armorTags[Math.floor(Math.random() * armorTags.length)]);
    }
    return [...new Set(tags)]; // sem duplicatas
  }

  generateUniqueEffect() {
    const effects = [
      "Ataques básicos escalam com Mana Máxima (INT×2 dano extra).",
      "50% dano extra contra alvos com SANGRAMENTO.",
      "Ignora 100% da Armadura Física do alvo.",
      "Recupera 5% HP ao dar Stagger em um inimigo.",
      "Cada kill consecutivo aumenta o dano em 15% (acumula até 3x).",
      "Primeiro ataque de cada combate causa CONGELAMENTO automático.",
      "Usar RECUPERAR também aplica COMBUSTÃO no inimigo atual.",
      "EVASÃO concede +30% dano no contra-ataque seguinte.",
      "Habilidades de Clérigo curam aliados em 20% extra do dano causado.",
      "Ao entrar em Colapso, dispara automaticamente Força Centrípeta.",
      "Orbes ganhos em combate são duplicados por este portador.",
      "A cada 5 turnos em MOMENTO, o próximo ataque é garantidamente crítico."
    ];
    this.uniques.push(effects[Math.floor(Math.random() * effects.length)]);
  }

  getColorizedName() {
    const colors = { COMUM: T.rarityComum, MÁGICO: T.rarityMagico, RARO: T.rarityRaro, LENDÁRIO: T.rarityLendario };
    return (colors[this.rarity] || T.bright)(this.name);
  }

  getPrice() {
    const rarityMult = { COMUM: 10, MÁGICO: 25, RARO: 75, LENDÁRIO: 300 };
    const typeBonus = this.type === 'TOMO' ? 1.5 : 1;
    return Math.floor(rarityMult[this.rarity] * (1 + (this.floor * 0.2)) * typeBonus);
  }

  refine(newFloor) {
    this.floor = newFloor;
    this.stats = this.generateStats();
    if (this.rarity === 'LENDÁRIO' && this.uniques.length === 0) this.generateUniqueEffect();
  }

  toggleRadiant() {
    if (!this.tags.includes('RADIANTE')) { this.tags.push('RADIANTE'); return true; }
    return false;
  }

  getDetails() {
    const typeLabel = this.type === 'TOMO' ? T.info(this.type) : T.neutral(this.type);
    let details = `${this.getColorizedName()}\n`;
    details += `${typeLabel}`;
    if (this.consumableType && this.type !== 'TOMO') details += T.neutral(` [${this.consumableType}]`);
    details += T.neutral(` | Andar ${this.floor}\n`);
    for (const [stat, value] of Object.entries(this.stats)) {
      if (typeof value === 'number') details += ` ${T.success('+'+value)} ${stat.toUpperCase()}\n`;
    }
    if (this.tags.length > 0) details += ` Tags: <${this.tags.join('> <')}>\n`;
    if (this.uniques.length > 0) details += T.magic(` Único: "${this.uniques[0]}"\n`);
    if (this.flavorText) details += T.neutral.italic(`\n "${this.flavorText}"`);
    return details;
  }
}
module.exports = Item;
