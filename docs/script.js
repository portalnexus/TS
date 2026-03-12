document.addEventListener('DOMContentLoaded', () => {
    console.log('%cTerminal Souls - TUI-ARPG', 'color: #ff2a2a; font-weight: bold; font-size: 16px;');
    console.log('%cInicializando interface de documentação...', 'color: #ff0055;');

    const headings = document.querySelectorAll('h1, h2, h3');
    headings.forEach(heading => {
        heading.addEventListener('mouseenter', () => {
            heading.style.textShadow = '0 0 10px #ff2a2a, 0 0 20px #ff0055';
        });
        heading.addEventListener('mouseleave', () => {
            heading.style.textShadow = '0 0 5px #ff2a2a, 0 0 10px #ff0055';
        });
    });
});
