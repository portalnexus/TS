const { v4: uuidv4 } = require('uuid');
class Entity {
  constructor(name, stats = {}) {
    this.id = stats.id || uuidv4();
    this.name = name;
    this.race = stats.race || 'Humano';
    this.background = stats.background || 'Guerreiro';

    this.strength = stats.strength || 10;
    this.dexterity = stats.dexterity || 10;
    this.intelligence = stats.intelligence || 10;

    if (!stats.id) {
       if (this.race === 'Humano') { this.strength += 2; this.dexterity += 2; this.intelligence += 2; }
       if (this.race === 'Elfo') { this.intelligence += 5; }
       if (this.race === 'Anão') { this.strength += 5; }
       if (this.race === 'Orc') { this.dexterity += 5; }
    }

    this.maxHp = stats.maxHp || (100 + (this.strength * 8) + (this.race === 'Anão' ? 20 : 0));
    this.hp = stats.hp || this.maxHp;
    this.maxSp = stats.maxSp || (50 + (this.strength * 2) + (this.race === 'Orc' ? 15 : 0));
    this.sp = stats.sp || this.maxSp;
    this.maxMp = stats.maxMp || (50 + (this.intelligence * 2) + (this.race === 'Elfo' ? 10 : 0));
    this.mp = stats.mp || this.maxMp;

    this.level = stats.level || 1;
    this.xp = stats.xp || 0;
    this.xpToNextLevel = this.level * 100;
    this.attributePoints = stats.attributePoints || 0;
    this.proficiencyPoints = stats.proficiencyPoints || 0;
    this.skillPoints = stats.skillPoints || 0;
    this.orbs = stats.orbs || 0;
    this.activeQuest = stats.activeQuest || null;

    this.skillTree = stats.skillTree || this.initializeSkillTree();
    this.bestiary = stats.bestiary || {};

    this.proficiencies = stats.proficiencies || {
      'CORTE': 0, 'ESMAGAMENTO': 0, 'FOGO': 0, 'CHOQUE': 0, 'VAZIO': 0
    };

    // --- REVISÃO DE POSTURA: ESTABILIDADE CINÉTICA ---
    this.posture = stats.posture || 100; // Estabilidade agora começa em 100
    this.maxPosture = stats.maxPosture || (100 + (this.dexterity * 5));
    this.postureMode = stats.postureMode || 'EQUILIBRIO'; // INERCIA, MOMENTO, EQUILIBRIO

    this.activeStatuses = [];
    this.isDead = false;
    this.isStaggered = false;
    this.exhaustionPhysical = false; 
    this.exhaustionMagical = false;  

    this.equipment = {
      ARMA: stats.equipment?.ARMA ? this.rehydrateItem(stats.equipment.ARMA) : null,
      ARMADURA: stats.equipment?.ARMADURA ? this.rehydrateItem(stats.equipment.ARMADURA) : null,
      ACESSÓRIO: stats.equipment?.ACESSÓRIO ? this.rehydrateItem(stats.equipment.ACESSÓRIO) : null,
      RELÍQUIA: stats.equipment?.RELÍQUIA ? this.rehydrateItem(stats.equipment.RELÍQUIA) : null
    };
    this.inventory = (stats.inventory || []).map(it => this.rehydrateItem(it));
  }

