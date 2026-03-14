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

  calculateDamage(attacker, target, moveType = 'physical', skillMultiplier = 1) {
    let baseDamage = attacker.getAttackPower() + Math.floor(Math.random() * 5);
    let postureDamage = 10;

    if (moveType === 'physical') {
      baseDamage = Math.max(attacker.level, baseDamage - target.getDefense());
    }

    if (attacker.postureMode === 'ATTACK') {
      baseDamage *= 1.5;
      postureDamage *= 1.2;
    } else if (attacker.postureMode === 'DEFENCE') {
      baseDamage *= 0.7;
    }

    if (target.postureMode === 'DEFENCE') {
      baseDamage *= 0.5;
      postureDamage *= 0.5;
    } else if (target.postureMode === 'ATTACK') {
      baseDamage *= 1.2;
    }

    if (attacker.proficiencies) {
      let tagBonus = 1;
      const tagsToCheck = attacker.equipment.ARMA ? attacker.equipment.ARMA.tags : [];
      tagsToCheck.forEach(tag => {
        if (attacker.proficiencies[tag]) tagBonus += (attacker.proficiencies[tag] * 0.05);
      });

      if (moveType === 'magical') {
        if (attacker.proficiencies['VAZIO']) tagBonus += (attacker.proficiencies['VAZIO'] * 0.05);
        if (attacker.background === 'Mago') tagBonus *= 1.1;
      }
      baseDamage *= tagBonus;
    }

    if (target.isStaggered) {
      baseDamage *= 2;
      this.addLog(chalk.bold.yellow(` ! CRÍTICO: ${target.name} está vulnerável!`));
    }

    return {
      hpDamage: Math.floor(baseDamage * skillMultiplier),
      postureDamage: Math.floor(postureDamage)
    };
  }

  playerAction(action, targetIndex = 0, skillName = null) {
    const target = this.enemies[targetIndex];
    if (!target) return;

    this.player.processStatuses(this.log);
    if (this.player.isDead) { this.isOver = true; this.result = 'LOSS'; return; }

    switch (action) {
      case 'ATTACK':
        if (this.player.sp < 10) this.addLog(chalk.red(' > Stamina insuficiente!'));
        const dmg = this.calculateDamage(this.player, target);
        target.takeDamage(dmg.hpDamage, 'physical');
        target.addPostureDamage(dmg.postureDamage);
        this.player.consumeSp(15);
        this.addLog(` > Você atacou ${target.name} causando ${dmg.hpDamage} de dano.`);
        this.applyElementalEffects(target);
        break;

      case 'RECOVER':
        this.player.recover();
        this.addLog(chalk.green(' > Você assumiu uma postura defensiva e recuperou recursos.'));
        break;

      case 'SKILL':
        if (!skillName) return;
        const skill = this.player.skillTree[skillName];
        if (this.player.mp >= skill.cost) {
          this.player.consumeMp(skill.cost);
          this.executeSkill(skillName, target);
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

  executeSkill(name, target) {
    const skill = this.player.skillTree[name];
    const lvlBonus = 1 + (skill.lvl * 0.2);
    this.addLog(chalk.bold.cyan(` > [${name}] NIVEL ${skill.lvl}!`));

    if (name === 'Impacto de Newton' || name === 'Flecha de Hawking') {
      const dmg = this.calculateDamage(this.player, target, 'physical', 1.5 * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'physical');
      target.addPostureDamage(dmg.postureDamage * 1.5);
      this.addLog(` > Dano causado: ${dmg.hpDamage}.`);
    } else if (name === 'Raio de Maxwell' || name === 'Chama de Lavoisier' || name === 'Luz Primordial') {
      const dmg = this.calculateDamage(this.player, target, 'magical', 1.8 * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'magical');
      this.addLog(` > Dano mágico causado: ${dmg.hpDamage}.`);
      if (name === 'Chama de Lavoisier') target.addStatus('COMBUSTÃO', 3);
      if (name === 'Luz Primordial') this.player.recover(0.05, 0, 0);
    } else if (name === 'Cura de Hipócrates') {
      this.player.recover(0.2 * lvlBonus, 0, 0);
      this.addLog(` > Você recuperou vida.`);
    } else if (name === 'Inércia de Galileu' || name === 'Relatividade de Einstein') {
      this.player.addPostureDamage(-20 * lvlBonus);
      this.addLog(` > Sua postura se estabilizou.`);
    } else if (name === 'Zero Absoluto') {
      target.isStaggered = true;
      this.addLog(` > ${target.name} foi congelado!`);
    } else {
      // Fallback
      const dmg = this.calculateDamage(this.player, target, 'physical', lvlBonus);
      target.takeDamage(dmg.hpDamage);
    }
  }

  applyElementalEffects(target) {
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
        target.isStaggered = true;
        this.addLog(chalk.cyan(` > Choque atordoou ${target.name}!`));
      }
    }
  }

  enemyTurn() {
    this.enemies.forEach(enemy => {
      if (enemy.isDead || this.isOver) return;
      enemy.processStatuses(this.log);
      if (enemy.isDead) return;
      if (enemy.isStaggered) {
        this.addLog(chalk.gray(` > ${enemy.name} está atordoado e perdeu o turno.`));
        enemy.recover(0, 0, 0);
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
    this.enemies.forEach(e => {
      if (e.isDead && !e.recorded) {
        this.player.recordKill(e.name);
        e.recorded = true; // Evita duplicar abates no mesmo combate
      }
    });

    if (this.enemies.every(e => e.isDead)) {
      this.isOver = true;
      this.result = 'WIN';
      const xpReward = this.enemies.reduce((acc, e) => acc + (e.level * 25), 0);
      const leveledUp = this.player.addExperience(xpReward);
      this.addLog(chalk.bold.green(` >>> VITÓRIA! +${xpReward} XP. <<<`));
      if (leveledUp) this.addLog(chalk.bold.cyan(' >>> NÍVEL AUMENTADO! <<<'));
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
