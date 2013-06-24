/* jshint devel:true */
/* globals define */

// **Blocks** are the game pieces that fall down the screen -- something
// else is awesome.

define(['tetris/shape', 'tetris/color'],
function( Shape, Color ) {

  function Block () {
    this.x = 0;
    this.y = 0;

    this.shape = new Shape('random');
    this.color = Color.random();
  }

  Block.prototype.moveTo = function ( x, y ) {
    this.x = x;
    this.y = y;
  };

  // ### rotate()
  // Rotates the block in 90 degree steps, clockwise for positive integers
  // and counterclockwise for negative integers. If called without arguments,
  // a random number of rotations are applied.
  Block.prototype.rotate = function ( amount ) {
    this.shape.rotate(amount);
  };

  Block.prototype.randomize = function () {
    this.shape.randomize();
  };

  return Block;
});