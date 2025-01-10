import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Button, Picker, Text } from 'react-native';
import CreateGrid from './CreateGrid';
import GenerateMaze from './GenerateMaze';
import findShortestPath from './findShortestPath';
import findShortestPathDFS from './findShortestPathDFS';
import WallEditor from './WallEditor';

const MazeGenerator = ({ height, width, showCreationProcess, extraWallProbability = 0 }) => {
  const [maze, SetMaze] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [path1, setPath1] = useState([]);
  const [path2, setPath2] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastSelectedCell, setLastSelectedCell] = useState(null);
  const [algorithm, setAlgorithm] = useState('BFS');
  const [generationTime, setGenerationTime] = useState(0);
  const [pathTimeBFS, setPathTimeBFS] = useState(0);
  const [pathTimeDFS, setPathTimeDFS] = useState(0);
  const { selectedCells, toggleCellSelection, clearSelectedCells } = WallEditor(maze, SetMaze);
  const cellSize = Math.min(Dimensions.get('window').width / width, Dimensions.get('window').height / height); 
  const shouldContinueRef = useRef(true);

  useEffect(() => {
    const newMaze = CreateGrid(width, height).map(row => row.map(cell => ({ ...cell, visited: false })));
    shouldContinueRef.current = true;
    GenerateMaze(newMaze, SetMaze, extraWallProbability, showCreationProcess, shouldContinueRef, setGenerationTime);
    setShowButton(false);
    setPath1([]);
    setPath2([]);
    clearSelectedCells();
  }, [height, width, showCreationProcess, extraWallProbability]);

  useEffect(() => {
    setShowButton(selectedCells.length === 2);
  }, [selectedCells]);

  const handleShowPath = () => {
    shouldContinueRef.current = true;
    if (algorithm === 'BFS') {
      findShortestPath(selectedCells[0], selectedCells[1], maze, (path, visited) => {
        setPath1(path);
        updateMazeWithVisited(visited);
      }, () => shouldContinueRef.current, setPathTimeBFS);
      setPath2([]);
    } else if (algorithm === 'DFS') {
      findShortestPathDFS(selectedCells[0], selectedCells[1], maze, (path, visited) => {
        setPath1(path);
        updateMazeWithVisited(visited);
      }, () => shouldContinueRef.current, setPathTimeDFS);
      setPath2([]);
    } else if (algorithm === 'BOTH') {
      findShortestPath(selectedCells[0], selectedCells[1], maze, (path, visited) => {
        setPath1(path);
        updateMazeWithVisited(visited);
      }, () => shouldContinueRef.current, setPathTimeBFS);
      
      findShortestPathDFS(selectedCells[0], selectedCells[1], maze, (path, visited) => {
        setPath2(path);
        updateMazeWithVisited(visited);
      }, () => shouldContinueRef.current, setPathTimeDFS);
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
        <Picker.Item label="BOTH" value="BOTH" />
      </Picker>
      <View style={{ opacity: showButton ? 1 : 0 }}>
        <Button title="Show Path" onPress={handleShowPath} />
      </View>
      <Text>Generation Time: {generationTime} ms</Text>
      {algorithm === 'BOTH' ? (
        <>
          <Text>BFS Pathfinding Time: {pathTimeBFS} ms</Text>
          <Text>DFS Pathfinding Time: {pathTimeDFS} ms</Text>
        </>
      ) : (
        <Text>Pathfinding Time: {algorithm === 'BFS' ? pathTimeBFS : pathTimeDFS} ms</Text>
      )}
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