/* jshint devel:true, unused:false */

(function(){

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Define the global `Tetris` module.
  var Tetris = root.Tetris = {};

  // # Tetris.Grid
  //
  //
  var Grid = Tetris.Grid = function ( cols, rows ) {
    // If enabled, `print()` will be called each time the collision data
    // changes.
    this.debug = false;

    this.clear(cols, rows);
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
    if ( console.clear ) {
      console.clear();
    } else {
      console.log('-------------------------------');
    }

    for ( var i = 0; i < this.grid.length; i++ ) {
      console.log(this.grid[i].join(' '));
    }
  };

  Grid.prototype.hitTestBlock = function ( block, offsetX, offsetY ) {
    return this.hitTestShapeData(block.shapeData, block.x + (offsetY || 0), block.y + (offsetY || 0));
  };

  Grid.prototype.hitTestShapeData = function ( shapeData, gridX, gridY ) {
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
    this.writeShapeData(block.shapeData, block.x, block.y, fill);
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

    this.shapeType = null;
    this.shapeIndex = 0;
  };

  Block.createRandom = function () {
    var block = new Block();
    block.setShape();
    return block;
  };

  // Rotates the block 90 degrees clockwise.
  Block.prototype.rotate = function () {
    if ( this.shapeIndex < this.shapeCount - 1 ) {
      this.shapeIndex++;
    } else {
      this.shapeIndex = 0;
    }
    this.setShape(this.shapeType, this.shapeIndex);
  };

  Block.prototype.setShape = function ( type, index ) {
    if ( type === undefined ) {
      type = Block.shapeTypes[Math.floor(Math.random() * Block.shapeTypes.length)];
    }

    this.shapeType  = type;
    this.shapeCount = Block.shapeData[type].length;

    if ( index === undefined ) {
      index = Math.floor(Math.random() * this.shapeCount);
    }

    this.shapeIndex = index;
    this.shapeData = Block.shapeData[type][index];
  };

  // ## Shape Data

  // The shape of each block and its various rotated forms (listed in
  // clockwise direction) are defined using simple two-dimensional arrays.
  // This data is used to draw each shape and for collision detection on
  // the grid and against other shapes.

  // For example, the initial rotation of the "S" shaped block is defined as
  // having two rows as seen in the image below. `1`'s are used to represent
  // the solid areas of the shape.

  //      Block.shapeData.S = [
  //        [[0, 1, 1], [1, 1, 0]],
  //        ...
  //      ];

  // <div style="text-align: center;">
  //   <img src="http://1.bp.blogspot.com/_zWFdJl7vhzA/TErn3NFwRrI/AAAAAAAABsA/4aGia3qvC9k/s1600/tetrominoes.png" width="350" />
  // </div>

  Block.shapeTypes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  Block.shapeData = {};

  Block.shapeData.I = [
    [[1, 1, 1, 1]],
    [[1], [1], [1], [1]]
  ];

  Block.shapeData.J = [
    [[1, 1, 1], [0, 0, 1]],
    [[0, 1], [0, 1], [1, 1]],
    [[1, 0, 0], [1, 1, 1]],
    [[1, 1], [1, 0], [1, 0]]
  ];

  Block.shapeData.L = [
    [[1, 1, 1], [1, 0, 0]],
    [[1, 1], [0, 1], [0, 1]],
    [[0, 0, 1], [1, 1, 1]],
    [[1, 0], [1, 0], [1, 1]]
  ];

  Block.shapeData.O = [
    [[1, 1], [1, 1]]
  ];

  Block.shapeData.S = [
    [[0, 1, 1], [1, 1, 0]],
    [[1, 0], [1, 1], [0, 1]]
  ];

  Block.shapeData.T = [
    [[1, 1, 1], [0, 1, 0]],
    [[0, 1], [1, 1], [0, 1]],
    [[0, 1, 0], [1, 1, 1]],
    [[1, 0], [1, 1], [1, 0]]
  ];

  Block.shapeData.Z = [
    [[1, 1, 0], [0, 1, 1]],
    [[0, 1], [1, 1], [1, 0]]
  ];

  var Shape = Tetris.Shape = function () {
    this.data = [];
  };

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

  Shape.prototype.setType = function ( type ) {
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

  Shape.prototype.fill = function ( points, value ) {
    for ( var i = 0; i < points.length; i++ ) {
      this.data[points[i][1]][points[i][0]] = value;
    }
  };

  Shape.prototype.resize = function ( size ) {
    this.data = Shape.createMatrix(size);
    this.size = size;
  };

  Shape.prototype.rotate = function () {
    var data    = this.data;
    var size    = this.size;
    var rotated = Shape.createMatrix(size);

    for ( var i = 0; i < size; i++ ) {
      for ( var j = 0; j < size; j++ ) {
        rotated[i][j] = data[size - j - 1][i];
      }
    }

    this.data = rotated;
  };

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