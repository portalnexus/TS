const math = require('mathjs');
const chalk = require('chalk');

class Puzzle {
  constructor(type, floor) {
    this.type = type; // MATH, EQUATION, RIDDLE, MINESWEEPER
    this.floor = floor;
    this.difficulty = Math.min(10, Math.floor(floor / 2) + 1);
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
      case 'MINESWEEPER':
        this.generateMinesweeper();
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

    this.question = `Resolva a expressão: ${expr}`;
    this.answer = math.evaluate(expr).toString();
  }

  generateEquation() {
    // ax + b = c => x = (c - b) / a
    const a = Math.floor(Math.random() * 5) + 1;
    const x = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 20);
    const c = a * x + b;

    this.question = `Encontre o valor de X em: ${a}x + ${b} = ${c}`;
    this.answer = x.toString();
  }

  generateRiddle() {
    const riddles = [
      { q: "O que é que quanto mais se tira, maior fica?", a: "buraco" },
      { q: "O que tem cidades, mas não casas; montanhas, mas não árvores; e água, mas não peixes?", a: "mapa" },
      { q: "O que é que corre, mas não tem pernas; tem boca, mas não fala; tem leito, mas não dorme?", a: "rio" },
      { q: "O que é que se quebra quando se diz o seu nome?", a: "silencio" }
    ];
    const picked = riddles[Math.floor(Math.random() * riddles.length)];
    this.question = picked.q;
    this.answer = picked.a;
    this.hint = "Dica: Responda com uma única palavra em minúsculo.";
  }

  generateMinesweeper() {
    this.size = 4 + Math.min(2, Math.floor(this.difficulty / 4));
    this.mines = Math.floor(this.size * 1.5);
    this.question = `Campo Minado (${this.size}x${this.size}) - Sobreviva!`;
    this.answer = 'MINESWEEPER_STATE'; // Handled by TUI.js
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
