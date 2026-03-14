📜 GAME DESIGN DOCUMENT: TERMINAL SOULS
Subtítulo: The Echoes of Reason
Gênero: TUI-ARPG (Text User Interface Action RPG) com foco em História da Ciência e Matemática.
Versão: 0.9.5
Autor: João Pedro Melloni Tardif Germano
Tecnologias Core: Node.js, Chalk (Cores), Blessed (Layout TUI), Math.js (Geração de Puzzles).

1. RESUMO EXECUTIVO
Terminal Souls: The Echoes of Reason é um ARPG baseado em TUI ambientado em um mundo que é uma manifestação física do conhecimento científico. As Fendas representam os ecos de grandes mentes da história.

1.1 Pilares de Design
Ecos da Razão: Narrativa integrada à história da ciência.
Intelecto como Arma: Puzzles avançados e sistema de skills científicas.
Progressão Diablo II Style: Árvores de habilidades ramificadas por classe.
Hardcore: Morte permanente com deleção de save.

2. O MUNDO E O GAMEPLAY LOOP
As Fendas de Razão escalam em tamanho e complexidade conforme o jogador se aprofunda (Andar 1 ao 100).
- Mapas Dinâmicos: O tamanho do grid aumenta proceduralmente.
- Inimigos Temáticos: Esqueletos de Gauss, Lobos de Turing, Autômatos de Pascal.

3. CLASSES E SKILLS (Legado dos Arquitetos)
Cada classe possui 5 habilidades únicas que escalam com o nível:
- Guerreiro: Impacto de Newton, Inércia de Galileu, Entropia Cinética, Força Centrípeta, Lei da Inércia.
- Mago: Raio de Maxwell, Chama de Lavoisier, Zero Absoluto, Paradoxo de Schrödinger, Singularidade de Hawking.
- Arqueiro: Flecha de Hawking, Diagrama de Feynman, Relatividade de Einstein, Óptica de Euclides, Efeito Doppler.
- Clérigo: Cura de Hipócrates, Sopro de Gaia, Luz Primordial, Teorema de Pitágoras, Proporção Áurea.

4. SISTEMA DE ITENS
Os itens possuem raridades (Comum a Lendário) e atributos randômicos (STR, DEX, INT). Itens raros carregam Flavor Text com citações históricas.
- Sistema de Tooltip: Hover do mouse no inventário revela detalhes imediatos.
- Exibição de Equipamento: Painel dedicado para conferência de stats em tempo real.
