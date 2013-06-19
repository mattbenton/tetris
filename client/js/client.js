/* jshint devel:true, unused:false */
/* globals Kinetic, Tetris */
/* @codekit-prepend 'blocks.js' */

var grid = new Tetris.Grid(10, 10);
grid.debug = true;

var s = Tetris.Block.shapeData.S[0];
var j = Tetris.Block.shapeData.J[0];
var t = Tetris.Block.shapeData.T[3];

// grid.writeShapeData(t, 0, 0, 4);

// grid.writeShapeData(s, 0, 2, 1);


var b = Tetris.Block.createRandom();
// console.log(b);
// grid.writeBlock(b, 1);

var s = new Tetris.Shape();
s.setType('T');
s.print();
s.rotate();

setInterval(function() {
  s.print();
  s.rotate();
}, 1000);

// setInterval(function() {
//   grid.writeBlock(b, 0);
//   // b.y++;
//   b.rotate();
//   grid.writeBlock(b, 1);
// }, 500);

// console.log(grid.hitTestShapeData(t, 0, 0));

// grid.writeShapeData(j, 2, 1, 2);