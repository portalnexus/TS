📜 GAME DESIGN DOCUMENT: TERMINAL SOULS
Subtítulo: The Echoes of Reason
Gênero: TUI-ARPG (Text User Interface Action RPG) com foco em História da Ciência e Matemática.
Versão: 1.0.0
Autor: João Pedro Melloni Tardif Germano
Tecnologias Core: Node.js, Chalk (Cores), Blessed (Layout TUI), Math.js (Geração de Puzzles).

1. RESUMO EXECUTIVO
Terminal Souls: The Echoes of Reason é um ARPG baseado em TUI ambientado em um mundo que é uma manifestação física do conhecimento científico. As Fendas representam os ecos de grandes mentes da história.

1.1 Pilares de Design
Ecos da Razão: Narrativa integrada à história da ciência.
Intelecto como Arma: Puzzles avançados e sistema de skills científicas.
Progressão Diablo II Style: Árvores de habilidades ramificadas por classe.
Renome Científico (Score): Sua fama no Exílio é baseada no acúmulo de conhecimento, itens raros e inimigos catalogados.
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
- Exibição de Equipamento: Painel dedicado para conferência de stats em tempo real (tecla I).
- Crafting: Altar de Marie Curie realinha atributos de itens Raros e Lendários (50 Orbes).
- Mouse DESATIVADO intencionalmente — navegação 100% via teclado (WASD, 1-0, Q/E).
