const CreateGrid = (cols, rows) => {
  const grid = [];
  for (let y = 0; y < rows; y++) {
    const row = [];
    for (let x = 0; x < cols; x++) {
      row.push({
        x, y,
        walls: [true, true, true, true],
        visited: false,
      });
    }
    grid.push(row);
  }
  return grid;
};

export default CreateGrid;