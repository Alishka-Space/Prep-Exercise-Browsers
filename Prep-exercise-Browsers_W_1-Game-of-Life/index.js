'use strict';
/*------------------------------------------------------------------------------
Full description at: https://github.com/HackYourFuture/Assignments/tree/main/2-Browsers/Week1#exercise-6-conways-game-of-life

THIS IS A PREP EXERCISE FOR THE Q&A SESSION, IT SHOULD NOT BE PART OF THE ASSIGNMENT

Adapted from: https://spicyyoghurt.com/tutorials/javascript/conways-game-of-life-canvas
Refactored from ES6 Class syntax to regular functions
------------------------------------------------------------------------------*/


// Exercise
// In the supplied JavaScript code the color of all living cells is a single shade of blue. This is in contrast to the illustration above where living cells have different shades of blue, depending on their life time. Your job is as follows:

// In function createCell(), add a numeric lifeTime property to the object and assign it the value of one if the cell is initially alive or zero if it is initially dead.

// In function drawCell(), replace rgb() with rgba() that adds a fourth parameter indicating opacity to the rgb value like this:

// context.fillStyle = `rgba(24, 215, 236, ${opacity})`;
// The opacity of each rendered cell should depend on the cell's lifeTime property, as specified in this table:

// lifeTime	opacity
// 1	0.25
// 2	0.5
// 3	0.75
// 4+	1
// In function updateGrid() add code to update the lifeTime value of each cell:

// A living cell that remains living should have its lifeTime incremented by one.
// A living cell that dies should have its lifeTime reset to zero.
// A dead cell that is brought to life should have its lifeTime reset to one.

// ------------------------------------------------------------------------------*/
const CELL_SIZE = 10;
const NUM_COLUMNS = 75;
const NUM_ROWS = 40;

// Create a cell with the given coordinates and randomly assign its begin state:
// life or death
function createCell(x, y) {
  const alive = Math.random() > 0.5;
  const lifeTime = alive ? 1 : 0 ;  //Add 1 is alive or 0 is dead.
  return {
    x,
    y,
    alive,
    lifeTime,       //Add life time 
  };
}

// Create the game "engine" with a closure
function createGame(context, numRows, numColumns) {
  const grid = [];

  // Create the grid as a two-dimensional array (i.e. an array of arrays)
  function createGrid() {
    for (let y = 0; y < numRows; y++) {
      const row = [];
      for (let x = 0; x < numColumns; x++) {
        const cell = createCell(x, y);
        row.push(cell);
      }
      grid.push(row);
    }
  }

  // Execute a callback for each cell in the grid
  function forEachCell(callback) {
    grid.forEach((row) => {
      row.forEach((cell) => callback(cell));
    });
  }

  // Draw a cell onto the canvas
  function drawCell(cell) {
    // Draw cell background
    context.fillStyle = '#303030';
    context.fillRect(
      cell.x * CELL_SIZE,
      cell.y * CELL_SIZE,
      CELL_SIZE,
      CELL_SIZE
    );

    if (cell.alive) {
      // opacity based on lifeTime
      const opacity = 
        cell.lifeTime <= 1 ? 0.25 
      : cell.lifeTime <= 2 ? 0.5 
      : cell.lifeTime <= 3 ? 0.75 : 1;

      // Draw living cell inside background
      context.fillStyle = `rgb(24, 215, 236)`;
      context.fillRect(
        cell.x * CELL_SIZE + 1,
        cell.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    }
  }

  // Check the state of the cell at the given coordinates
  function isAlive(x, y) {
    // Out-of-border cells are presumed dead
    if (x < 0 || x >= numColumns || y < 0 || y >= numRows) {
      return 0;
    }

    return grid[y][x].alive ? 1 : 0;
  }

  // Count the number of living neighboring cells for a given cell
  function countLivingNeighbors(cell) {
    const { x, y } = cell;
    return (
      isAlive(x - 1, y - 1) +
      isAlive(x, y - 1) +
      isAlive(x + 1, y - 1) +
      isAlive(x - 1, y) +
      isAlive(x + 1, y) +
      isAlive(x - 1, y + 1) +
      isAlive(x, y + 1) +
      isAlive(x + 1, y + 1)
    );
  }

  // Update the state of the cells in the grid by applying the Game Of Life
  // rules on each cell.
  function updateGrid() {
    // Loop over all cells to determine their next state.
    forEachCell((cell) => {
      // Count number of living neighboring cells
      const numAlive = countLivingNeighbors(cell);

      if (numAlive === 2) {
        // Living cell remains living, dead cell remains dead
        cell.nextAlive = cell.alive;
      } else if (numAlive === 3) {
        // Dead cell becomes living, living cell remains living
        cell.nextAlive = true;
      } else {
        // Living cell dies, dead cell remains dead
        cell.nextAlive = false;
      }
    });

    // Apply the newly computed state to the cells
    forEachCell((cell) => {
      if (cell.alive && cell.nextAlive){
        cell.lifeTime += 1;  // Living cell remains living, increment lifeTime
      }else if (cell.alive && cell.nextAlive){
        cell.lifeTime = 1  // Dead cell becomes living, reset lifeTime to 1
      }else if(cell.alive && cell.nextAlive){
        cell.lifeTime = 0 // Living cell dies, reset lifeTime to 0
      }
      cell.alive = cell.nextAlive;
    });
  }

  // Render a visual representation of the grid
  function renderGrid() {
    // Draw all cells in the grid
    forEachCell(drawCell);
  }

  // Execute one game cycle
  function gameLoop() {
    // Update the state of cells in the grid
    updateGrid();

    // Render the updated grid
    renderGrid();

    // Schedule the next generation
    setTimeout(() => {
      window.requestAnimationFrame(gameLoop);
    }, 200);
  }

  // Starts the game
  function start() {
    // Create initial grid
    createGrid();

    // Render the initial generation
    renderGrid();

    // Kick-start the gameLoop
    window.requestAnimationFrame(gameLoop);
  }

  return { grid, updateGrid, start };
}

function main() {
  // Resize the canvas to accommodate the desired number of cell rows and
  // columns
  const canvas = document.getElementById('canvas');
  canvas.height = NUM_ROWS * CELL_SIZE;
  canvas.width = NUM_COLUMNS * CELL_SIZE;

  // Obtain a context that is needed to draw on the canvas
  const context = canvas.getContext('2d');

  // Create the game "engine"
  const { start } = createGame(context, NUM_ROWS, NUM_COLUMNS);

  // Start the game
  start();
}

// ! Do not change or remove any code below
try {
  window.addEventListener('load', main);
} catch {
  // ignore if running in node with jest
}

module.exports = createGame;
