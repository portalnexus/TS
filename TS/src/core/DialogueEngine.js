'use strict';

/**
 * DialogueEngine — Sistema de Diálogo Contextual para NPCs do Nexus.
 * Sprint 5: v1.2.0 "A Voz do Exílio"
 *
 * Cada NPC tem 3 pools de diálogo:
 *  - intro: primeiros encontros
 *  - contextual: baseado em floor/renome/kills/inventário
 *  - evento: desbloqueado por eventos especiais (one-time)
 */
class DialogueEngine {
  constructor() {
    // Rastreia eventos desbloqueados e diálogos já exibidos por player.id
    this.shownEvents = {};

    this.dialogues = {
      Halthor: {
        intro: [
          'Halthor: "Forja e ciência, a combinação perfeita do Exílio."',
          'Halthor: "Cada lâmina que afio carrega o peso da razão."',
          'Halthor: "Poucos ferreiros sobreviveram às Fendas. Eu sou um deles."'
        ],
        contextual: {
          hasLegendary: 'Halthor: "Esse item... raridade pura. Cuide para não perdê-lo nas Fendas."',
          lowHp:        'Halthor: "Você parece machucado. Compre algo antes de voltar lá."',
          highLevel:    'Halthor: "Nível {level}? Já vi poucos chegarem tão longe no Exílio."',
          manyOrbs:     'Halthor: "Com tantos Orbes, poderia equipar um batalhão inteiro."',
          default: [
            'Halthor: "Aco e ciencia, a combinacao perfeita."',
            'Halthor: "Minhas laminas nunca falharam. Que a sua sorte seja a mesma."',
            'Halthor: "Traga mais loot das Fendas — sempre ha valor no caos."',
            'Halthor: "O Exilio corroi metais comuns. So ciencia os preserva."'
          ]
        },
        evento: {
          firstBossKill: 'Halthor: "Voce derrotou um Guardiao? As Fendas nunca mais serao as mesmas para voce."',
          level10:       'Halthor: "Nivel 10... voce comecou a se tornar uma lenda aqui no Nexus."',
          loreDisco:     'Halthor: "Fragmentos historicos? Cada peca conta a historia esquecida do Exilio."'
        }
      },

      Ada: {
        intro: [
          'Ada Lovelace: "Os algoritmos dancam entre as estrelas do Exilio."',
          'Ada Lovelace: "A primeira programadora? Nao. A primeira a entender que maquinas podem pensar."',
          'Ada Lovelace: "Cada skill que voce aprende e um algoritmo gravado na sua alma."'
        ],
        contextual: {
          noSkills:  'Ada Lovelace: "Voce ainda nao aprendeu nenhuma skill? O conhecimento espera por voce."',
          allMaxed:  'Ada Lovelace: "Sua arvore esta completa. O motor analitico de Babbage aprova."',
          manySkills:'Ada Lovelace: "Com {skills} skills dominadas, voce e um algoritmo vivo."',
          highInt:   'Ada Lovelace: "INT {int}... voce pensa como uma maquina de calcular."',
          default: [
            'Ada Lovelace: "Os algoritmos estao em harmonia."',
            'Ada Lovelace: "O Motor Analitico de Babbage teria te admirado.",',
            'Ada Lovelace: "Cada combate e um algoritmo. Cada skill, uma instrucao."',
            'Ada Lovelace: "Programar e imaginar o futuro com precisao matematica."'
          ]
        },
        evento: {
          firstBossKill: 'Ada Lovelace: "Derrotar um Guardiao exige mais que forca — exige logica pura."',
          level10:       'Ada Lovelace: "Nivel 10. Sua curva de aprendizado e impressionante."',
          loreDisco:     'Ada Lovelace: "Um fragmento historico! O motor analitico foi criado para processar exatamente isso."'
        }
      },

      Darwin: {
        intro: [
          'Darwin: "No Exilio, apenas os mais adaptados sobrevivem."',
          'Darwin: "A evolucao nao e um direito — e uma conquista."',
          'Darwin: "Cada andar que voce explora e uma pressao seletiva diferente."'
        ],
        contextual: {
          newton:    'Darwin: "As criaturas do Prisma de Newton usam luz como arma. Adapte-se ao espectro."',
          hawking:   'Darwin: "Os seres da Singularidade de Hawking dobram o espaco ao redor deles."',
          turing:    'Darwin: "O Motor de Turing abriga automatos — criaturas de logica pura."',
          noether:   'Darwin: "O Vazio de Noether e simetrico. Seus habitantes espelham seus ataques."',
          euler:     'Darwin: "As espirais de Euler guiam as criaturas daquele lugar. Cuidado com padroes."',
          lovelace:  'Darwin: "O Labirinto de Lovelace e cheio de loops. Nao repita os mesmos erros."',
          highKills: 'Darwin: "Com {kills} abates, voce esta no topo da cadeia alimentar do Exilio."',
          default: [
            'Darwin: "Apenas os mais fortes evoluem no Exilio."',
            'Darwin: "A selecao natural e impiedosa aqui. Escolha seus atributos sabiamente."',
            'Darwin: "O Exilio e um ambiente hostil. Evolua ou pereca."',
            'Darwin: "Observe os padroes dos inimigos — toda criatura tem sua fraqueza."'
          ]
        },
        evento: {
          firstBossKill: 'Darwin: "Um Guardiao eliminado. A selecao natural favorece os persistentes."',
          level10:       'Darwin: "Nivel 10 — voce evoluiu alem da maioria dos exilados."',
          loreDisco:     'Darwin: "Fragmentos de lore? A historia do Exilio e, em si, uma pressao evolutiva."'
        }
      },

      'Marie Curie': {
        intro: [
          'Marie Curie: "A radioatividade revelou segredos que a humanidade mal imaginava."',
          'Marie Curie: "Dois premios Nobel. No Exilio, valem como moeda de conhecimento."',
          'Marie Curie: "A radiacao dos itens das Fendas e diferente de qualquer coisa que estudei."'
        ],
        contextual: {
          hasLegendary: 'Marie Curie: "Um item LENDARIO! A radiacao emitida e... extraordinaria."',
          hasRare:      'Marie Curie: "Esse item RARO... tem propriedades fascinantes. Posso melhora-lo."',
          highMastery:  'Marie Curie: "Sua maestria de Crafting esta em nivel {mastery}. Progresso impressionante."',
          noItems:      'Marie Curie: "Traga itens das Fendas. A transmutacao precisa de material para trabalhar."',
          default: [
            'Marie Curie: "A radiacao revela a verdade dos itens."',
            'Marie Curie: "Cada transmutacao e um experimento. Alguns falham — a maioria ilumina."',
            'Marie Curie: "A ciencia nao conhece patria. O Exilio tampouco."',
            'Marie Curie: "A pitchblende que estudei tinha mais energia que qualquer Fenda. Ou talvez nao."'
          ]
        },
        evento: {
          firstBossKill: 'Marie Curie: "O drop de um Guardiao... altamente radioativo e fascinante."',
          level10:       'Marie Curie: "Nivel 10. Seus itens comecam a refletir sua expertise crescente."',
          loreDisco:     'Marie Curie: "Fragmentos historicos? A historia da ciencia e minha especialidade."'
        }
      }
    };
  }