  initializeSkillTree() {
    const trees = {
      'Guerreiro': {
        'Impacto de Newton': { lvl: 0, desc: 'Dano físico massivo. Reduz estabilidade.', cost: 15 },
        'Inércia de Galileu': { lvl: 0, desc: 'Aumenta defesa e recupera estabilidade.', cost: 10 },
        'Entropia Cinética': { lvl: 0, desc: 'Dano em área baseado em STR.', cost: 20 },
        'Força Centrípeta': { lvl: 0, desc: 'Gira a arma atingindo todos.', cost: 25 },
        'Lei da Inércia': { lvl: 0, desc: 'Imunidade a Colapso.', cost: 30 }
      },
      'Mago': {
        'Raio de Maxwell': { lvl: 0, desc: 'Dano de choque preciso.', cost: 20 },
        'Chama de Lavoisier': { lvl: 0, desc: 'Incendeia o inimigo.', cost: 15 },
        'Zero Absoluto': { lvl: 0, desc: 'Gera Stagger imediato.', cost: 25 },
        'Paradoxo de Schrödinger': { lvl: 0, desc: 'Chance de evitar dano.', cost: 30 },
        'Singularidade de Hawking': { lvl: 0, desc: 'Dreno massivo de HP.', cost: 40 }
      },
      'Arqueiro': {
        'Flecha de Hawking': { lvl: 0, desc: 'Dano crítico garantido.', cost: 15 },
        'Diagrama de Feynman': { lvl: 0, desc: 'Disparo múltiplo.', cost: 20 },
        'Relatividade de Einstein': { lvl: 0, desc: 'Aumenta Evasão.', cost: 15 },
        'Óptica de Euclides': { lvl: 0, desc: 'Precisão máxima.', cost: 10 },
        'Efeito Doppler': { lvl: 0, desc: 'Dano aumenta com a distância.', cost: 25 }
      },
      'Clérigo': {
        'Cura de Hipócrates': { lvl: 0, desc: 'Recupera HP.', cost: 20 },
        'Sopro de Gaia': { lvl: 0, desc: 'Remove debuffs.', cost: 15 },
        'Luz Primordial': { lvl: 0, desc: 'Dano e cura leve.', cost: 25 },
        'Teorema de Pitágoras': { lvl: 0, desc: 'Escudo triangular.', cost: 30 },
        'Proporção Áurea': { lvl: 0, desc: 'Harmoniza atributos.', cost: 35 }
      }
    };
    return trees[this.background] || trees['Guerreiro'];
  }

  addExperience(amount) {
    this.xp += amount;
    let leveledUp = false;
    while (this.xp >= this.xpToNextLevel) {
      this.xp -= this.xpToNextLevel; this.level++; this.xpToNextLevel = this.level * 100;
      this.attributePoints += 3; this.proficiencyPoints += 1; this.skillPoints += 1;
      leveledUp = true;
    }
    return leveledUp;
  }

  upgradeAttribute(attr) {
    if (this.attributePoints <= 0) return false;
    if (attr === 'STR') { this.strength++; this.maxHp += 8; this.maxSp += 2; }
    else if (attr === 'DEX') { this.dexterity++; this.maxPosture += 5; }
    else if (attr === 'INT') { this.intelligence++; this.maxMp += 2; }
    this.attributePoints--; return true;
  }

  upgradeSkill(skillName) {
    if (this.skillPoints > 0 && this.skillTree[skillName]) { this.skillTree[skillName].lvl++; this.skillPoints--; return true; }
    return false;
  }

  adaptAttribute(attr, orbCost) {
    if (this.orbs >= orbCost) {
      if (attr === 'STR') { this.strength++; this.maxHp += 8; }
      else if (attr === 'DEX') { this.dexterity++; this.maxPosture += 5; }
      else if (attr === 'INT') { this.intelligence++; this.maxMp += 2; }
      this.orbs -= orbCost;
      return true;
    }
    return false;
  }

  compileSkill(orbCost) {
    if (this.orbs >= orbCost) {
      this.skillPoints++;
      this.orbs -= orbCost;
      return true;
    }
    return false;
  }

  recordKill(monsterName) { if (!this.bestiary[monsterName]) this.bestiary[monsterName] = 0; this.bestiary[monsterName]++; }
  getLearnedSkills() { return Object.keys(this.skillTree).filter(name => this.skillTree[name].lvl > 0); }
  upgradeProficiency(tag) { if (this.proficiencyPoints <= 0) return false; if (this.proficiencies[tag] !== undefined) { this.proficiencies[tag]++; this.proficiencyPoints--; return true; } return false; }
  rehydrateItem(itemData) { const Item = require('../items/Item'); return new Item(itemData.floor, null, itemData); }

  addStatus(name, duration) {
    const existing = this.activeStatuses.find(s => s.name === name);
    if (existing) existing.duration = Math.max(existing.duration, duration);
    else this.activeStatuses.push({ name, duration });
  }

