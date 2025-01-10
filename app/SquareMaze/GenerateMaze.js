import { CheckNeighbors } from './CheckNeighbors';
import RemoveWalls from './RemoveWalls';

const GenerateMaze = (initialMaze, SetMaze, extraWallProbability = 0, withSteps = false, shouldContinueRef, setGenerationTime) => {
  const stack = [];
  let currentCell = initialMaze[0][0];
  currentCell.visited = true;
  stack.push(currentCell);

  const GridCopy = initialMaze.map(row => row.map(cell => ({ ...cell })));
  const startTime = Date.now();

  const step = () => {
    if (!shouldContinueRef.current) return;

    if (stack.length > 0) {
      const nextCell = CheckNeighbors(currentCell, GridCopy);

      if (nextCell) {
        nextCell.visited = true;
        stack.push(nextCell);

        RemoveWalls(currentCell, nextCell, GridCopy);
        currentCell = nextCell;
      } else {
        currentCell = stack.pop();
      }

      if (Math.random() < extraWallProbability) {
        const randomCell = GridCopy[Math.floor(Math.random() * GridCopy.length)][Math.floor(Math.random() * GridCopy[0].length)];
        const direction = Math.floor(Math.random() * 4);
        if (!isBorderCell(randomCell, GridCopy)) {
          randomCell.walls[direction] = false;
          const neighbor = getNeighbor(GridCopy, randomCell, direction);
          if (neighbor) {
            neighbor.walls[(direction + 2) % 4] = false;
          }
        }
      }

      SetMaze([...GridCopy]);
      if (withSteps) {
        setTimeout(step, 100);
      } else {
        step();
      }
    } else {
      SetMaze(GridCopy);
      const endTime = Date.now();
      setGenerationTime(endTime - startTime);
    }
  };

  if (withSteps) {
    step();
  } else {
    while (stack.length > 0) {
      step();
    }
  }
};

const getNeighbor = (maze, cell, direction) => {
  const { x, y } = cell;
  switch (direction) {
    case 0: return y > 0 ? maze[y - 1][x] : null;
    case 1: return x < maze[0].length - 1 ? maze[y][x + 1] : null;
    case 2: return y < maze.length - 1 ? maze[y + 1][x] : null;
    case 3: return x > 0 ? maze[y][x - 1] : null;
    default: return null;
  }
};

const isBorderCell = (cell, maze) => {
  const { x, y } = cell;
  return x === 0 || y === 0 || x === maze[0].length - 1 || y === maze.length - 1;
};

export default GenerateMaze;