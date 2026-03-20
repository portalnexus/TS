'use strict';

/**
 * BestiaryData — Dados estáticos do bestiário por criatura das Fendas.
 * Sprint 5: v1.2.0 "A Voz do Exílio"
 */
const BESTIARY_DATA = {
  // --- BIOMA: O Prisma de Newton ---
  'Prisma Refrator': {
    description: 'Fragmento de luz solidificada que refrata ataques físicos em arcos espectrais.',
    weaknesses: ['VAZIO', 'CHOQUE'],
    drops: ['Cristal Espectral', 'Orbes de Luz'],
    raridade: 'COMUM'
  },
  'Corpo Gravitacional': {
    description: 'Massa densa que atrai objetos e deforma o campo cinemático ao redor.',
    weaknesses: ['ESMAGAMENTO'],
    drops: ['Fragmento de Massa', 'Orbes Densos'],
    raridade: 'COMUM'
  },
  'Arco Espectral': {
    description: 'Arqueiro elemental formado por ondas luminosas que perfuram armadura.',
    weaknesses: ['VAZIO', 'CONGELAMENTO'],
    drops: ['Feixe Espectral', 'Orbes de Fótons'],
    raridade: 'INCOMUM'
  },
  'Força Centrífuga': {
    description: 'Força rotacional que arrasta inimigos para órbita e causa sangramento.',
    weaknesses: ['CORTE', 'ESMAGAMENTO'],
    drops: ['Núcleo Rotacional'],
    raridade: 'INCOMUM'
  },

  // --- BIOMA: A Singularidade de Hawking ---
  'Eco de Radiação': {
    description: 'Emissão de radiação de Hawking que abrasa o campo energético do alvo.',
    weaknesses: ['ABSORÇÃO', 'VAZIO'],
    drops: ['Partícula de Hawking', 'Radiação Solidificada'],
    raridade: 'COMUM'
  },
  'Singularidade Menor': {
    description: 'Micro buraco negro que drena energia de tudo ao redor.',
    weaknesses: ['LUZ', 'CORTE'],
    drops: ['Núcleo Singular', 'Orbes do Vácuo'],
    raridade: 'INCOMUM'
  },
  'Horizonte de Eventos': {
    description: 'Guardião do limiar intransponível onde tempo e espaço colapsam em zero.',
    weaknesses: ['ESMAGAMENTO'],
    drops: ['Fragmento do Horizonte'],
    raridade: 'RARO'
  },
  'Pulsar Binário': {
    description: 'Par de estrelas de nêutrons girando em ritmo devastador e sincronizado.',
    weaknesses: ['VAZIO', 'CHOQUE'],
    drops: ['Pulso Magnético', 'Orbes Binárias'],
    raridade: 'INCOMUM'
  },

  // --- BIOMA: O Motor de Turing ---
  'Lobo de Turing': {
    description: 'Autômato de ataque rápido programado para caçar e destruir.',
    weaknesses: ['FOGO', 'ESMAGAMENTO'],
    drops: ['Fita de Turing', 'Fragmento Binário'],
    raridade: 'COMUM'
  },
  'Autômato de Pascal': {
    description: 'Máquina calculadora de alta resistência e precisão matemática.',
    weaknesses: ['FOGO', 'CORTE'],
    drops: ['Engrenagem de Pascal', 'Cristal Lógico'],
    raridade: 'COMUM'
  },
  'Bomba de Colapso': {
    description: 'Autômato suicida que explode ao ser derrotado, causando dano em área.',
    weaknesses: ['CHOQUE'],
    drops: ['Estilhaço Colapsado', 'Orbes Explosivas'],
    raridade: 'INCOMUM'
  },
  'Daemon Binário': {
    description: 'Processo sem fim que corrói a estabilidade mental do adversário.',
    weaknesses: ['LUZ', 'VAZIO'],
    drops: ['Registro Corrompido'],
    raridade: 'INCOMUM'
  },

  // --- BIOMA: O Vazio de Noether ---
  'Espectro de Noether': {
    description: 'Manifestação de simetria que espelha ataques recebidos com precisão.',
    weaknesses: ['ESMAGAMENTO', 'CORTE'],
    drops: ['Cristal Simétrico', 'Orbes do Vazio'],
    raridade: 'COMUM'
  },
  'Vazio Simétrico': {
    description: 'Região de espaço que anula propriedades elementares dos ataques.',
    weaknesses: ['FOGO', 'CHOQUE'],
    drops: ['Essência do Vazio'],
    raridade: 'INCOMUM'
  },
  'Sombra da Simetria': {
    description: 'Reflexo sombrio que duplica qualquer ação ofensiva do jogador.',
    weaknesses: ['ESMAGAMENTO'],
    drops: ['Sombra Cristalizada'],
    raridade: 'INCOMUM'
  },
  'Tensor de Tensão': {
    description: 'Campo de força tensorial que deforma o espaço e drena estabilidade.',
    weaknesses: ['CORTE', 'VAZIO'],
    drops: ['Fragmento Tensorial', 'Orbes Deformadas'],
    raridade: 'RARO'
  },

  // --- BIOMA: A Espiral de Euler ---
  'Espiral de Fibonacci': {
    description: 'Criatura que cresce exponencialmente a cada turno de combate.',
    weaknesses: ['VAZIO', 'CORTE'],
    drops: ['Sequência Cristalizada', 'Orbes Espirais'],
    raridade: 'COMUM'
  },
  'Constante de Euler': {
    description: 'Ser matemático imune a variações de dano — seu ataque é sempre constante.',
    weaknesses: ['CHOQUE', 'ESMAGAMENTO'],
    drops: ['Número de Euler', 'Essência e'],
    raridade: 'INCOMUM'
  },
  'Polígono de Gauss': {
    description: 'Guardião geométrico com defesa absoluta em combinações de números ímpares.',
    weaknesses: ['FOGO', 'CORTE'],
    drops: ['Fragmento Poligonal'],
    raridade: 'INCOMUM'
  },
  'Somatório Infinito': {
    description: 'Ser que acumula dano infinitamente antes de descarregá-lo de uma vez.',
    weaknesses: ['CORTE'],
    drops: ['Série Divergente', 'Orbes Infinitas'],
    raridade: 'RARO'
  },

  // --- BIOMA: O Labirinto de Lovelace ---
  'Loop Infinito': {
    description: 'Processo recursivo sem condição de parada, imune a sangramento.',
    weaknesses: ['CORTE', 'ESMAGAMENTO'],
    drops: ['Registro de Loop', 'Orbes Recursivas'],
    raridade: 'COMUM'
  },
  'Exceção de Pilha': {
    description: 'Erro de execução materializado que causa colapso de estabilidade.',
    weaknesses: ['FOGO', 'VAZIO'],
    drops: ['Stack Trace', 'Fragmento de Erro'],
    raridade: 'INCOMUM'
  },
  'Ponteiro Nulo': {
    description: 'Referência ao nada — seus ataques ignoram completamente a armadura.',
    weaknesses: ['LUZ', 'FOGO'],
    drops: ['Endereço Nulo', 'Orbes Nulas'],
    raridade: 'INCOMUM'
  },
  'Daemon de Lovelace': {
    description: 'Algoritmo ancestral que Ada Lovelace nunca conseguiu depurar.',
    weaknesses: ['CHOQUE', 'ESMAGAMENTO'],
    drops: ['Algoritmo Primordial'],
    raridade: 'RARO'
  },

  // --- INIMIGOS GENÉRICOS ---
  'Esqueleto de Gauss': {
    description: 'Restos de um erudito corrompido pelas Fendas do Exílio.',
    weaknesses: ['ESMAGAMENTO', 'LUZ'],
    drops: ['Osso de Gauss', 'Orbes'],
    raridade: 'COMUM'
  },
  'Sentinela de Maxwell': {
    description: 'Guardião electromagnético que patrulha as Fendas sem descanso.',
    weaknesses: ['VAZIO', 'ESMAGAMENTO'],
    drops: ['Bobina de Maxwell', 'Orbes Magnéticas'],
    raridade: 'INCOMUM'
  },
  'Gárgula de Euclides': {
    description: 'Construto geométrico de pedra com ângulos perfeitos e dureza máxima.',
    weaknesses: ['FOGO', 'ESMAGAMENTO'],
    drops: ['Fragmento Geométrico'],
    raridade: 'INCOMUM'
  },
  'Diferencial de Leibniz': {
    description: 'Entidade matemática que representa uma mudança infinitesimal do caos.',
    weaknesses: ['CORTE', 'CHOQUE'],
    drops: ['dx Cristalizado', 'Orbes Diferenciais'],
    raridade: 'COMUM'
  },

  // --- BOSSES TEMÁTICOS ---
  'CHEFE: Isaac Newton Corrompido': {
    description: 'O arquiteto da física clássica, corrompido pelas forças do Exílio.',
    weaknesses: ['CHOQUE', 'VAZIO'],
    drops: ['Maçã da Força', 'Orbes Gravitacionais', 'TOMO: Principia'],
    raridade: 'RARO'
  },
  'CHEFE: Sombra de Hawking': {
    description: 'A radiação de Hawking ganhou consciência própria e forma devastadora.',
    weaknesses: ['LUZ', 'CORTE'],
    drops: ['Radiação Primordial', 'Orbes Singulares'],
    raridade: 'RARO'
  },
  'CHEFE: A Máquina Implacável': {
    description: 'O maior autômato de Turing: computação sem fim, destruição sem propósito.',
    weaknesses: ['FOGO', 'ESMAGAMENTO'],
    drops: ['Fita Universal', 'Orbes Computacionais'],
    raridade: 'RARO'
  },
  'CHEFE: Guardiã do Vazio': {
    description: 'Encarnação das simetrias de Noether que guardam o equilíbrio eterno.',
    weaknesses: ['CORTE', 'FOGO'],
    drops: ['Simetria Eterna', 'Orbes de Conservação'],
    raridade: 'RARO'
  },
  'CHEFE: Euler, Arquiteto da Identidade': {
    description: 'A equação mais bela da matemática, e^(iπ)+1=0, ganhou forma aterrorizante.',
    weaknesses: ['VAZIO', 'ESMAGAMENTO'],
    drops: ['e^(iπ)+1=0', 'Orbes da Identidade'],
    raridade: 'RARO'
  },
  'CHEFE: Lovelace, Tecelã da Lógica': {
    description: 'O primeiro algoritmo da história se tornou uma entidade independente.',
    weaknesses: ['FOGO', 'CHOQUE'],
    drops: ['Primeiro Programa', 'Orbes Lógicas'],
    raridade: 'RARO'
  }
};

