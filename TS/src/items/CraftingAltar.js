const chalk = require('chalk');

class CraftingAltar {
  constructor() {
    this.name = 'Altar da Transmutação de Marie Curie';
  }

  getMasteryConfig(masteryLevel) {
    const configs = [
      { label: 'Aprendiz',   cost: 50,  rarityReq: ['RARO', 'LENDÁRIO'],
        effectDesc: 'Realinha atributos aleatoriamente.',
        upgradeCost: 200, upgradeLabel: 'Evoluir para Iniciado (200 Orbes)' },
      { label: 'Iniciado',   cost: 75,  rarityReq: ['RARO', 'LENDÁRIO'],
        effectDesc: 'Realinha atributos. Stat principal recebe +10%.',
        upgradeCost: 500, upgradeLabel: 'Evoluir para Alquimista (500 Orbes)' },
      { label: 'Alquimista', cost: 100, rarityReq: ['MÁGICO', 'RARO', 'LENDÁRIO'],
        effectDesc: 'Realinha + aceita MÁGICO. Chance 30% de promover raridade.',
        upgradeCost: 1200, upgradeLabel: 'Evoluir para Radiante (1200 Orbes)' },
      { label: 'Radiante',   cost: 150, rarityReq: ['MÁGICO', 'RARO', 'LENDÁRIO'],
        effectDesc: '+20% em todos os stats + marca RADIANTE no item.',
        upgradeCost: null, upgradeLabel: null }
    ];
    return configs[Math.min(masteryLevel || 0, 3)];
  }

  canReRoll(item, masteryLevel) {
    const config = this.getMasteryConfig(masteryLevel);
    return item && config.rarityReq.includes(item.rarity);
  }

  reRollItem(player, itemIndex) {
    const item = player.inventory[itemIndex];
    const mastery = player.craftingMastery || 0;
    const config = this.getMasteryConfig(mastery);
    if (!item || !this.canReRoll(item, mastery)) return false;
    if (player.orbs < config.cost) return false;

    player.orbs -= config.cost;
    item.stats = item.generateStats();

    // Nível 1: +10% no primeiro stat numérico
    if (mastery >= 1) {
      const mainStat = Object.keys(item.stats).find(k => typeof item.stats[k] === 'number');
      if (mainStat) item.stats[mainStat] = Math.floor(item.stats[mainStat] * 1.1);
    }

    // Nível 2: 30% de chance de promover MÁGICO → RARO
    if (mastery >= 2 && item.rarity === 'MÁGICO' && Math.random() < 0.30) {
      item.rarity = 'RARO';
      item.stats = item.generateStats();
      return { success: true, promoted: true };
    }

    // Nível 3: +20% em todos os stats + marca RADIANTE
    if (mastery >= 3) {
      for (const key of Object.keys(item.stats)) {
        if (typeof item.stats[key] === 'number') item.stats[key] = Math.floor(item.stats[key] * 1.2);
      }
      if (!item.uniques) item.uniques = [];
      if (!item.uniques.includes('RADIANTE')) item.uniques.push('RADIANTE');
    }

    return { success: true, promoted: false };
  }

  upgradeMastery(player) {
    const config = this.getMasteryConfig(player.craftingMastery || 0);
    if (!config.upgradeCost) return false;
    if (player.orbs < config.upgradeCost) return false;
    player.orbs -= config.upgradeCost;
    player.craftingMastery = (player.craftingMastery || 0) + 1;
    return true;
  }

  getMenuLabel(player) {
    const config = this.getMasteryConfig(player.craftingMastery || 0);
    return ` [ MARIE CURIE — Maestria ${config.label} (${config.cost} Orbes) ] `;
  }
}

module.exports = CraftingAltar;
