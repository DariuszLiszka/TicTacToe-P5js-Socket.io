var sketch = function(p) {
  let socket;
  let rectWidth;
  let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let posX;
  let posY;

  let turn = -1;
  p.setup = function() {
    socket = io.connect('http://localhost:3000/');
    socket.on('clickEvent', newBoard);
    let cnv = p.createCanvas(600, 600);
    cnv.mousePressed(drawSign);
    p.background(50);
    rectWidth = p.width / 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        p.rect(i * rectWidth, j * rectWidth, 200, 200);
      }
    }
  };
  function newBoard(data) {
    let changedBoard = data.board;
    let turn = data.turn;
    turn *= -1;
    console.log(turn);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (changedBoard[i][j] == 1) {
          p.ellipse(j * rectWidth + 100, i * rectWidth + 100, 200, 200);
        }
        if (changedBoard[i][j] == -1) {
          p.line(
            j * rectWidth + 200,
            i * rectWidth + 200,
            j * rectWidth,
            i * rectWidth
          );
          p.line(
            j * rectWidth + 200,
            i * rectWidth,
            j * rectWidth,
            i * rectWidth + 200
          );
        }
      }
    }
  }
  function drawSign() {
    posX = p.int(p.mouseX / rectWidth);
    posY = p.int(p.mouseY / rectWidth);
    if (board[posY][posX] == 0) {
      turn *= -1;
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
      data = {
        board: board,
        turn: turn
      };
      socket.emit('clickEvent', data);
    }
    if (checkWinner(board) == 'o') {
      console.log('the winner is o');
    }
    if (checkWinner(board) == 'x') {
      console.log('the winner is x');
    }
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
