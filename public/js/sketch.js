
// do not use vars
var sketch = function(p) {
  let socket;
  let rectWidth;

  let posX;
  let posY;
  let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let turn = 0;

  // enum for players
  // OPPONENT_1: 0
  // OPPONENT_2: 1
  let player = 0;

  
  p.setup = function() {
    // use from environment variable || config
    socket = io.connect('http://localhost:3000/');


    // use const if no reassign 
    // do not use magic numbers (600, 600)
    let cnv = p.createCanvas(600, 600);
    cnv.mousePressed(drawSign);

    socket.on('clickEvent', drawBoard);
    socket.on('newConnectedUser', connectionFunct);

    p.background(50);
  
    rectWidth = p.width / 3;
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        p.rect(i * rectWidth, j * rectWidth, 200, 200);
      }
    }
  };

  // nie hardkodowac ani stringow ani liczb

  function connectionFunct(data) {
    return (player = data);
  }

  function drawBoard(data) {
    posX = data.posX;
    posY = data.posY;
    turn = data.turn;

    if (board[posY][posX] == 0) {
      board[posY][posX] = turn;

      if (turn == 1) {
        p.ellipse(posX * rectWidth + 100, posY * rectWidth + 100, 200, 200);
      }
      if (turn == -1) {

        p.line(
          posX * rectWidth + 200,
          posY * rectWidth + 200,
          posX * rectWidth,
          posY * rectWidth
        );
        p.line(
          posX * rectWidth + 200,
          posY * rectWidth,
          posX * rectWidth,
          posY * rectWidth + 200
        );
      }
    }
    if (checkWinner(board) == 'o') {
      console.log('the winner is o');
    }
    if (checkWinner(board) == 'x') {
      console.log('the winner is x');
    }
  }
  function drawSign() {
    posX = p.int(p.mouseX / rectWidth);
    posY = p.int(p.mouseY / rectWidth);
    turn = player;

    boardSum = board
      .reduce(function(a, b) {
        return a.concat(b);
      })
      .reduce(function(a, b) {
        return a + b;
      });

    if (boardSum == 0 && turn == 1) {
      if (board[posY][posX] == 0) {
        board[posY][posX] = turn;

        if (turn == 1) {
          p.ellipse(posX * rectWidth + 100, posY * rectWidth + 100, 200, 200);
        }
        if (turn == -1) {
          p.line(
            posX * rectWidth + 200,
            posY * rectWidth + 200,
            posX * rectWidth,
            posY * rectWidth
          );
          p.line(
            posX * rectWidth + 200,
            posY * rectWidth,
            posX * rectWidth,
            posY * rectWidth + 200
          );
        }
      }

      sendData(posX, posY, turn);
      return (clicked = true);
    }
    if (boardSum == 1 && turn == -1) {
      if (board[posY][posX] == 0) {
        board[posY][posX] = turn;

        if (turn == 1) {
          p.ellipse(posX * rectWidth + 100, posY * rectWidth + 100, 200, 200);
        }
        if (turn == -1) {
          p.line(
            posX * rectWidth + 200,
            posY * rectWidth + 200,
            posX * rectWidth,
            posY * rectWidth
          );
          p.line(
            posX * rectWidth + 200,
            posY * rectWidth,
            posX * rectWidth,
            posY * rectWidth + 200
          );
        }
      }

      sendData(posX, posY, turn);
      return (clicked = true);
    }

    if (checkWinner(board) == 'o') {
      console.log('the winner is o');
    }
    if (checkWinner(board) == 'x') {
      console.log('the winner is x');
    }
  }
  function sendData() {
    data = {
      posX: posX,
      posY: posY,
      turn: turn
    };
    socket.emit('clickEvent', data);
  }
  function checkWinner(board) {
    let winner;
    //check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i].reduce((a, b) => {
          return a + b;
        }) == 3
      ) {
        return (winner = 'o');
      }
      if (
        board[i].reduce((a, b) => {
          return a + b;
        }) == -3
      ) {
        return (winner = 'x');
      }
    }
    //check cols
    let sumFirstCol = 0;
    let sumSecondCol = 0;
    let sumThirdCol = 0;
    for (let j = 0; j < 3; j++) {
      sumFirstCol += board[j][0];
      sumSecondCol += board[j][1];
      sumThirdCol += board[j][2];
      if (sumFirstCol == 3) return (winner = 'o');
      if (sumFirstCol == -3) return (winner = 'x');

      if (sumSecondCol == 3) return (winner = 'o');
      if (sumSecondCol == -3) return (winner = 'x');

      if (sumThirdCol == 3) return (winner = 'o');
      if (sumThirdCol == -3) return (winner = 'x');
    }
    //check diag
    sumFirstDiag = 0;
    for (let k = 0; k < 3; k++) {
      sumFirstDiag += board[k][k];
      if (sumFirstDiag == 3) return (winner = 'o');
      if (sumFirstDiag == -3) return (winner = 'x');
    }

    sumSecondDiag = 0;
    sumSecondDiag = board[0][2] + board[1][1] + board[2][0];
    if (sumSecondDiag == 3) return (winner = 'o');
    if (sumSecondDiag == -3) return (winner = 'x');
    return winner;
  }
  p.draw = function() {};
};

var myp5 = new p5(sketch);
