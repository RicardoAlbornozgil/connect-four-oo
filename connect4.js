class Player {
    constructor(color) {
        this.color = color;
    }
}

class Game {
    constructor(height, width, player1Color, player2Color) {
        this.height = height;
        this.width = width;
        this.board = []; // array of rows, each row is array of cells  (this.board[y][x])
        this.currPlayer = 1; // active player: 1 or 2
        this.gameOver = false; 

        // Initialize player colors
        
        console.log(`Player 1 color -> [${player1Color}] \n Player 2 color -> [${player2Color}]`);
        this.player1 = new Player(player1Color); 
        this.player2 = new Player(player2Color); 
        this.setPlayerColors(player1Color, player2Color);

        this.createExitButton();
        this.hideStartButton();
       
        this.makeBoard();      
        this.makeHtmlBoard();
        this.addEventListeners();
        console.log(`Game Initiated: height -> ${this.height} \n width -> ${this.width} \n board -> ${this.board} \n currPlayer -> ${this.currPlayer} \n gameOver -> ${this.gameOver} \n `);
    }

    makeBoard() {
        console.log(`Intitializing board...`);
        for (let y = 0; y < this.height; y++) {
            this.board.push(Array.from({ length: this.width }));
        }
    }

    makeHtmlBoard() {
        console.log(`Creating HTML board...`);
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
                cell.setAttribute('class', 'cell')
                row.append(cell);
            }

            board.append(row);
        }
    }

    addEventListeners() {
        console.log(`Adding event listeners...`);
        const startButton = document.getElementById('startButton');
        startButton.addEventListener('click', this.startGame.bind(this));
    }

    startGame() {
        this.gameOver = false;
        this.currPlayer = 1;
        this.clearBoard();
    }

    createExitButton() {
        console.log(`Creating exit button`)
        const exitButton = document.createElement('button');
        exitButton.innerHTML = 'Exit';
        exitButton.setAttribute('id', 'exitButton');
        exitButton.type = 'button';
        exitButton.style.display = 'block'

        const startButton = document.getElementById('startButton');
        startButton.parentNode.appendChild(exitButton); // Append the exit button after the start button

        // Add event listener to the exit button
        exitButton.addEventListener('click', this.exitGame.bind(this));
    }

   

    hideStartButton() {
        const startButton = document.getElementById('startButton');
        const colorSelect = document.getElementById('colorForm');
        if (startButton) {
            startButton.style.display = 'none';
            colorSelect.style.display = 'none';
        }
    }

    unhideStartButton() {
        const startButton = document.getElementById('startButton');
        const colorSelect = document.getElementById('colorForm');

        if (startButton) {
            startButton.style.display = 'block';
            colorSelect.style.display = 'block';
        }
    }

    deleteExitButton() {
        const exitButton = document.getElementById('exitButton');
        if (exitButton) {
            exitButton.remove();
        }
    }

    
    exitGame() {
        console.log("Exiting game...");
        const exitButton = document.getElementById('exitButton');
        const boardElement = document.getElementById('board');
    
        // Remove the event listener
        exitButton.removeEventListener('click', this.exitGame.bind(this)); 
    
        boardElement.innerHTML = '';  // Remove all child elements
        this.deleteExitButton();
        this.unhideStartButton();
    
        this.gameOver = false;
        this.currPlayer = 1;
    }
    

    clearBoard() {
        console.log(`Clearing board...`);
        for (let row of this.board) {
            row.fill(null);
        }

        const pieces = document.querySelectorAll('.piece');
        pieces.forEach(piece => piece.remove());
    }

    // setPlayerColors(event) {
    //     event.preventDefault();
    //     const playerId = event.target.id; // Get the ID of the player color select element
    //     const playerColor = event.target.value; // Get the selected color

    //     // Determine the player based on the ID of the select element
    //     const player = playerId === 'player1Color' ? this.player1 : this.player2;
    //     console.log

    //     // Update the player's color
    //     player.color = playerColor;
    //     console.log(`Set player ${playerId} color -> ${playerColor}`);
    //     // Update player colors in the game
    //     document.documentElement.style.setProperty(`--${playerId}-color`, playerColor);
    // }


    setPlayerColors(player1Color, player2Color) {
        console.log(`setPlayerColors()...`);

        this.player1.color = player1Color;
        this.player2.color = player2Color;
        // Update player colors in the HTML
        document.documentElement.style.setProperty('--player1Color', player1Color);
        document.documentElement.style.setProperty('--player2Color', player2Color);
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
            console.log(`Player ${this.currPlayer} placed a piece in position [Row|Column] -> [${y}|${x}]`);

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
            console.log(`Player ${this.currPlayer} turn.`);
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

        // Get the color of the current player
        const currentPlayerColor = this.currPlayer === 1 ? this.player1.color : this.player2.color;
        console.log(`Setting piece [Row|Column] -> [${y}|${x}] to Player ${this.currPlayer} Color ${currentPlayerColor}`);

        // Set the background color of the piece to the current player's color
        piece.style.backgroundColor = currentPlayerColor;

        const spot = document.getElementById(`${y}-${x}`);
        spot.append(piece);
    }

    endGame(msg) {
        setTimeout(() => {
            alert(msg);
        }, 500);
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

function getPlayerColors() {
    const player1Color = document.getElementById('player1Color').value;
    const player2Color = document.getElementById('player2Color').value;
    console.log(`Retrieving player colors p1 [${player1Color}] p2 [${player2Color}]`);
    return { player1Color, player2Color };
}

let button = document.querySelector(`button`);
console.log("Program begins....");
button.addEventListener(`click`, () => {
    const { player1Color, player2Color } = getPlayerColors();
    const connect4Game = new Game(6, 7, player1Color, player2Color); // Change variable name to connect4Game
});
