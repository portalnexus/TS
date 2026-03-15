const Combat = require('../src/combat/Combat');
const Entity = require('../src/entities/Entity');

describe('Combat System', () => {
  let player;
  let enemy;
  let combat;

  beforeEach(() => {
    player = new Entity('Player', { strength: 10, dexterity: 10, intelligence: 10 });
    enemy = new Entity('Slime', { strength: 5, dexterity: 5, intelligence: 5, level: 1 });
    combat = new Combat(player, [enemy]);
  });

  test('should calculate damage correctly based on level and scale', () => {
    player.setPostureMode('MOMENTO');
    const dmg = combat.calculateDamage(player, enemy);
    // Base power = (1 * 2) + (12 * 1.5) = 20
    // Momento = 20 * 1.5 = 30.
    // Class Guerreiro = 30 * 1.1 = 33.
    expect(dmg.hpDamage).toBeGreaterThanOrEqual(33);
  });

  test('should break stability and colapse target', () => {
    enemy.modifyStability(-100);
    expect(enemy.isStaggered).toBe(true);
  });

  test('should end combat with WIN when all enemies are dead', () => {
    enemy.hp = 1;
    combat.playerAction('ATTACK', 0);
    expect(enemy.isDead).toBe(true);
    expect(combat.isOver).toBe(true);
    expect(combat.result).toBe('WIN');
  });
});
