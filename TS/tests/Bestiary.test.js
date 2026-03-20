const Entity = require('../src/entities/Entity');
const { getEnemyData, isBoss, BESTIARY_DATA } = require('../src/core/BestiaryData');

describe('Bestiário Expandido — Sprint 5', () => {
  let player;

  beforeEach(() => {
    player = new Entity('Exilado', { race: 'Humano', background: 'Guerreiro' });
  });

  // --- BestiaryData ---

  test('getEnemyData deve retornar dados para inimigos conhecidos', () => {
    const data = getEnemyData('Lobo de Turing');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('weaknesses');
    expect(Array.isArray(data.weaknesses)).toBe(true);
    expect(data).toHaveProperty('drops');
    expect(data).toHaveProperty('raridade');
  });

  test('getEnemyData deve retornar dados genéricos para inimigos desconhecidos', () => {
    const data = getEnemyData('Criatura Inexistente');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('raridade', 'COMUM');
  });

  test('isBoss deve identificar bosses corretamente', () => {
    expect(isBoss('CHEFE: Isaac Newton Corrompido')).toBe(true);
    expect(isBoss('SENHOR DA ASCENSÃO — Andar 10')).toBe(true);
    expect(isBoss('ARQUITETO do Andar 5')).toBe(true);
    expect(isBoss('Lobo de Turing')).toBe(false);
    expect(isBoss('Eco de Radiação')).toBe(false);
  });

  test('BESTIARY_DATA deve ter 6 biomas com pelo menos 4 inimigos cada', () => {
    const biomes = { newton: 0, hawking: 0, turing: 0, noether: 0, euler: 0, lovelace: 0 };
    const biomeKeywords = {
      newton:   ['Prisma Refrator', 'Corpo Gravitacional', 'Arco Espectral', 'Força Centrífuga'],
      hawking:  ['Eco de Radiação', 'Singularidade Menor', 'Horizonte de Eventos', 'Pulsar Binário'],
      turing:   ['Lobo de Turing', 'Autômato de Pascal', 'Bomba de Colapso', 'Daemon Binário'],
      noether:  ['Espectro de Noether', 'Vazio Simétrico', 'Sombra da Simetria', 'Tensor de Tensão'],
      euler:    ['Espiral de Fibonacci', 'Constante de Euler', 'Polígono de Gauss', 'Somatório Infinito'],
      lovelace: ['Loop Infinito', 'Exceção de Pilha', 'Ponteiro Nulo', 'Daemon de Lovelace']
    };
    for (const [biome, enemies] of Object.entries(biomeKeywords)) {
      for (const enemy of enemies) {
        expect(BESTIARY_DATA).toHaveProperty(enemy);
      }
    }
  });

  // --- Entity.recordKill (formato expandido) ---

  test('recordKill deve criar entrada com estrutura expandida', () => {
    player.recordKill('Lobo de Turing', 3);
    const entry = player.bestiary['Lobo de Turing'];
    expect(entry).toEqual(expect.objectContaining({
      kills: 1,
      firstSeenFloor: 3,
      raridade: expect.any(String),
      description: expect.any(String),
      weaknesses: expect.any(Array),
      drops: expect.any(Array)
    }));
  });

  test('recordKill deve incrementar kills em entradas existentes', () => {
    player.recordKill('Prisma Refrator', 1);
    player.recordKill('Prisma Refrator', 2);
    player.recordKill('Prisma Refrator', 3);
    expect(player.bestiary['Prisma Refrator'].kills).toBe(3);
    // firstSeenFloor não deve mudar após primeira entrada
    expect(player.bestiary['Prisma Refrator'].firstSeenFloor).toBe(1);
  });

  test('recordKill deve identificar raridade de bosses como RARO', () => {
    player.recordKill('CHEFE: Isaac Newton Corrompido', 10);
    expect(player.bestiary['CHEFE: Isaac Newton Corrompido'].raridade).toBe('RARO');
  });

  // --- calculatePrestige com bestiário expandido ---

  test('calculatePrestige deve dar +10 por criatura única catalogada', () => {
    const prestigeBefore = player.calculatePrestige();
    player.recordKill('Lobo de Turing', 1);
    const prestigeAfter = player.calculatePrestige();
    // +10 pela criatura única + 2 pelo kill = +12
    expect(prestigeAfter).toBe(prestigeBefore + 12);
  });

  test('calculatePrestige deve dar +50 adicional por boss (+40 + 10 base)', () => {
    const prestigeBefore = player.calculatePrestige();
    player.recordKill('CHEFE: Isaac Newton Corrompido', 10);
    const prestigeAfter = player.calculatePrestige();
    // +10 criatura única + 40 boss + 2 kill = +52
    expect(prestigeAfter).toBe(prestigeBefore + 52);
  });

  test('calculatePrestige deve acumular +2 por kill adicional', () => {
    player.recordKill('Lobo de Turing', 1);
    const prestigeAfterFirst = player.calculatePrestige();
    player.recordKill('Lobo de Turing', 1);
    const prestigeAfterSecond = player.calculatePrestige();
    expect(prestigeAfterSecond - prestigeAfterFirst).toBe(2);
  });

  // --- Migração de formato legado ---

  test('_migrateBestiary deve converter formato antigo (número) para novo (objeto)', () => {
    const playerWithOldSave = new Entity('Antigo', {
      bestiary: { 'Lobo de Turing': 5, 'Eco de Radiação': 3 }
    });
    expect(playerWithOldSave.bestiary['Lobo de Turing'].kills).toBe(5);
    expect(playerWithOldSave.bestiary['Eco de Radiação'].kills).toBe(3);
    expect(playerWithOldSave.bestiary['Lobo de Turing']).toHaveProperty('description');
  });
});
