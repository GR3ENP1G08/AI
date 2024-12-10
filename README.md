# Descrição
## Mazes
Gerador de labirintos simples, onde pode determinar o tammanho do labirinto. Em SquareMaze cria um labirinto perfeito onde todas a celulas tem apenas um caminho para cada outra celula. Non-PerfectMaze um labirinto igual ao SquareMaze mas que remove paredes das celulas para criar mais caminhos.
## Fill Square
Um jogo simples onde são geradas uma grid com o tamanho determinado pelo ultilizador e obstáculos. Objetivo do jogo é preencher todos os quadrados sem passar por caminhos ja visitados e sem tocar nos obstáculos.
# Controlos
## Mazes
O utilizador consegue inserir a altura e a largura do labirinto, selecionar se quer sem saida, com uma saida ou 2 saidas, tambem se quer ver o labirinto a ser gerado, que tipo de técnica de AI gostaria de utilizar para a criação do path e o utilizadir pode selecionar as celulas no labirinto. A criação de path é feita a partir de duas celulas selecionadas, uma celula selecionada e uma saida, duas saidas ou duas saidas e uma celula selecionada.
## FillSquare
O utilizador pode selecionar a altura e largura do labirinto, mover com "wasd", resetar a grid e mostrar a solução
# Técnicas de AI utilizadas
## Mazes
Em Mazes foi utilizado DFS para a criação do labirinto em uma grid, no Non-PerffectMaze tambem foi utilizado DFS mas algumas paredes são removidas para a criação de mais caminhos. Para o path finding em Mazes foi utilizado BFS e DFS, dando ao utilizador a escolha de qual gostaria de usar.
# FillSquare
Em FillSquare tambem foi utilizado DFS para a criação. É criada uma grid com os tamanhos que o utilizador inseriu, depois com DFS percorre aleatoriamente a grid com as seguintes limitações, so pode percorrer uma vez, não pode visitar celulas ja visitadas e esta limitado a percorrer a grid entre 25% e 75% total da grid podendo ser alterado, depois disso as celulas não percorridas viram obstáculos. O show solution guarda o caminho percorrido e mostra quando pressionado.
