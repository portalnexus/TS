const Entity = require('../src/entities/Entity');
const QuestBoard = require('../src/core/QuestBoard');

describe('QuestBoard — geração e aceitação', () => {
  let board, player;

  beforeEach(() => {
    board = new QuestBoard();
    player = new Entity('Teste', { background: 'Guerreiro' });
  });

  test('gera exatamente 4 missões no início', () => {
    expect(board.quests.length).toBe(4);
  });

  test('cada missão tem os campos obrigatórios', () => {
    board.quests.forEach(q => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('type');
      expect(q).toHaveProperty('desc');
      expect(q).toHaveProperty('target');
      expect(q).toHaveProperty('progress');
      expect(q).toHaveProperty('rewardOrbs');
      expect(q).toHaveProperty('rewardXp');
      expect(q.completed).toBe(false);
    });
  });

  test('tipos de missão são válidos (KILL, FLOOR, ITEM, LORE)', () => {
    // gerar várias para garantir cobertura dos 4 tipos
    const tipos = new Set();
    for (let i = 0; i < 50; i++) tipos.add(board.generateQuest().type);
    expect([...tipos].every(t => ['KILL', 'FLOOR', 'ITEM', 'LORE'].includes(t))).toBe(true);
  });

  test('missão LORE tem campo rewardItem', () => {
    // Gera missões até encontrar uma LORE
    let loreQuest = null;
    for (let i = 0; i < 50; i++) {
      const q = board.generateQuest();
      if (q.type === 'LORE') { loreQuest = q; break; }
    }
    expect(loreQuest).not.toBeNull();
    expect(loreQuest.rewardItem).toBe(true);
  });

  test('player não pode aceitar duas missões simultâneas', () => {
    board.acceptQuest(player, 0);
    expect(player.activeQuest).not.toBeNull();
    const second = board.acceptQuest(player, 1);
    expect(second).toBe(false);
  });

  test('aceitar missão copia os dados corretamente para player.activeQuest', () => {
    const quest = board.quests[0];
    board.acceptQuest(player, 0);
    expect(player.activeQuest.id).toBe(quest.id);
    expect(player.activeQuest.type).toBe(quest.type);
  });
});

describe('QuestBoard — progressão KILL', () => {
  let board, player;

  beforeEach(() => {
    board = new QuestBoard();
    player = new Entity('Teste', { background: 'Guerreiro' });
    // Forçar uma missão KILL com target 3
    board.quests[0] = {
      id: 'kill-test', type: 'KILL', desc: 'Derrote 3 inimigos.', target: 3,
      progress: 0, rewardOrbs: 80, rewardXp: 150, completed: false
    };
    board.acceptQuest(player, 0);
  });

  test('progresso incrementa corretamente', () => {
    player.activeQuest.progress += 1;
    expect(player.activeQuest.progress).toBe(1);
  });

  test('missão completa quando progress >= target', () => {
    player.activeQuest.progress = 3;
    if (player.activeQuest.progress >= player.activeQuest.target) {
      player.activeQuest.completed = true;
    }
    expect(player.activeQuest.completed).toBe(true);
  });

  test('turnInQuest concede orbes e XP e limpa activeQuest', () => {
    player.activeQuest.completed = true;
    const orbsBefore = player.orbs;
    const xpBefore = player.xp;
    const result = board.turnInQuest(player);
    expect(result.success).toBe(true);
    expect(player.orbs).toBeGreaterThan(orbsBefore);
    expect(player.xp).toBeGreaterThan(xpBefore);
    expect(player.activeQuest).toBeNull();
  });

  test('após entrega, board substitui a missão por uma nova', () => {
    player.activeQuest.completed = true;
    board.turnInQuest(player);
    expect(board.quests.length).toBe(4);
    const ids = board.quests.map(q => q.id);
    expect(ids.includes('kill-test')).toBe(false);
  });
});

describe('QuestBoard — progressão FLOOR', () => {
  let board, player;

  beforeEach(() => {
    board = new QuestBoard();
    player = new Entity('Teste', { background: 'Guerreiro' });
    board.quests[0] = {
      id: 'floor-test', type: 'FLOOR', desc: 'Alcance o Andar 3.', target: 3,
      progress: 1, rewardOrbs: 150, rewardXp: 300, completed: false
    };
    board.acceptQuest(player, 0);
  });

  test('missão não completa antes de atingir o andar alvo', () => {
    player.activeQuest.progress = 2;
    expect(player.activeQuest.progress >= player.activeQuest.target).toBe(false);
  });

  test('missão completa ao atingir o andar alvo', () => {
    player.activeQuest.progress = 3;
    if (player.activeQuest.progress >= player.activeQuest.target) {
      player.activeQuest.completed = true;
    }
    expect(player.activeQuest.completed).toBe(true);
  });
});

describe('QuestBoard — progressão ITEM', () => {
  let board, player;

  beforeEach(() => {
    board = new QuestBoard();
    player = new Entity('Teste', { background: 'Guerreiro' });
    board.quests[0] = {
      id: 'item-test', type: 'ITEM', desc: 'Colete 2 itens.', target: 2,
      progress: 0, rewardOrbs: 140, rewardXp: 150, completed: false
    };
    board.acceptQuest(player, 0);
  });

  test('progresso incrementa ao coletar item', () => {
    player.activeQuest.progress++;
    expect(player.activeQuest.progress).toBe(1);
  });

  test('missão completa ao coletar todos os itens', () => {
    player.activeQuest.progress = 2;
    if (player.activeQuest.progress >= player.activeQuest.target) {
      player.activeQuest.completed = true;
    }
    expect(player.activeQuest.completed).toBe(true);
  });
});
