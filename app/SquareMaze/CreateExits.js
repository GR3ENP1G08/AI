import RandomInt from '../RandomInt';

const CreateExits = (grid, exits, setExitCells) => {
  const exitCells = [];

  if (exits > 0) {
    const side1 = RandomInt(0, 4);
    let exit1;
    switch (side1) {
      case 0:
        exit1 = grid[0][RandomInt(0, grid[0].length)];
        exit1.walls[0] = false;
        break;
      case 1:
        exit1 = grid[RandomInt(0, grid.length)][grid[0].length - 1];
        exit1.walls[1] = false;
        break;
      case 2:
        exit1 = grid[grid.length - 1][RandomInt(0, grid[0].length)];
        exit1.walls[2] = false;
        break;
      case 3:
        exit1 = grid[RandomInt(0, grid.length)][0];
        exit1.walls[3] = false;
        break;
    }
    exitCells.push(exit1);

    if (exits > 1) {
      let side2;
      switch (side1) {
        case 0: side2 = 2; break;
        case 1: side2 = 3; break;
        case 2: side2 = 0; break;
        case 3: side2 = 1; break;
      }

      let exit2;
      switch (side2) {
        case 0:
          exit2 = grid[0][RandomInt(0, grid[0].length)];
          exit2.walls[0] = false;
          break;
        case 1:
          exit2 = grid[RandomInt(0, grid.length)][grid[0].length - 1];
          exit2.walls[1] = false;
          break;
        case 2:
          exit2 = grid[grid.length - 1][RandomInt(0, grid[0].length)];
          exit2.walls[2] = false;
          break;
        case 3:
          exit2 = grid[RandomInt(0, grid.length)][0];
          exit2.walls[3] = false;
          break;
      }
      exitCells.push(exit2);
    }
  }

  setExitCells(exitCells);
};

export default CreateExits;