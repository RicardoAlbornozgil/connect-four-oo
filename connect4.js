class Player {
  constructor(color) {
    this.color = color;
  }
}

class Game {
  constructor(height, width) {
    this.height = height;
    this.width = width;
    this.board = []; // array of rows, each row is array of cells  (this.board[y][x])
    this.currPlayer = 1; // active player: 1 or 2
    this.gameOver = false;

    this.makeBoard();
    this.makeHtmlBoard();
    this.addEventListeners();
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    top.addEventListener('click', this.handleGameClick.bind(this));

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make the main part of the board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }

      board.append(row);
    }
  }

  addEventListeners() {
    const startButton = document.getElementById('startButton');
    startButton.addEventListener('click', this.startGame.bind(this));

    const colorForm = document.getElementById('colorForm');
    colorForm.addEventListener('submit', this.setPlayerColors.bind(this));

    const exitButton = document.getElementById('exitButton');
    exitButton.addEventListener('click', this.exitGame.bind(this));

  }

  startGame() {
    this.gameOver = false;
    this.currPlayer = 1;
    this.clearBoard();
  }

  exitGame() {
    const boardElement = document.getElementById('board');
    boardElement.innerHTML = '';  // This removes all child elements

    this.gameOver = false;
    this.currPlayer = 1;
    // Set the game instance to null
    connect4Game = null;
  }

  clearBoard() {
    for (let row of this.board) {
      row.fill(null);
    }

    const pieces = document.querySelectorAll('.piece');
    pieces.forEach(piece => piece.remove());
  }

  setPlayerColors(event) {
    event.preventDefault();
    const player1Color = document.getElementById('player1Color').value;
    const player2Color = document.getElementById('player2Color').value;

    this.player1 = new Player(player1Color);
    this.player2 = new Player(player2Color);

    // Update player colors in the game
    document.documentElement.style.setProperty('--player1-color', player1Color);
    document.documentElement.style.setProperty('--player2-color', player2Color);
  }

  handleGameClick(evt) {
    if (!this.gameOver) {
      // get x from ID of clicked cell
      const x = +evt.target.id;

      // get the next spot in the column (if none, ignore click)
      const y = this.findSpotForCol(x);
      if (y === null) {
        return;
      }

      // place the piece in the board and add to the HTML table
      this.board[y][x] = this.currPlayer;
      this.placeInTable(y, x);

      // check for win
      if (this.checkForWin()) {
        this.gameOver = true;
        return this.endGame(`Player ${this.currPlayer} won!`);
      }

      // check for a tie
      if (this.board.every(row => row.every(cell => cell))) {
        this.gameOver = true;
        return this.endGame('Tie!');
      }

      // switch players
      this.currPlayer = this.currPlayer === 1 ? 2 : 1;
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.classList.add(`p${this.currPlayer}`);
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  endGame(msg) {
    alert(msg);
  }

 checkForWin() {
  const _win = (cells) => {
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < this.height &&
        x >= 0 &&
        x < this.width &&
        this.board[y][x] === this.currPlayer
    );
  };

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (
        (x + 3 < this.width && _win(horiz)) ||
        (y + 3 < this.height && _win(vert)) ||
        (x + 3 < this.width && y + 3 < this.height && _win(diagDR)) ||
        (x - 3 >= 0 && y + 3 < this.height && _win(diagDL))
      ) {
        return true;
      }
    }
  }
  return false;
  }
}  

let button = document.querySelector(`button`);
button.addEventListener(`click`, () => {
  const connect4Game = new Game(6, 7);
});