import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';

const FillSquare = ({ fillHeight, fillWidth, regenerate, resetVisited }) => {
  const [grid, setGrid] = useState([]);
  const [visited, setVisited] = useState([]);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [showSolution, setShowSolution] = useState(false);
  const [solutionPath, setSolutionPath] = useState([]);
  const [animatedCells, setAnimatedCells] = useState([]);
  const timeoutsRef = useRef([]);

  useEffect(() => {
    initializeGrid();
  }, [regenerate]);

  useEffect(() => {
    if (resetVisited) {
      resetVisitedCells();
    }
  }, [resetVisited]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (gameOver) return;

      let newX = playerPosition.x;
      let newY = playerPosition.y;

      switch (event.key) {
        case 'w':
          newX = Math.max(0, playerPosition.x - 1);
          break;
        case 's':
          newX = Math.min(fillHeight - 1, playerPosition.x + 1);
          break;
        case 'a':
          newY = Math.max(0, playerPosition.y - 1);
          break;
        case 'd':
          newY = Math.min(fillWidth - 1, playerPosition.y + 1);
          break;
        default:
          return;
      }

      setShowSolution(false);
      setAnimatedCells([]);

      if (grid[newX][newY] === -1) {
        setGameOver(true);
        setMessage('You hit an obstacle.');
      } else if (visited[newX][newY]) {
        setGameOver(true);
        setMessage('You hit a visited cell.');
      } else {
        setPlayerPosition({ x: newX, y: newY });
        const newVisited = [...visited];
        newVisited[newX][newY] = true;
        setVisited(newVisited);

        if (checkWinCondition(newVisited)) {
          setGameOver(true);
          setMessage('You filled all cells.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPosition, gameOver, grid, visited]);

  const initializeGrid = () => {
    clearTimeouts();
    let newGrid;
    let filledCells;
    const totalCells = fillHeight * fillWidth;
    const minFilledCells = Math.floor(totalCells * 0.25);
    const maxFilledCells = Math.floor(totalCells * 0.75);
    let startX, startY;
    let path = [];

    do {
      newGrid = Array(fillHeight).fill(null).map(() => Array(fillWidth).fill(0));
      ({ filledCells, startX, startY, path } = createSinglePath(newGrid));
    } while (filledCells < minFilledCells || filledCells > maxFilledCells);

    placeObstacles(newGrid, filledCells);

    const newVisited = Array(fillHeight).fill(null).map(() => Array(fillWidth).fill(false));
    newVisited[startX][startY] = true;
    setGrid(newGrid);
    setVisited(newVisited);
    setPlayerPosition({ x: startX, y: startY });
    setStartPosition({ x: startX, y: startY });
    setGameOver(false);
    setMessage('');
    setShowSolution(false);
    setSolutionPath(path);
    setAnimatedCells([]);
  };

  const createSinglePath = (grid) => {
    let x = Math.floor(Math.random() * fillHeight);
    let y = Math.floor(Math.random() * fillWidth);
    const startX = x;
    const startY = y;
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    let filledCells = 0;
    let path = [];

    grid[x][y] = 1;
    filledCells++;
    path.push({ x, y });

    while (filledCells < fillHeight * fillWidth) {
      const validDirections = directions.filter(([dx, dy]) => {
        const newX = x + dx;
        const newY = y + dy;
        return newX >= 0 && newX < fillHeight && newY >= 0 && newY < fillWidth && grid[newX][newY] === 0;
      });

      if (validDirections.length === 0) {
        break;
      }

      const [dx, dy] = validDirections[Math.floor(Math.random() * validDirections.length)];
      x += dx;
      y += dy;
      grid[x][y] = 1;
      filledCells++;
      path.push({ x, y });
    }

    return { filledCells, startX, startY, path };
  };

  const placeObstacles = (grid, filledCells) => {
    const totalCells = fillHeight * fillWidth;
    const maxObstacles = totalCells - filledCells;
    let obstaclesPlaced = 0;

    while (obstaclesPlaced < maxObstacles) {
      const x = Math.floor(Math.random() * fillHeight);
      const y = Math.floor(Math.random() * fillWidth);
      if (grid[x][y] === 0) {
        grid[x][y] = -1;
        obstaclesPlaced++;
      }
    }
  };

  const resetVisitedCells = () => {
    clearTimeouts();
    const newVisited = Array(fillHeight).fill(null).map(() => Array(fillWidth).fill(false));
    newVisited[startPosition.x][startPosition.y] = true;
    setVisited(newVisited);
    setPlayerPosition(startPosition);
    setGameOver(false);
    setMessage('');
    setShowSolution(false);
    setAnimatedCells([]);
  };

  const checkWinCondition = (visited) => {
    for (let rowIndex = 0; rowIndex < fillHeight; rowIndex++) {
      for (let colIndex = 0; colIndex < fillWidth; colIndex++) {
        if (grid[rowIndex][colIndex] !== -1 && !visited[rowIndex][colIndex]) {
          return false;
        }
      }
    }
    return true;
  };

  const handleShowSolution = () => {
    setShowSolution(true);
    animateSolutionPath(solutionPath);
  };

  const animateSolutionPath = (path) => {
    clearTimeouts();
    path.forEach((pos, index) => {
      const timeout = setTimeout(() => {
        setAnimatedCells(prev => [...prev, pos]);
      }, index * 100);
      timeoutsRef.current.push(timeout);
    });
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current = [];
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <View
                key={colIndex}
                style={[
                  styles.cell,
                  cell === -1 ? styles.obstacle : 
                  visited[rowIndex][colIndex] ? styles.visited : 
                  (showSolution && animatedCells.some(pos => pos.x === rowIndex && pos.y === colIndex)) ? styles.solution : 
                  styles.unvisited,
                  playerPosition.x === rowIndex && playerPosition.y === colIndex ? styles.player : null,
                ]}
              />
            ))}
          </View>
        ))}
      </View>
      {gameOver && (
        <View style={styles.messageContainer}>
          <Text style={styles.message}>{message}</Text>
        </View>
      )}
      <Button title="Show Solution" onPress={handleShowSolution} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  grid: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 30,
    height: 30,
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  obstacle: {
    backgroundColor: 'black',
  },
  visited: {
    backgroundColor: '#0dbf3d',
  },
  unvisited: {
    backgroundColor: 'white',
  },
  solution: {
    backgroundColor: '#f5da11',
  },
  player: {
    backgroundColor: 'red',
  },
  messageContainer: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FillSquare;