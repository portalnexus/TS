const { v4: uuidv4 } = require('uuid');
class Entity {
  constructor(name, stats = {}) {
    this.id = stats.id || uuidv4();
    this.name = name;
    this.race = stats.race || 'Humano';
    this.background = stats.background || 'Mercenário';

    // Atributos Nucleares
    this.strength = stats.strength || 10;     // +HP, +Dano Físico, +Stamina
    this.dexterity = stats.dexterity || 10;   // +Crítico, +Evasão, +Postura
    this.intelligence = stats.intelligence || 10; // +Mana, +Dano Mágico

    // Aplicar Bônus de Raça (apenas na criação)
    if (!stats.id) {
       if (this.race === 'Humano') { this.strength += 2; this.dexterity += 2; this.intelligence += 2; }
       if (this.race === 'Elfo') { this.intelligence += 5; }
       if (this.race === 'Anão') { this.strength += 5; }
       if (this.race === 'Orc') { this.dexterity += 5; }
    }

    // Stats base calculados
    this.maxHp = stats.maxHp || (100 + (this.strength * 5) + (this.race === 'Anão' ? 20 : 0));
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

    // Árvore de Passivas (Nomes científicos)
    this.passives = stats.passives || {
      'CALCULO_DIFERENCIAL': 0, // +% Crítico
      'TERMODINAMICA': 0,        // +% Dano de Fogo
      'MECANICA_QUANTICA': 0,    // +% Evasão
      'ENTROPIA': 0,             // +% Dano do Vazio
      'RELATIVIDADE': 0          // +% Postura Máxima
    };

    // Proficiências (Bônus de % de Dano por Tag)
    this.proficiencies = stats.proficiencies || {
      'CORTE': 0,
      'ESMAGAMENTO': 0,
      'FOGO': 0,
      'CHOQUE': 0,
      'VAZIO': 0
    };

    // Sistema de Postura (0-100)
    this.posture = stats.posture || 0;
    this.maxPosture = stats.maxPosture || (100 + (this.dexterity * 2) + (this.background === 'Ladino' ? 10 : 0));
    this.postureMode = stats.postureMode || 'BALANCED'; // ATTACK, BALANCED, DEFENCE

    // Status Elementais / Reações
    this.activeStatuses = [];
    this.skills = stats.skills || ['Raio Arcano'];

    // Status
    this.isDead = false;
    this.isStaggered = false;
    this.exhaustionPhysical = false; 
    this.exhaustionMagical = false;  

    // Equipamento e Inventário
    this.equipment = {
      ARMA: stats.equipment?.ARMA ? this.rehydrateItem(stats.equipment.ARMA) : null,
      ARMADURA: stats.equipment?.ARMADURA ? this.rehydrateItem(stats.equipment.ARMADURA) : null,
      ACESSÓRIO: stats.equipment?.ACESSÓRIO ? this.rehydrateItem(stats.equipment.ACESSÓRIO) : null
    };
    this.inventory = (stats.inventory || []).map(it => this.rehydrateItem(it));
  }

  addExperience(amount) {
    this.xp += amount;
    let leveledUp = false;
    while (this.xp >= this.xpToNextLevel) {
      this.xp -= this.xpToNextLevel;
      this.level++;
      this.xpToNextLevel = this.level * 100;
      this.attributePoints += 3;
      this.proficiencyPoints += 1;
      this.skillPoints += 1;
      leveledUp = true;
    }
    return leveledUp;
  }

  upgradeAttribute(attr) {
    if (this.attributePoints <= 0) return false;
    if (attr === 'STR') {
      this.strength++;
      this.maxHp += 5;
      this.maxSp += 2;
    } else if (attr === 'DEX') {
      this.dexterity++;
      this.maxPosture += 2;
    } else if (attr === 'INT') {
      this.intelligence++;
      this.maxMp += 2;
    }
    this.attributePoints--;
    return true;
  }

  upgradeProficiency(tag) {
    if (this.proficiencyPoints <= 0) return false;
    if (this.proficiencies[tag] !== undefined) {
      this.proficiencies[tag]++;
      this.proficiencyPoints--;
      return true;
    }
    return false;
  }

  upgradePassive(skillKey) {
    if (this.skillPoints > 0 && this.passives[skillKey] !== undefined) {
      this.passives[skillKey]++;
      this.skillPoints--;
      return true;
    }
    return false;
  }

  rehydrateItem(itemData) {
    const Item = require('../items/Item');
    return new Item(itemData.floor, null, itemData);
  }

  addStatus(name, duration) {
    const existing = this.activeStatuses.find(s => s.name === name);
    if (existing) {
      existing.duration = Math.max(existing.duration, duration);
    } else {
      this.activeStatuses.push({ name, duration });
    }
  }

  processStatuses(combatLog) {
    for (let i = this.activeStatuses.length - 1; i >= 0; i--) {
      const status = this.activeStatuses[i];
      if (status.name === 'SANGRAMENTO') {
        const dmg = Math.max(5, Math.floor(this.maxHp * 0.05));
        this.hp -= dmg;
        if (combatLog) combatLog.push(` > ${this.name} sofreu ${dmg} de Sangramento.`);
      }
      if (status.name === 'COMBUSTÃO') {
        const dmg = Math.max(10, Math.floor(this.maxHp * 0.08));
        this.hp -= dmg;
        if (combatLog) combatLog.push(` > ${this.name} sofreu ${dmg} de Combustão.`);
      }

      status.duration--;
      if (status.duration <= 0) {
        if (combatLog) combatLog.push(` > [${status.name}] expirou em ${this.name}.`);
        this.activeStatuses.splice(i, 1);
      }
    }
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
  }

