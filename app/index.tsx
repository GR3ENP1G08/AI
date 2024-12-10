import React, { useState } from 'react';
import { Text, View, TextInput, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native";
import MazeGenerator from './SquareMaze/MazeGenerator';
import FillSquare from './FillSquare/FillSquare';

const NumericInputExample = () => {
  const [height, SetHeight] = useState('10');
  const [width, SetWidth] = useState('10');
  const [generate, SetGenerate] = useState(false);
  const [mazeParams, SetMazeParams] = useState({ height: 10, width: 10, exits: 0, color: '#FFFFFF'});
  const [exits, SetExits] = useState(0);
  const [selectedExitButton, SetSelectedExitButton] = useState(0);
  const [color, SetColor] = useState('#FFFFFF');
  const [mazeType, SetMazeType] = useState('square');
  const [showCreationProcess, SetShowCreationProcess] = useState(false);
  const [showFillSquare, setShowFillSquare] = useState(false);
  const [showNormal, setShowNormal] = useState(false);
  const [fillHeight, setfillHeight] = useState('5');
  const [fillWidth, setfillWidth] = useState('5');
  const [showGrid, setShowGrid] = useState(false);
  const [regenerate, setRegenerate] = useState(false);
  const [resetVisited, setResetVisited] = useState(false);

  const HandleGenerate = () => {
    SetMazeParams({
      height: parseInt(height) || 10,
      width: parseInt(width) || 10,
      exits,
      color,
    });
    SetGenerate(true);
    setShowGrid(true);
    setRegenerate(!regenerate);
  };

  const HandleExitButtonPress = (value: number) => {
    SetExits(value);
    SetSelectedExitButton(value);
  };

  const handleBackToMenu = () => {
    setShowFillSquare(false);
    setShowNormal(false);
    SetGenerate(false);
    SetMazeType('square');
    setShowGrid(false);
  };

  const handleShowMazes = () => {
    setShowNormal(true);
    setShowFillSquare(false);
  };

  const handleShowFillSquare = () => {
    setShowFillSquare(true);
    setShowNormal(false);
  };

  const handleResetVisited = () => {
    setResetVisited(prev => !prev);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {showNormal ? (
        <View style={styles.normalContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToMenu}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          {(mazeType === 'square' || mazeType === 'nonPerfect') && (
            <View style={styles.buttonContainer}>
              <Text>Height:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={height}
                onChangeText={text => SetHeight(text)}
              />
              <Text>Width:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={width}
                onChangeText={text => SetWidth(text)}
              />
            </View>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, selectedExitButton === 0 && styles.selectedButton]}
              onPress={() => HandleExitButtonPress(0)}
            >
              <Text style={styles.buttonText}>No Exit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedExitButton === 1 && styles.selectedButton]}
              onPress={() => HandleExitButtonPress(1)}
            >
              <Text style={styles.buttonText}>1 Exit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedExitButton === 2 && styles.selectedButton]}
              onPress={() => HandleExitButtonPress(2)}
            >
              <Text style={styles.buttonText}>2 Exits</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <Text>Background Color:</Text>
            <TextInput
              style={styles.input}
              value={color}
              onChangeText={text => SetColor(text)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, mazeType === 'square' && styles.selectedButton]}
              onPress={() => SetMazeType('square')}
            >
              <Text style={styles.buttonText}>Square Maze</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, mazeType === 'nonPerfect' && styles.selectedButton]}
              onPress={() => SetMazeType('nonPerfect')}
            >
              <Text style={styles.buttonText}>Non-Perfect Maze</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.switchContainer}>
            <Text>Show Creation Process:  </Text>
            <Switch
              value={showCreationProcess}
              onValueChange={SetShowCreationProcess}
            />
          </View>
          <TouchableOpacity style={styles.generateButton} onPress={HandleGenerate}>
            <Text style={styles.generateButtonText}>Generate</Text>
          </TouchableOpacity>
          {generate && (
            <View style={styles.mazeContainer}>
              {mazeType === 'square' ? (
                <MazeGenerator height={mazeParams.height} width={mazeParams.width} exits={mazeParams.exits} color={mazeParams.color} showCreationProcess={showCreationProcess}/>
              ) : (
                <MazeGenerator height={mazeParams.height} width={mazeParams.width} exits={mazeParams.exits} color={mazeParams.color} showCreationProcess={showCreationProcess} extraWallProbability={0.2} />
              )}
            </View>
          )}
        </View>
      ) : showFillSquare ? (
        <View style={styles.fillSquareContainer}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackToMenu}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <Text>Height:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={fillHeight}
              onChangeText={text => setfillHeight(text)}
            />
            <Text>Width:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={fillWidth}
              onChangeText={text => setfillWidth(text)}
            />
          </View>
          <TouchableOpacity style={styles.generateButton} onPress={HandleGenerate}>
            <Text style={styles.generateButtonText}>Generate Grid</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetVisited}>
            <Text style={styles.resetButtonText}>Reset Visited Cells</Text>
          </TouchableOpacity>
          {showGrid && (
            <View style={styles.gridContainer}>
              <FillSquare fillHeight={parseInt(fillHeight)} fillWidth={parseInt(fillWidth)} regenerate={regenerate} resetVisited={resetVisited} />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleShowMazes}>
            <Text style={styles.buttonText}>Mazes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleShowFillSquare}>
            <Text style={styles.buttonText}>Fill Square</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  input: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    width: 100,
    marginEnd: 10,
    paddingHorizontal: 10,
    marginLeft: 5,
  },
  button: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: 'blue',
  },
  buttonText: {
    color: 'white',
  },
  generateButton: {
    padding: 10,
    backgroundColor: 'green',
    borderRadius: 5,
  },
  generateButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  resetButton: {
    padding: 10,
    backgroundColor: 'orange',
    borderRadius: 5,
    margin: 10,
  },
  resetButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  mazeContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fillSquareContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  normalContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 10,
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <NumericInputExample />
    </View>
  );
}