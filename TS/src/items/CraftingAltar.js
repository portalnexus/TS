const chalk = require('chalk');

class CraftingAltar {
  constructor() {
    this.name = 'Altar da Transmutação';
    this.reRollCost = 50; // Custo em orbes
  }

  canReRoll(item) {
    return item && (item.rarity === 'RARO' || item.rarity === 'LENDÁRIO');
  }

  reRollItem(player, itemIndex) {
    const item = player.inventory[itemIndex];
    if (!item || !this.canReRoll(item)) return false;

    if (player.orbs >= this.reRollCost) {
      player.orbs -= this.reRollCost;
      
      // Salva dados antigos
      const oldHp = item.stats.maxHp;
      const oldSp = item.stats.maxSp;
      
      // Gera novos stats mantendo o tipo e raridade
      item.stats = item.generateStats();
      
      return true;
    }
    return false;
  }
}

module.exports = CraftingAltar;
