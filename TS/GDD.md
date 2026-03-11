📜 GAME DESIGN DOCUMENT: TERMINAL SOULS
Subtítulo: The Echoes of Exile
Gênero: TUI-ARPG (Text User Interface Action RPG) / Multiplayer Assíncrono e Hub Social
Versão: 1.0
Autor: João Pedro Melloni Tardif Germano
Tecnologias Core: Node.js, Chalk (Cores), Blessed (Layout TUI), Inquirer (Menus Interativos), Socket.io (Multiplayer/Trade), Firestore (NoSQL para Logs/Sessões), MariaDB (Relacional para Itens/Economia/Players), Math.js (Geração de Puzzles).
1. RESUMO EXECUTIVO
Terminal Souls é um MMORPG baseado em TUI (Interface de Usuário em Texto) que funde o combate deliberado, punitivo e baseado em recursos de Dark Souls com a complexidade profunda de construção de builds, sinergias e economia de itens de Path of Exile.
Ambientado em um mundo de fantasia sombria, a interface minimalista do terminal serve como uma janela para sistemas matemáticos e lógicos profundos. O jogador não vence pela velocidade dos reflexos, mas pela capacidade de planejar turnos, gerenciar recursos e resolver desafios lógicos.
1.1 Pilares de Design
Sinergia Estratégica (Min-Maxing): O dano não é apenas um número estático. O jogador é recompensado por encadear efeitos, tags e gatilhos de itens.
Combate Punitivo (Risco vs. Recompensa): Cada ação tem um peso. O esgotamento de recursos (Stamina/Mana) resulta em estados de exaustão letais. A morte cobra um preço alto (50% de XP).
Intelecto como Arma: A progressão exige a resolução de quebra-cabeças lógicos e matemáticos espalhados pelas masmorras, recompensando o conhecimento do jogador.
Economia Viva: Instâncias de combate são privadas, mas o "Nexus" é compartilhado. Um sistema de trade global permite a negociação segura de loot.
Estética TUI Imersiva: Uso cirúrgico de bibliotecas como Chalk e Blessed para criar uma hierarquia visual limpa, nostálgica, mas altamente informativa.
2. O MUNDO E O GAMEPLAY LOOP
O jogo é dividido em dois estados principais de exploração:
O Nexus (Hub Global): Área segura onde os jogadores interagem via chat (Socket.io), realizam trocas seguras, gerenciam o inventário e aceitam missões.
As Fendas (Instâncias de Combate): Masmorras geradas proceduralmente. Ao entrar, o "Instância Manager" cria um ambiente isolado com Loot Tables, Mobs e Puzzles específicos.
2.1 Enigmas do Exílio (Sistema de Puzzles)
Para quebrar o ritmo do combate e recompensar jogadores de forma única, as instâncias contêm Salas de Desafio opcionais. Falhar nelas não necessariamente mata o jogador, mas bloqueia o acesso a loot de alto nível (Raro/Lendário) ou aplica penalidades de dano (Armadilhas).
Desafios de Campo Minado: Mini-jogo em TUI. Resolver revela um baú seguro; explodir causa Dano Verdadeiro baseado no HP Máximo.
Desafios Matemáticos (Powered by Math.js): O selo de uma porta exige a resolução de expressões numéricas complexas ou equações do 1º grau geradas proceduralmente.
Charadas Lógicas (Estilo Khan Academy): Problemas de múltipla escolha testando raciocínio lógico.
Escalonamento: A dificuldade do puzzle escala com o nível da Fenda, garantindo recompensas (XP bônus, Orbes de Crafting) proporcionais ao esforço mental.
3. MECÂNICAS DE COMBATE (SOULS-LIKE TURN-BASED)
O combate abandona o hack 'n' slash em favor de turnos de alto risco.
3.1 Gestão de Recursos e Atributos
Recurso / Atributo
Função Principal
Consequência do Esgotamento (Punishment)
Vitalidade (HP)
Sobrevivência básica.
Morte: Retorno ao Nexus, perda de 50% da XP atual.
Stamina (SP)
Custo para ataques físicos, esquivas e uso de armas pesadas.
Exaustão Física: Dano físico recebido é multiplicado por 2x.
Mana (MP)
Custo para lançar magias, feitiços e invocações.
Exaustão Mágica: Dano mágico recebido é multiplicado por 2x.

