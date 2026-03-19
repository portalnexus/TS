const math = require('mathjs');
const chalk = require('chalk');

class Puzzle {
  constructor(type, floor) {
    this.floor = floor;
    this.difficulty = Math.min(10, Math.floor(floor / 2) + 1);
    
    // Pick random type for variety if not specifically requested
    const types = ['MATH', 'EQUATION', 'RIDDLE', 'SEQUENCE', 'BINARY', 'LOGIC_TABLE', 'FORMULA', 'PRIME_CHECK', 'MODULO'];
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
      case 'BINARY':
        this.generateBinary();
        break;
      case 'LOGIC_TABLE':
        this.generateLogicTable();
        break;
      case 'FORMULA':
        this.generateFormula();
        break;
      case 'PRIME_CHECK':
        this.generatePrimeCheck();
        break;
      case 'MODULO':
        this.generateModulo();
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

  generateBinary() {
    const bits = Math.min(6, 3 + Math.floor(this.difficulty / 2));
    const useBinToDec = Math.random() > 0.5;
    if (useBinToDec) {
      const num = Math.floor(Math.random() * (Math.pow(2, bits) - 1)) + 1;
      const binary = num.toString(2);
      this.question = `TURING questiona: Qual o decimal de "${binary}"?`;
      this.answer = num.toString();
      this.hint = 'Dica: Converta o número binário para base 10.';
    } else {
      const max = Math.pow(2, Math.min(bits, 5)) - 1;
      const num = Math.floor(Math.random() * max) + 1;
      this.question = `TURING questiona: Qual o binário de "${num}"?`;
      this.answer = num.toString(2);
      this.hint = 'Dica: Divida por 2 repetidamente e registre os restos.';
    }
  }

  generateLogicTable() {
    const useXor = this.difficulty >= 4;
    const ops = useXor
      ? [{ name: 'AND', fn: (a, b) => a & b }, { name: 'OR', fn: (a, b) => a | b }, { name: 'XOR', fn: (a, b) => a ^ b }]
      : [{ name: 'AND', fn: (a, b) => a & b }, { name: 'OR', fn: (a, b) => a | b }];
    const op = ops[Math.floor(Math.random() * ops.length)];
    const a = Math.floor(Math.random() * 2);
    const b = Math.floor(Math.random() * 2);
    this.question = `Lovelace computa: ${a} ${op.name} ${b} = ?  (Responda 0 ou 1)`;
    this.answer = op.fn(a, b).toString();
    this.hint = `Dica: Operação lógica ${op.name}. AND=1 só se ambos=1. OR=1 se qualquer=1.`;
  }

  generateFormula() {
    const formulas = [
      () => {
        const m = Math.floor(Math.random() * 10) + 1;
        const a = Math.floor(Math.random() * 10) + 1;
        return { q: `Newton exige: F = m×a. Se m=${m} e a=${a}, qual F?`, a: (m * a).toString() };
      },
      () => {
        const r = Math.floor(Math.random() * 5) + 1;
        return { q: `Euler pergunta: Área = π×r². Se r=${r}, qual a área? (use π≈3)`, a: (3 * r * r).toString() };
      },
      () => {
        const v = Math.floor(Math.random() * 8) + 2;
        const t = Math.floor(Math.random() * 5) + 1;
        return { q: `Einstein mede: d = v×t. Se v=${v} e t=${t}, qual d?`, a: (v * t).toString() };
      },
      () => {
        const m = Math.floor(Math.random() * 5) + 1;
        return { q: `Einstein revela: E = m×c². Se c=3 e m=${m}, qual E?`, a: (m * 9).toString() };
      }
    ];
    const f = formulas[Math.floor(Math.random() * formulas.length)]();
    this.question = f.q;
    this.answer = f.a;
    this.hint = 'Dica: Substitua os valores na fórmula e calcule.';
  }

  generatePrimeCheck() {
    const isPrime = n => { if (n < 2) return false; for (let i = 2; i <= Math.sqrt(n); i++) if (n % i === 0) return false; return true; };
    const nextPrime = n => { let i = n + 1; while (!isPrime(i)) i++; return i; };
    const variant = this.difficulty >= 6 ? 'COUNT' : this.difficulty >= 3 ? 'NEXT' : 'IS_PRIME';
    if (variant === 'IS_PRIME') {
      const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];
      const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18];
      const usesPrime = Math.random() > 0.5;
      const n = (usesPrime ? primes : composites)[Math.floor(Math.random() * 10)];
      this.question = `Eratóstenes questiona: ${n} é primo? Responda "sim" ou "nao".`;
      this.answer = usesPrime ? 'sim' : 'nao';
      this.hint = 'Dica: Um primo só é divisível por 1 e por ele mesmo.';
    } else if (variant === 'NEXT') {
      const bases = [10, 20, 30, 40, 50, 60, 70];
      const base = bases[Math.floor(Math.random() * bases.length)];
      this.question = `Riemann pergunta: Qual o primeiro primo maior que ${base}?`;
      this.answer = nextPrime(base).toString();
      this.hint = 'Dica: Teste divisibilidade para cada número acima do dado.';
    } else {
      const limit = 10 + Math.floor(Math.random() * 10);
      const count = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29].filter(p => p <= limit).length;
      this.question = `O Crivo de Eratóstenes: Quantos primos existem de 1 a ${limit}?`;
      this.answer = count.toString();
      this.hint = 'Dica: Liste 2,3,5,7,11... e conte os menores ou iguais ao limite.';
    }
  }

  generateModulo() {
    const a = Math.floor(Math.random() * (15 * this.difficulty)) + 10;
    const b = Math.floor(Math.random() * 9) + 2;
    const result = a % b;
    const templates = [
      `Gauss calcula: ${a} mod ${b} = ?`,
      `O relógio de Gauss: Qual o resto de ${a} ÷ ${b}?`,
      `Aritmética modular: ${a} ≡ ? (mod ${b})`
    ];
    this.question = templates[Math.floor(Math.random() * templates.length)];
    this.answer = result.toString();
    this.hint = `Dica: Divida ${a} por ${b} e pegue o resto inteiro.`;
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
