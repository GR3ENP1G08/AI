import RandomInt from '../RandomInt';

const CheckNeighbors = (cell, grid) => {
  const { x, y } = cell;
  const neighbors = [];

  if (y > 0 && !grid[y - 1][x].visited) neighbors.push(grid[y - 1][x]);
  if (x < grid[0].length - 1 && !grid[y][x + 1].visited) neighbors.push(grid[y][x + 1]);
  if (y < grid.length - 1 && !grid[y + 1][x].visited) neighbors.push(grid[y + 1][x]);
  if (x > 0 && !grid[y][x - 1].visited) neighbors.push(grid[y][x - 1]);

  if (neighbors.length > 0) {
    const randIndex = RandomInt(0, neighbors.length);
    return neighbors[randIndex];
  }

  return null;
};

export { CheckNeighbors };