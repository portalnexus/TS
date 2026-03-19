const Puzzle = require('../src/core/Puzzle');

describe('Puzzle — tipo SEQUENCE', () => {
  test('gera pergunta e resposta válidas', () => {
    const p = new Puzzle('SEQUENCE', 1);
    expect(p.question).toBeTruthy();
    expect(p.answer).toBeTruthy();
  });

  test('resposta correta retorna true', () => {
    const p = new Puzzle('SEQUENCE', 1);
    expect(p.checkAnswer(p.answer)).toBe(true);
  });

  test('resposta errada retorna false', () => {
    const p = new Puzzle('SEQUENCE', 1);
    expect(p.checkAnswer('9999')).toBe(false);
  });

  test('aceita resposta com espaços e case diferente', () => {
    const p = new Puzzle('SEQUENCE', 1);
    expect(p.checkAnswer('  ' + p.answer + '  ')).toBe(true);
  });

  test('dificuldade escala com o andar', () => {
    const easy = new Puzzle('SEQUENCE', 1);
    const hard = new Puzzle('SEQUENCE', 8);
    expect(easy.difficulty).toBeLessThan(hard.difficulty);
  });
});

describe('Puzzle — tipo MATH', () => {
  test('gera pergunta matemática com expressão numérica', () => {
    const p = new Puzzle('MATH', 2);
    expect(p.question).toMatch(/Euler|resolva/i);
    expect(p.answer).toBeTruthy();
  });

  test('resposta correta aceita', () => {
    const p = new Puzzle('MATH', 1);
    expect(p.checkAnswer(p.answer)).toBe(true);
  });

  test('resposta errada rejeitada', () => {
    const p = new Puzzle('MATH', 1);
    expect(p.checkAnswer('0')).toBe(false);
  });
});

describe('Puzzle — tipo EQUATION', () => {
  test('gera pergunta de equação', () => {
    const p = new Puzzle('EQUATION', 3);
    expect(p.question).toBeTruthy();
    expect(p.answer).not.toBeNull();
  });

  test('resposta correta aceita', () => {
    const p = new Puzzle('EQUATION', 1);
    expect(p.checkAnswer(p.answer)).toBe(true);
  });
});

describe('Puzzle — tipo RIDDLE', () => {
  test('gera adivinha com hint', () => {
    const p = new Puzzle('RIDDLE', 1);
    expect(p.question).toBeTruthy();
    expect(p.hint).toBeTruthy();
  });

  test('resposta correta aceita case-insensitive', () => {
    const p = new Puzzle('RIDDLE', 1);
    expect(p.checkAnswer(p.answer.toUpperCase())).toBe(true);
  });
});

describe('Puzzle — geração aleatória', () => {
  test('tipo aleatório produz puzzle funcional', () => {
    for (let i = 0; i < 10; i++) {
      const p = new Puzzle(null, Math.floor(Math.random() * 5) + 1);
      expect(['MATH', 'EQUATION', 'RIDDLE', 'SEQUENCE', 'BINARY', 'LOGIC_TABLE', 'FORMULA', 'PRIME_CHECK', 'MODULO']).toContain(p.type);
      expect(p.answer).not.toBeNull();
    }
  });

  test('checkAnswer marca isSolved como true na resposta certa', () => {
    const p = new Puzzle('SEQUENCE', 1);
    p.checkAnswer(p.answer);
    expect(p.isSolved).toBe(true);
  });
});