  /**
   * Marca um evento como ocorrido para o jogador.
   * @param {string} eventName
   * @param {object} player - Entity com campo .id
   */
  triggerEvent(eventName, player) {
    const pid = player.id;
    if (!this.shownEvents[pid]) this.shownEvents[pid] = {};
    this.shownEvents[pid][eventName] = true;
  }

  /**
   * Verifica se o evento foi ativado para o jogador.
   * @param {string} eventName
   * @param {object} player
   * @returns {boolean}
   */
  hasEvent(eventName, player) {
    return !!(this.shownEvents[player.id] && this.shownEvents[player.id][eventName]);
  }

  /**
   * Retorna o diálogo contextual mais adequado para um NPC e o estado atual do jogador.
   * @param {string} npcId - 'Halthor' | 'Ada' | 'Darwin' | 'Marie Curie'
   * @param {object} player - Entity do jogador
   * @param {object} [context] - Contexto adicional (ex: { biome: 'newton' })
   * @returns {string}
   */
  getDialogue(npcId, player, context = {}) {
    const npcData = this.dialogues[npcId];
    if (!npcData) return `${npcId}: "Ola, Exilado."`;

    const pid = player.id;
    const shownForPlayer = this.shownEvents[pid] || {};

    // Verifica eventos desbloqueados (exibido apenas uma vez por evento por NPC)
    for (const [event, line] of Object.entries(npcData.evento || {})) {
      const alreadyShown = shownForPlayer[`shown_${npcId}_${event}`];
      if (shownForPlayer[event] && !alreadyShown) {
        if (!this.shownEvents[pid]) this.shownEvents[pid] = {};
        this.shownEvents[pid][`shown_${npcId}_${event}`] = true;
        return line;
      }
    }

    const ctx = npcData.contextual;

    // Diálogos contextuais por NPC
    if (npcId === 'Halthor') {
      const hasLeg = player.inventory.some(i => i.rarity === 'LENDÁRIO') ||
                     Object.values(player.equipment).some(i => i && i.rarity === 'LENDÁRIO');
      if (hasLeg) return ctx.hasLegendary;
      if (player.hp < player.maxHp * 0.3) return ctx.lowHp;
      if (player.level >= 10) return ctx.highLevel.replace('{level}', player.level);
      if (player.orbs >= 200) return ctx.manyOrbs;
    }

    if (npcId === 'Ada') {
      const learned = player.getLearnedSkills().length;
      const total   = Object.keys(player.skillTree).length;
      if (learned === 0) return ctx.noSkills;
      if (total > 0 && learned >= total) return ctx.allMaxed;
      if (learned >= 3) return ctx.manySkills.replace('{skills}', learned);
      if (player.intelligence >= 20) return ctx.highInt.replace('{int}', player.intelligence);
    }

    if (npcId === 'Darwin') {
      // Calcula total de kills (suporta formato antigo número e novo objeto)
      const totalKills = Object.values(player.bestiary).reduce((s, v) => {
        if (typeof v === 'number') return s + v;
        return s + (v.kills || 0);
      }, 0);
      if (context.biome && ctx[context.biome]) return ctx[context.biome];
      if (totalKills >= 20) return ctx.highKills.replace('{kills}', totalKills);
    }

    if (npcId === 'Marie Curie') {
      const hasLeg  = player.inventory.some(i => i.rarity === 'LENDÁRIO');
      const hasRare = player.inventory.some(i => i.rarity === 'RARO');
      if (hasLeg) return ctx.hasLegendary;
      if (hasRare) return ctx.hasRare;
      if (player.craftingMastery >= 3) return ctx.highMastery.replace('{mastery}', player.craftingMastery);
      if (player.inventory.length === 0) return ctx.noItems;
    }

    // Default aleatório
    const defaults = ctx.default;
    return defaults[Math.floor(Math.random() * defaults.length)];
  }
}

module.exports = DialogueEngine;