3.2 O Sistema de Postura
Antes de atacar ou defender, o jogador pode alterar sua Postura (afeta apenas ações físicas/corpo-a-corpo):
[A] Full Attack: +Dano e Chance de Crítico. -Defesa e Evasão.
[B] Balanced Mode: Modificadores neutros.
[D] Full Defence: +Defesa e Chance de Bloqueio. -Dano.
Mecânica de Stagger: Quebrar a postura do inimigo faz com que ele perca o próximo turno e receba dano Crítico garantido.
3.3 Dificuldade Dinâmica e Ações
Ações do Turno: Atacar (Aplica Tags), Usar Skill (Consumo alto de recursos), Usar Item, Recuperar (Pula o turno para regenerar % de HP/SP/MP com risco de tomar dano crítico).
Resistência Adaptativa (Bosses): Inimigos de instâncias superiores analisam o padrão do jogador. Se o player usar magias de Fogo por 3 turnos seguidos, o Boss adquire 80% de Resistência a Fogo no 4º turno, forçando a troca de sinergias no meio da luta.
4. SISTEMA DE SINERGIA (TAGS & TRIGGERS)
Inspirado em Path of Exile, equipamentos não dão apenas atributos, eles alteram as regras do combate criando reações em cadeia.
4.1 Fluxo de Sinergia (Exemplo de Build Pyromancer Físico)
Ação 1: Jogador usa um ataque básico com a Espada Enferrujada.
Triggers: O jogador tem equipado o Anel de Óleo (Passiva: Ataques físicos aplicam a tag [Encharcado de Óleo]).
Ação 2: No turno seguinte, jogador usa a skill Centelha.
Reação: As Luvas de Ignição conferem +15% de Dano de Fogo contra alvos com Óleo. O alvo sofre Combustão (Dano em Área), limpando salas inteiras de uma vez.
4.2 Tabela de Tags Primárias
<Corte>: Alta chance de causar [Sangramento] (Dano DoT contínuo).
<Esmagamento>: Dano multiplicativo contra a Postura do alvo (Focado em Stagger).
<Choque>: Paralisação parcial. Reduz a zero a chance de o inimigo esquivar no próximo turno.
<Vazio>: Dano maciço que ignora 100% da Armadura Física, porém, conjurar magias do Vazio consome HP (Sanidade) em vez de Mana.
5. SISTEMA DE LOOT, CRAFTING E ECONOMIA
O motor do jogo é a busca pela build perfeita.
5.1 Geração de Itens (Raridade e Afixos)
Cada item instanciado possui um UUID registrado no banco (MariaDB).
Branco (Comum): Item base. Sem afixos.
Azul (Mágico): 1 a 2 Afixos mágicos (Ex: +10 de Stamina Máxima).
Amarelo (Raro): 3 a 5 Afixos. Base para a maioria das builds late-game.
Laranja (Lendário): Possui Afixos Únicos não roláveis que quebram as regras do jogo (Ex: "Ataques básicos agora escalam com sua Mana Máxima em vez de Força").
5.2 Sistema de Crafting (Min-Maxing)
Orbes do Exílio: Moeda principal de troca e material de crafting (Dropados de Bosses ou Puzzles difíceis). Permitem "rolar" (re-roll) um afixo específico de um item Raro, permitindo aos jogadores aperfeiçoarem suas builds matemáticas sem depender 100% do RNG de drops.
5.3 Trade Global
Interface: Menu Inquirer no Nexus.
Segurança (Transação Atômica): O servidor Node verifica o MariaDB. Só conclui a troca se os UUIDs dos itens estiverem de posse dos respectivos IDs dos jogadores simultaneamente, evitando duplicação ou scams.
6. INFRAESTRUTURA TÉCNICA E TUI Mockup
6.1 Arquitetura
Servidor Node.js: Roda o loop principal do jogo de forma assíncrona.
MariaDB: Armazenamento rígido (Relacional). Tabelas: Users, Inventory, Items (Geração de UUIDs para cada drop).
Firestore: Armazenamento dinâmico (NoSQL). Usado para persistência de sessões temporárias, chat do Nexus e logs de instâncias ativas para reconexão rápida.
6.2 Mockup do Inventário (Visual no Terminal)
A interface utilizará Blessed para as caixas e Chalk para colorir as raridades (Ex: Branco, Azul-Ciano, Amarelo, Laranja).
======================================================================
  [ INVENTÁRIO DO EXILADO ]                     [ ESPAÇO: 12/30 ]
======================================================================
  [1] Lâmina Longa da Agonia (Lendário) <Corte> <Fogo>
  [2] Elmo de Ferro Enferrujado (Comum)
  [3] Amuleto do Estudioso (Raro) <Mente>
  [4] Frasco de Vitalidade (x3)
  [5] Orbe da Mutação (x1) - Material de Crafting
----------------------------------------------------------------------
  DETALHES DO ITEM [1] - Lâmina Longa da Agonia:
  Status: + 45 Dano Base Físico
  Afixo 1: + 10% Chance de Queimar
  Sinergia Única: "Causa 50% de dano extra contra alvos com <Sangramento>."
----------------------------------------------------------------------
  [M] Equipar/Desequipar  |  [T] Negociar no Nexus  |  [V] Voltar
======================================================================
