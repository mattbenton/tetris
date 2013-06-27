/* jshint devel:true */
/* globals define */

// **Shapes** are essentially square matrices that represent the solid
// areas of a block by storing values higher than `zero`. These values are
// used to denote the color of each area.

// Shapes are defined by the minimum matrix size necessary to represent the
// shape and an array of points that denote the solid areas.

// <div style="text-align: center;">
//   <img src="http://1.bp.blogspot.com/_zWFdJl7vhzA/TErn3NFwRrI/AAAAAAAABsA/4aGia3qvC9k/s1600/tetrominoes.png" width="350" />
// </div>

// Another good resource to check out <http://tetris.wikia.com/wiki/SRS>.

define(['tetris/utils'], function( Utils ){

  function Shape ( type ) {
    this.setType(type);
  }

  Shape.types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  Shape.prototype.randomize = function () {
    this.setType();
    // this.rotate();
  };

  Shape.prototype.setType = function ( type ) {
    if ( !type || type === 'random' ) {
      type = Shape.types[Math.floor(Math.random() * Shape.types.length)];
    }

    this.type = type;

    if ( type === 'O' ) {
      this.resize(2);
      this.fill([[0, 0], [0, 1], [1, 0], [1, 1]], 1);
    } else if ( type === 'I' ) {
      this.resize(4);
      this.fill([[1, 0], [1, 1], [1, 2], [1, 3]], 1);
    } else if ( type === 'S' ) {
      this.resize(3);
      this.fill([[0, 1], [0, 2], [1, 0], [1, 1]], 1);
    } else if ( type === 'Z' ) {
      this.resize(3);
      this.fill([[0, 0], [0, 1], [1, 1], [1, 2]], 1);
    } else if ( type === 'L' ) {
      this.resize(3);
      this.fill([[0, 0], [1, 0], [2, 0], [2, 1]], 1);
    } else if ( type === 'J' ) {
      this.resize(3);
      this.fill([[0, 2], [1, 2], [2, 1], [2, 2]], 1);
    } else if ( type === 'T' ) {
      this.resize(3);
      this.fill([[0, 0], [0, 1], [0, 2], [1, 1]], 1);
    }
  };

  // Fills all specified points in the matrix with a certain value. Values
  // greater than `zero` are considered solid.
  Shape.prototype.fill = function ( points, value ) {
    for ( var i = 0; i < points.length; i++ ) {
      this.data[points[i][1]][points[i][0]] = value;
    }
  };

  // Clears and resizes the matrix to a certain size.
  Shape.prototype.resize = function ( size ) {
    this.data = Utils.create2dArray(size, size);
    this.size = size;
  };

  // Rotates the matrix in 90 degree steps, clockwise for positive integers
  // and counterclockwise for negative integers. If called without arguments,
  // a random number of rotations are applied.
  Shape.prototype.rotate = function ( amount ) {
    if ( amount === undefined ) {
      amount = Math.floor(Math.random() * 4);
    } else if ( typeof amount !== 'number' ) {
      amount = 0;
    }

    if ( amount ) {
      var data    = this.data;
      var size    = this.size;
      var i, j, rotated;

      while ( amount > 0 ) {
        amount--;
        rotated = Utils.create2dArray(size, size);
        for ( i = 0; i < size; i++ ) {
          for ( j = 0; j < size; j++ ) {
            rotated[i][j] = data[size - j - 1][i];
          }
        }
        data = rotated;
      }

      while ( amount < 0 ) {
        amount++;
        rotated = Utils.create2dArray(size, size);
        for ( i = 0; i < size; i++ ) {
          for ( j = 0; j < size; j++ ) {
            rotated[size - j - 1][i] = data[i][j];
          }
        }
        data = rotated;
      }

      this.data = data;
    }
  };

  // For debugging, prints the matrix to the Developer console.
  Shape.prototype.print = function () {
    if ( console.clear ) {
      console.clear();
    } else {
      console.log('-------------------------------');
    }

    for ( var i = 0; i < this.data.length; i++ ) {
      console.log(this.data[i].join(' '));
    }
  };

  return Shape;
});