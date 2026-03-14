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

    // Bônus de Proficiência (5% por ponto)
    if (attacker.proficiencies) {
      let tagBonus = 1;
      const tagsToCheck = attacker.equipment.ARMA ? attacker.equipment.ARMA.tags : [];
      
      tagsToCheck.forEach(tag => {
        if (attacker.proficiencies[tag]) {
          tagBonus += (attacker.proficiencies[tag] * 0.05);
        }
      });

      // Bônus para Magia baseado em INT/VAZIO
      if (moveType === 'magical') {
        if (attacker.proficiencies['VAZIO']) {
          tagBonus += (attacker.proficiencies['VAZIO'] * 0.05);
        }
        if (attacker.background === 'Erudito') {
          tagBonus *= 1.1;
        }
      }

      baseDamage *= tagBonus;
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

    // Processar status do player no começo do turno
    this.player.processStatuses(this.log);
    if (this.player.isDead) {
      this.isOver = true;
      this.result = 'LOSS';
      return;
    }

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

        // Reações Elementais (Baseado na arma)
        if (this.player.equipment.ARMA && this.player.equipment.ARMA.tags) {
          const tags = this.player.equipment.ARMA.tags;
          if (tags.includes('CORTE') && Math.random() > 0.5) {
            target.addStatus('SANGRAMENTO', 3);
            this.addLog(chalk.red(` > ${target.name} está sangrando!`));
          }
          if (tags.includes('FOGO') && Math.random() > 0.6) {
            target.addStatus('COMBUSTÃO', 2);
            this.addLog(chalk.yellow(` > ${target.name} entrou em combustão!`));
          }
          if (tags.includes('CHOQUE') && Math.random() > 0.7) {
            target.isStaggered = true; // Choque pode atordoar direto
            this.addLog(chalk.cyan(` > Choque atordoou ${target.name}!`));
          }
        }
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
          
          if (Math.random() > 0.5) {
             target.addStatus('COMBUSTÃO', 2);
             this.addLog(chalk.yellow(` > A magia incendiou ${target.name}!`));
          }
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

      // Processa status do inimigo
      enemy.processStatuses(this.log);
      if (enemy.isDead) return;

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
      
      const xpReward = this.enemies.reduce((acc, e) => acc + (e.level * 25), 0);
      const leveledUp = this.player.addExperience(xpReward);
      
      this.addLog(chalk.bold.green(` >>> VITÓRIA! +${xpReward} XP. <<<`));
      if (leveledUp) {
        this.addLog(chalk.bold.cyan(' >>> NÍVEL AUMENTADO! +3 PONTOS DE ATRIBUTO. <<<'));
      }

      // Progressão de Quest
      if (this.player.activeQuest && this.player.activeQuest.type === 'KILL' && !this.player.activeQuest.completed) {
        this.player.activeQuest.progress += this.enemies.length;
        if (this.player.activeQuest.progress >= this.player.activeQuest.target) {
          this.player.activeQuest.progress = this.player.activeQuest.target;
          this.player.activeQuest.completed = true;
          this.addLog(chalk.bold.yellow(' [!] MISSÃO CONCLUÍDA! Retorne ao Nexus.'));
        }
      }
    }
  }
}

module.exports = Combat;
