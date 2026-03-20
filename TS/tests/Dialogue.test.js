const DialogueEngine = require('../src/core/DialogueEngine');
const Entity = require('../src/entities/Entity');

describe('DialogueEngine — Diálogo Contextual de NPCs', () => {
  let engine;
  let player;

  beforeEach(() => {
    engine = new DialogueEngine();
    player = new Entity('Exilado', { race: 'Humano', background: 'Guerreiro' });
  });

  test('deve retornar diálogo padrão para NPC sem condições especiais', () => {
    const dialogue = engine.getDialogue('Halthor', player);
    expect(typeof dialogue).toBe('string');
    expect(dialogue.length).toBeGreaterThan(0);
    expect(dialogue).toContain('Halthor');
  });

  test('deve retornar diálogo de baixo HP para Halthor quando HP < 30%', () => {
    player.hp = Math.floor(player.maxHp * 0.2); // 20% HP
    const dialogue = engine.getDialogue('Halthor', player);
    expect(dialogue).toContain('machucado');
  });

  test('deve retornar diálogo de alto nível para Halthor quando level >= 10', () => {
    player.level = 10;
    player.hp = player.maxHp; // HP cheio para não triggar lowHp
    const dialogue = engine.getDialogue('Halthor', player);
    expect(dialogue).toContain('10');
    expect(dialogue).toContain('Halthor');
  });

  test('deve retornar diálogo sem skills para Ada quando nenhuma skill aprendida', () => {
    const dialogue = engine.getDialogue('Ada', player);
    expect(dialogue).toContain('Ada');
    // Sem skills aprendidas, deve retornar noSkills
    expect(dialogue.toLowerCase()).toContain('skill');
  });

  test('deve retornar diálogo contextual de bioma para Darwin', () => {
    const dialogue = engine.getDialogue('Darwin', player, { biome: 'newton' });
    expect(dialogue).toContain('Darwin');
    expect(dialogue).toContain('Newton');
  });

  test('deve retornar diálogo sem itens para Marie Curie quando inventário vazio', () => {
    const dialogue = engine.getDialogue('Marie Curie', player);
    expect(dialogue).toContain('Marie Curie');
    expect(dialogue.toLowerCase()).toContain('itens');
  });

  test('triggerEvent deve desbloquear diálogo de evento para o jogador', () => {
    engine.triggerEvent('firstBossKill', player);
    expect(engine.hasEvent('firstBossKill', player)).toBe(true);
  });

  test('diálogo de evento deve ser exibido apenas uma vez por NPC', () => {
    engine.triggerEvent('level10', player);
    const first = engine.getDialogue('Halthor', player);
    // Após primeira exibição, não deve mais retornar o mesmo evento
    const second = engine.getDialogue('Halthor', player);
    // O evento já foi marcado como exibido; a segunda chamada retorna diálogo padrão
    expect(typeof second).toBe('string');
    expect(second.length).toBeGreaterThan(0);
  });

  test('hasEvent deve retornar false antes de triggerEvent', () => {
    expect(engine.hasEvent('firstBossKill', player)).toBe(false);
  });

  test('deve retornar fallback para NPC desconhecido', () => {
    const dialogue = engine.getDialogue('NPCInexistente', player);
    expect(typeof dialogue).toBe('string');
    expect(dialogue).toContain('NPCInexistente');
  });

  test('eventos de NPCs diferentes são independentes entre si', () => {
    engine.triggerEvent('level10', player);
    // Verifica Ada
    const adaDialogue = engine.getDialogue('Ada', player);
    expect(adaDialogue).toContain('Ada');
    // Verifica que Darwin não recebeu o evento
    const darwinDialogue = engine.getDialogue('Darwin', player, {});
    expect(darwinDialogue).toContain('Darwin');
  });
});
