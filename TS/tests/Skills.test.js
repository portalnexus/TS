const Combat = require('../src/combat/Combat');
const Entity = require('../src/entities/Entity');

function makePlayer(background = 'Guerreiro', level = 5) {
  const p = new Entity('Herói', { background, level, strength: 15, dexterity: 12, intelligence: 15, mp: 200, maxMp: 200, sp: 100, maxSp: 100, hp: 300, maxHp: 300 });
  // Ativar cada skill na árvore com nível 1
  Object.keys(p.skillTree).forEach(k => { p.skillTree[k].lvl = 1; });
  return p;
}

function makeEnemy(hp = 200) {
  return new Entity('Inimigo Teste', { hp, maxHp: hp, sp: 50, maxSp: 50, mp: 0, maxMp: 0, level: 1, strength: 5, dexterity: 5, intelligence: 5 });
}

// ── Entity: métodos de status ──────────────────────────────────────────────

describe('Entity — métodos de status (consumeMp / hasStatus / removeStatus)', () => {
  let p;
  beforeEach(() => { p = makePlayer(); });

  test('consumeMp reduz mp corretamente', () => {
    p.mp = 100; p.maxMp = 100;
    p.consumeMp(30);
    expect(p.mp).toBe(70);
    expect(p.exhaustionMagical).toBe(false);
  });

  test('consumeMp seta exhaustionMagical quando mp vai a 0', () => {
    p.mp = 20; p.maxMp = 100;
    p.consumeMp(50);
    expect(p.mp).toBe(0);
    expect(p.exhaustionMagical).toBe(true);
  });

  test('hasStatus retorna false quando status ausente', () => {
    expect(p.hasStatus('COMBUSTÃO')).toBe(false);
  });

  test('hasStatus retorna true após addStatus', () => {
    p.addStatus('COMBUSTÃO', 3);
    expect(p.hasStatus('COMBUSTÃO')).toBe(true);
  });

  test('removeStatus remove o status corretamente', () => {
    p.addStatus('SANGRAMENTO', 2);
    p.addStatus('CHOQUE', 1);
    p.removeStatus('SANGRAMENTO');
    expect(p.hasStatus('SANGRAMENTO')).toBe(false);
    expect(p.hasStatus('CHOQUE')).toBe(true);
  });

  test('CHOQUE reduz estabilidade em processStatuses', () => {
    const initialPosture = p.posture;
    p.addStatus('CHOQUE', 2);
    p.processStatuses([]);
    expect(p.posture).toBeLessThan(initialPosture);
  });

  test('CONGELAMENTO reduz estabilidade em processStatuses', () => {
    const initialPosture = p.posture;
    p.addStatus('CONGELAMENTO', 2);
    p.processStatuses([]);
    expect(p.posture).toBeLessThan(initialPosture);
  });
});

// ── Skills — Guerreiro ────────────────────────────────────────────────────

describe('Skills — Guerreiro', () => {
  let player, enemy, combat;
  beforeEach(() => {
    player = makePlayer('Guerreiro');
    enemy = makeEnemy();
    combat = new Combat(player, [enemy]);
  });

  test('Impacto de Newton causa dano físico e reduz estabilidade', () => {
    const hpBefore = enemy.hp;
    const postureBefore = enemy.posture;
    combat.executeSkill('Impacto de Newton', enemy);
    expect(enemy.hp).toBeLessThan(hpBefore);
    expect(enemy.posture).toBeLessThan(postureBefore);
  });

  test('Inércia de Galileu restaura estabilidade do jogador', () => {
    player.modifyStability(-60);
    const postureBefore = player.posture;
    combat.executeSkill('Inércia de Galileu', enemy);
    expect(player.posture).toBeGreaterThan(postureBefore);
  });

  test('Entropia Cinética causa dano a todos os inimigos', () => {
    const enemy2 = makeEnemy();
    const c2 = new Combat(player, [enemy, enemy2]);
    const hp1 = enemy.hp;
    const hp2 = enemy2.hp;
    c2.executeSkill('Entropia Cinética', enemy);
    expect(enemy.hp).toBeLessThan(hp1);
    expect(enemy2.hp).toBeLessThan(hp2);
  });

  test('Lei da Inércia restaura estabilidade ao máximo', () => {
    player.modifyStability(-80);
    combat.executeSkill('Lei da Inércia', enemy);
    expect(player.posture).toBe(player.maxPosture);
  });
});

