const chalk = require('chalk');
const { T } = require('../ui/Theme');

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
    let stabilityDmg = Math.max(10, 15 + Math.floor((attacker.strength || 0) * 0.3));

    if (moveType === 'physical') {
      baseDamage = Math.max(attacker.level, baseDamage - target.getDefense());
    }

    // Bônus de Proficiência por tags da arma
    if (attacker.equipment?.ARMA?.tags && attacker.proficiencies) {
      attacker.equipment.ARMA.tags.forEach(tag => {
        const lvl = attacker.proficiencies[tag] || 0;
        if (lvl > 0) baseDamage = Math.floor(baseDamage * (1 + lvl * 0.05));
      });
    }

    // Sinergias de Reação
    if (target.hasStatus && target.hasStatus('SANGRAMENTO') && attacker.equipment?.ARMA?.tags.includes('FOGO')) {
      baseDamage *= 2;
      target.removeStatus('SANGRAMENTO');
      this.addLog(T.danger.bold(' >>> CAUTERIZAÇÃO: Dano térmico massivo!'));
    }
    if (target.hasStatus && target.hasStatus('CONGELAMENTO') && attacker.equipment?.ARMA?.tags.includes('ESMAGAMENTO')) {
      baseDamage = Math.floor(baseDamage * 1.5);
      target.removeStatus('CONGELAMENTO');
      this.addLog(T.player.bold(' >>> FRAGMENTAÇÃO: Alvo despedaçado!'));
    }
    if (target.hasStatus && target.hasStatus('CHOQUE') && attacker.equipment?.ARMA?.tags.includes('CORTE')) {
      baseDamage = Math.floor(baseDamage * 1.3);
      target.removeStatus('CHOQUE');
      this.addLog(chalk.bold.yellow(' >>> DESCARGA: Condução potencializada!'));
    }

    if (target.isStaggered) {
      baseDamage *= 2;
      this.addLog(T.warning.bold(` ! COLAPSO: ${target.name} está vulnerável!`));
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
    // IMUNIDADE: bloqueia dano de status no turno ativo
    if (this.player.hasStatus('IMUNIDADE')) {
      this.addLog(T.player.bold(' > IMUNIDADE ativa: dano de status bloqueado.'));
    }
    if (this.player.isDead) { this.isOver = true; this.result = 'LOSS'; return; }

    // Penalidade de Estabilidade por Ação no modo ATAQUE
    if (this.player.postureMode === 'ATAQUE') {
      this.player.modifyStability(-10);
      this.addLog(T.neutral(' > Ataque reduz estabilidade (-10).'));
    }

    switch (action) {
      case 'ATTACK':
        if (this.player.sp < 10) { this.addLog(T.danger(' > Sem stamina!')); return false; }
        const dmg = this.calculateDamage(this.player, target);
        target.takeDamage(dmg.hpDamage, 'physical');
        target.modifyStability(-dmg.stabilityDmg);
        this.player.consumeSp(15);
        this.addLog(` > Ataque em ${target.name}: ${dmg.hpDamage} dano.`);
        this.applyElementalEffects(target);
        break;

      case 'RECOVER':
        this.player.recover();
        this.addLog(T.success(' > Meditação científica recuperou recursos e estabilidade.'));
        break;

      case 'SKILL':
        if (!skillName) return;
        const skill = this.player.skillTree[skillName];
        if (this.player.mp >= skill.cost) {
          this.player.consumeMp(skill.cost);
          this.executeSkill(skillName, target);
        } else {
          this.addLog(T.danger(' > Mana insuficiente!'));
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
    this.addLog(T.player.bold(` > [${name}] NIVEL ${skill.lvl}!`));

    // --- GUERREIRO ---
    if (name === 'Impacto de Newton') {
      const dmg = this.calculateDamage(this.player, target, 'physical', 1.5 * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'physical');
      target.modifyStability(-30 * lvlBonus);
      this.addLog(` > Impacto devastador: ${dmg.hpDamage} dano.`);

    } else if (name === 'Inércia de Galileu') {
      const stability = Math.floor(40 * lvlBonus);
      this.player.modifyStability(stability);
      this.player.recover(0.05, 0.3, 0.05);
      this.addLog(T.player(` > Inércia restaurou +${stability} Estabilidade.`));

    } else if (name === 'Entropia Cinética') {
      const strBonus = Math.floor(this.player.strength * 0.8 * lvlBonus);
      this.enemies.forEach(e => {
        if (!e.isDead) { e.takeDamage(strBonus, 'physical'); e.modifyStability(-10); }
      });
      this.addLog(` > Entropia atingiu todos por ${strBonus} dano.`);

    } else if (name === 'Força Centrípeta') {
      this.enemies.forEach(e => {
        if (!e.isDead) {
          const dmg = this.calculateDamage(this.player, e, 'physical', 1.2 * lvlBonus);
          e.takeDamage(dmg.hpDamage, 'physical');
          e.modifyStability(-20);
        }
      });
      this.addLog(` > Rotação atingiu todos os inimigos!`);

    } else if (name === 'Lei da Inércia') {
      this.player.modifyStability(this.player.maxPosture);
      this.player.addStatus('IMUNIDADE', Math.ceil(1 + skill.lvl * 0.5));
      this.addLog(chalk.bold.cyan(` > Lei da Inércia: Estabilidade máxima restaurada!`));

    // --- MAGO ---
    } else if (name === 'Raio de Maxwell') {
      const dmg = this.calculateDamage(this.player, target, 'magical', 1.6 * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'magical');
      target.addStatus('CHOQUE', 2);
      this.addLog(` > Raio de Maxwell: ${dmg.hpDamage} + CHOQUE aplicado.`);

    } else if (name === 'Chama de Lavoisier') {
      const dmg = this.calculateDamage(this.player, target, 'magical', 1.8 * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'magical');
      target.addStatus('COMBUSTÃO', 3);
      this.addLog(` > Chama de Lavoisier: ${dmg.hpDamage} + COMBUSTÃO (3t).`);

    } else if (name === 'Zero Absoluto') {
      target.addStatus('CONGELAMENTO', Math.ceil(1 + skill.lvl * 0.5));
      target.modifyStability(-80 * lvlBonus);
      this.addLog(T.info.bold(` > Zero Absoluto: CONGELAMENTO + colapso de estabilidade!`));

    } else if (name === 'Paradoxo de Schrödinger') {
      this.player.addStatus('EVASÃO', Math.ceil(1 + skill.lvl));
      this.addLog(T.magic.bold(` > Paradoxo: Próximos ${Math.ceil(1+skill.lvl)} ataques têm 60% de desvio.`));

    } else if (name === 'Singularidade de Hawking') {
      const dmg = Math.floor(target.hp * 0.3 * lvlBonus);
      target.takeDamage(dmg, 'magical');
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.floor(dmg * 0.5));
      this.addLog(` > Singularidade drenou ${dmg} de vida (+${Math.floor(dmg*0.5)} HP absorvido).`);

    // --- ARQUEIRO ---
    } else if (name === 'Flecha de Hawking') {
      const dmg = this.calculateDamage(this.player, target, 'physical', 2.0 * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'physical');
      target.modifyStability(-25 * lvlBonus);
      this.addLog(` > Flecha crítica: ${dmg.hpDamage} dano perfurante.`);

    } else if (name === 'Diagrama de Feynman') {
      const hits = Math.min(2 + skill.lvl, 5);
      let total = 0;
      for (let i = 0; i < hits; i++) {
        const dmg = this.calculateDamage(this.player, target, 'physical', 0.6 * lvlBonus);
        target.takeDamage(dmg.hpDamage, 'physical');
        total += dmg.hpDamage;
      }
      this.addLog(` > Diagrama: ${hits} disparos, ${total} dano total.`);

    } else if (name === 'Relatividade de Einstein') {
      const boost = Math.floor(20 * lvlBonus);
      this.player.modifyStability(boost);
      this.player.addStatus('EVASÃO', 2);
      this.addLog(T.warning(` > Relatividade: +${boost} Estabilidade + EVASÃO.`));

    } else if (name === 'Óptica de Euclides') {
      const dmg = Math.floor((this.player.getAttackPower() * 2.5 * lvlBonus));
      target.takeDamage(dmg, 'physical');
      this.addLog(` > Precisão absoluta: ${dmg} dano (ignora defesa).`);

    } else if (name === 'Efeito Doppler') {
      const floorBonus = this.enemies[0]?.level || 1;
      const dmg = this.calculateDamage(this.player, target, 'physical', (1.2 + floorBonus * 0.1) * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'physical');
      this.addLog(` > Doppler: ${dmg.hpDamage} dano (escala com andar).`);

    // --- CLÉRIGO ---
    } else if (name === 'Cura de Hipócrates') {
      const heal = Math.floor(this.player.maxHp * 0.25 * lvlBonus);
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
      this.addLog(T.success(` > Hipócrates restaurou ${heal} HP.`));

    } else if (name === 'Sopro de Gaia') {
      const removed = this.player.activeStatuses.length;
      this.player.activeStatuses = [];
      this.player.modifyStability(Math.floor(20 * lvlBonus));
      this.addLog(T.success(` > Sopro de Gaia removeu ${removed} debuff(s).`));

    } else if (name === 'Luz Primordial') {
      const dmg = this.calculateDamage(this.player, target, 'magical', 1.3 * lvlBonus);
      target.takeDamage(dmg.hpDamage, 'magical');
      const heal = Math.floor(dmg.hpDamage * 0.3);
      this.player.hp = Math.min(this.player.maxHp, this.player.hp + heal);
      this.addLog(` > Luz Primordial: ${dmg.hpDamage} dano / +${heal} HP.`);

    } else if (name === 'Teorema de Pitágoras') {
      const shield = Math.floor(this.player.maxPosture * 0.5 * lvlBonus);
      this.player.modifyStability(shield);
      this.addLog(T.bright.bold(` > Escudo triangular: +${shield} Estabilidade.`));

    } else if (name === 'Proporção Áurea') {
      const avg = Math.floor((this.player.hp/this.player.maxHp + this.player.sp/this.player.maxSp + this.player.mp/this.player.maxMp) / 3 * 100);
      this.player.hp = Math.floor(this.player.maxHp * avg / 100);
      this.player.sp = Math.floor(this.player.maxSp * avg / 100);
      this.player.mp = Math.floor(this.player.maxMp * avg / 100);
      this.addLog(T.warning.bold(` > Proporção Áurea: HP/SP/MP harmonizados em ${avg}%.`));
    }
  }

  applyElementalEffects(target) {
    if (this.player.equipment.ARMA?.tags) {
      const tags = this.player.equipment.ARMA.tags;
      if (tags.includes('CORTE') && Math.random() > 0.5) target.addStatus('SANGRAMENTO', 3);
      if (tags.includes('FOGO') && Math.random() > 0.6) target.addStatus('COMBUSTÃO', 2);
      if (tags.includes('CHOQUE') && Math.random() > 0.65) target.addStatus('CHOQUE', 2);
      if (tags.includes('VAZIO') && Math.random() > 0.7) target.modifyStability(-25);
    }
  }

  // Verifica se o jogador desvia com EVASÃO
  playerEvades() {
    if (this.player.hasStatus('EVASÃO') && Math.random() < 0.6) {
      this.player.removeStatus('EVASÃO');
      this.addLog(T.warning.bold(' > DESVIO! O ataque foi evitado!'));
      return true;
    }
    return false;
  }

  enemyTurn() {
    this.enemies.forEach(enemy => {
      if (enemy.isDead || this.isOver) return;
      enemy.processStatuses(this.log);
      if (enemy.isDead) return;
      if (enemy.isStaggered) {
        this.addLog(T.neutral(` > ${enemy.name} em Colapso (Turno Perdido).`));
        enemy.modifyStability(40);
        return;
      }

      const isBoss = enemy.name.includes('CHEFE') || enemy.name.includes('SENHOR') || enemy.name.includes('ARQUITETO');

      // IA de Boss: padrões especiais por fase de HP
      if (isBoss) {
        const hpPercent = enemy.hp / enemy.maxHp;

        // Fase 3 (≤30% HP): ataque frenético duplo
        if (hpPercent <= 0.30 && this.turn % 2 === 0) {
          this.addLog(T.criticalBg(` !! ${enemy.name}: COLAPSO DIMENSIONAL !!`));
          const dmg1 = this.calculateDamage(enemy, this.player);
          const dmg2 = this.calculateDamage(enemy, this.player);
          this.player.takeDamage(dmg1.hpDamage, 'physical');
          this.player.takeDamage(dmg2.hpDamage, 'physical');
          this.player.modifyStability(-(dmg1.stabilityDmg + dmg2.stabilityDmg));
          this.addLog(T.danger(` > DUPLO ATAQUE: ${dmg1.hpDamage} + ${dmg2.hpDamage} dano!`));
        // Fase 2 (≤60% HP): aplica status especial a cada 3 turnos
        } else if (hpPercent <= 0.60 && this.turn % 3 === 0) {
          this.addLog(T.magic.bold(` !! ${enemy.name}: CAMPO DE DISTORÇÃO !!`));
          this.player.addStatus('CHOQUE', 2);
          this.player.addStatus('COMBUSTÃO', 2);
          const dmg = this.calculateDamage(enemy, this.player, 'magical', 1.3);
          this.player.takeDamage(dmg.hpDamage, 'magical');
          this.addLog(T.magic(` > Distorção: ${dmg.hpDamage} + CHOQUE + COMBUSTÃO aplicados!`));
        // Fase 1: ataque com recuperação de estabilidade
        } else {
          if (this.turn % 4 === 0) {
            enemy.modifyStability(30);
            this.addLog(T.neutral(` > ${enemy.name} recuperou postura.`));
          }
          const dmg = this.calculateDamage(enemy, this.player, 'physical', 1.2);
          this.player.takeDamage(dmg.hpDamage, 'physical');
          this.player.modifyStability(-dmg.stabilityDmg);
          this.addLog(T.danger(` > ${enemy.name} atacou com força: ${dmg.hpDamage} dano.`));
        }
      } else {
        // Inimigo comum
        if (this.playerEvades()) return;
        const dmg = this.calculateDamage(enemy, this.player);
        // Efeito elemental do inimigo (30% chance para inimigos avançados)
        if (enemy.level >= 5 && Math.random() > 0.7) {
          this.player.addStatus('SANGRAMENTO', 2);
          this.addLog(T.danger(` > ${enemy.name} causou SANGRAMENTO!`));
        }
        this.player.takeDamage(dmg.hpDamage, 'physical');
        this.player.modifyStability(-dmg.stabilityDmg);
        this.addLog(T.danger(` > ${enemy.name} atacou: ${dmg.hpDamage} dano.`));
      }

      if (this.player.isDead) { this.isOver = true; this.result = 'LOSS'; }
    });
    this.turn++;
    this.checkVictory();
  }

  checkVictory() {
    this.enemies.forEach(e => { if (e.isDead && !e.recorded) { this.player.recordKill(e.name, e.level); e.recorded = true; } });
    if (this.enemies.every(e => e.isDead)) {
      this.isOver = true; this.result = 'WIN';
      const xp = this.enemies.reduce((acc, e) => acc + (e.level * 25), 0);
      this.player.addExperience(xp);
      // Orbes por derrota: level * 3 por inimigo comum; boss dá bônus extra
      const orbs = this.enemies.reduce((acc, e) => {
        const isBoss = e.name.includes('CHEFE') || e.name.includes('SENHOR') || e.name.includes('ARQUITETO');
        return acc + (isBoss ? e.level * 15 : e.level * 3);
      }, 0);
      this.player.orbs += orbs;
      this.addLog(T.success.bold(` >>> VITORIA CIENTIFICA! +${xp} XP  +${orbs} Orbes <<<`));
    }
  }
}

module.exports = Combat;
