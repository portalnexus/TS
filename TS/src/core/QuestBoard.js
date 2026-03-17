const chalk = require('chalk');

class QuestBoard {
  constructor() {
    this.quests = [
      this.generateQuest(),
      this.generateQuest(),
      this.generateQuest()
    ];
  }

  generateQuest() {
    const types = ['KILL', 'FLOOR', 'ITEM'];
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
    } else {
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
    }
  }

  getMenuOptions(player) {
    const options = this.quests.map((q, idx) => {
      let status = q.completed ? chalk.green(' [CONCLUÍDA]') : ` [${q.progress}/${q.target}]`;
      const isActive = player.activeQuest && player.activeQuest.id === q.id;
      if (isActive) status = chalk.yellow(' [ATIVA]') + status;
      
      return ` ${q.desc}${status} - Recompensa: ${q.rewardOrbs} Orbes`;
    });
    
    if (player.activeQuest && player.activeQuest.completed) {
      options.push(' [ENTREGAR] Receber recompensa da missão ativa');
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

  turnInQuest(player) {
    if (player.activeQuest && player.activeQuest.completed) {
      player.orbs += player.activeQuest.rewardOrbs;
      player.addExperience(player.activeQuest.rewardXp);
      
      // Remove a quest do board e substitui por uma nova
      this.quests = this.quests.filter(q => q.id !== player.activeQuest.id);
      this.quests.push(this.generateQuest());
      
      player.activeQuest = null;
      return true;
    }
    return false;
  }
}

module.exports = QuestBoard;
