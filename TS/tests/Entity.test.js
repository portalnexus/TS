const Entity = require('../src/entities/Entity');

describe('Entity Class', () => {
  let player;

  beforeEach(() => {
    player = new Entity('Test Hero', { strength: 10, dexterity: 10, intelligence: 10 });
  });

  test('should calculate initial stats correctly with Humano race and v0.9.6 balance', () => {
    expect(player.name).toBe('Test Hero');
    expect(player.maxHp).toBe(196); // 100 + (12 * 8)
    expect(player.hp).toBe(196);
  });

  test('should gain experience and level up', () => {
    const leveledUp = player.addExperience(100);
    expect(leveledUp).toBe(true);
    expect(player.level).toBe(2);
    expect(player.skillPoints).toBe(1);
  });

  test('should upgrade attributes correctly', () => {
    player.addExperience(100);
    player.upgradeAttribute('STR');
    expect(player.strength).toBe(13); // 10+2+1
    expect(player.maxHp).toBe(204); // 196+8
  });

  test('should recover stability correctly', () => {
    // Initial posture is 100. maxPosture is 100 + 12*5 = 160.
    player.modifyStability(-50);
    expect(player.posture).toBe(50); 
    player.recover();
    expect(player.posture).toBe(80); // 50 + 30
  });

  test('should become staggered at 0 stability', () => {
    player.modifyStability(-100);
    expect(player.posture).toBe(0);
    expect(player.isStaggered).toBe(true);
  });
});