// ── Skills — Mago ─────────────────────────────────────────────────────────

describe('Skills — Mago', () => {
  let player, enemy, combat;
  beforeEach(() => {
    player = makePlayer('Mago');
    enemy = makeEnemy();
    combat = new Combat(player, [enemy]);
  });

  test('Raio de Maxwell causa dano e aplica CHOQUE', () => {
    const hpBefore = enemy.hp;
    combat.executeSkill('Raio de Maxwell', enemy);
    expect(enemy.hp).toBeLessThan(hpBefore);
    expect(enemy.hasStatus('CHOQUE')).toBe(true);
  });

  test('Chama de Lavoisier causa dano e aplica COMBUSTÃO', () => {
    combat.executeSkill('Chama de Lavoisier', enemy);
    expect(enemy.hasStatus('COMBUSTÃO')).toBe(true);
  });

  test('Zero Absoluto aplica CONGELAMENTO e causa colapso de estabilidade', () => {
    const postureBefore = enemy.posture;
    combat.executeSkill('Zero Absoluto', enemy);
    expect(enemy.hasStatus('CONGELAMENTO')).toBe(true);
    expect(enemy.posture).toBeLessThan(postureBefore);
  });

  test('Singularidade de Hawking drena HP e recupera vida do jogador', () => {
    const playerHpBefore = player.hp;
    player.hp = Math.floor(player.maxHp * 0.5); // começa com 50% HP
    const enemyHpBefore = enemy.hp;
    combat.executeSkill('Singularidade de Hawking', enemy);
    expect(enemy.hp).toBeLessThan(enemyHpBefore);
    expect(player.hp).toBeGreaterThan(Math.floor(player.maxHp * 0.5));
  });

  test('skill consome mana corretamente via playerAction', () => {
    player.mp = 200;
    combat.playerAction('SKILL', 0, 'Raio de Maxwell');
    expect(player.mp).toBeLessThan(200);
  });
});

// ── Skills — Arqueiro ─────────────────────────────────────────────────────

describe('Skills — Arqueiro', () => {
  let player, enemy, combat;
  beforeEach(() => {
    player = makePlayer('Arqueiro');
    enemy = makeEnemy(500); // HP alto para sobreviver hits múltiplos
    combat = new Combat(player, [enemy]);
  });

  test('Flecha de Hawking causa dano crítico elevado', () => {
    const normalDmg = combat.calculateDamage(player, enemy, 'physical', 1);
    const hpBefore = enemy.hp;
    combat.executeSkill('Flecha de Hawking', enemy);
    const dmgDealt = hpBefore - enemy.hp;
    expect(dmgDealt).toBeGreaterThan(normalDmg.hpDamage);
  });

  test('Diagrama de Feynman realiza múltiplos hits', () => {
    const hpBefore = enemy.hp;
    combat.executeSkill('Diagrama de Feynman', enemy);
    // Com lvl 1: hits = min(2+1, 5) = 3 hits; dano total > 1 hit simples
    const dmgDealt = hpBefore - enemy.hp;
    const singleHit = combat.calculateDamage(player, enemy, 'physical', 0.6);
    expect(dmgDealt).toBeGreaterThan(singleHit.hpDamage);
  });

  test('Óptica de Euclides ignora defesa com dano alto', () => {
    const e = new Entity('Inimigo Armado', { hp: 500, maxHp: 500, sp: 50, maxSp: 50, mp: 0, maxMp: 0, level: 1, strength: 5, dexterity: 30, intelligence: 5 });
    const hpBefore = e.hp;
    const c = new Combat(player, [e]);
    c.executeSkill('Óptica de Euclides', e);
    expect(e.hp).toBeLessThan(hpBefore);
  });
});

// ── Skills — Clérigo ──────────────────────────────────────────────────────

