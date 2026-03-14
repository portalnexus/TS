const Item = require('./Item');
const chalk = require('chalk');

class Blacksmith {
  constructor(floor = 1) {
    this.name = 'Halthor, o Ferreiro';
    this.stock = this.generateStock(floor);
  }

  generateStock(floor) {
    const stock = [];
    // 3 itens comuns/mágicos garantidos
    for (let i = 0; i < 3; i++) stock.push(new Item(floor));
    // 1 item raro ou lendário raro
    stock.push(new Item(floor + 1, Math.random() > 0.9 ? 'LENDÁRIO' : 'RARO'));
    return stock;
  }

  getMenuOptions() {
    const options = this.stock.map((item, idx) => {
      const price = item.getPrice();
      return ` [COMPRAR] ${item.getColorizedName()} - ${chalk.yellow(price + ' Orbes')}`;
    });
    options.push(' [VENDER] Vender itens do inventário (40% do valor)');
    options.push(' [ESC] Sair da loja');
    return options;
  }

  buyItem(player, index) {
    const item = this.stock[index];
    if (!item) return false;
    
    const price = item.getPrice();
    if (player.orbs >= price) {
      player.orbs -= price;
      player.inventory.push(item);
      this.stock.splice(index, 1); // Remove do estoque
      return true;
    }
    return false;
  }

  sellItem(player, itemIndex) {
    const item = player.inventory[itemIndex];
    if (!item) return false;

    const sellValue = Math.floor(item.getPrice() * 0.4);
    player.orbs += sellValue;
    player.inventory.splice(itemIndex, 1);
    return sellValue;
  }
}

module.exports = Blacksmith;
