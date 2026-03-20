const blessed = require('blessed');
const chalk = require('chalk');
const { T, setTheme, getActiveKey, THEME_NAMES, THEMES } = require('./ui/Theme');
const Entity = require('./entities/Entity');
const Dungeon = require('./core/Dungeon');
const Combat = require('./combat/Combat');
const Puzzle = require('./core/Puzzle');
const Item = require('./items/Item');
const Sprites = require('./ui/Sprites');
const SaveSystem = require('./core/SaveSystem');
const Blacksmith = require('./items/Blacksmith');
const CraftingAltar = require('./items/CraftingAltar');
const QuestBoard = require('./core/QuestBoard');
const Nexus = require('./core/Nexus');
const DialogueEngine = require('./core/DialogueEngine');

const screen = blessed.screen({ smartCSR: true, title: 'Terminal Souls - The Echoes of Reason', fullUnicode: true, mouse: false });

// --- COMPONENTES UI ---
const titleBox = blessed.box({ top: 0, left: 'center', width: '100%', height: 5,
  content: T.danger.bold('\n ⚔  T E R M I N A L   S O U L S  ⚔ \n') + T.neutral(' ◈  The Echoes of Reason  ◈') + T.bright('                                            v1.1.0'),
  align: 'center', border: { type: 'line', fg: T.borderTitle } });
const statusBox = blessed.box({ top: 5, left: 0, width: '20%', height: 13, label: ' [ STATUS ] ', border: { type: 'line', fg: T.borderStatus } });
const synergyBox = blessed.box({ top: 18, left: 0, width: '20%', height: 8, label: ' [ SINERGIAS ] ', border: { type: 'line', fg: T.borderSynergy }, tags: true });
const legendBox = blessed.box({ top: 26, left: 0, width: '20%', height: '30%', label: ' [ LEGENDA ] ', border: { type: 'line', fg: T.borderInteract }, tags: true });
const mapBox = blessed.box({ top: 5, left: '20%', width: '60%', height: '65%', label: ' [ MAPA DA FENDA ] ', border: { type: 'line', fg: T.borderMap }, tags: true });
const combatVisualBox = blessed.box({ top: 5, left: '20%', width: '60%', height: '65%', label: ' [ COMBATE ] ', border: { type: 'line', fg: T.borderCombat }, hidden: true, tags: true });
const logBox = blessed.log({ top: '68%', left: '20%', width: '80%', height: '30%', label: ' [ CRÔNICAS ] ', border: { type: 'line', fg: T.borderLog }, scrollable: true, alwaysScroll: true });
const actionMenu = blessed.list({ top: '68%', left: 0, width: '20%', height: '30%', label: ' [ AÇÕES ] ', border: { type: 'line', fg: T.borderAction }, keys: true, vi: true, style: { selected: { bg: T.selectedBg, bold: true } } });
const interactBox = blessed.box({ top: 'center', left: 'center', width: '50%', height: 9, label: ' [ INTERAÇÃO ] ', border: { type: 'line', fg: T.borderInteract }, hidden: true, tags: true });
const inputField = blessed.textbox({ parent: interactBox, top: 5, left: 2, width: '90%', height: 1, inputOnFocus: true, style: { bg: 'blue' } });
const storyBox = blessed.box({
  top: '8%', left: '20%', width: '60%', height: '80%',
  label: ' [ NARRATIVA ] ',
  border: { type: 'line', fg: 'yellow' },
  hidden: true, tags: true, scrollable: true, alwaysScroll: true,
  padding: { left: 1, right: 1, top: 0, bottom: 0 }
});
const inventoryBox = blessed.list({ top: 5, left: '20%', width: '60%', height: '65%', label: ' [ LISTA ] ', border: { type: 'line', fg: T.borderInventory }, keys: true, vi: true, style: { selected: { bg: T.inventorySelectedBg, bold: true } }, hidden: true });
const itemDetailBox = blessed.box({ top: '68%', left: '20%', width: '80%', height: '30%', label: ' [ ANALISE DE DADOS ] ', border: { type: 'line', fg: T.borderLog }, tags: true, hidden: true });
const equipVisualBox = blessed.box({ top: 5, left: '80%', width: '20%', height: '65%', label: ' [ EQUIPAMENTO ] ', border: { type: 'line', fg: T.borderEquip }, tags: true, scrollable: true });

let player = null;

// Gera barra de progresso ASCII colorida
function makeBar(current, max, length = 8) {
  const ratio = Math.max(0, Math.min(1, current / max));
  const filled = Math.round(ratio * length);
  const empty = length - filled;
  return '█'.repeat(filled) + '░'.repeat(empty);
}

let currentBlacksmith = new Blacksmith(1);
let currentAltar = new CraftingAltar();
let questBoard = new QuestBoard();
let currentDungeon = null;
let currentCombat = null;
let currentNexus = new Nexus();
let dialogueEngine = new DialogueEngine();
let lastBiomeKey = null; // Último bioma visitado (para contexto de Darwin)
let gameState = 'MENU';
let prevState = null; // Estado anterior — usado pelo botão Voltar para navegação correta
let storyCallback = null;          // Callback após fechar story
const visitedBiomes = new Set();   // Biomas já visitados (para narrativa de entrada)
const metNpcs = new Set();         // NPCs já conhecidos (para diálogo de 1ª vez)
let creationData = {};
let bossRushWave = 0;
let bossRushScore = 0;
const BOSS_RUSH_SEQUENCE = [
  { floor: 5,  name: 'BOSS RUSH: Isaac Newton Corrompido',       mult: 1.0 },
  { floor: 10, name: 'BOSS RUSH: Sombra de Hawking',             mult: 1.1 },
  { floor: 15, name: 'BOSS RUSH: A Máquina Implacável',          mult: 1.2 },
  { floor: 20, name: 'BOSS RUSH: Guardiã do Vazio',              mult: 1.3 },
  { floor: 25, name: 'BOSS RUSH: Euler, Arquiteto da Identidade',mult: 1.4 },
  { floor: 30, name: 'BOSS RUSH: Lovelace, Tecelã da Lógica',   mult: 1.5 },
  { floor: 50, name: 'BOSS RUSH: SENHOR DA ASCENSÃO — Forma Pura', mult: 2.0 }
];

// --- SISTEMA DE SAVE ---
function saveGame() { if (player && SaveSystem.save(player.serialize())) log(T.success('💾 Alma vinculada (Salvo).')); }
function loadGame() {
  const data = SaveSystem.load();
  if (data) { player = Entity.fromSave(data); log(T.player('✨ Reencarnação concluída.')); updateStatus(); showNexus(); }
}

// --- STORY OVERLAY ---
function showStory(title, content, callback) {
  storyCallback = callback || null;
  gameState = 'STORY';
  storyBox.setLabel(` [ ${title} ] `);
  storyBox.setContent(content);
  mapBox.hide(); combatVisualBox.hide(); inventoryBox.hide();
  storyBox.show();
  actionMenu.setLabel(' [ NARRATIVA ] ');
  actionMenu.setItems([' [Enter/1] Continuar', ' [ESC] Pular']);
  actionMenu.focus();
  screen.render();
}

function closeStory() {
  storyBox.hide();
  mapBox.show(); logBox.show();
  const cb = storyCallback;
  storyCallback = null;
  if (cb) cb();
  else showNexus();
}

function showNpcStory(npcId, player, onContinue) {
  const portrait = Sprites.getNpcPortrait(npcId);
  const context = npcId === 'Darwin' ? { biome: lastBiomeKey } : {};
  const dialogue = dialogueEngine.getDialogue(npcId, player, context);

  const portraitStr = portrait.map(l => T.warning('  ' + l)).join('\n');
  const divider = T.neutral('\n  ' + '─'.repeat(34) + '\n');

  const content =
    '\n' + portraitStr + '\n' +
    divider +
    '\n' + T.bright('  ' + dialogue) +
    '\n\n' + T.neutral('  [1/Enter] Continuar  [ESC] Pular');

  showStory(npcId, content, onContinue);
}

