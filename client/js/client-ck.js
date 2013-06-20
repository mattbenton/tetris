/* jshint devel:true, unused:false */

(function(){

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Define the global `Tetris` module.
  var Tetris = root.Tetris = {};

  // # Renderer

  // The base **Renderer** class.

  var Renderer = Tetris.Renderer = function () {

  };

  // # Color

  // Defines the colors each block can be and provides a convenience method to
  // get a random color.

  var Color = Tetris.Color = {
    red:    { fill: '#f14d43', stroke: '#7c1413' },
    orange: { fill: '#f79210', stroke: '#c04207' },
    yellow: { fill: '#ffd101', stroke: '#d77e06' },
    green:  { fill: '#13cb15', stroke: '#067a0b' },
    blue:   { fill: '#36abfb', stroke: '#2e72d5' },
    purple: { fill: '#c390db', stroke: '#894ab5' }
  };

  Color.names = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];

  Color.random = function () {
    return Color[Color.names[Math.floor(Math.random() * 6)]];
  };

  // # Tetris.Grid
  //
  //
  var Grid = Tetris.Grid = function ( cols, rows ) {
    // If enabled, `print()` will be called each time the collision data
    // changes.
    this.debug = false;

    this.size = 25;

    this.blocks = [];

    this.$grid = $('#grid');
    this.context = this.$grid[0].getContext('2d');

    this.clear(cols, rows);
  };

  Grid.prototype.render = function () {
    var ctx  = this.context;
    var grid = this.grid;
    var cols = this.cols;
    var rows = this.rows;
    var size = this.size;
    var x, y, bit;

    var blocks = this.blocks;
    var blockCount = blocks.length;
    var i, block, color, shape, shapeSize, shapeData;

    ctx.clearRect(0, 0, cols * size, rows * size);

    for ( i = 0; i < blockCount; i++ ) {
      block = blocks[i];
      shape = block.shape;
      shapeData = shape.data;
      shapeSize = shape.size;

      color = Color.random();

      ctx.fillStyle   = color.fill;
      ctx.strokeStyle = color.stroke;
      ctx.lineWidth   = 2;
      ctx.beginPath();

      for ( y = 0; y < shapeSize; y++ ) {
        for ( x = 0; x < shapeSize; x++ ) {
          bit = shapeData[y][x];
          if ( bit ) {
            ctx.rect((x + block.x) * size, (y + block.y) * size, size, size);
          }
        }
      }

      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // for ( y = 0; y < rows; y++ ) {
    //   for ( x = 0; x < cols; x++ ) {
    //     bit = grid[y][x];
    //     if ( bit ) {
    //       ctx.fillStyle = color.fill;
    //       ctx.beginPath();
    //       ctx.rect(x * size, y * size, size, size);
    //       ctx.closePath();
    //       ctx.fill();
    //     }
    //   }
    // }
  };

  Grid.prototype.clear = function ( cols, rows ) {
    var x, y, row;

    this.cols = cols || this.cols;
    this.rows = rows || this.rows;
    this.grid = [];

    for ( y = 0; y < rows; y++ ) {
      row = [];
      for ( x = 0; x < cols; x++ ) {
        row.push(0);
      }
      this.grid.push(row);
    }
  };

  Grid.prototype.print = function () {
    if ( console.clear && 0 ) {
      console.clear();
    } else {
      console.log('-------------------------------');
    }

    for ( var i = 0; i < this.grid.length; i++ ) {
      console.log(this.grid[i].join(' '));
    }
  };

  Grid.prototype.hitTestBlock = function ( block, offsetX, offsetY ) {
    return this.hitTestShapeData(block.shape.data, block.x + (offsetY || 0), block.y + (offsetY || 0));
  };

  Grid.prototype.hitTestShape = function ( shapeData, gridX, gridY ) {
    var i, j, x, y;

    for ( j = 0; j < shapeData.length; j++ ) {
      for ( i = 0; i < shapeData[j].length; i++ ) {
        x = i + gridX;
        y = j + gridY;
        if ( shapeData[j][i] && x >= 0 && x < this.cols && y >= 0 && y < this.rows && this.grid[y][x] ) {
          return true;
        }
      }
    }

    return false;
  };

  Grid.prototype.writeBlock = function ( block, fill ) {
    this.writeShapeData(block.shape.data, block.x, block.y, fill);
  };

  Grid.prototype.writeShapeData = function ( shapeData, gridX, gridY, fill ) {
    var i, j, x, y;

    for ( j = 0; j < shapeData.length; j++ ) {
      for ( i = 0; i < shapeData[j].length; i++ ) {
        x = i + gridX;
        y = j + gridY;
        if ( shapeData[j][i] && x >= 0 && x < this.cols && y >= 0 && y < this.rows ) {
          this.grid[y][x] = fill;
        }
      }
    }

    if ( this.debug ) {
      this.print();
    }
  };

  // # Tetris.Block

  // **Blocks** are the game pieces that fall down the screen -- something
  // else is awesome.
  var Block = Tetris.Block = function () {
    this.x = 0;
    this.y = 0;

    this.shape = new Shape('random');
  };

  // Rotates the block in 90 degree steps, clockwise for positive integers
  // and counterclockwise for negative integers. If called without arguments,
  // a random number of rotations are applied.
  Block.prototype.rotate = function ( amount ) {
    this.shape.rotate(amount);
  };

  Block.prototype.randomize = function () {
    this.shape.randomize();
  };

  // # Tetris.Shape

  // **Shapes** are essentially square matrices that represent the solid
  // areas of a block by storing values higher than `zero`. These values are
  // used to denote the color of each area.

  // Shapes are defined by the minimum matrix size necessary to represent the
  // shape and an array of points that denote the solid areas.

  // <div style="text-align: center;">
  //   <img src="http://1.bp.blogspot.com/_zWFdJl7vhzA/TErn3NFwRrI/AAAAAAAABsA/4aGia3qvC9k/s1600/tetrominoes.png" width="350" />
  // </div>

  var Shape = Tetris.Shape = function ( type ) {
    this.setType(type);
  };

  // Creates a square matrix of a specific size.
  Shape.createMatrix = function ( size ) {
    var matrix = [];
    var x, y, row;

    for ( y = 0; y < size; y++ ) {
      row = [];
      for ( x = 0; x < size; x++ ) {
        row.push(0);
      }
      matrix.push(row);
    }

    return matrix;
  };

  Shape.types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  Shape.prototype.randomize = function () {
    this.setType();
    this.rotate();
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
    this.data = Shape.createMatrix(size);
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
        rotated = Shape.createMatrix(size);
        for ( i = 0; i < size; i++ ) {
          for ( j = 0; j < size; j++ ) {
            rotated[i][j] = data[size - j - 1][i];
          }
        }
        data = rotated;
      }

      while ( amount < 0 ) {
        amount++;
        rotated = Shape.createMatrix(size);
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

}).call(this);

/* **********************************************
     Begin client.js
********************************************** */

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