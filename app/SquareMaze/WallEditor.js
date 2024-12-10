import { useState } from 'react';

const WallEditor = (maze, setMaze) => {
  const [selectedCells, setSelectedCells] = useState([]);

  const toggleCellSelection = (cell, clearPaths) => {
    setSelectedCells(prevSelectedCells => {
      const isSelected = prevSelectedCells.some(selectedCell => selectedCell.x === cell.x && selectedCell.y === cell.y);
      const newSelectedCells = isSelected
        ? prevSelectedCells.filter(selectedCell => selectedCell.x !== cell.x || selectedCell.y !== cell.y)
        : [...prevSelectedCells, cell];

      clearPaths();
      return newSelectedCells;
    });
  };

  const clearSelectedCells = () => {
    setSelectedCells([]);
  };

  const addWall = () => {
    if (selectedCells.length > 1) {
      const newMaze = [...maze];
      for (let i = 0; i < selectedCells.length - 1; i++) {
        const cell1 = selectedCells[i];
        const cell2 = selectedCells[i + 1];
        const direction = getDirection(cell1, cell2);
        if (direction !== null) {
          newMaze[cell1.y][cell1.x].walls[direction] = true;
          const neighbor = getNeighbor(newMaze, cell1, direction);
          if (neighbor) {
            neighbor.walls[(direction + 2) % 4] = true;
          }
        }
      }
      setMaze(newMaze);
    }
  };

  const removeWall = () => {
    if (selectedCells.length > 1) {
      const newMaze = [...maze];
      for (let i = 0; i < selectedCells.length - 1; i++) {
        const cell1 = selectedCells[i];
        const cell2 = selectedCells[i + 1];
        const direction = getDirection(cell1, cell2);
        if (direction !== null) {
          newMaze[cell1.y][cell1.x].walls[direction] = false;
          const neighbor = getNeighbor(newMaze, cell1, direction);
          if (neighbor) {
            neighbor.walls[(direction + 2) % 4] = false;
          }
        }
      }
      setMaze(newMaze);
    }
  };

  const getDirection = (cell1, cell2) => {
    if (cell1.x === cell2.x && cell1.y === cell2.y - 1) return 2;
    if (cell1.x === cell2.x && cell1.y === cell2.y + 1) return 0;
    if (cell1.x === cell2.x - 1 && cell1.y === cell2.y) return 1;
    if (cell1.x === cell2.x + 1 && cell1.y === cell2.y) return 3;
    return null;
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

  return {
    selectedCells,
    toggleCellSelection,
    clearSelectedCells,
    addWall,
    removeWall,
  };
};

export default WallEditor;