const BIOME_INTROS = {
  newton:   'Você entra no Prisma de Newton.\n\n  Aqui, a luz é fragmentada em armas espectrais e a gravidade é uma prisão. As criaturas se alimentam de fótons e massa pura.\n\n  "Eu fui corrompido pela minha própria descoberta," sussurra uma voz. "Mas a física não mente."\n\n  Prepare-se para enfrentar os Guardiões da Luz.',
  hawking:  'Você entra na Singularidade de Hawking.\n\n  Onde o tempo se curva e o espaço colapsa em si mesmo. A radiação de Hawking ganhou consciência — e quer te consumir.\n\n  O horizonte de eventos está em todo lugar. Não há escape pela força bruta.\n\n  Prepare-se para enfrentar os Guardiões do Vácuo.',
  turing:   'Você entra no Motor de Turing.\n\n  Uma máquina infinita de cálculo que nunca para. Os autômatos aqui foram programados para uma única função: destruir.\n\n  "O problema da parada não tem solução," ecoa no corredor. "Nem para você."\n\n  Prepare-se para enfrentar os Guardiões do Código.',
  noether:  'Você entra no Vazio de Noether.\n\n  A simetria é lei aqui. Tudo que você faz é espelhado. Tudo que você destrói, se reconstrói.\n\n  "A conservação é absoluta," a Guardiã sussurra. "Sua energia pertence ao Vazio."\n\n  Prepare-se para enfrentar os Guardiões da Simetria.',
  euler:    'Você entra na Espiral de Euler.\n\n  Onde os números ganham forma. As criaturas crescem em padrões de Fibonacci, suas forças multiplicando a cada ciclo.\n\n  "e elevado a iπ mais 1 igual a zero," ressoa no ar. "A equação mais bela — e a mais letal."\n\n  Prepare-se para enfrentar os Guardiões da Identidade.',
  lovelace: 'Você entra no Labirinto de Lovelace.\n\n  Um algoritmo sem fim. Loops recursivos, exceções não tratadas, ponteiros para o nada.\n\n  "O primeiro programa foi meu," a Tecelã murmura. "Este labirinto também é. Você nunca vai depurá-lo."\n\n  Prepare-se para enfrentar os Guardiões da Lógica.'
};

function showBiomeIntro(biome) {
  const text = BIOME_INTROS[biome.key] || `Você entra em ${biome.name}.`;
  const content = '\n' + T.warning.bold('  ══ ' + biome.name.toUpperCase() + ' ══') +
    '\n\n' + T.neutral(text.split('\n').map(l => '  ' + l).join('\n')) +
    '\n\n' + T.neutral('  [1/Enter] Adentrar a Fenda  [ESC] Continuar');
  showStory(biome.name, content, () => {
    gameState = 'EXPLORING';
    mapBox.show(); mapBox.setLabel(chalk[biome.color](` [ ${biome.name} ] `));
    mapBox.setContent(currentDungeon ? '' : '');
    actionMenu.setLabel(' [ EXPLORAÇÃO ] ');
    actionMenu.setItems([' [1] Norte', ' [2] Sul', ' [3] Oeste', ' [4] Leste', ' [5] Inv', ' [6] Skills', ' [ESC] Fugir']);
    actionMenu.focus();
    if (currentDungeon) renderMap();
  });
}

// --- RENDERIZAÇÃO ---
function updateStatus() {
  if (!player) return;
  const prestige = player.calculatePrestige();

  // Cores por limiar de HP
  const hpRatio = player.hp / player.maxHp;
  const hpColor = T.hpColor(hpRatio);
  const spColor = T.spColor(player.sp / player.maxSp);
  const mpColor = T.mpColor(player.mp / player.maxMp);

  // Cor de acento por classe
  const classColors = { Guerreiro: T.classGuerreiro, Mago: T.classMago, Arqueiro: T.classArqueiro, Clérigo: T.classClerigo };
  const accent = classColors[player.background] || T.player;

  // Barras de recursos
  const hpBar  = hpColor(makeBar(player.hp, player.maxHp));
  const spBar  = spColor(makeBar(player.sp, player.maxSp));
  const mpBar  = mpColor(makeBar(player.mp, player.maxMp));
  const stBar  = T.player(makeBar(player.posture, player.maxPosture));

  // XP bar
  const xpBar  = T.neutral(makeBar(player.xp, player.level * 100, 8));

  // Postura mode badge
  const modeBadge = player.postureMode === 'DEFESA' ? T.player('[DEF]')
                  : player.postureMode === 'ATAQUE' ? T.warning('[ATK]')
                  : T.neutral('[NEU]');

  statusBox.setContent(
    `\n  ${accent.bold(player.name)}\n` +
    `  ${T.neutral(player.race + ' · ' + player.background)}\n` +
    `  ${T.neutral('Lv')}${T.bright(player.level)} ${xpBar} ${T.neutral(player.xp+'/'+(player.level*100))}\n\n` +
    `  ${chalk.bold('HP')} ${hpBar} ${hpColor(player.hp+'/'+player.maxHp)}\n` +
    `  ${chalk.bold('SP')} ${spBar} ${spColor(player.sp+'/'+player.maxSp)}\n` +
    `  ${chalk.bold('MP')} ${mpBar} ${mpColor(player.mp+'/'+player.maxMp)}\n` +
    `  ${chalk.bold('ES')} ${stBar} ${T.player(player.posture)} ${modeBadge}\n\n` +
    `  ${T.classGuerreiro('STR')} ${T.bright(player.strength)}  ${T.player('DEX')} ${T.bright(player.dexterity)}  ${T.info('INT')} ${T.bright(player.intelligence)}\n\n` +
    `  ${T.warning.bold('◈')} ${T.warning(player.orbs)} Orbes  ${T.magic.bold('✦')} ${T.magic(player.skillPoints)} Skills\n` +
    `  ${T.bright.bold('RENOME')} ${T.success.bold(prestige)}\n` +
    (player.activeQuest ? `  ${T.warning.bold('►')} ${T.warning(player.activeQuest.desc.slice(0,18)+'…')} ${T.bright(player.activeQuest.progress+'/'+player.activeQuest.target)}\n` : '')
  );

  // Sinergias + status ativos
  const classIcons = { Guerreiro: T.classGuerreiro('⚔ '), Mago: T.classMago('✦ '), Arqueiro: T.classArqueiro('→ '), Clérigo: T.classClerigo('✝ ') };
  let synergyContent = (classIcons[player.background] || '') + accent.bold(player.background + '\n');
  if (player.background === 'Guerreiro') synergyContent += T.classGuerreiro('• +10% Dano Físico\n');
  if (player.background === 'Mago')      synergyContent += T.classMago('• +10% Dano Mágico\n');
  if (player.background === 'Arqueiro')  synergyContent += T.classArqueiro('• +10 Postura Máx.\n');
  if (player.background === 'Clérigo')   synergyContent += T.classClerigo('• +10% Recuperação\n');
  if (player.postureMode === 'DEFESA')  synergyContent += T.player('• DEFESA: ×2 Def, +12% SP/turno\n');
  if (player.postureMode === 'ATAQUE') synergyContent += T.warning('• ATAQUE: +60% Dmg, -10% SP/turno\n');
  if (player.isStaggered)               synergyContent += T.criticalBg('! COLAPSO !\n');

  // Status ativos
  if (player.activeStatuses && player.activeStatuses.length > 0) {
    synergyContent += T.neutral('─────────\n');
    const statusIcons = { SANGRAMENTO: T.iconBleed('⬤'), COMBUSTÃO: T.iconBurn('⬤'), CHOQUE: T.iconShock('⚡'), CONGELAMENTO: T.iconFreeze('❄'), EVASÃO: T.iconEvade('◎'), IMUNIDADE: T.iconImmunity('⬡') };
    player.activeStatuses.forEach(s => {
      const icon = statusIcons[s.name] || T.neutral('•');
      synergyContent += `${icon} ${T.bright(s.name)} ${T.neutral('('+s.duration+'t)')}\n`;
    });
  }
  synergyBox.setContent(synergyContent);

  let equipContent = `${chalk.bold('EQUIPADO:')}\n\n`;
  for (const [type, item] of Object.entries(player.equipment)) {
    equipContent += `${chalk.bold.underline(type)}: ${item ? item.getColorizedName() : T.neutral('Vazio')}\n`;
    if (item) { for (const [s, v] of Object.entries(item.stats)) { if (typeof v === 'number') equipContent += ` ${T.success('+'+v)} ${s.toUpperCase()}\n`; } }
    equipContent += '\n';
  }
  equipVisualBox.setContent(equipContent);
  updateLegend(); screen.render();
}

