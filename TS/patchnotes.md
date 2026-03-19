# 📜 PATCH NOTES - TERMINAL SOULS

---

## [v1.1.0] - Conteúdo Expandido
*Novos biomas, Boss Rush, Maestria de Crafting, Sistema de Temas e ajustes visuais.*

### 🗺️ 2 Novos Biomas
- **A Espiral de Euler:** Fibonacci, Constante de Euler, Polígono de Gauss. BOSS: Euler, Arquiteto da Identidade.
- **O Labirinto de Lovelace:** Loop Infinito, Exceção de Pilha, Ponteiro Nulo. BOSS: Lovelace, Tecelã da Lógica.
- Total: **6 biomas** com inimigos e bosses únicos.

### ⚔️ Boss Rush — Arena dos Arquitetos
- 7 ondas consecutivas de Guardiões com dificuldade crescente (multiplicadores 1.0× → 2.0×).
- Cada vitória restaura 30% HP/SP/MP. Save preservado em caso de derrota.
- NPC **Arena** (β) no Nexus. Score registrado no **Hall of Fame**.

### 🏆 Hall of Fame & Game Over
- Tela de Game Over exibe Renome Final e top 5 do Hall of Fame local.
- Registros persistentes em `saves/hall_of_fame.json`.

### 🔮 Maestria de Crafting — Altar de Marie Curie
- 4 níveis: **Aprendiz → Iniciado → Alquimista → Radiante**.
- Efeitos crescentes: reroll básico, +10% stat, promoção de raridade, +20% todos stats.

### 🧩 9 Tipos de Puzzle
- **Novos:** BINARY (binário↔decimal), LOGIC_TABLE (AND/OR/XOR), FORMULA (F=ma, E=mc²), PRIME_CHECK (Eratóstenes), MODULO (aritmética de Gauss).

### 🎨 Sistema de Temas de Cores
- **4 temas** selecionáveis em Nexus → `[0] Configurações`:
  - **DARK** — Escuridão do Exílio (padrão)
  - **LIGHT** — Claridade da Razão (cores bright/vividas)
  - **COLORBLIND** — Espectro Acessível (vermelho→laranja, verde→azul; deuteranopia/protanopia)
  - **NO_RED** — O Exílio sem Sangue (nenhum vermelho; perigo→magenta)
- Preferência salva em `saves/settings.json` e restaurada ao reabrir o jogo.
- Afeta tiles do mapa, barras de recurso, bordas de painel, raridades de item, ícones de status e mensagens de combate.

### 🖥️ Visual
- **Sprite do jogador:** Revertido de bloco 2×2 para `@` simples (melhor legibilidade no grid).

### ⚖️ Balanceamento
- Curva logarítmica para inimigos nos andares 10–100.
- Boss: coeficiente quadrático reduzido para progressão sustentável.

---

## [v1.0.1] - Polimento do Exilado
*Controles corrigidos, postura redesenhada, criação instrutiva.*

### 🛠️ Correções Críticas
- **Menu pós-combate:** Após vencer um combate, o menu de exploração (Norte/Sul/Inv/Skills) é restaurado corretamente.
- **Teclas [5] Inv e [6] Skills** agora funcionam durante a exploração da Fenda.

### 🎨 Visual
- **Sprite do jogador `@@`:** O exilado ocupa um bloco 2×2 no mapa para maior visibilidade.

### ⚡ Sistema de Postura Remodelado
- **Nomes simplificados:** INÉRCIA → **DEFESA**, MOMENTO → **ATAQUE**, EQUILÍBRIO → **NEUTRO**.
- **SP dinâmica em combate:** DEFESA +12% SP/turno, NEUTRO +5% SP/turno, ATAQUE −10% SP/turno.
- **SP regenera ao caminhar:** +5% maxSP a cada passo na exploração.

### 📋 Criação de Personagem Instrutiva
- **Raças com stats inline:** Cada raça exibe seus bônus na lista de seleção.
- **Hover com fichas completas:** Navegar pela lista de raças e classes exibe descrição, estilo e sinergias recomendadas.
- **Tela de confirmação:** Resumo final do exilado antes de iniciar a jornada.

---

## [v1.0.0] - A Ascensão do Exilado
*O Exílio está completo. O Arquiteto aguarda no Andar 10.*

### ⚔️ Sistema de Skills Completo
- **20 Skills Implementadas:** Todas as habilidades das 4 classes agora funcionam com custo de mana real e efeitos únicos.
- **Guerreiro:** Entropia Cinética (AoE por STR), Força Centrípeta (todos os inimigos), Lei da Inércia (estabilidade máxima + IMUNIDADE).
- **Mago:** Raio de Maxwell (CHOQUE), Zero Absoluto (CONGELAMENTO), Paradoxo de Schrödinger (EVASÃO 60%).
- **Arqueiro:** Diagrama de Feynman (multi-hit 3-5x), Óptica de Euclides (ignora defesa), Efeito Doppler (escala com andar).
- **Clérigo:** Cura de Hipócrates (heal 25% HP), Sopro de Gaia (remove todos os debuffs), Proporção Áurea (equaliza HP/SP/MP).

