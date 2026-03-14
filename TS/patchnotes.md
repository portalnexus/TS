# 📜 PATCH NOTES - TERMINAL SOULS

---

## [v0.9.0] - Ecos da Razão
*A ciência é a luz que brilha no terminal. O conhecimento agora é poder real.*

### 🌌 Narrativa e Lore Científica
- **Ecos da Razão:** O mundo do Exílio agora reflete o legado de grandes mentes.
- **Biomas Temáticos:** Fendas renomeadas para O Prisma de Newton, A Singularidade de Hawking, O Motor de Turing e O Vazio de Noether.
- **Lore nos Itens:** Itens Raros e Lendários agora possuem "Flavor Text" com citações e referências históricas (Euler, Ada Lovelace, Gauss, etc).
- **Puzzles Contextualizados:** Desafios matemáticos agora são apresentados por "ecos" de Euler e Lovelace.

### 🌳 Árvore de Passivas (O Legado)
- **Novo Sistema:** Implementada a primeira versão da Árvore de Habilidades Passivas (Acesse com a tecla `K`).
- **Teorias Científicas:** Invista pontos em Cálculo Diferencial, Termodinâmica, Mecânica Quântica, Entropia e Relatividade para ganhar bônus de combate.
- **Progressão:** Cada nível concede 1 ponto de Skill para a árvore.

### 🏛️ Roadmap v1.0
- **Prioridade Single-Player:** Roadmap atualizado focando no lançamento da versão 1.0 com Boss Final e Campanha Completa antes do Multiplayer.

---

## [v0.8.5] - O Intelecto é sua Arma
*Refinamento dos desafios lógicos e preparação para o lançamento Single Player.*

### 🧩 Puzzles Evoluídos
- **Desafios Matemáticos e Lógicos:** Substituição de charadas simples por problemas elaborados de geometria, probabilidade, lógica e álgebra.
- **Dificuldade Intelectual:** Os enigmas agora exigem raciocínio real (ex: cálculo de dimensões de terreno, soma de idades e estatística básica).

### 🏛️ Roadmap Redefinido
- **Prioridade Single-Player:** O desenvolvimento foi redirecionado para completar a experiência para um jogador antes da implementação de funcionalidades online.
- **Preparação para v0.9.0:** Otimização do código core para suportar futuras Árvores de Habilidades.

---

## [v0.8.4] - O Despertar dos Guardiões
*Exploração aprimorada e novos desafios intelectuais.*

### ⚔️ Chefes e Progressão
- **Identidade Visual:** Os Chefes de Fenda agora aparecem no mapa com um ícone Magenta/Roxo exclusivo (`$$`), destacando o perigo iminente.
- **Fluxo de Exploração:** A escada para o próximo andar (`HH`) não aparece mais automaticamente. Ela agora surge exatamente onde o Chefe foi derrotado, simbolizando a abertura do caminho para as profundezas.

### 🧩 Enigmas e Puzzles
- **Diversificação:** Os desafios agora alternam aleatoriamente entre Expressões Matemáticas, Equações de 1º Grau e Charadas Lógicas.
- **Biblioteca de Charadas:** Adicionadas novas charadas clássicas para testar o conhecimento do exilado.
- **Sistema Randômico:** A geração de puzzles no mapa agora seleciona o tipo de desafio dinamicamente.

---

## [v0.8.3] - O Peso das Escolhas
- **Refatoração de Input:** Teclas `Q/E` agora navegam e `F` seleciona, padronizando a experiência TUI.
- **Segurança:** Removido o risco de fechar o jogo acidentalmente ao tentar interagir com menus usando `Q`.

---

## [v0.8.2] - Almas e Identidades
*A morte agora tem peso, e o exilado tem um passado.*

### 👤 Criação de Personagem
- **Identidade:** Sistema de definição de Nome, Raça e Background ao iniciar um Novo Jogo.
- **Raças:** Escolha entre Humano, Elfo, Anão ou Orc, cada um com sprites e bônus de atributos únicos.
- **Backgrounds:** Mercenário, Erudito, Ladino e Clérigo agora concedem sinergias passivas (ex: Dano Físico, Magia ou Postura).

### 💀 Hardcore Mode
- **Morte Permanente:** O jogo agora é punitivo ao extremo. Morrer no combate deleta o arquivo de save e força o reinício da jornada.
- **Vínculo de Alma:** Saves são carregados normalmente, mas o risco de perdê-los torna cada fenda uma decisão crítica.

### 🖥️ Interface & UI
- **Box de Sinergias:** Nova seção na tela principal que lista bônus passivos ativos.
- **Layout Refinado:** Reorganização dos componentes Blessed para melhor visibilidade de Atributos e Logs.

---

## [v0.8.0] - A Ascensão do Exilado
*O loop de gameplay está completo. De um simples combate a um mundo vivo.*

### 🏛️ Nexus & Economia
- **Blacksmith (Ferreiro):** Halthor agora compra loot e vende estoque rotativo.
- **Altar de Crafting:** Implementado o Reroll de atributos para itens Raros e Lendários.
- **Quadro de Missões:** Sistema de quests procedurais (Abates e Exploração) com recompensas.
- **Economia de Orbes:** Introduzida a moeda oficial para trade e serviços.

### ⚔️ Combate & RPG
- **Atributos Nucleares:** Sistema de Força (STR), Destreza (DEX) e Inteligência (INT) com Level Up.
- **Árvore de Proficiências:** Mestria em Tags (Corte, Fogo, etc.) que concede bônus de dano.
- **Reações Elementais:** Tags agora causam efeitos de status (Sangramento, Combustão, Choque).
- **IA de Combate:** Inimigos agora sofrem e causam status elementais.

### 🌍 Mundo & Exploração
- **Biomas Procedurais:** Fendas agora possuem temas (Gelo, Vazio, Fogo) com cores dinâmicas.
- **Descida Infinita:** Derrotar o Boss do andar permite descer para o próximo nível sem retornar ao Nexus.
- **Boss de Ascensão:** Novo boss final no Andar 10 (Senhor da Ascensão).

### 💾 Sistema de Almas
- **Persistência Completa:** Inventário, Orbes, Missões Ativas e Proficiências são salvos localmente em JSON.

---
*"O caminho é árduo, mas os sistemas estão prontos."*
