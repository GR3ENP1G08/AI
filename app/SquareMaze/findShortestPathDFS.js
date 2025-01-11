import getNeighbors from './getNeighbors';

const findShortestPathDFS = (start, end, maze, updateMaze, shouldContinue, setPathTime) => {
  return new Promise((resolve) => {
    const stack = [[start]];
    const visited = new Set();
    visited.add(`${start.x},${start.y}`);
    let shortestPath = null;
    const startTime = Date.now();

    const step = () => {
      if (!shouldContinue()) {
        resolve([]);
        return;
      }

      if (stack.length > 0) {
        const path = stack.pop();
        const cell = path[path.length - 1];

        if (cell.x === end.x && cell.y === end.y) {
          if (!shortestPath || path.length < shortestPath.length) {
            shortestPath = path;
          }
          updateMaze(shortestPath, visited);
          const endTime = Date.now();
          setPathTime(endTime - startTime);
          resolve(shortestPath);
          return;
        }

        const neighbors = getNeighbors(cell, maze);
        for (const neighbor of neighbors) {
          if (!visited.has(`${neighbor.x},${neighbor.y}`)) {
            visited.add(`${neighbor.x},${neighbor.y}`);
            const newPath = [...path, neighbor];
            stack.push(newPath);
            updateMaze(newPath, visited);
          }
        }

        setTimeout(step, 100);
      } else {
        resolve(shortestPath || []);
      }
    };

    step();
  });
};

export default findShortestPathDFS;