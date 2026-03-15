const chalk = require('chalk');

class Combat {
  constructor(player, enemies) {
    this.player = player;
    this.enemies = enemies.filter(e => !e.isDead);
    this.turn = 1;
    this.log = [];
    this.isOver = false;
    this.result = null;
  }

  addLog(msg) {
    this.log.push(msg);
    if (this.log.length > 10) this.log.shift();
  }

  calculateDamage(attacker, target, moveType = 'physical', skillMultiplier = 1) {
    let baseDamage = attacker.getAttackPower() + Math.floor(Math.random() * 5);
    let stabilityDmg = 15;

    if (moveType === 'physical') {
      baseDamage = Math.max(attacker.level, baseDamage - target.getDefense());
    }

    // Sinergias de Reação
    if (typeof target.hasStatus === 'function' && target.hasStatus('SANGRAMENTO') && attacker.equipment.ARMA?.tags.includes('FOGO')) {
      baseDamage *= 2;
      target.removeStatus('SANGRAMENTO');
      this.addLog(chalk.bold.red(' >>> CAUTERIZAÇÃO: Dano térmico massivo!'));
    }

    if (target.isStaggered) {
      baseDamage *= 2;
      this.addLog(chalk.bold.yellow(` ! COLAPSO: ${target.name} está vulnerável!`));
    }

    return {
      hpDamage: Math.floor(baseDamage * skillMultiplier),
      stabilityDmg: Math.floor(stabilityDmg)
    };
  }

  playerAction(action, targetIndex = 0, skillName = null) {
    const target = this.enemies[targetIndex];
    if (!target) return;

    this.player.processStatuses(this.log);
    if (this.player.isDead) { this.isOver = true; this.result = 'LOSS'; return; }

    // Penalidade de Estabilidade por Ação no modo MOMENTO
    if (this.player.postureMode === 'MOMENTO') {
      this.player.modifyStability(-10);
      this.addLog(chalk.gray(' > Momento reduz estabilidade (-10).'));
    }

    switch (action) {
      case 'ATTACK':
        if (this.player.sp < 10) { this.addLog(chalk.red(' > Sem stamina!')); return false; }
        const dmg = this.calculateDamage(this.player, target);
        target.takeDamage(dmg.hpDamage, 'physical');
        target.modifyStability(-dmg.stabilityDmg);
        this.player.consumeSp(15);
        this.addLog(` > Ataque em ${target.name}: ${dmg.hpDamage} dano.`);
        this.applyElementalEffects(target);
        break;

      case 'RECOVER':
        this.player.recover();
        this.addLog(chalk.green(' > Meditação científica recuperou recursos e estabilidade.'));
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
      target.modifyStability(-30 * lvlBonus);
      this.addLog(` > Impacto devastador: ${dmg.hpDamage}.`);
    } else if (name === 'Zero Absoluto') {
      target.modifyStability(-100);
      this.addLog(` > Zero Absoluto congelou o movimento do alvo.`);
    } else if (name === 'Singularidade de Hawking') {
      const dmg = Math.floor(target.hp * 0.3 * lvlBonus);
      target.takeDamage(dmg, 'magical');
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.floor(dmg * 0.5));
      this.addLog(` > A singularidade drenou ${dmg} de vida.`);
    } else {
      const dmg = this.calculateDamage(this.player, target, 'magical', 1.8 * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'magical');
      if (name === 'Chama de Lavoisier') target.addStatus('COMBUSTÃO', 3);
    }
  }

  applyElementalEffects(target) {
    if (this.player.equipment.ARMA?.tags) {
      const tags = this.player.equipment.ARMA.tags;
      if (tags.includes('CORTE') && Math.random() > 0.5) target.addStatus('SANGRAMENTO', 3);
      if (tags.includes('FOGO') && Math.random() > 0.6) target.addStatus('COMBUSTÃO', 2);
    }
  }

  enemyTurn() {
    this.enemies.forEach(enemy => {
      if (enemy.isDead || this.isOver) return;
      enemy.processStatuses(this.log);
      if (enemy.isDead) return;
      if (enemy.isStaggered) {
        this.addLog(chalk.gray(` > ${enemy.name} em Colapso (Turno Perdido).`));
        enemy.modifyStability(40);
        return;
      }
      const dmg = this.calculateDamage(enemy, this.player);
      this.player.takeDamage(dmg.hpDamage, 'physical');
      this.player.modifyStability(-dmg.stabilityDmg);
      this.addLog(chalk.red(` > ${enemy.name} atacou: ${dmg.hpDamage} dano.`));
      if (this.player.isDead) { this.isOver = true; this.result = 'LOSS'; }
    });
    this.turn++;
    this.checkVictory();
  }

  checkVictory() {
    this.enemies.forEach(e => { if (e.isDead && !e.recorded) { this.player.recordKill(e.name); e.recorded = true; } });
    if (this.enemies.every(e => e.isDead)) {
      this.isOver = true; this.result = 'WIN';
      const xp = this.enemies.reduce((acc, e) => acc + (e.level * 25), 0);
      this.player.addExperience(xp);
      this.addLog(chalk.bold.green(` >>> VITORIA CIENTIFICA! +${xp} XP. <<<`));
    }
  }
}

module.exports = Combat;