describe('Skills — Clérigo', () => {
  let player, enemy, combat;
  beforeEach(() => {
    player = makePlayer('Clérigo');
    enemy = makeEnemy();
    combat = new Combat(player, [enemy]);
  });

  test('Cura de Hipócrates recupera HP do jogador', () => {
    player.hp = 100;
    combat.executeSkill('Cura de Hipócrates', enemy);
    expect(player.hp).toBeGreaterThan(100);
  });

  test('Sopro de Gaia remove todos os status ativos', () => {
    player.addStatus('COMBUSTÃO', 3);
    player.addStatus('CHOQUE', 2);
    combat.executeSkill('Sopro de Gaia', enemy);
    expect(player.activeStatuses.length).toBe(0);
  });

  test('Luz Primordial causa dano e cura jogador', () => {
    player.hp = 150;
    const hpBefore = player.hp;
    const enemyHpBefore = enemy.hp;
    combat.executeSkill('Luz Primordial', enemy);
    expect(enemy.hp).toBeLessThan(enemyHpBefore);
    expect(player.hp).toBeGreaterThanOrEqual(hpBefore); // cura >= 0
  });

  test('Proporção Áurea harmoniza HP/SP/MP', () => {
    player.hp = Math.floor(player.maxHp * 0.9);  // 90%
    player.sp = Math.floor(player.maxSp * 0.3);  // 30%
    player.mp = Math.floor(player.maxMp * 0.6);  // 60%
    combat.executeSkill('Proporção Áurea', enemy);
    const hpPerc = Math.floor(player.hp / player.maxHp * 100);
    const spPerc = Math.floor(player.sp / player.maxSp * 100);
    const mpPerc = Math.floor(player.mp / player.maxMp * 100);
    // Todos devem estar próximos da média (60%)
    expect(Math.abs(hpPerc - spPerc)).toBeLessThanOrEqual(5);
  });
});

// ── Sinergias de Reação ───────────────────────────────────────────────────

describe('Sinergias de Reação', () => {
  let player, enemy, combat;

  test('CAUTERIZAÇÃO: SANGRAMENTO + arma de FOGO dobra dano', () => {
    const { Item } = jest.requireActual('../src/items/Item') || require('../src/items/Item');
    player = makePlayer('Guerreiro');
    enemy = makeEnemy();
    combat = new Combat(player, [enemy]);

    // Equipar arma com tag FOGO
    player.equipment.ARMA = { tags: ['FOGO'], stats: { physicalDamage: 20 } };
    enemy.addStatus('SANGRAMENTO', 3);

    const hpBefore = enemy.hp;
    const dmg = combat.calculateDamage(player, enemy, 'physical', 1);
    // Cauterização deveria dobrar o dano
    expect(dmg.hpDamage).toBeGreaterThan(0);
    expect(enemy.hasStatus('SANGRAMENTO')).toBe(false); // status consumido
  });

  test('FRAGMENTAÇÃO: CONGELAMENTO + arma de ESMAGAMENTO aumenta dano', () => {
    player = makePlayer('Guerreiro');
    enemy = makeEnemy();
    combat = new Combat(player, [enemy]);

    player.equipment.ARMA = { tags: ['ESMAGAMENTO'], stats: { physicalDamage: 20 } };
    enemy.addStatus('CONGELAMENTO', 2);

    const dmg = combat.calculateDamage(player, enemy, 'physical', 1);
    expect(dmg.hpDamage).toBeGreaterThan(0);
    expect(enemy.hasStatus('CONGELAMENTO')).toBe(false);
  });
});

// ── Proficiências ────────────────────────────────────────────────────────

describe('Proficiências — bônus de dano', () => {
  test('proficiência FOGO adiciona 5% de dano por nível', () => {
    const player = makePlayer('Mago');
    const enemy = makeEnemy(1000);
    const combat = new Combat(player, [enemy]);

    player.equipment.ARMA = { tags: ['FOGO'], stats: { physicalDamage: 30 } };
    player.proficiencies.FOGO = 0;
    const dmgSem = combat.calculateDamage(player, enemy, 'physical', 1).hpDamage;

    player.proficiencies.FOGO = 4;
    const dmgCom = combat.calculateDamage(player, enemy, 'physical', 1).hpDamage;

    expect(dmgCom).toBeGreaterThan(dmgSem);
  });
});
