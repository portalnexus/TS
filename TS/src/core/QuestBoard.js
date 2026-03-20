const chalk = require('chalk');

class QuestBoard {
  constructor() {
    this.quests = [
      this.generateQuest(),
      this.generateQuest(),
      this.generateQuest(),
      this.generateQuest()
    ];
  }

  generateQuest() {
    const types = ['KILL', 'FLOOR', 'ITEM', 'LORE'];
    const type = types[Math.floor(Math.random() * types.length)];

    if (type === 'KILL') {
      const target = Math.floor(Math.random() * 5) + 3; // 3 a 7
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: 'KILL',
        desc: `Derrote ${target} inimigos nas Fendas.`,
        target: target,
        progress: 0,
        rewardOrbs: target * 10 + 50,
        rewardXp: target * 50,
        completed: false
      };
    } else if (type === 'FLOOR') {
      const target = Math.floor(Math.random() * 3) + 2; // 2 a 4 andares
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: 'FLOOR',
        desc: `Alcance o Andar ${target} da Fenda.`,
        target: target,
        progress: 1,
        rewardOrbs: target * 25 + 75,
        rewardXp: target * 100,
        completed: false
      };
    } else if (type === 'ITEM') {
      const target = Math.floor(Math.random() * 3) + 2; // 2 a 4 itens
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: 'ITEM',
        desc: `Colete ${target} itens das Fendas.`,
        target: target,
        progress: 0,
        rewardOrbs: target * 20 + 100,
        rewardXp: target * 75,
        completed: false
      };
    } else {
      // LORE — encontrar fragmentos históricos nas Fendas
      const target = Math.floor(Math.random() * 2) + 1; // 1 a 2 fragmentos
      return {
        id: Math.random().toString(36).substr(2, 9),
        type: 'LORE',
        desc: `Descubra ${target} fragmento${target > 1 ? 's' : ''} historico${target > 1 ? 's' : ''} nas Fendas.`,
        target: target,
        progress: 0,
        rewardOrbs: target * 50 + 150,
        rewardXp: target * 200,
        rewardItem: true, // Recompensa especial: Tomo Histórico LENDÁRIO
        completed: false
      };
    }
  }

  getMenuOptions(player) {
    const options = this.quests.map((q, idx) => {
      let status = q.completed ? chalk.green(' [CONCLUIDA]') : ` [${q.progress}/${q.target}]`;
      const isActive = player.activeQuest && player.activeQuest.id === q.id;
      if (isActive) status = chalk.yellow(' [ATIVA]') + status;
      const typeTag = q.type === 'LORE' ? chalk.cyan(' [LORE]') : '';
      return ` ${q.desc}${typeTag}${status} - Recompensa: ${q.rewardOrbs} Orbes`;
    });

    if (player.activeQuest && player.activeQuest.completed) {
      options.push(' [ENTREGAR] Receber recompensa da missao ativa');
    }
    options.push(' [ESC] Voltar ao Nexus');
    return options;
  }

  acceptQuest(player, index) {
    if (player.activeQuest) return false;
    const quest = this.quests[index];
    if (quest && !quest.completed) {
      player.activeQuest = { ...quest };
      return true;
    }
    return false;
  }

  /**
   * Entrega a missão ativa. Retorna um objeto com resultado, incluindo
   * se houve recompensa especial (Tomo Histórico LENDÁRIO para missões LORE).
   * @param {object} player
   * @returns {{ success: boolean, specialReward: boolean }}
   */
  turnInQuest(player) {
    if (player.activeQuest && player.activeQuest.completed) {
      player.orbs += player.activeQuest.rewardOrbs;
      player.addExperience(player.activeQuest.rewardXp);

      const hadLoreReward = player.activeQuest.type === 'LORE' && player.activeQuest.rewardItem;

      // Remove a quest do board e substitui por uma nova
      this.quests = this.quests.filter(q => q.id !== player.activeQuest.id);
      this.quests.push(this.generateQuest());

      player.activeQuest = null;
      return { success: true, specialReward: hadLoreReward };
    }
    return { success: false, specialReward: false };
  }
}

module.exports = QuestBoard;
