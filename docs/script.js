document.addEventListener('DOMContentLoaded', () => {
    console.log('%c TERMINAL SOULS: THE ECHOES OF REASON ', 'background: #ff5555; color: #000; font-weight: bold; font-size: 20px;');
    console.log('%c [SISTEMA] Inicializando interface de documentação científica... ', 'color: #55ffff;');
    console.log('%c [NÚCLEO] Versão 1.0.0 — A Ascensão do Exilado. ', 'color: #55ff55;');

    // Typing effect for the vision text
    const visionText = document.querySelector('.vision-box p');
    if (visionText) {
        const originalText = visionText.innerHTML;
        visionText.innerHTML = '';
        let i = 0;
        const type = () => {
            if (i < originalText.length) {
                // Handle tags
                if (originalText[i] === '<') {
                    const tagEnd = originalText.indexOf('>', i);
                    visionText.innerHTML += originalText.substring(i, tagEnd + 1);
                    i = tagEnd + 1;
                } else {
                    visionText.innerHTML += originalText[i];
                    i++;
                }
                setTimeout(type, 1);
            }
        };
        type();
    }

    // Sound effect simulation (visual only)
    const boxes = document.querySelectorAll('.box');
    boxes.forEach((box, index) => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        setTimeout(() => {
            box.style.transition = 'all 0.5s ease';
            box.style.opacity = '1';
            box.style.transform = 'translateY(0)';
        }, 100 * index);
    });

    // Random glitch effect on the title
    const title = document.querySelector('.glitch');
    setInterval(() => {
        if (Math.random() > 0.95) {
            title.style.textShadow = `
                ${Math.random() * 10}px 0 var(--cyan),
                ${Math.random() * -10}px 0 var(--magenta)
            `;
            setTimeout(() => {
                title.style.textShadow = '';
            }, 100);
        }
    }, 200);

    // --- GALERIA DE SPRITES ASCII ---
    const rawSprites = {
        player: {
            'Humano': [
                '<span class="cyan">      _____      </span>',
                '<span class="cyan">     /     \\     </span>',
                '<span class="cyan">    |  o o  |    </span>',
                '<span class="cyan">    \\_  -  _/    </span>',
                '<span class="cyan">      /| |\\      </span>',
                '<span class="cyan">     / | | \\     </span>',
                '<span class="cyan">      /   \\      </span>'
            ],
            'Elfo': [
                '<span class="green">     /|     |\\   </span>',
                '<span class="green">    / |_____| \\  </span>',
                '<span class="green">   |  ^     ^  | </span>',
                '<span class="green">    \\_   -   _/  </span>',
                '<span class="green">     --| |--     </span>',
                '<span class="green">      /| |\\      </span>',
                '<span class="green">     /     \\     </span>'
            ],
            'Anão': [
                '<span class="yellow">      _____      </span>',
                '<span class="yellow">     /     \\     </span>',
                '<span class="yellow">    |  - -  |    </span>',
                '<span class="yellow">    |#######|    </span>',
                '<span class="yellow">    \\_#####_/    </span>',
                '<span class="yellow">     [|||||]     </span>',
                '<span class="yellow">     /     \\     </span>'
            ],
            'Orc': [
                '<span class="red">     /     \\     </span>',
                '<span class="red">    |  ^ ^  |    </span>',
                '<span class="red">    |  \\_/  |    </span>',
                '<span class="red">    \\__VVV__/    </span>',
                '<span class="red">     /|   |\\     </span>',
                '<span class="red">    / |   | \\    </span>',
                '<span class="red">     /     \\     </span>'
            ]
        },
        bosses: {
            'Newton Corrompido': [
                '<span class="gray" style="font-weight:bold">      .-------.      </span>',
                '<span class="gray" style="font-weight:bold">     /  F=ma   \\     </span>',
                '<span class="gray" style="font-weight:bold">    |  [ G ] [ G ] |  </span>',
                '<span class="gray" style="font-weight:bold">    |   PRISMA   |    </span>',
                '<span class="gray" style="font-weight:bold">    |  /  |  \\  |    </span>',
                '<span class="gray" style="font-weight:bold">   /   --|--   \\      </span>',
                '<span class="gray" style="font-weight:bold"> /_______________\\    </span>'
            ],
            'Sombra de Hawking': [
                '<span class="cyan" style="font-weight:bold">      .-------.      </span>',
                '<span class="cyan" style="font-weight:bold">     /  (   )  \\     </span>',
                '<span class="cyan" style="font-weight:bold">    |  EVENT  HRZ |  </span>',
                '<span class="cyan" style="font-weight:bold">    |   (( X ))   |  </span>',
                '<span class="cyan" style="font-weight:bold">    |   -----     |  </span>',
                '<span class="cyan" style="font-weight:bold">   /     |     \\     </span>',
                '<span class="cyan" style="font-weight:bold"> /_______________\\   </span>'
            ],
            'A Máquina Implacável': [
                '<span class="red" style="font-weight:bold">      _______      </span>',
                '<span class="red" style="font-weight:bold">    |01001011|     </span>',
                '<span class="red" style="font-weight:bold">    |10110100|     </span>',
                '<span class="red" style="font-weight:bold">    | TURING |     </span>',
                '<span class="red" style="font-weight:bold">    |________|     </span>',
                '<span class="red" style="font-weight:bold">     |_|   |_|    </span>',
                '<span class="red" style="font-weight:bold">    /       \\     </span>'
            ],
            'Guardiã do Vazio': [
                '<span class="magenta" style="font-weight:bold">     < * * * >    </span>',
                '<span class="magenta" style="font-weight:bold">    <  NOETHER >  </span>',
                '<span class="magenta" style="font-weight:bold">   <--- [ ∞ ] ---> </span>',
                '<span class="magenta" style="font-weight:bold">    <  SIMETRIA>  </span>',
                '<span class="magenta" style="font-weight:bold">     < * * * >    </span>',
                '<span class="magenta" style="font-weight:bold">      / | \\       </span>',
                '<span class="magenta" style="font-weight:bold">     /  |  \\      </span>'
            ],
            'Senhor da Ascensão': [
                '<span class="magenta" style="font-weight:bold">      .-------.      </span>',
                '<span class="magenta" style="font-weight:bold">     /  VOID   \\     </span>',
                '<span class="magenta" style="font-weight:bold">    |  [ANDAR+] |    </span>',
                '<span class="magenta" style="font-weight:bold">    |  (  X  )  |    </span>',
                '<span class="magenta" style="font-weight:bold">    |__| | |____|    </span>',
                '<span class="magenta" style="font-weight:bold">   /   VOID-LORD \\   </span>',
                '<span class="magenta" style="font-weight:bold"> /_______________\\   </span>'
            ]
        },
        enemies: {
            'Esqueleto Maldito': [
                '<span class="white">      .---.      </span>',
                '<span class="white">     / x x \\     </span>',
                '<span class="white">     \\_ x _/     </span>',
                '<span class="white">      _|_|_      </span>',
                '<span class="white">     |  |  |     </span>',
                '<span class="white">     |__|__|     </span>',
                '<span class="white">     /     \\     </span>'
            ],
            'Esqueleto de Gauss': [
                '<span class="white">      .---.      </span>',
                '<span class="white">     / ( ) \\     </span>',
                '<span class="white">    |  _|_  |    </span>',
                '<span class="white">     \\_/_\\_/     </span>',
                '<span class="white">      _|_|_      </span>',
                '<span class="white">     |  |  |     </span>',
                '<span class="white">     |__|__|     </span>'
            ],
            'Lobo Corrompido': [
                '<span class="gray">    /\\___/\\    </span>',
                '<span class="gray">   / o   o \\   </span>',
                '<span class="gray">  ( == Y == )  </span>',
                '<span class="gray">   )       (   </span>',
                '<span class="gray">  /         \\  </span>',
                '<span class="gray"> /           \\ </span>'
            ],
            'Lobo de Turing': [
                '<span class="cyan">    /\\___/\\    </span>',
                '<span class="cyan">   / 0   1 \\   </span>',
                '<span class="cyan">  ( == X == )  </span>',
                '<span class="cyan">   ) 10101 (   </span>',
                '<span class="cyan">  / 0101010 \\  </span>',
                '<span class="cyan"> / 101010101 \\ </span>'
            ],
            'Guerreiro Caído': [
                '<span class="red">     ._____.     </span>',
                '<span class="red">     |#####|     </span>',
                '<span class="red">     |#_#_#|     </span>',
                '<span class="red">    _|_|_|_|_    </span>',
                '<span class="red">   / |  X  | \\   </span>',
                '<span class="red">  /  |_____|  \\  </span>',
                '<span class="red">     |     |     </span>'
            ],
            'Autômato de Pascal': [
                '<span class="yellow">     _______     </span>',
                '<span class="yellow">    | [ ] [ ] |    </span>',
                '<span class="yellow">    |    ^    |    </span>',
                '<span class="yellow">    |  [===]  |    </span>',
                '<span class="yellow">    |_________|    </span>',
                '<span class="yellow">     |_|   |_|     </span>',
                '<span class="yellow">     |_|   |_|     </span>'
            ],
            'Eco de Noether': [
                '<span class="magenta">     < * * >     </span>',
                '<span class="magenta">    <   |   >    </span>',
                '<span class="magenta">   <--- o --->   </span>',
                '<span class="magenta">    <   |   >    </span>',
                '<span class="magenta">     < * * >     </span>',
                '<span class="magenta">      / | \\      </span>',
                '<span class="magenta">     /  |  \\     </span>'
            ],
            'Fractal de Mandelbrot': [
                '<span class="magenta">      { & % }     </span>',
                '<span class="magenta">    { % # @ & }   </span>',
                '<span class="magenta">   { & @ % # @ }  </span>',
                '<span class="magenta">    { % # @ & }   </span>',
                '<span class="magenta">      { & % }     </span>'
            ],
            'Prisma de Pitágoras': [
                '<span class="yellow">        /\\       </span>',
                '<span class="yellow">       /  \\      </span>',
                '<span class="yellow">      /____\\     </span>',
                '<span class="yellow">     | a²+b²|    </span>',
                '<span class="yellow">     |  =c² |    </span>',
                '<span class="yellow">     |______|    </span>'
            ],
            'Matriz de Cayley': [
                '<span class="blue">     [ a  b ]    </span>',
                '<span class="blue">     [ c  d ]    </span>',
                '<span class="blue">     [ e  f ]    </span>',
                '<span class="blue">      Vektor     </span>',
                '<span class="blue">     <------>    </span>'
            ],
            'Coelho de Fibonacci': [
                '<span class="white">      (\\_/)      </span>',
                '<span class="white">      (o.o)      </span>',
                '<span class="white">     (>1,1<)     </span>',
                '<span class="white">      (2,3)      </span>',
                '<span class="white">      (5,8)      </span>'
            ],
            'Diferencial de Leibniz': [
                '<span class="green">      dy / dx     </span>',
                '<span class="green">     ∫ (f(x))     </span>',
                '<span class="green">    |   ||   |    </span>',
                '<span class="green">    |   ||   |    </span>',
                '<span class="green">     -------     </span>'
            ],
            'Crivo de Eratóstenes': [
                '<span class="red">    [2][3][5]    </span>',
                '<span class="red">    [7][11][13]  </span>',
                '<span class="red">    [17][19][23] </span>',
                '<span class="red">     # PRIMES #  </span>',
                '<span class="red">     ##########  </span>'
            ],
            'Euler (Arquiteto da Identidade)': [
                '<span class="yellow" style="font-weight:bold">      .-------.      </span>',
                '<span class="yellow" style="font-weight:bold">     / e^iπ+1=0 \\     </span>',
                '<span class="yellow" style="font-weight:bold">    |   ( ∑ )   |    </span>',
                '<span class="yellow" style="font-weight:bold">    |   / | \\   |    </span>',
                '<span class="yellow" style="font-weight:bold">    |  /  |  \\  |    </span>',
                '<span class="yellow" style="font-weight:bold">   /   --|--   \\   </span>',
                '<span class="yellow" style="font-weight:bold">  /    /   \\    \\  </span>',
                '<span class="yellow" style="font-weight:bold"> /_______________\\  </span>'
            ],
            'Lovelace (Tecelã da Lógica)': [
                '<span class="green" style="font-weight:bold">      .-------.      </span>',
                '<span class="green" style="font-weight:bold">     / [10101] \\     </span>',
                '<span class="green" style="font-weight:bold">    |  { LOOP } |    </span>',
                '<span class="green" style="font-weight:bold">    |   ( < > ) |    </span>',
                '<span class="green" style="font-weight:bold">    |  /  |  \\  |    </span>',
                '<span class="green" style="font-weight:bold">   /   --|--   \\   </span>',
                '<span class="green" style="font-weight:bold">  /    /   \\    \\  </span>',
                '<span class="green" style="font-weight:bold"> /_______________\\  </span>'
            ],
            'Riemann (Guardião da Hipótese)': [
                '<span class="blue" style="font-weight:bold">      .-------.      </span>',
                '<span class="blue" style="font-weight:bold">     /  ζ(s)=0  \\     </span>',
                '<span class="blue" style="font-weight:bold">    |  (  ∞  )  |    </span>',
                '<span class="blue" style="font-weight:bold">    |   / | \\   |    </span>',
                '<span class="blue" style="font-weight:bold">    |  /  |  \\  |    </span>',
                '<span class="blue" style="font-weight:bold">   /   --|--   \\   </span>',
                '<span class="blue" style="font-weight:bold">  /    /   \\    \\  </span>',
                '<span class="blue" style="font-weight:bold"> /_______________\\  </span>'
            ],
            'Newton (Arquiteto da Gravidade)': [
                '<span class="red" style="font-weight:bold">      .-------.      </span>',
                '<span class="red" style="font-weight:bold">     /   [G]   \\     </span>',
                '<span class="red" style="font-weight:bold">    |  F = ma   |    </span>',
                '<span class="red" style="font-weight:bold">    |   ( O )   |    </span>',
                '<span class="red" style="font-weight:bold">    |  /  |  \\  |    </span>',
                '<span class="red" style="font-weight:bold">   /   --|--   \\   </span>',
                '<span class="red" style="font-weight:bold">  /    /   \\    \\  </span>',
                '<span class="red" style="font-weight:bold"> /_______________\\  </span>'
            ],
            'Hawking (Senhor da Singularidade)': [
                '<span class="blue" style="font-weight:bold">      .-------.      </span>',
                '<span class="blue" style="font-weight:bold">     /  (   )  \\     </span>',
                '<span class="blue" style="font-weight:bold">    |   ( X )   |    </span>',
                '<span class="blue" style="font-weight:bold">    |  (     )  |    </span>',
                '<span class="blue" style="font-weight:bold">    |   -----   |    </span>',
                '<span class="blue" style="font-weight:bold">   /     |     \\   </span>',
                '<span class="blue" style="font-weight:bold">  /    /   \\    \\  </span>',
                '<span class="blue" style="font-weight:bold"> /_______________\\  </span>'
            ],
            'Maxwell (Tecelão do Eletromagnetismo)': [
                '<span class="cyan" style="font-weight:bold">      .-------.      </span>',
                '<span class="cyan" style="font-weight:bold">     /  ~ ~ ~  \\     </span>',
                '<span class="cyan" style="font-weight:bold">    |  E -> B   |    </span>',
                '<span class="cyan" style="font-weight:bold">    |  (  ⚡  )  |    </span>',
                '<span class="cyan" style="font-weight:bold">    |  /  |  \\  |    </span>',
                '<span class="cyan" style="font-weight:bold">   /   --|--   \\   </span>',
                '<span class="cyan" style="font-weight:bold">  /    /   \\    \\  </span>',
                '<span class="cyan" style="font-weight:bold"> /_______________\\  </span>'
            ],
            'Senhor das Fendas': [
                '<span class="magenta" style="font-weight:bold">      .-------.      </span>',
                '<span class="magenta" style="font-weight:bold">     /  RIP    \\     </span>',
                '<span class="magenta" style="font-weight:bold">    |   _|_     |    </span>',
                '<span class="magenta" style="font-weight:bold">    |  | | |    |    </span>',
                '<span class="magenta" style="font-weight:bold">    |__| | |____|    </span>',
                '<span class="magenta" style="font-weight:bold">   /            \\    </span>',
                '<span class="magenta" style="font-weight:bold">  /   VOID-LORD  \\   </span>',
                '<span class="magenta" style="font-weight:bold"> /________________\\  </span>'
            ]
        }
    };

    const spriteDisplay = document.getElementById('sprite-display');
    const spriteBtns = document.querySelectorAll('.sprite-btn');

    const renderSprites = (type) => {
        if (!spriteDisplay) return;
        spriteDisplay.innerHTML = '';
        const sprites = rawSprites[type];

        Object.entries(sprites).forEach(([name, lines]) => {
            const item = document.createElement('div');
            item.className = 'sprite-item';
            item.innerHTML = `
                <div class="sprite-canvas">${lines.join('\n')}</div>
                <h4>${name}</h4>
            `;
            spriteDisplay.appendChild(item);
        });
    };

    spriteBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            spriteBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderSprites(btn.dataset.type);
        });
    });

    renderSprites('player');

    // --- PATCH NOTES DINÂMICOS ---
    const loadPatchNotes = async () => {
        const container = document.getElementById('patchnotes-container');
        if (!container) return;

        try {
            const markdown = `
# 📜 PATCH NOTES - TERMINAL SOULS

---

## [v1.0.0] - A Ascensão do Exilado
*O Exílio está completo. O Arquiteto aguarda no Andar 10.*

### ⚔️ Sistema de Skills Completo
- **20 Skills Implementadas:** Todas as habilidades das 4 classes com custo de mana real.
- **Guerreiro:** Entropia Cinética (AoE por STR), Lei da Inércia (imunidade + postura máxima).
- **Mago:** Raio de Maxwell (CHOQUE), Paradoxo de Schrödinger (EVASÃO 60%).
- **Arqueiro:** Diagrama de Feynman (multi-hit 3-5x), Óptica de Euclides (ignora defesa).
- **Clérigo:** Sopro de Gaia (remove todos os debuffs), Proporção Áurea (equaliza HP/SP/MP).

### 🔮 Novos Status e Sinergias
- **CHOQUE:** -20 Estabilidade/turno. Combina com CORTE → DESCARGA (+30% dano).
- **CONGELAMENTO:** -15 Estabilidade/turno. Combina com ESMAGAMENTO → FRAGMENTAÇÃO (+50%).
- **EVASÃO:** 60% de chance de desviar do próximo ataque.

### 🗡️ IA de Boss — 3 Fases
- **Fase 1:** Ataque reforçado com recuperação de postura a cada 4 turnos.
- **Fase 2 (≤60%):** Campo de Distorção — aplica CHOQUE + COMBUSTÃO.
- **Fase 3 (≤30%):** Colapso Dimensional — ataque duplo nos turnos pares.

### 🧬 Biomas com Inimigos Temáticos
- **Newton:** Prisma Refrator, Corpo Gravitacional, Arco Espectral — BOSS: Newton Corrompido.
- **Hawking:** Eco de Radiação, Singularidade Menor — BOSS: Sombra de Hawking.
- **Turing:** Autômato de Pascal, Daemon Binário — BOSS: A Máquina Implacável.
- **Noether:** Espectro de Noether, Tensor de Tensão — BOSS: Guardiã do Vazio.

### ⚖️ Economia e Balanceamento
- **Drops de Orbes:** Inimigos dropam Orbes ao morrer (level×3; boss level×15).
- **Curva suave:** HP reduzido nos andares iniciais para progressão fluida.

### 🏆 Endgame
- **SENHOR DA ASCENSÃO:** Boss final a partir do Andar 10 com 3 fases.
- **Tela de Vitória:** Renome Final, bestiário e créditos.

---

## [v0.9.9.1] - O Renome do Exilado
*Seu impacto no mundo agora é quantificado pelo seu legado científico.*

### 🏅 Sistema de Renome (Score)
- **Cálculo de Prestígio:** Score global que escala com nível, atributos, itens equipados, skills e bestiário.
- **Visibilidade:** Renome exibido permanentemente na caixa de Status.

### 💎 Economia & UI
- **Orbes em Destaque:** Linha dedicada na interface de Status.
- **Layout de Status:** Reorganização para melhor leitura.

---

## [v0.9.9] - A Teoria da Estabilidade Cinética
*O combate agora exige precisão matemática e gestão de momentum.*

### ⚙️ NPCs e Hub Expandido
- **Ada (Algoritmos):** Compilação de Dados para Skill Points extras.
- **Marie Curie (Alquimia):** Transmutação e reroll de atributos de itens.
- **Darwin (Evolução):** Seleção Natural — Orbes por atributos permanentes.

### ⚔️ Estabilidade Cinética
- **INÉRCIA:** Dobra defesa, reduz dano. **MOMENTO:** +50% dano, drena Estabilidade. **EQUILÍBRIO:** Estado neutro.

### ⌨️ Navegação Unificada
- **Teclas 1-0:** Funcionam em todos os menus do jogo.
`;

            // Parser Markdown ultra-simples para o formato do projeto
            const lines = markdown.split('\n');
            let html = '';
            let inList = false;

            lines.forEach(line => {
                if (line.startsWith('## ')) {
                    if (inList) { html += '</ul>'; inList = false; }
                    html += `<div class="patch-entry"><h3>${line.replace('## ', '')}</h3>`;
                } else if (line.startsWith('### ')) {
                    if (inList) { html += '</ul>'; inList = false; }
                    html += `<h4>${line.replace('### ', '')}</h4><ul>`;
                    inList = true;
                } else if (line.startsWith('- ')) {
                    html += `<li>${line.replace('- ', '')}</li>`;
                } else if (line.startsWith('*') && line.endsWith('*')) {
                    html += `<p class="gray"><i>${line.replace(/\\*/g, '')}</i></p>`;
                } else if (line.trim() === '---' || line.startsWith('# ')) {
                    if (inList) { html += '</ul>'; inList = false; }
                    if (line.startsWith('## ')) html += '</div>';
                }
            });

            if (inList) html += '</ul>';
            container.innerHTML = html || '<p>Nenhuma transmissão disponível.</p>';
            
        } catch (error) {
            container.innerHTML = '<p class="red">Erro ao sincronizar com o Códice.</p>';
        }
    };

    loadPatchNotes();

    // --- SIMULADOR DE RENOME & SKILL TREE ---
    const skillData = {
        'Guerreiro': {
            'Impacto de Newton': { desc: 'Dano físico massivo. Reduz estabilidade.', cost: 15 },
            'Inércia de Galileu': { desc: 'Aumenta defesa e recupera estabilidade.', cost: 10 },
            'Entropia Cinética': { desc: 'Dano em área baseado em STR.', cost: 20 },
            'Força Centrípeta': { desc: 'Gira a arma atingindo todos.', cost: 25 },
            'Lei da Inércia': { desc: 'Imunidade a Colapso.', cost: 30 }
        },
        'Mago': {
            'Raio de Maxwell': { desc: 'Dano de choque preciso.', cost: 20 },
            'Chama de Lavoisier': { desc: 'Incendeia o inimigo.', cost: 15 },
            'Zero Absoluto': { desc: 'Gera Stagger imediato.', cost: 25 },
            'Paradoxo de Schrödinger': { desc: 'Chance de evitar dano.', cost: 30 },
            'Singularidade de Hawking': { desc: 'Dreno massivo de HP.', cost: 40 }
        },
        'Arqueiro': {
            'Flecha de Hawking': { desc: 'Dano crítico garantido.', cost: 15 },
            'Diagrama de Feynman': { desc: 'Disparo múltiplo.', cost: 20 },
            'Relatividade de Einstein': { desc: 'Aumenta Evasão.', cost: 15 },
            'Óptica de Euclides': { desc: 'Precisão máxima.', cost: 10 },
            'Efeito Doppler': { desc: 'Dano aumenta com a distância.', cost: 25 }
        },
        'Clérigo': {
            'Cura de Hipócrates': { desc: 'Recupera HP.', cost: 20 },
            'Sopro de Gaia': { desc: 'Remove debuffs.', cost: 15 },
            'Luz Primordial': { desc: 'Dano e cura leve.', cost: 25 },
            'Teorema de Pitágoras': { desc: 'Escudo triangular.', cost: 30 },
            'Proporção Áurea': { desc: 'Harmoniza atributos.', cost: 35 }
        }
    };

    const simClass = document.getElementById('sim-class');
    const simLevel = document.getElementById('sim-level');
    const simStr = document.getElementById('sim-str');
    const simDex = document.getElementById('sim-dex');
    const simInt = document.getElementById('sim-int');
    const prestigeValue = document.getElementById('prestige-value');
    const skillContainer = document.getElementById('skill-container');

    const updatePrestige = () => {
        const parsedLevel = parseInt(simLevel.value);
        const parsedStr = parseInt(simStr.value);
        const parsedDex = parseInt(simDex.value);
        const parsedInt = parseInt(simInt.value);

        const level = isNaN(parsedLevel) ? 1 : parsedLevel;
        const str = isNaN(parsedStr) ? 10 : parsedStr;
        const dex = isNaN(parsedDex) ? 10 : parsedDex;
        const int = isNaN(parsedInt) ? 10 : parsedInt;
        
        // Fórmula exata de Entity.js: calculatePrestige()
        // (Nível × 100) + (Atributos × 10) + SkillBonus + BestiárioBonus
        let prestige = (level * 100) + (str + dex + int) * 10;
        prestige += Math.floor(level / 2) * 50; // estimativa de skills
        prestige += Math.floor(level * 3);       // estimativa de bestiário

        prestigeValue.innerText = prestige.toLocaleString('pt-BR');
    };

    const updateSkillTree = () => {
        if (!simClass || !skillContainer) return;
        const selectedClass = simClass.value;
        const skills = skillData[selectedClass];
        skillContainer.innerHTML = '';
        
        Object.entries(skills).forEach(([name, data]) => {
            const node = document.createElement('div');
            node.className = 'skill-node';
            node.innerHTML = `
                <h4>${name}</h4>
                <p>${data.desc}</p>
                <span class="cost">Custo: ${data.cost} MP</span>
            `;
            skillContainer.appendChild(node);
        });
    };

    [simClass, simLevel, simStr, simDex, simInt].forEach(el => {
        if (!el) return;
        ['input', 'change'].forEach(evt => {
            el.addEventListener(evt, () => {
                updatePrestige();
                if (el === simClass) updateSkillTree();
            });
        });
    });

    // Inicialização
    updatePrestige();
    updateSkillTree();

    // Terminal-like keyboard interaction
    document.addEventListener('keydown', (e) => {
        // Log key press in a "terminal" way
        console.log(`%c[INPUT]: ${e.key}`, 'color: #ffff55');
        
        if (e.key >= '1' && e.key <= '9') {
            const index = parseInt(e.key) - 1;
            if (boxes[index]) {
                boxes.forEach(b => b.style.borderColor = 'var(--border-color)');
                boxes[index].style.borderColor = 'var(--red)';
                boxes[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });

    // Add "Data Analysis" effect to tech list
    const techItems = document.querySelectorAll('.tech-box li');
    techItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.color = 'var(--yellow)';
            item.style.transform = 'translateX(10px)';
            item.style.transition = 'all 0.2s ease';
        });
        item.addEventListener('mouseleave', () => {
            item.style.color = '';
            item.style.transform = 'translateX(0)';
        });
    });
});
