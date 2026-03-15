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
        const level = parseInt(simLevel.value) || 1;
        const str = parseInt(simStr.value) || 10;
        const dex = parseInt(simDex.value) || 10;
        const int = parseInt(simInt.value) || 10;
        
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
