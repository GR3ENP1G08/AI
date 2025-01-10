import getNeighbors from './getNeighbors';

const findShortestPath = (start, end, maze, updateMaze, shouldContinue, setPathTime) => {
  return new Promise((resolve) => {
    const queue = [[start]];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);
    const startTime = Date.now();

    const step = () => {
      if (!shouldContinue()) {
        resolve([]);
        return;
      }

      if (queue.length > 0) {
        const path = queue.shift();
        const cell = path[path.length - 1];

        if (cell.x === end.x && cell.y === end.y) {
          updateMaze(path, visited);
          const endTime = Date.now();
          setPathTime(endTime - startTime);
          resolve(path);
          return;
        }

        const neighbors = getNeighbors(cell, maze);
        for (const neighbor of neighbors) {
          if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
            visited.add(`${neighbor.x},${neighbor.y}`);
            const newPath = [...path, neighbor];
            queue.push(newPath);
            updateMaze(newPath, visited);
          }
        }

        setTimeout(step, 100);
      } else {
        resolve([]);
      }
    };

    step();
  });
};

export default findShortestPath;