function updateLegend() {
  let content = '';
  if (gameState === 'EXPLORING' && currentDungeon) {
    content += `${Sprites.objects.player || '@ '} : Voce\n${Sprites.objects.enemy} : Inimigo\n${Sprites.objects.boss} : Guardiao\n${Sprites.objects.treasure} : Tesouro\n${Sprites.objects.door} : Escada\n${Sprites.objects.puzzle} : Enigma\n${Sprites.objects.rest} : Descanso\n${T.magic('? ')} : Lore\n`;
  } else if (gameState === 'COMBAT' && currentCombat) {
    const enemy = currentCombat.enemies[0];
    content += `${T.danger.bold('ALVO:')}\n${enemy.name}\nLvl: ${enemy.level}\nEstabilidade: ${enemy.posture}\n`;
    if (enemy.isStaggered) content += T.criticalBg(' COLAPSO ') + '\n';
  } else if (gameState === 'NEXUS') {
    content += T.info.bold('NEXUS — CONTROLES:\n');
    content += T.neutral('WASD') + ' mover\n';
    content += T.neutral('[7]') + ' Inventário\n';
    content += T.neutral('[8]') + ' Bestiário\n';
    content += T.neutral('[9]') + ' Skills\n';
    content += T.neutral('[0]') + ' Temas\n';
    content += '\n' + T.info.bold('NPCs:\n');
    content += T.warning('H') + ' Halthor (loja)\n';
    content += T.info('A') + ' Ada (skills)\n';
    content += T.success('D') + ' Darwin (atrib.)\n';
    content += T.magic('M') + ' Marie (craft)\n';
    content += T.danger('Ω') + ' Fenda (dungeon)\n';
    content += T.danger('β') + ' Arena (rush)\n';
    content += '\n' + T.neutral('♦') + ' deco\n';
  }
  legendBox.setContent(content);
}

// --- ATUALIZAÇÃO DINÂMICA DA SEÇÃO DE DETALHES ---
function updateDetailSection(listComponent) {
  const i = listComponent.selected;
  if (gameState === 'INVENTORY' && player.inventory[i]) {
    itemDetailBox.setContent(player.inventory[i].getDetails());
  } else if (gameState === 'SKILL_TREE') {
    const name = Object.keys(player.skillTree)[i];
    const s = player.skillTree[name];
    if (s) itemDetailBox.setContent(`${T.player.bold(name)}\n\nNivel: ${s.lvl}\nCusto de Mana: ${s.cost}\nDescricao: ${s.desc}\n\nUse [1-0] ou Enter para upar.`);
  } else if (gameState === 'BESTIARY') {
    const name = Object.keys(player.bestiary)[i];
    if (name) {
      const entry = player.bestiary[name];
      if (typeof entry === 'object' && entry !== null) {
        const weakStr = entry.weaknesses && entry.weaknesses.length > 0 ? entry.weaknesses.join(', ') : 'Desconhecida';
        const dropsStr = entry.drops && entry.drops.length > 0 ? entry.drops.join(', ') : 'Desconhecido';
        itemDetailBox.setContent(
          `${T.danger.bold(name)}\n\n` +
          `Raridade: ${T.warning(entry.raridade || 'COMUM')}\n` +
          `Abates: ${T.bright(entry.kills || 0)}\n` +
          `Primeiro encontro: Andar ${entry.firstSeenFloor || 1}\n\n` +
          `${T.neutral(entry.description || 'Criatura das Fendas.')}\n\n` +
          `${T.info('Fraquezas:')} ${weakStr}\n` +
          `${T.warning('Drops:')} ${dropsStr}`
        );
      } else {
        itemDetailBox.setContent(`${T.danger.bold(name)}\n\nAbates: ${entry}\nAnalise: Habitante das fendas.`);
      }
    }
  } else if (gameState === 'MARIE' && player.inventory[i]) {
    itemDetailBox.setContent(player.inventory[i].getDetails() + '\n\n' + T.magic('Selecione para Reroll (20 Orbes).'));
  }
  screen.render();
}

inventoryBox.on('element focus', (el) => updateDetailSection(inventoryBox));
actionMenu.on('element focus', (el) => {
  if (gameState === 'NEXUS' || gameState === 'COMBAT') {
    const text = el.getText();
    itemDetailBox.setContent(chalk.bold.yellow('Acao Selecionada:\n\n') + text + '\n\nNavegue com Q/E ou 1-0.');
    screen.render();
  } else if (gameState === 'CREATION_RACE') {
    const raceDetails = {
      'Humano':  'HUMANO — Versátil\n\n+2 STR | +2 DEX | +2 INT\n\nEquilibrado em tudo. Funciona com\nqualquer classe. Ideal para iniciantes\nou builds híbridas.',
      'Elfo':    'ELFO — Feiticeiro Nato\n\n+5 INT\n\nPoder mágico superior. Combina com\nMago para máximo dano elemental.\nFraco em combate corpo a corpo.',
      'Anão':    'ANÃO — Fortaleza Viva\n\n+5 STR\n\nResistência e força bruta. Melhor com\nGuerreiro ou Clérigo. SP alto e dano\nfísico máximo.',
      'Orc':     'ORC — Predador Ágil\n\n+5 DEX\n\nReflexos e velocidade superiores.\nSinérgico com Arqueiro. Evade ataques\ne golpeia com precisão letal.'
    };
    const key = el.getText().trim().split(/\s+/)[0];
    itemDetailBox.setContent(raceDetails[key] || '');
    itemDetailBox.show(); screen.render();
  } else if (gameState === 'CREATION_CLASS') {
    const classDetails = {
      'Guerreiro': 'GUERREIRO — Força e Impacto\n\nAtributo: STR\nEstilo: Tanque agressivo\n\nSkills iniciais:\n• Impacto de Newton — Golpe massivo\n• Inércia de Galileu — Recupera SP\n\nUse DEFESA para tankar, ATAQUE\npara explosões de dano.',
      'Mago':      'MAGO — Poder Elemental\n\nAtributo: INT\nEstilo: Dano em área, efeitos\n\nSkills iniciais:\n• Raio de Maxwell — Choque elétrico\n• Chama de Lavoisier — Fogo/combustão\n\nAltíssimo dano, baixa resistência.',
      'Arqueiro':  'ARQUEIRO — Precisão e Velocidade\n\nAtributo: DEX\nEstilo: Controle e mobilidade\n\nSkills iniciais:\n• Flecha de Hawking — Projétil preciso\n• Óptica de Euclides — Aumenta alcance\n\nEvita dano, ataca a distância.',
      'Clérigo':   'CLÉRIGO — Suporte e Cura\n\nAtributo: INT/STR híbrido\nEstilo: Sustentação e resistência\n\nSkills iniciais:\n• Cura de Hipócrates — Restaura HP\n• Sopro de Gaia — Cura de emergência\n\nBônus +10% em todas as recuperações.'
    };
    itemDetailBox.setContent(classDetails[el.getText().trim()] || '');
    itemDetailBox.show(); screen.render();
  }
});

function showInventory() {
  prevState = gameState; // Salva de onde veio (NEXUS, EXPLORING, etc.)
  gameState = 'INVENTORY'; mapBox.hide(); logBox.hide(); inventoryBox.show(); itemDetailBox.show();
  inventoryBox.setLabel(' [ INVENTÁRIO ] ');
  const items = player.inventory.map(it => `${it.getColorizedName()} (${it.type})`);
  inventoryBox.setItems(items); inventoryBox.focus();
  actionMenu.setItems([' [V/ESC] Voltar']);
  updateDetailSection(inventoryBox);
}

inventoryBox.on('select', (item, index) => {
  if (gameState === 'INVENTORY') { const it = player.inventory[index]; if (!it) return; if (it.type === 'CONSUMÍVEL' || it.type === 'TOMO') { player.useConsumable(it); log(T.success(`Usado: ${it.name}`)); } else player.equipItem(it); updateStatus(); showInventory(); }
  else if (gameState === 'SKILL_TREE') { const n = Object.keys(player.skillTree)[index]; if (player.upgradeSkill(n)) { log(T.success(`Up: ${n}`)); showPassives(); } }
  else if (gameState === 'MARIE') handleMarieAction(index);
});

function showPassives() {
  prevState = gameState; // Salva de onde veio (NEXUS, EXPLORING, etc.)
  gameState = 'SKILL_TREE'; mapBox.hide(); logBox.hide(); inventoryBox.show(); itemDetailBox.show();
  const items = Object.keys(player.skillTree).map(n => ` [${player.skillTree[n].lvl}] ${n}`);
  inventoryBox.setItems(items); inventoryBox.setLabel(` [ ARVORE DE SKILLS - PONTOS: ${player.skillPoints} ] `); 
  inventoryBox.focus(); updateDetailSection(inventoryBox);
}

function showBestiary() {
  prevState = gameState; // add this
  gameState = 'BESTIARY'; mapBox.hide(); logBox.hide(); inventoryBox.show(); itemDetailBox.show();
  const known = Object.keys(player.bestiary);
  const items = known.length > 0 ? known.map(name => {
    const entry = player.bestiary[name];
    const kills = typeof entry === 'number' ? entry : (entry.kills || 0);
    const raridade = typeof entry === 'object' ? entry.raridade : 'COMUM';
    const rarColor = raridade === 'RARO' ? T.rarityRaro : raridade === 'INCOMUM' ? T.rarityMagico : T.neutral;
    return `${rarColor('[' + raridade + ']')} ${T.danger(name)} - Abates: ${kills}`;
  }) : [T.neutral('Nenhum dado.')];
  inventoryBox.setItems(items); inventoryBox.setLabel(` [ BESTIARIO - ${known.length} criaturas ] `); inventoryBox.focus();
  actionMenu.setItems([' [V/ESC] Voltar']); updateDetailSection(inventoryBox);
}

