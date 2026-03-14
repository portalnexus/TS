const Combat = require('../src/combat/Combat');
const Entity = require('../src/entities/Entity');

describe('Combat System', () => {
  let player;
  let enemy;
  let combat;

  beforeEach(() => {
    // Humano (STR 12), Mercenário (+10% Physical Dmg)
    player = new Entity('Player', { strength: 10, dexterity: 10, intelligence: 10 });
    enemy = new Entity('Slime', { strength: 5, dexterity: 5, intelligence: 5, level: 1 });
    combat = new Combat(player, [enemy]);
  });

  test('should initialize combat correctly', () => {
    expect(combat.enemies.length).toBe(1);
    expect(combat.turn).toBe(1);
    expect(combat.isOver).toBe(false);
  });

  test('should calculate damage correctly based on posture and Mercenary background', () => {
    player.setPostureMode('ATTACK');
    const dmg = combat.calculateDamage(player, enemy);
    // Base power = (1 * 2) + (12 * 1.5) = 2 + 18 = 20
    // Attack mode = 20 * 1.5 = 30.
    // Mercenário bonus = 30 * 1.1 = 33 (min damage).
    expect(dmg.hpDamage).toBeGreaterThanOrEqual(33);
    expect(dmg.hpDamage).toBeLessThanOrEqual(42); // 33 + random roll * posture * mercenary
  });

  test('should break posture and stagger target', () => {
    enemy.maxPosture = 20;
    enemy.posture = 15;
    const dmg = combat.calculateDamage(player, enemy);
    enemy.addPostureDamage(dmg.postureDamage);
    expect(enemy.isStaggered).toBe(true);
  });

  test('should end combat with WIN when all enemies are dead', () => {
    enemy.hp = 10;
    player.setPostureMode('ATTACK');
    combat.playerAction('ATTACK', 0);
    expect(enemy.isDead).toBe(true);
    expect(combat.isOver).toBe(true);
    expect(combat.result).toBe('WIN');
  });
});