  processStatuses(combatLog) {
    for (let i = this.activeStatuses.length - 1; i >= 0; i--) {
      const status = this.activeStatuses[i];
      if (status.name === 'SANGRAMENTO') { const dmg = Math.max(5, Math.floor(this.maxHp * 0.05)); this.hp -= dmg; if (combatLog) combatLog.push(` > ${this.name} sofreu ${dmg} de Sangramento.`); }
      if (status.name === 'COMBUSTÃO') { const dmg = Math.max(10, Math.floor(this.maxHp * 0.08)); this.hp -= dmg; if (combatLog) combatLog.push(` > ${this.name} sofreu ${dmg} de Combustão.`); }
      if (status.name === 'CHOQUE') { this.modifyStability(-20); if (combatLog) combatLog.push(` > ${this.name} foi eletrocutado! (-20 Estabilidade)`); }
      if (status.name === 'CONGELAMENTO') { this.modifyStability(-15); if (combatLog) combatLog.push(` > ${this.name} está congelado! (-15 Estabilidade)`); }
      status.duration--; if (status.duration <= 0) { if (combatLog) combatLog.push(` > [${status.name}] expirou.`); this.activeStatuses.splice(i, 1); }
    }
    if (this.hp <= 0) { this.hp = 0; this.isDead = true; }
  }

  serialize() {
    return {
      id: this.id, name: this.name, race: this.race, background: this.background,
      strength: this.strength, dexterity: this.dexterity, intelligence: this.intelligence,
      maxHp: this.maxHp, hp: this.hp, maxSp: this.maxSp, sp: this.sp, maxMp: this.maxMp, mp: this.mp,
      level: this.level, xp: this.xp, orbs: this.orbs,
      attributePoints: this.attributePoints, proficiencyPoints: this.proficiencyPoints, skillPoints: this.skillPoints,
      proficiencies: this.proficiencies, skillTree: this.skillTree, bestiary: this.bestiary,
      activeQuest: this.activeQuest, posture: this.posture, maxPosture: this.maxPosture,
      postureMode: this.postureMode, equipment: this.equipment, inventory: this.inventory
    };
  }

  static fromSave(saveData) { return new Entity(saveData.name, saveData); }

  getAttackPower() {
    let power = (this.level * 2) + (this.strength * 1.5);
    if (this.equipment.ARMA) { power += this.equipment.ARMA.stats.physicalDamage || 0; if (this.equipment.ARMA.stats.strength) power += this.equipment.ARMA.stats.strength * 2; }
    if (this.equipment.RELÍQUIA) { if (this.equipment.RELÍQUIA.stats.strength) power += this.equipment.RELÍQUIA.stats.strength * 2; }
    if (this.background === 'Guerreiro') power *= 1.1;
    if (this.postureMode === 'MOMENTO') power *= 1.5; // Bônus de Momento
    return Math.floor(power);
  }

  getDefense() {
    let def = 0;
    if (this.equipment.ARMADURA) { def += this.equipment.ARMADURA.stats.defense || 0; if (this.equipment.ARMADURA.stats.dexterity) def += this.equipment.ARMADURA.stats.dexterity; }
    if (this.equipment.RELÍQUIA) { if (this.equipment.RELÍQUIA.stats.dexterity) def += this.equipment.RELÍQUIA.stats.dexterity; }
    if (this.postureMode === 'INERCIA') def *= 2; // Bônus de Inércia
    return def;
  }