  hasStatus(name) {
    return this.activeStatuses.some(s => s.name === name);
  }

  removeStatus(name) {
    this.activeStatuses = this.activeStatuses.filter(s => s.name !== name);
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      race: this.race,
      background: this.background,
      strength: this.strength,
      dexterity: this.dexterity,
      intelligence: this.intelligence,
      maxHp: this.maxHp,
      hp: this.hp,
      maxSp: this.maxSp,
      sp: this.sp,
      maxMp: this.maxMp,
      mp: this.mp,
      level: this.level,
      xp: this.xp,
      orbs: this.orbs,
      attributePoints: this.attributePoints,
      proficiencyPoints: this.proficiencyPoints,
      skillPoints: this.skillPoints,
      proficiencies: this.proficiencies,
      passives: this.passives,
      activeQuest: this.activeQuest,
      posture: this.posture,
      maxPosture: this.maxPosture,
      postureMode: this.postureMode,
      equipment: this.equipment,
      inventory: this.inventory
    };
  }

  static fromSave(saveData) {
    return new Entity(saveData.name, saveData);
  }

  getAttackPower() {
    let power = (this.level * 2) + (this.strength * 1.5);
    if (this.equipment.ARMA) {
      power += this.equipment.ARMA.stats.physicalDamage || 0;
    }
    
    // Bônus de Background
    if (this.background === 'Mercenário') power *= 1.1;
    
    return Math.floor(power);
  }

  getDefense() {
    let def = 0;
    if (this.equipment.ARMADURA) {
      def += this.equipment.ARMADURA.stats.defense || 0;
    }
    return def;
  }

  equipItem(item) {
    if (item.type === 'CONSUMÍVEL') return false;

    // Desequipar anterior se existir
    if (this.equipment[item.type]) {
      const oldItem = this.equipment[item.type];
      // Remover bônus do item antigo
      if (oldItem.stats.maxHp) this.maxHp -= oldItem.stats.maxHp;
      if (oldItem.stats.maxSp) this.maxSp -= oldItem.stats.maxSp;
      if (oldItem.stats.maxMp) this.maxMp -= oldItem.stats.maxMp;
      this.inventory.push(oldItem);
    }

    this.equipment[item.type] = item;
    this.inventory = this.inventory.filter(i => i.id !== item.id);

    // Bônus de Status do item ao equipar
    if (item.stats.maxHp) this.maxHp += item.stats.maxHp;
    if (item.stats.maxSp) this.maxSp += item.stats.maxSp;
    if (item.stats.maxMp) this.maxMp += item.stats.maxMp;

    // Ajustar HP/SP/MP se necessário (não passar do máximo)
    this.hp = Math.min(this.hp, this.maxHp);
    this.sp = Math.min(this.sp, this.maxSp);
    this.mp = Math.min(this.mp, this.maxMp);

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
    if (type === 'physical') {
      finalDamage = Math.max(1, amount - this.getDefense());
    }

    // Penalidades de exaustão
    if (type === 'physical' && this.exhaustionPhysical) finalDamage *= 2;
    if (type === 'magical' && this.exhaustionMagical) finalDamage *= 2;

    this.hp -= finalDamage;
    if (this.hp <= 0) {
      this.hp = 0;
      this.isDead = true;
    }
    return finalDamage;
  }

  consumeSp(amount) {
    this.sp -= amount;
    if (this.sp < 0) {
      this.sp = 0;
      this.exhaustionPhysical = true;
    } else {
      this.exhaustionPhysical = false;
    }
  }

  consumeMp(amount) {
    this.mp -= amount;
    if (this.mp < 0) {
      this.mp = 0;
      this.exhaustionMagical = true;
    } else {
      this.exhaustionMagical = false;
    }
  }

  addPostureDamage(amount) {
    this.posture += amount;
    if (this.posture >= this.maxPosture) {
      this.posture = this.maxPosture;
      this.isStaggered = true;
    }
  }

  recover(hpPerc = 0.1, spPerc = 0.2, mpPerc = 0.2) {
    let bonus = this.background === 'Clérigo' ? 1.1 : 1.0;
    this.hp = Math.min(this.maxHp, this.hp + Math.floor(this.maxHp * hpPerc * bonus));
    this.sp = Math.min(this.maxSp, this.sp + Math.floor(this.maxSp * spPerc * bonus));
    this.mp = Math.min(this.maxMp, this.mp + Math.floor(this.maxMp * mpPerc * bonus));

    if (this.sp > 0) this.exhaustionPhysical = false;
    if (this.mp > 0) this.exhaustionMagical = false;

    this.posture = Math.max(0, this.posture - 20);
    if (this.posture < this.maxPosture) this.isStaggered = false;
  }

  setPostureMode(mode) {
    const validModes = ['ATTACK', 'BALANCED', 'DEFENCE'];
    if (validModes.includes(mode)) {
      this.postureMode = mode;
    }
  }
}

module.exports = Entity;
