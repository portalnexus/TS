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
