import getNeighbors from './getNeighbors';

const findShortestPath = (start, end, maze) => {
  const queue = [[start]];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  while (queue.length > 0) {
    const path = queue.shift();
    const cell = path[path.length - 1];

    if (cell.x === end.x && cell.y === end.y) {
      return path;
    }

    const neighbors = getNeighbors(cell, maze);
    for (const neighbor of neighbors) {
      if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
        visited.add(`${neighbor.x},${neighbor.y}`);
        queue.push([...path, neighbor]);
      }
    }
  }

  return [];
};

export default findShortestPath;