  equipItem(item) {
    if (item.type === 'CONSUMÍVEL') return false;
    if (this.equipment[item.type]) {
      const oldItem = this.equipment[item.type];
      if (oldItem.stats.maxHp) this.maxHp -= oldItem.stats.maxHp;
      if (oldItem.stats.maxSp) this.maxSp -= oldItem.stats.maxSp;
      if (oldItem.stats.maxMp) this.maxMp -= oldItem.stats.maxMp;
      if (oldItem.stats.strength) this.strength -= oldItem.stats.strength;
      if (oldItem.stats.dexterity) this.dexterity -= oldItem.stats.dexterity;
      if (oldItem.stats.intelligence) this.intelligence -= oldItem.stats.intelligence;
      this.inventory.push(oldItem);
    }
    this.equipment[item.type] = item;
    this.inventory = this.inventory.filter(i => i.id !== item.id);
    if (item.stats.maxHp) this.maxHp += item.stats.maxHp;
    if (item.stats.maxSp) this.maxSp += item.stats.maxSp;
    if (item.stats.maxMp) this.maxMp += item.stats.maxMp;
    if (item.stats.strength) this.strength += item.stats.strength;
    if (item.stats.dexterity) this.dexterity += item.stats.dexterity;
    if (item.stats.intelligence) this.intelligence += item.stats.intelligence;
    this.hp = Math.min(this.hp, this.maxHp); this.sp = Math.min(this.sp, this.maxSp); this.mp = Math.min(this.mp, this.maxMp);
    return true;
  }

  useConsumable(item) {
    if (item.type !== 'CONSUMÍVEL') return false;
    const val = item.stats.recoverValue || 20;
    if (item.name.includes('HP')) this.hp = Math.min(this.maxHp, this.hp + val);
    if (item.name.includes('SP')) this.sp = Math.min(this.maxSp, this.sp + val);
    if (item.name.includes('MP')) this.mp = Math.min(this.maxMp, this.mp + val);
    this.inventory = this.inventory.filter(i => i.id !== item.id);
    return true;
  }

  takeDamage(amount, type = 'physical') {
    let finalDamage = amount;
    if (type === 'physical') finalDamage = Math.max(1, amount - this.getDefense());
    if (this.exhaustionPhysical) finalDamage *= 2;
    this.hp -= finalDamage;
    if (this.hp <= 0) { this.hp = 0; this.isDead = true; }
    return finalDamage;
  }

  consumeSp(amount) {
    this.sp -= amount;
    if (this.sp < 0) { this.sp = 0; this.exhaustionPhysical = true; }
    else this.exhaustionPhysical = false;
  }

  consumeMp(amount) {
    this.mp -= amount;
    if (this.mp < 0) { this.mp = 0; this.exhaustionMagical = true; }
    else this.exhaustionMagical = false;
  }

  hasStatus(name) {
    return this.activeStatuses.some(s => s.name === name);
  }

  removeStatus(name) {
    this.activeStatuses = this.activeStatuses.filter(s => s.name !== name);
  }

  modifyStability(amount) {
    this.posture = Math.min(this.maxPosture, Math.max(0, this.posture + amount));
    if (this.posture <= 0) { this.isStaggered = true; }
    else if (this.posture > 20) { this.isStaggered = false; }
  }

  recover(hpPerc = 0.1, spPerc = 0.2, mpPerc = 0.2) {
    let bonus = this.background === 'Clérigo' ? 1.1 : 1.0;
    this.hp = Math.min(this.maxHp, this.hp + Math.floor(this.maxHp * hpPerc * bonus));
    this.sp = Math.min(this.maxSp, this.sp + Math.floor(this.maxSp * spPerc * bonus));
    this.mp = Math.min(this.maxMp, this.mp + Math.floor(this.maxMp * mpPerc * bonus));
    this.modifyStability(30); // Recuperação agora foca em Estabilidade
  }

  setPostureMode(mode) {
    if (['INERCIA', 'MOMENTO', 'EQUILIBRIO'].includes(mode)) this.postureMode = mode;
  }

  calculatePrestige() {
    let prestige = this.level * 100;
    prestige += (this.strength + this.dexterity + this.intelligence) * 10;
    
    // Prestige por Itens (Baseado no preço/raridade)
    Object.values(this.equipment).forEach(item => {
      if (item) prestige += Math.floor(item.getPrice() / 5);
    });
    
    // Prestige por Conhecimento (Skills)
    Object.values(this.skillTree).forEach(s => {
      prestige += s.lvl * 50;
    });

    // Prestige por Descobertas (Bestiário)
    Object.values(this.bestiary).forEach(count => {
      prestige += count * 2;
    });

    return prestige;
  }
}
module.exports = Entity;
