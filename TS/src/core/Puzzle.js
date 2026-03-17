const math = require('mathjs');
const chalk = require('chalk');

class Puzzle {
  constructor(type, floor) {
    this.floor = floor;
    this.difficulty = Math.min(10, Math.floor(floor / 2) + 1);
    
    // Pick random type for variety if not specifically requested
    const types = ['MATH', 'EQUATION', 'RIDDLE', 'SEQUENCE'];
    this.type = type || types[Math.floor(Math.random() * types.length)];
    
    this.isSolved = false;
    this.question = '';
    this.answer = null;
    this.hint = '';

    this.generate();
  }

  generate() {
    switch (this.type) {
      case 'MATH':
        this.generateMath();
        break;
      case 'EQUATION':
        this.generateEquation();
        break;
      case 'RIDDLE':
        this.generateRiddle();
        break;
      case 'SEQUENCE':
        this.generateSequence();
        break;
      default:
        this.generateMath();
    }
  }

  generateMath() {
    const ops = ['+', '-', '*'];
    const numCount = 2 + Math.floor(this.difficulty / 3);
    let expr = '';

    for (let i = 0; i < numCount; i++) {
      const num = Math.floor(Math.random() * (10 * this.difficulty)) + 1;
      const op = ops[Math.floor(Math.random() * ops.length)];
      expr += i === numCount - 1 ? num : `${num} ${op} `;
    }

    this.question = `Euler exige que voce resolva: ${expr}`;
    this.answer = math.evaluate(expr).toString();
  }

  generateEquation() {
    // ax + b = c => x = (c - b) / a
    const a = Math.floor(Math.random() * 5) + 1;
    const x = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20);
    const c = a * x + b;

    this.question = `Lovelace preve que o valor de X em "${a}x + ${b} = ${c}" e:`;
    this.answer = x.toString();
  }

  generateRiddle() {
    const riddles = [
      { q: "O que é que quanto mais se tira, maior fica?", a: "buraco" },
      { q: "O que é que quanto mais seca, mais molhada fica?", a: "toalha" },
      { q: "O que é que cai em pé e corre deitado?", a: "chuva" },
      { q: "Um terreno retangular tem 40m de perimetro. O comprimento e o triplo da largura. Qual a largura em metros?", a: "5" },
      { q: "Pedro tem o triplo da idade de Lucas. Em 10 anos a soma das idades sera 60. Qual a idade atual de Lucas?", a: "10" },
      { q: "Qual a probabilidade em porcentagem (apenas numero) de acertar uma questao de 4 alternativas apenas chutando?", a: "25" },
      { q: "Um item de 100 reais sofre 20% de desconto e depois 20% de aumento. Qual o preco final em reais?", a: "96" },
      { q: "Se 3 pintores pintam 3 casas em 3 dias, quantos dias 1 pintor leva para pintar 1 casa?", a: "3" },
      { q: "Em uma gaveta ha 6 meias pretas e 6 meias brancas. Qual o numero minimo de meias a retirar para garantir um par da mesma cor?", a: "3" }
    ];
    const picked = riddles[Math.floor(Math.random() * riddles.length)];
    this.question = picked.q;
    this.answer = picked.a;
    this.hint = "Dica: Responda com uma única palavra ou número inteiro.";
  }

  generateSequence() {
    // Gera sequências lógicas com padrão reconhecível
    const sequences = [
      { seq: [1, 1, 2, 3, 5, 8, 13, '?'], a: '21', desc: 'Fibonacci' },
      { seq: [2, 4, 8, 16, 32, '?'], a: '64', desc: 'Potências de 2' },
      { seq: [1, 4, 9, 16, 25, '?'], a: '36', desc: 'Quadrados perfeitos' },
      { seq: [1, 8, 27, 64, '?'], a: '125', desc: 'Cubos' },
      { seq: [2, 3, 5, 7, 11, 13, '?'], a: '17', desc: 'Primos' },
      { seq: [0, 1, 3, 6, 10, 15, '?'], a: '21', desc: 'Triangulares' },
      { seq: [1, 2, 4, 7, 11, 16, '?'], a: '22', desc: '+1,+2,+3,+4,+5,+6' },
      { seq: [3, 6, 12, 24, 48, '?'], a: '96', desc: 'Dobro' },
      { seq: [100, 91, 82, 73, 64, '?'], a: '55', desc: '-9 a cada termo' },
      { seq: [1, 3, 7, 15, 31, '?'], a: '63', desc: '2^n - 1' }
    ];
    const difficulty = Math.min(this.difficulty, sequences.length - 1);
    const pool = sequences.slice(0, Math.max(3, difficulty + 1));
    const picked = pool[Math.floor(Math.random() * pool.length)];
    const display = picked.seq.join(', ');
    this.question = `SEQUÊNCIA [${picked.desc}]: ${display} — Qual é o próximo número?`;
    this.answer = picked.a;
    this.hint = 'Dica: Analise o padrão numérico e responda com um inteiro.';
  }

  checkAnswer(userAnswer) {
    const normalizedUser = userAnswer.toString().toLowerCase().trim();
    const normalizedSystem = this.answer.toString().toLowerCase().trim();

    if (normalizedUser === normalizedSystem) {
      this.isSolved = true;
      return true;
    }
    return false;
  }
}

module.exports = Puzzle;
