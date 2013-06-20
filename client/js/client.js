/* jshint devel:true, unused:false */
/* globals Kinetic, Tetris */
/* @codekit-prepend 'blocks.js' */

// grid.writeBlock(b, 1);

$(function() {

  var grid = new Tetris.Grid(10, 10);
  grid.debug = true;

  var i = 10;

  while ( i-- ) {
    var b = new Tetris.Block();
    b.randomize();

    b.x = Math.floor(Math.random() * 5);
    b.y = Math.floor(Math.random() * 5);

    grid.blocks.push(b);
  }

  grid.render();

});