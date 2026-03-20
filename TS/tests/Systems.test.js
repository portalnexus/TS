const Entity = require('../src/entities/Entity');
const Item = require('../src/items/Item');

describe('Bestiário e Atributos de Itens', () => {
  let player;

  beforeEach(() => {
    player = new Entity('Newton', { race: 'Humano', background: 'Guerreiro' });
  });

  test('deve registrar abates no bestiário corretamente', () => {
    player.recordKill('Esqueleto de Gauss', 1);
    player.recordKill('Esqueleto de Gauss', 1);
    player.recordKill('Lobo de Turing', 2);

    expect(player.bestiary['Esqueleto de Gauss'].kills).toBe(2);
    expect(player.bestiary['Lobo de Turing'].kills).toBe(1);
  });

  test('deve popular dados de lore do bestiário na primeira entrada', () => {
    player.recordKill('Lobo de Turing', 3);
    const entry = player.bestiary['Lobo de Turing'];
    expect(entry).toHaveProperty('description');
    expect(entry).toHaveProperty('weaknesses');
    expect(entry).toHaveProperty('drops');
    expect(entry).toHaveProperty('firstSeenFloor', 3);
    expect(entry).toHaveProperty('raridade');
  });

  test('itens devem conceder atributos extras ao serem equipados', () => {
    const initialStr = player.strength;
    const magicSword = new Item(1, 'MÁGICO');
    magicSword.type = 'ARMA';
    magicSword.stats = { physicalDamage: 10, strength: 5 };

    player.equipItem(magicSword);
    
    expect(player.strength).toBe(initialStr + 5);
    expect(player.equipment.ARMA.name).toBe(magicSword.name);
  });

  test('deve remover bônus de atributos ao desequipar item', () => {
    const initialStr = player.strength;
    const magicSword = new Item(1, 'MÁGICO');
    magicSword.type = 'ARMA';
    magicSword.stats = { strength: 5 };

    player.equipItem(magicSword);
    expect(player.strength).toBe(initialStr + 5);

    // Equipar outro item por cima (ou simular desequipar)
    const commonSword = new Item(1, 'COMUM');
    commonSword.type = 'ARMA';
    commonSword.stats = { physicalDamage: 5 };
    
    player.equipItem(commonSword);
    expect(player.strength).toBe(initialStr); // Voltou ao normal
  });
});
