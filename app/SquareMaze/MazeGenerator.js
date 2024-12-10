import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Button } from 'react-native';
import CreateGrid from './CreateGrid';
import GenerateMaze from './GenerateMaze';
import findShortestPath from './findShortestPath';
import WallEditor from './WallEditor';

const MazeGenerator = ({ height, width, exits, color, showCreationProcess, extraWallProbability = 0 }) => {
  const [maze, SetMaze] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const [path1, setPath1] = useState([]);
  const [path2, setPath2] = useState([]);
  const [exitCells, setExitCells] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [lastSelectedCell, setLastSelectedCell] = useState(null);
  const { selectedCells, toggleCellSelection, addWall, removeWall, clearSelectedCells } = WallEditor(maze, SetMaze);
  const cellSize = Math.min(Dimensions.get('window').width / width, Dimensions.get('window').height / height); 

  useEffect(() => {
    const newMaze = CreateGrid(width, height);
    GenerateMaze(newMaze, exits, SetMaze, setExitCells, extraWallProbability, showCreationProcess);
    setShowButton(false);
    setPath1([]);
    setPath2([]);
    clearSelectedCells();
  }, [height, width, exits, showCreationProcess, extraWallProbability]);

  useEffect(() => {
    setShowButton(selectedCells.length === 2 || (selectedCells.length === 1 && exits > 0));
  }, [selectedCells, exits]);

  const handleShowPath = () => {
    if (selectedCells.length === 2) {
      const path = findShortestPath(selectedCells[0], selectedCells[1], maze);
      setPath1(path);
      setPath2([]);
    } else if (selectedCells.length === 1 && exits > 0) {
      const paths = exitCells.map(exitCell => findShortestPath(selectedCells[0], exitCell, maze));
      setPath1(paths[0] || []);
      setPath2(paths[1] || []);
    }
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
                    backgroundColor: isSelected ? 'pink' : isCrossingPath ? 'yellow' : isPath1 ? 'lightgreen' : isPath2 ? 'lightblue' : color,
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