function showNexus() {
  gameState = 'NEXUS'; mapBox.show(); logBox.show(); inventoryBox.hide(); itemDetailBox.show();
  mapBox.setLabel(T.info(' [ O NEXUS - VILA DO CONHECIMENTO ] '));
  mapBox.setContent(currentNexus.render());
  actionMenu.setItems([' [WASD] Mover', ' [7] Inventário', ' [8] Bestiário', ' [9] Skills', ' [0] Configurações', ' [ESC] Sair']);
  actionMenu.focus(); updateStatus();
}

function showAda() { gameState = 'ADA'; actionMenu.setLabel(' [ ADA: ALGORITMOS ] '); actionMenu.setItems([' [1] Compilar Skill (50 Orbes)', ' [ESC] Voltar']); actionMenu.focus(); }
function handleAda(c) { if (c.includes('Compilar')) { if (player.compileSkill(50)) { log(T.player('Skill Points +1.')); showNexus(); } else log(T.danger('Sem orbes.')); } }

function showMarie() {
  gameState = 'MARIE';
  const config = currentAltar.getMasteryConfig(player.craftingMastery);
  actionMenu.setLabel(currentAltar.getMenuLabel(player));
  const menuItems = [' [ESC] Voltar'];
  if (config.upgradeLabel) menuItems.unshift(` [U] ${config.upgradeLabel}`);
  actionMenu.setItems(menuItems);
  itemDetailBox.setContent(
    T.magic.bold(`\n  Maestria: ${config.label} (Nível ${player.craftingMastery || 0})\n`) +
    T.bright(`  Efeito: ${config.effectDesc}\n`) +
    T.warning(`  Custo de Transmutação: ${config.cost} Orbes\n`) +
    T.neutral(`  Elegíveis: ${config.rarityReq.join(', ')}\n\n`) +
    T.neutral('  Selecione um item do inventário para transmutar.')
  );
  const items = player.inventory.map(it => `${it.getColorizedName()}`);
  inventoryBox.setItems(items); inventoryBox.show(); inventoryBox.focus(); mapBox.hide(); itemDetailBox.show();
  updateDetailSection(inventoryBox);
}

function handleMarieAction(index) {
  const result = currentAltar.reRollItem(player, index);
  if (result && result.success) {
    if (result.promoted) log(T.warning.bold('PROMOÇÃO! Item elevado para RARO!'));
    else log(T.success('Transmutação concluída!'));
    showMarie(); updateStatus();
  } else {
    log(T.danger('Falha: Orbes insuficientes ou item inelegível.'));
  }
}

function showDarwin() { gameState = 'DARWIN'; actionMenu.setLabel(' [ DARWIN: EVOLUCAO ] '); actionMenu.setItems([' [1] + FORÇA (30 Orbes)', ' [2] + DESTREZA (30 Orbes)', ' [3] + INTELIGÊNCIA (30 Orbes)', ' [ESC] Voltar']); actionMenu.focus(); }
function handleDarwin(c) {
  let s = false;
  if (c.includes('FORÇA')) s = player.adaptAttribute('STR', 30);
  else if (c.includes('DESTREZA')) s = player.adaptAttribute('DEX', 30);
  else if (c.includes('INTELIGÊNCIA')) s = player.adaptAttribute('INT', 30);
  if (s) { log(T.success('Evoluído!')); updateStatus(); showNexus(); } else log(T.danger('Sem orbes.'));
}

function showBlacksmith() { gameState = 'TRADE_BUY'; actionMenu.setLabel(' [ HALTHOR: FERREIRO ] '); actionMenu.setItems(currentBlacksmith.getMenuOptions()); actionMenu.focus(); }
function showBlacksmithSell() { prevState = 'TRADE_BUY'; gameState = 'TRADE_SELL'; const items = player.inventory.map(it => `${it.getColorizedName()} (${Math.floor(it.getPrice()*0.4)} Orbes)`); items.push(' [ESC] Voltar'); actionMenu.setItems(items); actionMenu.focus(); }
function handleTrade(c, index) {
  if (gameState === 'TRADE_BUY') { if (c.includes('VENDER')) showBlacksmithSell(); else if (currentBlacksmith.buyItem(player, index)) { log(T.success('Comprado!')); showBlacksmith(); updateStatus(); } else log(T.danger('Sem orbes!')); }
  else if (gameState === 'TRADE_SELL') { if (c.includes('Voltar')) showBlacksmith(); else { const v = currentBlacksmith.sellItem(player, index); if (v) { log(T.success(`Vendido: ${v}`)); showBlacksmithSell(); updateStatus(); } } }
}

function showQuests() { gameState = 'QUESTS'; actionMenu.setLabel(' [ QUADRO DE MISSÕES ] '); actionMenu.setItems(questBoard.getMenuOptions(player)); actionMenu.focus(); }
function handleQuests(c, i) {
  if (c.includes('Voltar')) { showNexus(); return; }
  if (c.includes('ENTREGAR')) {
    const result = questBoard.turnInQuest(player);
    if (result.success) {
      log(T.success('Missão concluída! Recompensa recebida.'));
      // Recompensa especial para missões LORE: Tomo Histórico LENDÁRIO
      if (result.specialReward) {
        const tomo = new Item(player.level, 'LENDÁRIO');
        tomo.type = 'TOMO';
        tomo.consumableType = 'TOMO';
        tomo.name = 'Tomo Historico do Exilio';
        tomo.flavorText = 'Compilado dos fragmentos historicos encontrados nas Fendas do Exilio. Conhecimento e poder.';
        const baseVal = 10 * (1 + player.level * 0.1) * 3.5;
        tomo.stats = {
          recoverHp: Math.floor(baseVal * 0.8),
          recoverSp: Math.floor(baseVal * 0.8),
          recoverMp: Math.floor(baseVal * 0.8)
        };
        player.inventory.push(tomo);
        log(T.magic.bold('>>> RECOMPENSA ESPECIAL: Tomo Historico do Exilio (LENDARIO) adicionado ao inventario! <<<'));
      }
      showQuests(); updateStatus();
    }
  }
  else if (questBoard.acceptQuest(player, i)) { log(T.player('Aceita!')); showQuests(); } else log(T.danger('Erro.'));
}

function renderMap() {
  if (!currentDungeon) return; let d = '';
  for (let y = 0; y < currentDungeon.height; y++) {
    for (let x = 0; x < currentDungeon.width; x++) {
      if (x === currentDungeon.playerPos.x && y === currentDungeon.playerPos.y) { d += T.tilePlayer; continue; }
      const t = currentDungeon.grid[y][x];
      if (!t.discovered) { d += T.tileFog; continue; }
      switch(t.type) {
        case 'WALL':     d += Sprites.objects.wall; break;
        case 'FLOOR':    d += Sprites.objects.floor; break;
        case 'TREASURE': d += Sprites.objects.treasure; break;
        case 'ENEMY':    d += Sprites.objects.enemy; break;
        case 'BOSS':     d += Sprites.objects.boss; break;
        case 'PUZZLE':   d += Sprites.objects.puzzle; break;
        case 'EXIT':     d += Sprites.objects.door; break;
        case 'REST':     d += Sprites.objects.rest; break;
        case 'LORE':     d += T.magic('? '); break;
        default:         d += Sprites.objects.floor; break;
      }
    }
    d += '\n';
  }
  mapBox.setContent(d); updateLegend(); screen.render();
}

function renderCombat() {
  if (!currentCombat) return;
  const e = currentCombat.enemies[0];
  const es = Sprites.getEnemySprite(e.name);
  const ps = Sprites.getPlayerSprite(player.race);
  const boxW = Math.floor(screen.width * 0.60) - 4;
  const spriteW = 24;
  const enemyPad = Math.max(2, Math.floor(boxW * 0.60) - spriteW);
  const playerPad = Math.max(2, Math.floor(boxW * 0.04));
  const dividerLen = Math.min(boxW - playerPad, 55);
  let d = '\n';
  es.forEach(l => { d += ' '.repeat(enemyPad) + l + '\n'; });
  d += ' '.repeat(enemyPad) + T.danger.bold(e.name) + '\n';
  const hpP = Math.min(10, Math.max(0, Math.floor(e.hp / e.maxHp * 10)));
  d += ' '.repeat(enemyPad) + `HP: [${'#'.repeat(hpP)}${'.'.repeat(10 - hpP)}]\n\n`;
  d += ' '.repeat(playerPad) + '-'.repeat(dividerLen) + '\n\n';
  ps.forEach(l => { d += ' '.repeat(playerPad) + l + '\n'; });
  d += ' '.repeat(playerPad) + T.success.bold(player.name) + '\n';
  d += ' '.repeat(playerPad) + `HP: ${makeBar(player.hp, player.maxHp, 12)} ${T.success(player.hp + '/' + player.maxHp)}\n`;
  combatVisualBox.setContent(d); updateLegend(); screen.render();
}