/**
 * Retorna dados do bestiário para um monstro pelo nome.
 * Fallback para dados genéricos se o monstro não estiver mapeado.
 * @param {string} name
 * @returns {{ description, weaknesses, drops, raridade }}
 */
function getEnemyData(name) {
  if (BESTIARY_DATA[name]) return BESTIARY_DATA[name];

  // Bosses com nomes dinâmicos (ex: "SENHOR DA ASCENSÃO — Andar 15")
  if (name.includes('SENHOR DA ASCENSÃO')) {
    return {
      description: 'O Senhor que domina todas as Fendas — forma máxima de poder corrompido.',
      weaknesses: ['CORTE', 'VAZIO', 'CHOQUE'],
      drops: ['Alma da Ascensão', 'Orbes do Senhor'],
      raridade: 'RARO'
    };
  }
  if (name.includes('BOSS RUSH')) {
    return {
      description: 'Guardião convocado pela Arena dos Arquitetos em máxima potência.',
      weaknesses: ['ESMAGAMENTO'],
      drops: ['Orbes da Arena'],
      raridade: 'RARO'
    };
  }
  if (name.includes('CHEFE') || name.includes('ARQUITETO')) {
    return {
      description: 'Guardião das Fendas de poder imenso e natureza desconhecida.',
      weaknesses: ['VAZIO'],
      drops: ['Orbes do Guardião'],
      raridade: 'RARO'
    };
  }

  // Genérico
  return {
    description: 'Uma criatura das Fendas ainda não completamente catalogada.',
    weaknesses: ['DESCONHECIDO'],
    drops: ['Orbes'],
    raridade: 'COMUM'
  };
}

/**
 * Verifica se um nome de inimigo é considerado boss.
 * @param {string} name
 * @returns {boolean}
 */
function isBoss(name) {
  return (
    name.includes('CHEFE') ||
    name.includes('SENHOR') ||
    name.includes('BOSS RUSH') ||
    name.includes('ARQUITETO')
  );
}

module.exports = { BESTIARY_DATA, getEnemyData, isBoss };
