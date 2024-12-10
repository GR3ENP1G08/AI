import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Button, Picker } from 'react-native';
import CreateGrid from './CreateGrid';
import GenerateMaze from './GenerateMaze';
import findShortestPath from './findShortestPath';
import findShortestPathDFS from './findShortestPathDFS';
import WallEditor from './WallEditor';

const MazeGenerator = ({ height, width, exits, showCreationProcess, extraWallProbability = 0 }) => {
  const [maze, SetMaze] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [path1, setPath1] = useState([]);
  const [path2, setPath2] = useState([]);
  const [exitCells, setExitCells] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastSelectedCell, setLastSelectedCell] = useState(null);
  const [algorithm, setAlgorithm] = useState('BFS');
  const { selectedCells, toggleCellSelection, addWall, removeWall, clearSelectedCells } = WallEditor(maze, SetMaze);
  const cellSize = Math.min(Dimensions.get('window').width / width, Dimensions.get('window').height / height); 
  const shouldContinueRef = useRef(true);

  useEffect(() => {
    const newMaze = CreateGrid(width, height).map(row => row.map(cell => ({ ...cell, visited: false })));
    GenerateMaze(newMaze, exits, SetMaze, setExitCells, extraWallProbability, showCreationProcess);
    setShowButton(false);
    setPath1([]);
    setPath2([]);
    clearSelectedCells();
    shouldContinueRef.current = false;
  }, [height, width, exits, showCreationProcess, extraWallProbability]);

  useEffect(() => {
    setShowButton(selectedCells.length === 2 || (selectedCells.length === 1 && exits > 0) || exits === 2);
  }, [selectedCells, exits]);

  const handleShowPath = () => {
    shouldContinueRef.current = true;
    const findPath = algorithm === 'BFS' ? findShortestPath : findShortestPathDFS;
  
    if (selectedCells.length === 2) {
      findPath(selectedCells[0], selectedCells[1], maze, (path, visited) => {
        setPath1(path);
        updateMazeWithVisited(visited);
      }, () => shouldContinueRef.current);
      setPath2([]);
    } else if (selectedCells.length === 1 && exits > 0) {
      if (exitCells.length > 0) {
        findPath(selectedCells[0], exitCells[0], maze, (path, visited) => {
          setPath1(path);
          updateMazeWithVisited(visited);
        }, () => shouldContinueRef.current);
      }
      if (exitCells.length > 1) {
        findPath(selectedCells[0], exitCells[1], maze, (path, visited) => {
          setPath2(path);
          updateMazeWithVisited(visited);
        }, () => shouldContinueRef.current);
      }
    } else if (exits === 2 && exitCells.length === 2) {
      findPath(exitCells[0], exitCells[1], maze, (path, visited) => {
        setPath1(path);
        updateMazeWithVisited(visited);
      }, () => shouldContinueRef.current);
      setPath2([]);
    }
  };

  const updateMazeWithVisited = (visited) => {
    const newMaze = maze.map(row => row.map(cell => ({
      ...cell,
      visited: visited.has(`${cell.x},${cell.y}`)
    })));
    SetMaze(newMaze);
  };

  const handleMouseDown = () => {
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setLastSelectedCell(null);
  };

  const handleMouseMove = (cell) => {
    if (isMouseDown) {
      if (!lastSelectedCell || (lastSelectedCell.x !== cell.x || lastSelectedCell.y !== cell.y)) {
        toggleCellSelection(cell, () => {
          setPath1([]);
          setPath2([]);
        });
        setLastSelectedCell(cell);
      }
    }
  };

  const borderWidth = cellSize * 0.01;
  const outerBorderWidth = cellSize * 0.06;

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={algorithm}
        style={{ height: 50, width: 150 }}
        onValueChange={(itemValue) => setAlgorithm(itemValue)}
      >
        <Picker.Item label="BFS" value="BFS" />
        <Picker.Item label="DFS" value="DFS" />
      </Picker>
      <View style={{ opacity: showButton ? 1 : 0 }}>
        <Button title="Show Path" onPress={handleShowPath} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Add Wall" onPress={addWall} />
        <Button title="Remove Wall" onPress={removeWall} />
      </View>
      {maze.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((cell, cellIndex) => {
            const isTopRow = rowIndex === 0;
            const isBottomRow = rowIndex === height - 1;
            const isLeftCol = cellIndex === 0;
            const isRightCol = cellIndex === width - 1;
            const isSelected = selectedCells.some(selectedCell => selectedCell.x === cell.x && selectedCell.y === cell.y);
            const isPath1 = path1.some(pathCell => pathCell.x === cell.x && pathCell.y === cell.y);
            const isPath2 = path2.some(pathCell => pathCell.x === cell.x && pathCell.y === cell.y);
            const isCrossingPath = isPath1 && isPath2;
            const isVisited = cell.visited;

            return (
              <TouchableOpacity
                key={cellIndex}
                style={[
                  styles.cell,
                  {
                    borderTopWidth: cell.walls[0] ? (isTopRow ? outerBorderWidth : borderWidth) : 0,
                    borderRightWidth: cell.walls[1] ? (isRightCol ? outerBorderWidth : borderWidth) : 0,
                    borderBottomWidth: cell.walls[2] ? (isBottomRow ? outerBorderWidth : borderWidth) : 0,
                    borderLeftWidth: cell.walls[3] ? (isLeftCol ? outerBorderWidth : borderWidth) : 0,
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: isSelected ? 'pink' : isCrossingPath ? 'yellow' : isPath1 ? (algorithm === 'BFS' ? 'lightgreen' : 'lightcoral') : isPath2 ? 'lightblue' : isVisited ? 'lightgray' : 'white',
                  },
                ]}
                onPress={() => toggleCellSelection(cell, () => {
                  setPath1([]);
                  setPath2([]);
                })}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={() => handleMouseMove(cell)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: { 
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default MazeGenerator;