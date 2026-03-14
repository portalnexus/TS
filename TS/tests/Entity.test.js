const Entity = require('../src/entities/Entity');

describe('Entity Class', () => {
  let player;

  beforeEach(() => {
    // Default: Humano (+2 STR, DEX, INT), Mercenário (+10% Physical Dmg)
    player = new Entity('Test Hero', { strength: 10, dexterity: 10, intelligence: 10 });
  });

  test('should calculate initial stats correctly with Humano race', () => {
    expect(player.name).toBe('Test Hero');
    // Humano bonus: STR 12, DEX 12, INT 12
    expect(player.maxHp).toBe(160); // 100 + (12 * 5)
    expect(player.hp).toBe(160);
    expect(player.maxSp).toBe(74);  // 50 + (12 * 2)
    expect(player.maxMp).toBe(74);  // 50 + (12 * 2)
  });

  test('should gain experience and level up', () => {
    const leveledUp = player.addExperience(100);
    expect(leveledUp).toBe(true);
    expect(player.level).toBe(2);
    expect(player.attributePoints).toBe(3);
    expect(player.proficiencyPoints).toBe(1);
  });

  test('should upgrade attributes correctly starting from Humano base', () => {
    player.addExperience(100); // level 2, +3 points
    player.upgradeAttribute('STR');
    expect(player.strength).toBe(13); // 10 base + 2 race + 1 upgrade
    expect(player.maxHp).toBe(165);
    expect(player.maxSp).toBe(76);
    expect(player.attributePoints).toBe(2);
  });

  test('should take damage correctly and respect defense', () => {
    player.takeDamage(20);
    // HP 160 - 20 = 140
    expect(player.hp).toBe(140);
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
    player.takeDamage(200);
    expect(player.hp).toBe(0);
    expect(player.isDead).toBe(true);
  });

  test('should recover correctly considering Humano max stats', () => {
    player.takeDamage(50); // 160 - 50 = 110
    player.consumeSp(30);  // 74 - 30 = 44
    player.recover(0.1, 0.2, 0.2); // +16 HP, +14.8 -> 14 SP
    expect(player.hp).toBe(126); 
    expect(player.sp).toBe(58);
  });
});
