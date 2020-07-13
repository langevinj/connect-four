/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  //Creates a nessed array representing the board, where each cell is filled with null
  for(let i = 0; i < HEIGHT; i++){
      let temp = [];
      for (let z = 0; z < WIDTH; z++){
        temp.push(null);
      }
      board.push(temp);
  } 
}

/** makeHtmlBoard: make HTML table and row of column tops. */
function makeHtmlBoard() {
  // gets element with ID of board from HTML
  let htmlBoard = document.getElementById("board");

  //creates top, hoverable row element and cells, and gives them an ID
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

//sets coordinates for each cell
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);    
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  let temp = null;
  for(let i = 0; i < HEIGHT; i++){
      if((board[i][x] === null)){
        temp = i;
      }
  };
  if(temp !== null){
    return temp;
  } else {
    return null;
  }
};

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  //makes a div and places it into correct table cell
  let temp = document.getElementById(`${y}-${x}`);
  let newDiv = document.createElement("div");
  newDiv.classList.add('piece');
  currPlayer === 1 ? newDiv.classList.add('p1') : newDiv.classList.add('p2');
  temp.append(newDiv);
}

/** endGame: announce game end */

function endGame(msg) {
  // popup alert message
  alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell

  let x = +evt.target.id;
  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and adds to HTML table
  placeInTable(y, x);
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  let isFull = board.every(function (val) {
    return val === null;
  });

  if(isFull){
    endGame();
  }

  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;//switch players
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //creates arrays of the cells in the described arrangements, then checks if they all contain the same current player # with .every to check for a Win

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
