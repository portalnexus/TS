document.addEventListener('DOMContentLoaded', () => {
    console.log('%c TERMINAL SOULS: THE ECHOES OF REASON ', 'background: #ff5555; color: #000; font-weight: bold; font-size: 20px;');
    console.log('%c [SISTEMA] Inicializando interface de documentação científica... ', 'color: #55ffff;');
    console.log('%c [NÚCLEO] Versão 0.9.9.1 carregada com sucesso. ', 'color: #55ff55;');

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
                '<span class="green">     /\\     /\\   </span>',
                '<span class="green">    /  \\___/  \\  </span>',
                '<span class="green">   |   o   o   | </span>',
                '<span class="green">    \\_  -  _/    </span>',
                '<span class="green">     /| |\\      </span>',
                '<span class="green">    / | | \\     </span>',
                '<span class="green">     /   \\      </span>'
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
            'Lobo Corrompido': [
                '<span class="gray">    /\\___/\\    </span>',
                '<span class="gray">   / o   o \\   </span>',
                '<span class="gray">  ( == Y == )  </span>',
                '<span class="gray">   )       (   </span>',
                '<span class="gray">  /         \\  </span>',
                '<span class="gray"> /           \\ </span>'
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
            // Em produção: const response = await fetch('../TS/patchnotes.md');
            // Simulando fetch para esta demonstração com o conteúdo que acabamos de ler
            const markdown = `
# 📜 PATCH NOTES - TERMINAL SOULS

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
        
        // Lógica simplificada de Entity.js: (Lvl * 100) + (Stats Sum * 10)
        let prestige = (level * 100) + (str + dex + int) * 10;
        
        // Simular prestige de skills (assumindo que o player comprou algumas)
        prestige += Math.floor(level / 2) * 50; 
        
        prestigeValue.innerText = prestige;
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
