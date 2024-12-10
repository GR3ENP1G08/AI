const getNeighbors = (cell, maze) => {
  const { x, y } = cell;
  const neighbors = [];

  if (!cell.walls[0] && y > 0) neighbors.push(maze[y - 1][x]);
  if (!cell.walls[1] && x < maze[0].length - 1) neighbors.push(maze[y][x + 1]);
  if (!cell.walls[2] && y < maze.length - 1) neighbors.push(maze[y + 1][x]);
  if (!cell.walls[3] && x > 0) neighbors.push(maze[y][x - 1]);

  return neighbors;
};

export default getNeighbors;