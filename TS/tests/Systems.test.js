const Entity = require('../src/entities/Entity');
const Item = require('../src/items/Item');

describe('Bestiário e Atributos de Itens', () => {
  let player;

  beforeEach(() => {
    player = new Entity('Newton', { race: 'Humano', background: 'Guerreiro' });
  });

  test('deve registrar abates no bestiário corretamente', () => {
    player.recordKill('Esqueleto de Gauss');
    player.recordKill('Esqueleto de Gauss');
    player.recordKill('Lobo de Turing');

    expect(player.bestiary['Esqueleto de Gauss']).toBe(2);
    expect(player.bestiary['Lobo de Turing']).toBe(1);
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