### 🔮 Novos Status e Sinergias
- **CHOQUE:** Drena -20 Estabilidade por turno. Combina com CORTE → DESCARGA (+30% dano).
- **CONGELAMENTO:** Drena -15 Estabilidade por turno. Combina com ESMAGAMENTO → FRAGMENTAÇÃO (+50% dano).
- **EVASÃO:** 60% de chance de desviar do próximo ataque (Schrödinger, Einstein).
- **IMUNIDADE:** Bloqueia dano de status por N turnos (Lei da Inércia).

### 🗡️ IA de Boss — 3 Fases
- **Fase 1 (>60% HP):** Ataque reforçado (×1.2) com recuperação de postura a cada 4 turnos.
- **Fase 2 (≤60% HP):** Campo de Distorção — aplica CHOQUE + COMBUSTÃO ao jogador a cada 3 turnos.
- **Fase 3 (≤30% HP):** Colapso Dimensional — ataque duplo nos turnos pares.

### 🧬 Biomas com Inimigos Temáticos
- **Newton:** Prisma Refrator, Corpo Gravitacional, Arco Espectral, Força Centrífuga.
- **Hawking:** Eco de Radiação, Singularidade Menor, Horizonte de Eventos, Pulsar Binário.
- **Turing:** Lobo de Turing, Autômato de Pascal, Bomba de Colapso, Daemon Binário.
- **Noether:** Espectro de Noether, Vazio Simétrico, Sombra da Simetria, Tensor de Tensão.
- **Bosses temáticos:** Newton Corrompido, Sombra de Hawking, A Máquina Implacável, Guardiã do Vazio.

### 📋 Sistema de Missões Funcional
- **Novo tipo ITEM:** Coletar X drops de Tesouros nas Fendas.
- **Auto-progressão:** KILL, FLOOR e ITEM agora incrementam automaticamente durante o gameplay.
- **Progresso visível:** Missão ativa exibida no painel de Status.

### ⚖️ Economia e Balanceamento
- **Drops de Orbes:** Inimigos agora dropam Orbes ao morrer (level × 3; boss level × 15).
- **Curva suave:** HP de inimigos nos andares iniciais reduzido para melhor progressão.
- **Darwin corrigido:** Upgrade de INT agora funciona corretamente via Nexus.

### 🏆 Endgame
- **SENHOR DA ASCENSÃO:** Boss final aparece a partir do Andar 10 com mecânicas de 3 fases.
- **Tela de Vitória:** Exibe Renome Final, nível, bestiário catalogado e créditos.

### 🧪 Testes
- **64 testes automatizados** cobrindo skills, sinergias, missões, puzzles e entidades.

---

## [v0.9.9.1] - O Renome do Exilado
*Seu impacto no mundo agora é quantificado pelo seu legado científico.*

### 🏅 Sistema de Renome (Score)
- **Cálculo de Prestígio:** Implementado um score global ("RENOME") que escala com seu nível, atributos totais, raridade dos itens equipados, nível de habilidades e descobertas no bestiário.
- **Visibilidade:** O Renome é exibido permanentemente na caixa de Status, servindo como sua pontuação de "fama" no exílio.

### 💎 Economia & UI
- **Orbes em Destaque:** A quantidade de Orbes agora possui uma linha dedicada e colorida na interface de Status para facilitar a gestão financeira durante a exploração.
- **Layout de Status:** Reorganização dos atributos para melhor leitura em resoluções variadas.

---

## [v0.9.9] - A Teoria da Estabilidade Cinética
*O combate agora exige precisão matemática e gestão de momentum.*

### ⚙️ NPCs e Hub Expandido
- **Ada (Algoritmos):** Permite a "Compilação de Dados" para ganhar pontos de Skill extras em troca de Orbes.
- **Marie Curie (Alquimia):** Gerencia a transmutação radiante de itens e reroll de atributos.
- **Darwin (Evolução):** Permite a "Seleção Natural", trocando Orbes por aumentos permanentes de atributos (STR, DEX, INT).

### ⚔️ Estabilidade Cinética (Rework de Postura)
- **Novo Recurso:** A Postura agora é sua **Estabilidade**. Começa em 100% e é consumida por ações agressivas.
- **Inércia (Defensivo):** Dobra sua defesa mas reduz o dano. Ótimo para observar inimigos.
- **Momento (Ofensivo):** Aumenta o dano em 50%, mas drena Estabilidade a cada turno.
- **Equilíbrio (Neutro):** O estado estável para combos de reação.

### ⌨️ Navegação Unificada
- **Teclas 1-0:** Agora funcionam em **todos os menus** (Inventário, Skills, Bestiário, Atributos). Você pode jogar inteiramente pelo teclado numérico.

---

## [v0.9.7] - O Códice da Existência
*O conhecimento coletado é a fundação da vitória.*

### 📖 Bestiário Científico
- **Catálogo de Espécimes:** Novo sistema para rastrear monstros derrotados via tecla `B`.
- **Análise Dinâmica:** O Bestiário exibe a quantidade de abates e análises preliminares.

### 🛡️ Sinergia de Atributos
- **Equipamento Inteligente:** Itens agora concedem bônus diretos em STR, DEX e INT.

---

## [v0.9.6] - O Equilíbrio da Razão
*Ajustes finos para uma jornada justa.*

### ⚖️ Rebalanceamento de Dificuldade
- **Poder dos Inimigos:** Reduzido o crescimento de atributos por andar.
- **Sobrevivência:** Aumentado o ganho de HP por ponto de Força (STR).

---

## [v0.9.0] - Ecos da Razão
*A ciência é a luz que brilha no terminal.*
