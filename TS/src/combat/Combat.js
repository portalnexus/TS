const chalk = require('chalk');

class Combat {
  constructor(player, enemies) {
    this.player = player;
    this.enemies = enemies.filter(e => !e.isDead);
    this.turn = 1;
    this.log = [];
    this.isOver = false;
    this.result = null; // 'WIN', 'LOSS', 'FLED'
  }

  addLog(msg) {
    this.log.push(msg);
    if (this.log.length > 10) this.log.shift();
  }

  // Lógica de cálculo de dano baseada em Postura e Status
  calculateDamage(attacker, target, moveType = 'physical') {
    let baseDamage = attacker.getAttackPower() + Math.floor(Math.random() * 5);
    let postureDamage = 10;

    // Redução por defesa do alvo
    if (moveType === 'physical') {
      baseDamage = Math.max(1, baseDamage - target.getDefense());
    }

    // Modificadores de Postura do Atacante
    if (attacker.postureMode === 'ATTACK') {
      baseDamage *= 1.5;
      postureDamage *= 1.2;
    } else if (attacker.postureMode === 'DEFENCE') {
      baseDamage *= 0.7;
    }

    // Modificadores de Postura do Alvo
    if (target.postureMode === 'DEFENCE') {
      baseDamage *= 0.5;
      postureDamage *= 0.5;
    } else if (target.postureMode === 'ATTACK') {
      baseDamage *= 1.2;
    }

    // Bônus contra Stagger (Crítico garantido)
    if (target.isStaggered) {
      baseDamage *= 2;
      this.addLog(chalk.bold.yellow(` ! CRÍTICO: ${target.name} está vulnerável!`));
    }

    return {
      hpDamage: Math.floor(baseDamage),
      postureDamage: Math.floor(postureDamage)
    };
  }

  playerAction(action, targetIndex = 0) {
    const target = this.enemies[targetIndex];
    if (!target) return;

    switch (action) {
      case 'ATTACK':
        if (this.player.sp < 10) {
          this.addLog(chalk.red(' > Stamina insuficiente! Atacando em Exaustão...'));
        }
        const dmg = this.calculateDamage(this.player, target);
        target.takeDamage(dmg.hpDamage, 'physical');
        target.addPostureDamage(dmg.postureDamage);
        this.player.consumeSp(15);
        this.addLog(` > Você atacou ${target.name} causando ${dmg.hpDamage} de dano.`);
        break;

      case 'RECOVER':
        this.player.recover();
        this.addLog(chalk.green(' > Você assumiu uma postura defensiva e recuperou recursos.'));
        break;

      case 'SKILL':
        if (this.player.mp >= 20) {
          const sDmg = this.calculateDamage(this.player, target, 'magical');
          target.takeDamage(sDmg.hpDamage * 1.8, 'magical');
          this.player.consumeMp(20);
          this.addLog(chalk.blue(` > Você lançou uma magia em ${target.name}!`));
        } else {
          this.addLog(chalk.red(' > Mana insuficiente!'));
          return false;
        }
        break;
    }

    this.checkVictory();
    if (!this.isOver) this.enemyTurn();
    return true;
  }

  enemyTurn() {
    this.enemies.forEach(enemy => {
      if (enemy.isDead || this.isOver) return;

      // IA Básica
      if (enemy.isStaggered) {
        this.addLog(chalk.gray(` > ${enemy.name} está atordoado e perdeu o turno.`));
        enemy.recover(0, 0, 0); // Recupera um pouco de postura apenas
        return;
      }

      const dmg = this.calculateDamage(enemy, this.player);
      this.player.takeDamage(dmg.hpDamage, 'physical');
      this.player.addPostureDamage(dmg.postureDamage);

      this.addLog(chalk.red(` > ${enemy.name} atacou você: ${dmg.hpDamage} de dano.`));

      if (this.player.isDead) {
        this.isOver = true;
        this.result = 'LOSS';
        this.addLog(chalk.bold.red(' >>> VOCÊ MORREU <<<'));
      }
    });

    this.turn++;
    this.checkVictory();
  }

  checkVictory() {
    if (this.enemies.every(e => e.isDead)) {
      this.isOver = true;
      this.result = 'WIN';
      this.addLog(chalk.bold.green(' >>> VITÓRIA! Inimigos derrotados. <<<'));
    }
  }
}

module.exports = Combat;
