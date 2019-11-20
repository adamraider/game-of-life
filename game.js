const boardElement = document.getElementById('board');
const ROWS = 54;
const COLS = 96;

const DEAD_VAL = 0;
const LIVE_VAL = 1;

const TIME_IN_BETWEEN_GENERATIONS_IN_MS = 26;
const NUM_OF_GENERATIONS = 1000;
const NUM_OF_RANDOM_CELLS = 800;

function render(board) {
  boardElement.innerHTML = board
    .map(row => {
      let htmlRow = ['<div>'];
      htmlRow = htmlRow.concat(
        row.map(cell => {
          return `<div class="cell${
            cell === LIVE_VAL ? ' cell--alive' : ''
          }"></div>`;
        })
      );
      htmlRow.push('</div>');
      return htmlRow.join('');
    })
    .join('');
}

playGame(makeRandomBoard(), NUM_OF_GENERATIONS, render);

async function playGame(initialState, generations, callback) {
  let gen = 0;
  let board = initialState;

  while (gen < generations) {
    await wait();

    board = makeNextGeneration(board);
    if (callback) {
      callback(board);
    }
    gen++;
  }
}

function makeRandomBoard() {
  const board = makeEmptyBoard(ROWS, COLS);

  let i = 0;

  while (i < NUM_OF_RANDOM_CELLS) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    console.log(row, col);
    board[row][col] = LIVE_VAL;
    i++;
  }

  return board;
}

function makeEmptyBoard(rows, cols, defaultValue = DEAD_VAL) {
  return [...Array(rows)].map(_ => Array(cols).fill(defaultValue));
}

function makeNextGeneration(board) {
  const nextBoard = makeEmptyBoard(board.length, board[0].length);

  for (let row = 0; row < nextBoard.length; row++) {
    for (let col = 0; col < nextBoard[0].length; col++) {
      let neighbors = 0;

      for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
          if (x === 0 && y === 0) continue;

          /* prettier-ignore */
          const isValidSquare =
              row + x >= 0 &&
              col + y >= 0 &&
              row + x < ROWS &&
              col + y < COLS;

          if (!isValidSquare) continue;

          if (board[row + x][col + y] === LIVE_VAL) {
            neighbors++;
          }
        }
      }

      nextBoard[row][col] = nextValue(board[row][col], neighbors);
    }
  }

  return nextBoard;
}

function nextValue(currentValue, neighbors) {
  // underpopulation
  if (neighbors < 2) {
    return DEAD_VAL;
  }

  // overpopulation
  if (neighbors > 3) {
    return DEAD_VAL;
  }

  if (neighbors === 3) {
    return LIVE_VAL;
  }

  if (currentValue === LIVE_VAL && neighbors === 2) {
    return LIVE_VAL;
  }

  return DEAD_VAL;
}

function wait() {
  return new Promise(resolve => {
    setTimeout(() => resolve(), TIME_IN_BETWEEN_GENERATIONS_IN_MS);
  });
}
