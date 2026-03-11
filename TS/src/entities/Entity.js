const { v4: uuidv4 } = require('uuid');

class Entity {
  constructor(name, stats = {}) {
    this.id = uuidv4();
    this.name = name;

    // Stats base
    this.maxHp = stats.hp || 100;
    this.hp = this.maxHp;

    this.maxSp = stats.sp || 50;
    this.sp = this.maxSp;

    this.maxMp = stats.mp || 50;
    this.mp = this.maxMp;

    this.level = stats.level || 1;
    this.xp = 0;

    // Sistema de Postura (0-100)
    this.posture = 0;
    this.maxPosture = 100;
    this.postureMode = 'BALANCED'; // ATTACK, BALANCED, DEFENCE

    // Status
    this.isDead = false;
    this.isStaggered = false;
    this.exhaustionPhysical = false; // 2x dano físico recebido
    this.exhaustionMagical = false;  // 2x dano mágico recebido

    // Equipamento e Inventário
    this.equipment = {
      ARMA: null,
      ARMADURA: null,
      ACESSÓRIO: null
    };
    this.inventory = [];
  }

  getAttackPower() {
    let power = this.level * 5;
    if (this.equipment.ARMA) {
      power += this.equipment.ARMA.stats.physicalDamage || 0;
    }
    return power;
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
    this.hp = Math.min(this.maxHp, this.hp + Math.floor(this.maxHp * hpPerc));
    this.sp = Math.min(this.maxSp, this.sp + Math.floor(this.maxSp * spPerc));
    this.mp = Math.min(this.maxMp, this.mp + Math.floor(this.maxMp * mpPerc));

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