function log(msg) { logBox.log(msg); screen.render(); }

function startDungeon(floor = 1) {
  // Calcula quantos tiles cabem no mapBox (cada tile = 2 chars, descontar bordas)
  const availW = Math.max(20, Math.floor((screen.width * 0.60 - 4) / 2));
  const availH = Math.max(10, Math.floor(screen.height * 0.65 - 2));
  currentDungeon = new Dungeon(floor, availW, availH); gameState = 'EXPLORING';
  lastBiomeKey = currentDungeon.biome.key;
  mapBox.setLabel(chalk[currentDungeon.biome.color](` [ ${currentDungeon.biome.name} - ${floor} ] `));
  mapBox.show(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.show(); logBox.show();
  actionMenu.setLabel(' [ EXPLORACAO ] '); actionMenu.setItems([' [1] Norte', ' [2] Sul', ' [3] Oeste', ' [4] Leste', ' [5] Inv', ' [6] Skills', ' [ESC] Fugir']);
  log(T.success(`Fenda ${floor} aberta.`));

  // Narrativa de entrada no bioma (primeira visita)
  if (!visitedBiomes.has(currentDungeon.biome.key)) {
    visitedBiomes.add(currentDungeon.biome.key);
    showBiomeIntro(currentDungeon.biome);
    return; // showBiomeIntro handles the state transition
  }

  // Auto-progresso de missão FLOOR
  if (player && player.activeQuest && player.activeQuest.type === 'FLOOR' && !player.activeQuest.completed) {
    player.activeQuest.progress = floor;
    if (floor >= player.activeQuest.target) {
      player.activeQuest.completed = true;
      log(T.success.bold(`>>> MISSÃO CONCLUÍDA! Andar ${floor} alcançado! <<<`));
    }
  }

  renderMap();
}

function handleMove(dx, dy) {
  if (gameState === 'EXPLORING') {
    const t = currentDungeon.movePlayer(dx, dy);
    if (t) {
      player.sp = Math.min(player.maxSp, player.sp + Math.floor(player.maxSp * 0.05));
      if (t.type !== 'FLOOR') handleTileInteraction(t);
      renderMap();
      updateStatus();
    }
  } else if (gameState === 'NEXUS') {
    const interaction = currentNexus.movePlayer(dx, dy);
    mapBox.setContent(currentNexus.render());
    if (interaction) {
      const npcNames = ['Halthor', 'Ada', 'Darwin', 'Marie Curie'];
      if (player && npcNames.includes(interaction.name)) {
        // For NPCs with story: show story panel before menu
        const npcMenuMap = {
          'Ada':         showAda,
          'Marie Curie': showMarie,
          'Darwin':      showDarwin,
          'Halthor':     showBlacksmith
        };
        const onContinue = npcMenuMap[interaction.name];
        if (onContinue) {
          showNpcStory(interaction.name, player, onContinue);
        }
      } else if (interaction.name === 'Fenda') {
        startDungeon();
      } else if (interaction.name === 'Arena') {
        showBossRush();
      } else {
        log(T.player(interaction.dialogue));
      }
    }
    screen.render();
  }
}
function handleTileInteraction(t) {
  switch(t.type) {
    case 'ENEMY': case 'BOSS': startCombat(t.data); t.type = 'FLOOR'; break;
    case 'EXIT': startDungeon(currentDungeon.floor + 1); break;
    case 'TREASURE': {
      const l = new Item(currentDungeon.floor);
      player.inventory.push(l);
      log(T.warning(`Loot: ${l.name}`));
      t.type = 'FLOOR';
      // Auto-progresso de missão ITEM
      if (player.activeQuest && player.activeQuest.type === 'ITEM' && !player.activeQuest.completed) {
        player.activeQuest.progress++;
        if (player.activeQuest.progress >= player.activeQuest.target) {
          player.activeQuest.completed = true;
          log(T.success.bold('>>> MISSÃO CONCLUÍDA! Retorne ao Quadro de Missões. <<<'));
        } else {
          log(T.warning(`Missão: ${player.activeQuest.progress}/${player.activeQuest.target} itens coletados.`));
        }
      }
      break;
    }
    case 'PUZZLE': startPuzzle(t); break;
    case 'REST': player.recover(0.5, 0.5, 0.5); log(T.success('Descansou.')); t.type = 'FLOOR'; break;
    case 'LORE': handleLoreTile(t); break;
  }
}

function handleLoreTile(t) {
  if (!t.data) { t.type = 'FLOOR'; return; }
  const loreText = t.data.text;
  t.type = 'FLOOR';

  // Auto-progresso de missão LORE
  let questMsg = '';
  if (player.activeQuest && player.activeQuest.type === 'LORE' && !player.activeQuest.completed) {
    player.activeQuest.progress++;
    if (player.activeQuest.progress >= player.activeQuest.target) {
      player.activeQuest.completed = true;
      questMsg = '\n\n' + T.success.bold('  ► MISSÃO LORE CONCLUÍDA! Retorne ao Nexus.');
    } else {
      questMsg = '\n\n' + T.warning(`  ► Fragmentos: ${player.activeQuest.progress}/${player.activeQuest.target}`);
    }
  }

  // Dispara evento de diálogo especial
  if (player) dialogueEngine.triggerEvent('loreDisco', player);

  const content =
    '\n' + T.magic.bold('  ══ FRAGMENTO HISTÓRICO ══\n\n') +
    T.bright('  "' + loreText + '"\n') +
    questMsg +
    '\n\n' + T.neutral('  [1/Enter] Continuar exploração');

  showStory('FRAGMENTO HISTÓRICO', content, () => {
    gameState = 'EXPLORING';
    mapBox.show();
    actionMenu.setLabel(' [ EXPLORAÇÃO ] ');
    actionMenu.setItems([' [1] Norte', ' [2] Sul', ' [3] Oeste', ' [4] Leste', ' [5] Inv', ' [6] Skills', ' [ESC] Fugir']);
    actionMenu.focus();
    renderMap();
  });
}

function startCombat(e) { gameState = 'COMBAT'; currentCombat = new Combat(player, e); mapBox.hide(); combatVisualBox.show(); renderCombat(); actionMenu.setItems([' [1] ATACAR', ' [2] SKILLS', ' [3] RECUPERAR', ' [4] POSTURA', ' [ESC] Fugir']); actionMenu.focus(); }
function handleCombatAction(c) {
  if (currentCombat.isOver) return; if (c.includes('ATACAR')) currentCombat.playerAction('ATTACK');
  else if (c.includes('SKILLS')) { const l = player.getLearnedSkills(); if (l.length === 0) log(T.danger('Sem skills!')); else { prevState = gameState; gameState = gameState === 'BOSS_RUSH' ? 'BOSS_RUSH_SKILLS' : 'COMBAT_SKILLS'; actionMenu.setItems([...l, ' [ESC] Voltar']); actionMenu.focus(); return; } }
  else if (c.includes('RECUPERAR')) currentCombat.playerAction('RECOVER');
  else if (c.includes('POSTURA')) { const m = ['NEUTRO', 'DEFESA', 'ATAQUE']; player.setPostureMode(m[(m.indexOf(player.postureMode)+1)%3]); log(T.player(`Postura: ${player.postureMode}`)); }
  processCombatTurn();
}

function processCombatTurn(s = null) {
  const prevLevel = player ? player.level : 0;
  if (s) currentCombat.playerAction('SKILL', 0, s);
  currentCombat.log.forEach(m => logBox.log(m)); currentCombat.log = []; updateStatus(); renderCombat();
  // Detecta subida para nível 10 (trigger de diálogo especial)
  if (player && player.level >= 10 && prevLevel < 10 && !dialogueEngine.hasEvent('level10', player)) {
    dialogueEngine.triggerEvent('level10', player);
    log(T.magic.bold('>>> NÍVEL 10 ALCANÇADO! Os NPCs do Nexus têm algo a dizer... <<<'));
  }
  if (!currentCombat.isOver) {
    const spDelta = { DEFESA: 0.12, NEUTRO: 0.05, ATAQUE: -0.10 };
    const rate = spDelta[player.postureMode] ?? 0;
    const delta = Math.floor(player.maxSp * Math.abs(rate));
    if (rate > 0) {
      player.sp = Math.min(player.maxSp, player.sp + delta);
      if (rate >= 0.10) log(T.player(`Postura DEFESA recuperou ${delta} SP.`));
    } else if (rate < 0) {
      player.sp = Math.max(0, player.sp - delta);
      log(T.warning(`Postura ATAQUE consumiu ${delta} SP.`));
    }
  }
  if (currentCombat.isOver) {
    // Boss Rush: tratar separadamente sem afetar o save nem a dungeon normal
    if (gameState === 'BOSS_RUSH') {
      if (currentCombat.result === 'WIN') {
        bossRushScore += BOSS_RUSH_SEQUENCE[bossRushWave].floor * 100;
        bossRushWave++;
        player.recover(0.3, 0.3, 0.3);
        updateStatus();
        log(T.success(`Guardião derrotado! Recuperação concedida. Score: ${bossRushScore}`));
        if (bossRushWave >= BOSS_RUSH_SEQUENCE.length) { showBossRushVictory(); return; }
        startBossRushWave();
      } else {
        log(T.danger(`Boss Rush encerrado na Onda ${bossRushWave + 1}.`));
        bossRushWave = 0; bossRushScore = 0;
        combatVisualBox.hide(); logBox.show();
        showNexus();
      }
      return;
    }

    if (currentCombat.result === 'WIN') {
      // Auto-progresso de missão KILL
      if (player.activeQuest && player.activeQuest.type === 'KILL' && !player.activeQuest.completed) {
        player.activeQuest.progress += currentCombat.enemies.length;
        if (player.activeQuest.progress >= player.activeQuest.target) {
          player.activeQuest.completed = true;
          log(T.success.bold('>>> MISSÃO CONCLUÍDA! Retorne ao Quadro de Missões. <<<'));
        } else {
          log(T.warning(`Missão: ${player.activeQuest.progress}/${player.activeQuest.target} inimigos.`));
        }
      }
      gameState = 'EXPLORING'; combatVisualBox.hide(); mapBox.show();
      inventoryBox.hide(); itemDetailBox.hide(); logBox.show();
      actionMenu.setLabel(' [ EXPLORAÇÃO ] ');
      actionMenu.setItems([' [1] Norte', ' [2] Sul', ' [3] Oeste', ' [4] Leste', ' [5] Inv', ' [6] Skills', ' [ESC] Fugir']);
      actionMenu.focus();
      const isFinalBoss = currentCombat.enemies.some(e => e.name.includes('SENHOR DA ASCENSÃO'));
      if (isFinalBoss) {
        showVictory();
        return;
      }
      if (currentCombat.enemies.some(e => e.name.includes('CHEFE') || e.name.includes('SENHOR') || e.name.includes('ARQUITETO'))) {
        log(T.magic('GUARDIÃO CAIU! A Escada se abre...'));
        const t = currentDungeon.getTile(currentDungeon.playerPos.x, currentDungeon.playerPos.y);
        if (t) t.type = 'EXIT';
        renderMap();
        // Dispara evento de diálogo firstBossKill (uma vez por save)
        if (player && !dialogueEngine.hasEvent('firstBossKill', player)) {
          dialogueEngine.triggerEvent('firstBossKill', player);
        }
      }
    } else {
      const entry = {
        name: player.name, race: player.race, background: player.background,
        level: player.level, prestige: player.calculatePrestige(),
        floor: currentDungeon ? currentDungeon.floor : 1,
        date: new Date().toLocaleDateString('pt-BR')
      };
      const hall = SaveSystem.saveHallOfFame(entry);
      SaveSystem.deleteSave();
      showGameOver(entry, hall);
    }
  }
}

function showGameOver(entry, hall) {
  gameState = 'GAME_OVER';
  combatVisualBox.hide(); mapBox.hide(); inventoryBox.hide(); logBox.show(); itemDetailBox.show();
  itemDetailBox.setLabel(' [ O EXÍLIO RECLAMA SUA ALMA ] ');
  const top5 = hall.slice(0, 5);
  const medals = ['◈', '✦', '★', '•', '·'];
  let content = T.danger.bold('\n  ✦ GAME OVER ✦\n\n');
  content += T.bright(`  ${entry.name} (${entry.race} ${entry.background}) sucumbiu no Andar ${entry.floor}.\n`);
  content += T.player(`  Renome Final: ${T.player.bold(entry.prestige)}\n\n`);
  content += T.warning.bold('  ══ HALL OF FAME ══\n');
  top5.forEach((e, i) => {
    content += `  ${medals[i]} ${T.bright(e.name)} ${T.neutral(`(${e.race} ${e.background})`)} `;
    content += T.warning(`Renome: ${e.prestige} `) + T.neutral(`[Lv${e.level} — ${e.date}]\n`);
  });
  content += T.danger.bold('\n  [ESC] Retornar ao Menu');
  itemDetailBox.setContent(content);
  actionMenu.setLabel(' [ GAME OVER ] ');
  actionMenu.setItems([' [ESC] Menu Principal']);
  actionMenu.focus(); screen.render();
}

function showBossRush() {
  gameState = 'BOSS_RUSH_MENU';
  mapBox.show(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.show(); logBox.show();
  itemDetailBox.setLabel(' [ ARENA DOS ARQUITETOS ] ');
  itemDetailBox.setContent(
    T.danger.bold('\n  ══ BOSS RUSH ══\n\n') +
    T.bright('  Enfrente todos os Guardiões em sequência.\n') +
    T.warning(`  ${BOSS_RUSH_SEQUENCE.length} ondas crescentes de dificuldade.\n`) +
    T.success('  Cada vitória restaura 30% HP/SP/MP.\n') +
    T.danger('  Derrota encerra o desafio (save preservado).\n')
  );
  actionMenu.setLabel(' [ ARENA ] ');
  actionMenu.setItems([' [1] Iniciar Boss Rush', ' [ESC] Voltar']);
  actionMenu.focus(); screen.render();
}

function startBossRushWave() {
  const wave = BOSS_RUSH_SEQUENCE[bossRushWave];
  const bossHp = Math.floor((80 + wave.floor * 35 + wave.floor * wave.floor * 0.5) * wave.mult);
  const boss = new Entity(wave.name, {
    hp: bossHp, maxHp: bossHp,
    sp: Math.floor((80 + wave.floor * 8) * wave.mult),
    mp: Math.floor((80 + wave.floor * 8) * wave.mult),
    level: wave.floor + 1,
    strength:     8 + Math.floor(wave.floor * 1.0),
    dexterity:    6 + Math.floor(wave.floor * 0.6),
    intelligence: 6 + Math.floor(wave.floor * 0.6)
  });
  gameState = 'BOSS_RUSH';
  currentCombat = new Combat(player, [boss]);
  mapBox.hide(); combatVisualBox.show(); itemDetailBox.hide();
  log(T.danger.bold(`=== ONDA ${bossRushWave + 1}/${BOSS_RUSH_SEQUENCE.length}: ${wave.name} ===`));
  renderCombat();
  actionMenu.setLabel(` [ BOSS RUSH — Onda ${bossRushWave + 1}/${BOSS_RUSH_SEQUENCE.length} ] `);
  actionMenu.setItems([' [1] ATACAR', ' [2] SKILLS', ' [3] RECUPERAR', ' [4] POSTURA']);
  actionMenu.focus();
}

function showBossRushVictory() {
  const bonus = Math.floor(bossRushScore * 0.1);
  player.orbs += bonus;
  SaveSystem.saveHallOfFame({
    name: player.name + ' [BOSS RUSH]', race: player.race, background: player.background,
    level: player.level, prestige: bossRushScore, floor: 0,
    date: new Date().toLocaleDateString('pt-BR')
  });
  saveGame();
  gameState = 'NEXUS';
  combatVisualBox.hide(); mapBox.show(); logBox.show(); itemDetailBox.show();
  itemDetailBox.setLabel(' [ ARENA: VITÓRIA TOTAL ] ');
  itemDetailBox.setContent(
    T.warning.bold('\n  ✦ BOSS RUSH COMPLETO! ✦\n\n') +
    T.bright(`  Todos os ${BOSS_RUSH_SEQUENCE.length} Guardiões foram derrotados.\n\n`) +
    T.player(`  Score: ${T.player.bold(bossRushScore)}\n`) +
    T.success(`  Bônus: +${bonus} Orbes\n`)
  );
  bossRushWave = 0; bossRushScore = 0;
  actionMenu.setLabel(' [ EXPLORAÇÃO ] ');
  actionMenu.setItems([' [WASD] Mover', ' [7] Inventário', ' [8] Bestiário', ' [9] Skills', ' [ESC] Sair']);
  updateStatus(); screen.render();
}

function showVictory() {
  gameState = 'VICTORY';
  const prestige = player.calculatePrestige();
  const bestiaryCount = Object.keys(player.bestiary).length;
  mapBox.hide(); combatVisualBox.hide(); inventoryBox.hide();
  logBox.show(); itemDetailBox.show();
  itemDetailBox.setLabel(' [ O FIM DO EXÍLIO ] ');
  itemDetailBox.setContent(
    T.warning.bold('\n  ╔══════════════════════════════════╗\n') +
    T.warning.bold('  ║   TERMINAL SOULS: CONCLUÍDO!     ║\n') +
    T.warning.bold('  ╚══════════════════════════════════╝\n\n') +
    T.bright.bold(`  ${player.name}, o Exilado, quebrou as Correntes do Nexus.\n\n`) +
    T.player.bold(`  RENOME FINAL: ${prestige}\n`) +
    T.success(`  Nível Alcançado: ${player.level}\n`) +
    T.success(`  Criaturas Catalogadas: ${bestiaryCount}\n`) +
    T.success(`  Orbes Acumulados: ${player.orbs}\n\n`) +
    T.neutral('  "O conhecimento é a única arma que\n   o Exílio jamais poderá confiscar."\n\n') +
    T.danger.bold('  [ESC] Retornar ao Menu Principal')
  );
  log(T.warning.bold('=== O SENHOR DA ASCENSÃO FOI DERROTADO! ==='));
  log(T.player.bold(`=== RENOME ETERNO: ${prestige} ===`));
  actionMenu.setItems([' [ESC] Menu Principal']);
  actionMenu.focus();
  screen.render();
}

function startPuzzle(t) {
  gameState = 'PUZZLE'; const p = new Puzzle(null, currentDungeon.floor); logBox.log(T.info(`ENIGMA: ${p.question}`)); interactBox.show(); inputField.focus(); inputField.setValue(''); screen.render();
  inputField.once('submit', (v) => { interactBox.hide(); if (p.checkAnswer(v)) { player.addExperience(50*currentDungeon.floor); log(T.success('Sucesso!')); t.type = 'FLOOR'; } else { log(T.danger('Falha!')); player.takeDamage(20); } gameState = 'EXPLORING'; updateStatus(); });
}

function startCreation() {
  creationData = {};
  // Intro story before character creation
  const introText =
    T.warning.bold('  ══ O EXÍLIO DOS ARQUITETOS ══\n\n') +
    T.neutral('  Há cem anos, os maiores cientistas da história\n') +
    T.neutral('  abriram as Fendas — portais para o conhecimento\n') +
    T.neutral('  puro. O que encontraram os destruiu.\n\n') +
    T.bright('  As Fendas são instáveis. Criaturas nascidas da\n') +
    T.bright('  matemática corrompida surgem delas, drenando\n') +
    T.bright('  energia e matéria de tudo ao redor.\n\n') +
    T.player('  Você é um Exilado. Enviado para sobreviver\n') +
    T.player('  onde os maiores gênios falharam.\n\n') +
    T.info('  No Nexus — a vila dos refugiados — os\n') +
    T.info('  descendentes dos Arquitetos esperam.\n') +
    T.info('  Ada ensina algoritmos. Darwin fortalece.\n') +
    T.info('  Halthor forja armas. Marie transmuta.\n\n') +
    T.danger.bold('  Vá. As Fendas não esperarão.\n\n') +
    T.neutral('  [1/Enter] Criar Personagem  [ESC] Menu');

  showStory('O EXÍLIO DOS ARQUITETOS', introText, () => {
    gameState = 'CREATION_NAME'; interactBox.setLabel(' [ NOME ] '); interactBox.show(); inputField.focus(); inputField.setValue(''); screen.render();
  });
  inputField.once('submit', (n) => {
    if (!n || n.trim() === '') n = 'Exilado';
    creationData.name = n;
    gameState = 'CREATION_RACE'; interactBox.hide();
    actionMenu.setLabel(' [ RAÇA ] ');
    actionMenu.setItems([
      ' Humano       [+2 STR  +2 DEX  +2 INT]',
      ' Elfo         [+5 INT             ]',
      ' Anão         [+5 STR             ]',
      ' Orc          [+5 DEX             ]'
    ]);
    itemDetailBox.show(); actionMenu.focus(); screen.render();
    actionMenu.once('select', (i) => {
      const r = i.getText().trim().split(/\s+/)[0];
      creationData.race = r;
      gameState = 'CREATION_CLASS';
      actionMenu.setLabel(' [ CLASSE ] ');
      actionMenu.setItems([' Guerreiro', ' Mago', ' Arqueiro', ' Clérigo']);
      actionMenu.focus(); screen.render();
      actionMenu.once('select', (c) => {
        const cls = c.getText().trim();
        creationData.cls = cls;
        gameState = 'CREATION_CONFIRM';
        actionMenu.setLabel(' [ CONFIRMAR ] ');
        actionMenu.setItems([' [1] Começar Jornada', ' [2] Recomeçar']);
        itemDetailBox.setContent(
          T.player.bold(`\n  ${n} — ${r} ${cls}\n\n`) +
          T.neutral('  Confirme seu exilado ou recomece\n  a criação do personagem.\n')
        );
        itemDetailBox.show(); actionMenu.focus(); screen.render();
      });
    });
  });
}

// --- ATALHOS NUMÉRICOS GLOBAIS (1-0) ---
const numKeys = ['1','2','3','4','5','6','7','8','9','0'];
numKeys.forEach((key, idx) => {
  screen.key([key], () => {
    const list = inventoryBox.visible ? inventoryBox : (actionMenu.focused ? actionMenu : null);
    if (list) {
      const realIdx = key === '0' ? 9 : idx;
      if (realIdx < list.items.length) {
        list.select(realIdx); list.emit('select', list.getItem(realIdx), realIdx);
        updateDetailSection(list); screen.render();
      }
    }
  });
});

screen.key(['w'], () => handleMove(0, -1)); screen.key(['s'], () => handleMove(0, 1));
screen.key(['a'], () => handleMove(-1, 0)); screen.key(['d'], () => handleMove(1, 0));
screen.key(['q'], () => { const l = inventoryBox.visible ? inventoryBox : actionMenu; l.up(1); updateDetailSection(l); });
screen.key(['e'], () => { const l = inventoryBox.visible ? inventoryBox : actionMenu; l.down(1); updateDetailSection(l); });

screen.key(['escape', 'v'], () => {
  // --- Menu principal: sai ---
  if (gameState === 'MENU') { process.exit(0); return; }

  // --- Game Over: volta ao menu ---
  if (gameState === 'GAME_OVER') {
    player = null; currentDungeon = null; currentCombat = null; gameState = 'MENU';
    mapBox.hide(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.hide(); logBox.show();
    actionMenu.setLabel(' [ AÇÕES ] '); actionMenu.setItems(initialMenu); actionMenu.focus();
    screen.render(); return;
  }

  // --- Vitória: volta ao menu ---
  if (gameState === 'VICTORY') {
    player = null; currentDungeon = null; currentCombat = null; gameState = 'MENU';
    mapBox.hide(); combatVisualBox.hide(); inventoryBox.hide(); itemDetailBox.hide(); logBox.show();
    actionMenu.setLabel(' [ AÇÕES ] '); actionMenu.setItems(initialMenu); actionMenu.focus();
    screen.render(); return;
  }

  // --- Story overlay: fechar e continuar ---
  if (gameState === 'STORY') { closeStory(); return; }

  // --- Criação de personagem: sai do jogo ---
  if (gameState === 'CREATION_NAME') { process.exit(0); return; }

  // --- Exploração e combate: fuga salva o jogo e volta ao Nexus ---
  if (gameState === 'EXPLORING' || gameState === 'COMBAT') {
    saveGame(); currentDungeon = null;
    inventoryBox.hide(); itemDetailBox.hide(); combatVisualBox.hide(); mapBox.show(); logBox.show();
    showNexus(); return;
  }

  // --- Boss Rush: abandona sem penalidade ---
  if (gameState === 'BOSS_RUSH' || gameState === 'BOSS_RUSH_SKILLS') {
    bossRushWave = 0; bossRushScore = 0;
    inventoryBox.hide(); itemDetailBox.hide(); combatVisualBox.hide(); mapBox.show(); logBox.show();
    showNexus(); return;
  }

  // --- Lista de skills de combate: volta ao combate ---
  if (gameState === 'COMBAT_SKILLS') {
    gameState = 'COMBAT';
    actionMenu.setItems([' [1] ATACAR', ' [2] SKILLS', ' [3] RECUPERAR', ' [4] POSTURA', ' [ESC] Fugir']);
    actionMenu.focus(); screen.render(); return;
  }

  // --- Venda: volta para a compra (Halthor) ---
  if (gameState === 'TRADE_SELL') {
    showBlacksmith(); return;
  }

  // --- Inventário/Skills abertas da exploração: volta à exploração ---
  if ((gameState === 'INVENTORY' || gameState === 'SKILL_TREE' || gameState === 'BESTIARY') && prevState === 'EXPLORING') {
    inventoryBox.hide(); itemDetailBox.hide(); mapBox.show(); logBox.show();
    gameState = 'EXPLORING';
    actionMenu.setLabel(' [ EXPLORAÇÃO ] ');
    actionMenu.setItems([' [1] Norte', ' [2] Sul', ' [3] Oeste', ' [4] Leste', ' [5] Inv', ' [6] Skills', ' [ESC] Fugir']);
    actionMenu.focus(); renderMap(); return;
  }

  // --- Inventário/Skills/Bestiário abertas de submenus de NPCs: volta ao NPC ---
  const npcReturnMap = { 'ADA': showAda, 'DARWIN': showDarwin, 'MARIE': showMarie, 'TRADE_BUY': showBlacksmith };
  if (['SKILL_TREE', 'INVENTORY', 'BESTIARY'].includes(gameState) && prevState && npcReturnMap[prevState]) {
    inventoryBox.hide(); itemDetailBox.hide(); mapBox.show(); logBox.show();
    npcReturnMap[prevState]();
    return;
  }

  // --- Marie: sai do inventário de crafting e volta ao menu Marie ---
  if (gameState === 'MARIE') {
    inventoryBox.hide(); mapBox.show(); logBox.show();
    showNexus(); return;
  }

  // --- Todos os outros submenus do Nexus: volta ao Nexus ---
  inventoryBox.hide(); itemDetailBox.hide(); mapBox.show(); logBox.show();
  showNexus();
});

// --- SISTEMA DE TEMAS ---
function applyTheme() {
  titleBox.border.fg          = T.borderTitle;
  combatVisualBox.border.fg   = T.borderCombat;
  logBox.border.fg            = T.borderLog;
  actionMenu.border.fg        = T.borderAction;
  actionMenu.style.selected.bg = T.selectedBg;
  statusBox.border.fg         = T.borderStatus;
  synergyBox.border.fg        = T.borderSynergy;
  inventoryBox.border.fg      = T.borderInventory;
  inventoryBox.style.selected.bg = T.inventorySelectedBg;
  equipVisualBox.border.fg    = T.borderEquip;
  titleBox.setContent(
    T.danger.bold('\n ⚔  T E R M I N A L   S O U L S  ⚔ \n') +
    T.neutral(' ◈  The Echoes of Reason  ◈') +
    T.bright('                                            v1.1.0')
  );
  updateStatus();
  screen.render();
}

function showSettings() {
  gameState = 'SETTINGS';
  actionMenu.setLabel(' [ CONFIGURAÇÕES ] ');
  const themeOptions = THEME_NAMES.map(key => {
    const marker = key === getActiveKey() ? '◈ ' : '  ';
    return `${marker}[${key}] ${THEMES[key].label}`;
  });
  actionMenu.setItems([...themeOptions, ' [ESC] Voltar']);
  itemDetailBox.setContent(
    T.player.bold('\n  TEMAS DE CORES\n\n') +
    T.neutral('  ◈ DARK        — Escuridão do Exílio (padrão)\n') +
    T.bright('  ◈ LIGHT       — Claridade da Razão\n') +
    T.warning('  ◈ COLORBLIND  — Espectro Acessível (daltonismo)\n') +
    T.magic('  ◈ NO_RED      — O Exílio sem Sangue\n\n') +
    T.neutral('  Selecione com [1-4] ou navegue e pressione Enter.\n')
  );
  itemDetailBox.show(); actionMenu.focus(); screen.render();
}

actionMenu.on('select', (item, index) => {
  const c = item.getText().trim();
  if (gameState === 'STORY') { closeStory(); return; }
  if (gameState === 'MENU') { if (c.includes('Novo Jogo')) startCreation(); if (c.includes('Carregar')) loadGame(); if (c.includes('Sair')) process.exit(0); }
  else if (gameState === 'SETTINGS') {
    if (c.includes('[DARK]'))       { setTheme('DARK');       applyTheme(); showSettings(); }
    else if (c.includes('[LIGHT]')) { setTheme('LIGHT');      applyTheme(); showSettings(); }
    else if (c.includes('[COLORBLIND]')) { setTheme('COLORBLIND'); applyTheme(); showSettings(); }
    else if (c.includes('[NO_RED]')) { setTheme('NO_RED');    applyTheme(); showSettings(); }
    else showNexus();
  }
  else if (gameState === 'NEXUS') {
    if (c.includes('Entrar')) startDungeon(); else if (c.includes('Ada')) showAda(); else if (c.includes('Marie')) showMarie(); else if (c.includes('Darwin')) showDarwin(); else if (c.includes('Halthor')) showBlacksmith(); else if (c.includes('Missões')) showQuests(); else if (c.includes('Inventário')) showInventory(); else if (c.includes('Bestiário')) showBestiary(); else if (c.includes('Skills')) showPassives(); else if (c.includes('Configurações')) showSettings(); else if (c.includes('Sair')) process.exit(0);
  }
  else if (gameState === 'ADA') handleAda(c);
  else if (gameState === 'DARWIN') handleDarwin(c);
  else if (gameState === 'COMBAT') handleCombatAction(c);
  else if (gameState === 'COMBAT_SKILLS') {
    if (c.includes('Voltar') || c.includes('ESC')) {
      gameState = 'COMBAT';
      actionMenu.setItems([' [1] ATACAR', ' [2] SKILLS', ' [3] RECUPERAR', ' [4] POSTURA', ' [ESC] Fugir']);
      actionMenu.focus();
    } else {
      processCombatTurn(c);
    }
  }
  else if (gameState === 'BOSS_RUSH') handleCombatAction(c);
  else if (gameState === 'BOSS_RUSH_SKILLS') {
    if (c.includes('Voltar') || c.includes('ESC')) {
      gameState = 'BOSS_RUSH';
      actionMenu.setItems([' [1] ATACAR', ' [2] SKILLS', ' [3] RECUPERAR', ' [4] POSTURA']);
      actionMenu.focus();
    } else {
      processCombatTurn(c);
    }
  }
  else if (gameState === 'BOSS_RUSH_MENU') {
    if (c.includes('Iniciar')) { bossRushWave = 0; bossRushScore = 0; startBossRushWave(); }
    else showNexus();
  }
  else if (gameState === 'MARIE') {
    if (c.includes('[U]')) {
      if (currentAltar.upgradeMastery(player)) {
        const cfg = currentAltar.getMasteryConfig(player.craftingMastery);
        log(T.magic.bold(`Maestria evoluída: ${cfg.label}!`));
        showMarie(); updateStatus();
      } else log(T.danger('Orbes insuficientes para evoluir Maestria.'));
    }
  }
  else if (gameState === 'ATTRIBUTES') { if (c.includes('FORÇA')) player.upgradeAttribute('STR'); if (c.includes('DESTREZA')) player.upgradeAttribute('DEX'); if (c.includes('INTELIGÊNCIA')) player.upgradeAttribute('INT'); updateStatus(); }
  else if (gameState === 'TRADE_BUY' || gameState === 'TRADE_SELL') handleTrade(c, index);
  else if (gameState === 'QUESTS') handleQuests(c, index);
  else if (gameState === 'EXPLORING') {
    if (c.includes('Inv')) showInventory();
    else if (c.includes('Skills')) showPassives();
  }
  else if (gameState === 'CREATION_CONFIRM') {
    if (c.includes('Começar')) {
      player = new Entity(creationData.name, { race: creationData.race, background: creationData.cls });
      showNexus();
    } else if (c.includes('Recomeçar')) {
      startCreation();
    }
  }
});

screen.on('resize', () => screen.render());
screen.append(titleBox); screen.append(statusBox); screen.append(synergyBox); screen.append(legendBox); screen.append(mapBox);
screen.append(combatVisualBox); screen.append(inventoryBox); screen.append(itemDetailBox);
screen.append(equipVisualBox); screen.append(logBox); screen.append(actionMenu); screen.append(storyBox); screen.append(interactBox);
const initialMenu = [' [1] Novo Jogo', ' [2] Carregar Jogo', ' [3] Sair']; actionMenu.setItems(initialMenu); actionMenu.focus(); updateStatus();
