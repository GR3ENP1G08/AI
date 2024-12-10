const RemoveWalls = (current, next, grid) => {
  const xDiff = current.x - next.x;
  const yDiff = current.y - next.y;

  if (xDiff === 1) {
    grid[current.y][current.x].walls[3] = false;
    grid[next.y][next.x].walls[1] = false;
  } else if (xDiff === -1) {
    grid[current.y][current.x].walls[1] = false;
    grid[next.y][next.x].walls[3] = false;
  }

  if (yDiff === 1) {
    grid[current.y][current.x].walls[0] = false;
    grid[next.y][next.x].walls[2] = false;
  } else if (yDiff === -1) {
    grid[current.y][current.x].walls[2] = false;
    grid[next.y][next.x].walls[0] = false;
  }
};

export default RemoveWalls;