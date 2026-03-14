const Entity = require('../src/entities/Entity');

describe('Entity Class', () => {
  let player;

  beforeEach(() => {
    // Default: Humano (+2 STR, DEX, INT), Guerreiro (+10% Physical Dmg)
    player = new Entity('Test Hero', { strength: 10, dexterity: 10, intelligence: 10 });
  });

  test('should calculate initial stats correctly with Humano race and v0.9.6 balance', () => {
    expect(player.name).toBe('Test Hero');
    // Humano bonus: STR 12, DEX 12, INT 12
    // v0.9.6: HP per STR = 8
    expect(player.maxHp).toBe(196); // 100 + (12 * 8)
    expect(player.hp).toBe(196);
    expect(player.maxSp).toBe(74);  // 50 + (12 * 2)
    expect(player.maxMp).toBe(74);  // 50 + (12 * 2)
  });

  test('should gain experience and level up', () => {
    const leveledUp = player.addExperience(100);
    expect(leveledUp).toBe(true);
    expect(player.level).toBe(2);
    expect(player.attributePoints).toBe(3);
    expect(player.proficiencyPoints).toBe(1);
    expect(player.skillPoints).toBe(1);
  });

  test('should upgrade attributes correctly starting from Humano base', () => {
    player.addExperience(100); // level 2, +3 points
    player.upgradeAttribute('STR');
    expect(player.strength).toBe(13); // 10 base + 2 race + 1 upgrade
    expect(player.maxHp).toBe(204); // 196 + 8
    expect(player.maxSp).toBe(76);
    expect(player.attributePoints).toBe(2);
  });

  test('should take damage correctly and respect defense', () => {
    player.takeDamage(20);
    // HP 196 - 20 = 176
    expect(player.hp).toBe(176);
  });

  test('should become exhausted when SP or MP reaches 0', () => {
    player.consumeSp(100);
    expect(player.sp).toBe(0);
    expect(player.exhaustionPhysical).toBe(true);

    player.consumeMp(100);
    expect(player.mp).toBe(0);
    expect(player.exhaustionMagical).toBe(true);
  });

  test('should die when HP reaches 0', () => {
    player.takeDamage(300);
    expect(player.hp).toBe(0);
    expect(player.isDead).toBe(true);
  });

  test('should recover correctly considering Humano max stats', () => {
    player.takeDamage(50); // 196 - 50 = 146
    player.consumeSp(30);  // 74 - 30 = 44
    player.recover(0.1, 0.2, 0.2); // +19.6 HP, +14.8 SP
    expect(player.hp).toBe(165); // 146 + 19
    expect(player.sp).toBe(58);  // 44 + 14
  });
});
