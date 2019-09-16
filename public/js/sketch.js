var sketch = function(p) {
  let socket;
  let rectWidth;
  let board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  let posX;
  let posY;

  let turn = -1;
  p.setup = function() {
    socket = io.connect('http://localhost:3000/');
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
  function drawSign() {
    turn *= -1;
    posX = p.int(p.mouseX / rectWidth);
    posY = p.int(p.mouseY / rectWidth);
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
    checkWinner(board);
  }
  function checkWinner(board) {
    //check rows
    for (let i = 0; i < 3; i++) {
      if (
        board[i].reduce((a, b) => {
          return a + b;
        }) == 3
      ) {
        console.log('o is winner');
      }
      if (
        board[i].reduce((a, b) => {
          return a + b;
        }) == -3
      ) {
        console.log('x is winner');
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
      if (sumFirstCol == 3) console.log('winner is o');
      if (sumFirstCol == -3) console.log('winner is x');

      if (sumSecondCol == 3) console.log('winner is o');
      if (sumSecondCol == -3) console.log('winner is x');

      if (sumThirdCol == 3) console.log('winner is o');
      if (sumThirdCol == -3) console.log('winner is x');
    }
    //check diag
    sumFirstDiag = 0;
    for (let k = 0; k < 3; k++) {
      sumFirstDiag += board[k][k];
      if (sumFirstDiag == 3) console.log('winner is o');
      if (sumFirstDiag == -3) console.log('winner is x');
    }

    sumSecondDiag = 0;
    sumSecondDiag = board[0][2] + board[1][1] + board[2][0];
    if (sumSecondDiag == 3) console.log('winner is o');
    if (sumSecondDiag == -3) console.log('winner is x');
  }
  p.draw = function() {};
};
var myp5 = new p5(sketch);
