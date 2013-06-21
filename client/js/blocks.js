/* jshint devel:true, unused:false */
/* @codekit-prepend 'requestAnimationFrame.js' */

(function(){

  // Save a reference to the global object (`window` in the browser, `exports`
  // on the server).
  var root = this;

  // Define the global `Tetris` module.
  var Tetris = root.Tetris = {};

  var Game = Tetris.Game = function () {
    var input = this.input = new Input(this);

    var grid = this.grid = new Grid(10, 15);
    // grid.debug = true;

    var block = this.currentBlock = new Block();
    block.randomize();

    var renderer = this.renderer = new Renderer(grid);
    renderer.render();
    renderer.renderBlock(block);

    this.loop();
  };

  Game.prototype.loop = function () {
    var self  = this;
    var grid  = this.grid;
    var block = this.currentBlock;

    if ( block ) {
      if ( grid.hitTestBlock(block, block.x, block.y + 1) ) {
        grid.writeBlock(block, block.color.index);

        block = new Block();
        block.randomize();
        this.currentBlock = block;
      } else {
        block.y++;
      }
    }

    grid.checkCompletedRows();

    this.renderer.render();
    this.renderer.renderBlock(block);

    setTimeout(function() {
      self.loop();
    }, 500);
  };

  Game.prototype.update = function () {
    var input = this.input;
    var block = this.currentBlock;
    var grid  = this.grid;

    if ( input.isDown && block ) {
      var x = block.x;
      var y = block.y;

      switch ( input.key ) {
        case Input.LEFT:
          x--;
          break;
        case Input.UP:
          y--;
          // block.rotate(1);
          // if ( grid.hitTestBlock(block) ) {
          //   block.rotate(-1);
          // }
          break;
        case Input.RIGHT:
          x++;
          break;
        case Input.DOWN:
          y++;
          // block.rotate(-1);
          // if ( grid.hitTestBlock(block) ) {
          //   block.rotate(1);
          // }
          break;
        case Input.ROTATE:
          block.rotate(1);
          if ( grid.hitTestBlock(block) ) {
            block.rotate(-1);
          }
          break;
        case Input.STAMP:
          grid.writeBlock(block, block.color.index);

          this.currentBlock = block = new Block();
          block.randomize();
          grid.blocks.push(block);

          break;
      }

      if ( !grid.hitTestBlock(block, x, y) ) {
        block.x = x;

        if ( y > block.y ) {
          block.y = y;
        }
      }

      // grid.render();
      this.renderer.render();

      this.renderer.renderBlock(block);
    }
  };

  // # Input

  // Handles input from the player.

  var Input = Tetris.Input = function ( game ) {
    this.game = game;

    this.addListeners();
  };

  Input.LEFT   = 37;
  Input.UP     = 38;
  Input.RIGHT  = 39;
  Input.DOWN   = 40;
  Input.ROTATE = 32;
  Input.STAMP  = 70;

  Input.keys = [Input.LEFT, Input.UP, Input.RIGHT, Input.DOWN, Input.ROTATE, Input.STAMP];

  Input.prototype.addListeners = function () {
    var self = this;

    $(window).on('keydown keyup', function ( event ) {
      self.handleKeyboard(event);
    });

    // $(window).on('touchstart touchmove touchend', function (event) {
    //   self.handleTouch(event);
    // });
  };

  Input.prototype.removeListeners = function () {
    $(window).off('keydown keyup');
  };

  Input.prototype.handleTouch = function ( event ) {
    event.preventDefault();

    var game  = this.game;
    var block = game.currentBlock;

    if ( !block ) {
      return;
    }

    if ( event.type === 'touchend' ) {
    } else {
      var touch = event.originalEvent.touches[0];
      var x = touch.pageX;

      if ( event.type === 'touchstart' ) {
        this.startX = x;
        this.lastX = x;
      }

      var dx = Math.round((x - this.startX) / game.grid.size / 2);

      console.log(game.grid.hitTestBlockWithOffset(block, dx, 0));

      if ( !game.grid.hitTestBlockWithOffset(block, dx, 0) ) {
        block.x += dx;
        // block.y = y;
      }

      window.requestAnimationFrame(function() {
        game.grid.render();
      });

      // console.log(dx);

      // this.lastX = x;
    }
  };

  Input.prototype.handleKeyboard = function ( event ) {
    var key = event.keyCode;

    // console.log(key);

    // if ( key >= Input.LEFT && key <= Input.DOWN ) {
    if ( Input.keys.indexOf(key) !== -1 ) {
      if ( event.type === 'keydown' ) {
        event.preventDefault();

        this.key    = key;
        this.isDown = true;

        this.game.update();
      } else if ( event.type === 'keyup' ) {
        this.isDown = false;
      }
    }
  };

  // # Renderer

  // The base **Renderer** class.

  var Renderer = Tetris.Renderer = function ( grid ) {
    this.grid = grid;
    this.size = 25;
    this.context = $('#grid')[0].getContext('2d');
  };

  Renderer.prototype.render = function () {
    var ctx  = this.context;
    var size = this.size;
    var grid = this.grid;
    var cols = grid.cols;
    var rows = grid.rows;
    var x, y, bit, color;

    // Clear everything.
    ctx.clearRect(0, 0, cols * size, rows * size);

    // Render grid lines.
    ctx.save();
    for ( y = 0; y < rows + 1; y++ ) {
      for ( x = 0; x < cols + 1; x++ ) {
        ctx.moveTo(x * size, 0);
        ctx.lineTo(x * size, rows * size);

        ctx.moveTo(0, y * size);
        ctx.lineTo(cols * size, y * size);
      }
    }
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // Render grid bits.
    ctx.save();
    ctx.lineWidth = 2;
    for ( y = 0; y < rows; y++ ) {
      for ( x = 0; x < cols; x++ ) {
        bit = grid.grid[y][x];
        if ( bit ) {
          color = Color[bit];
          ctx.fillStyle   = color.fill;
          ctx.strokeStyle = color.stroke;
          ctx.beginPath();

          ctx.rect(x * size, y * size, size, size);

          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  };

  Renderer.prototype.renderBlock = function ( block ) {
    var ctx       = this.context;
    var size      = this.size;
    var shapeData = block.shape.data;
    var shapeSize = block.shape.size;
    var x, y, bit;

    ctx.save();
    ctx.fillStyle   = block.color.fill;
    ctx.strokeStyle = block.color.stroke;
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
    ctx.restore();
  };

  // # Color

  // Defines the colors each block can be and provides a convenience method to
  // get a random color.

  var Color = Tetris.Color = {
    1: { index: 1, fill: '#f14d43', stroke: '#7c1413' }, // Red
    2: { index: 2, fill: '#f79210', stroke: '#c04207' }, // orange
    3: { index: 3, fill: '#ffd101', stroke: '#d77e06' }, // Yellow
    4: { index: 4, fill: '#13cb15', stroke: '#067a0b' }, // Green
    5: { index: 5, fill: '#36abfb', stroke: '#2e72d5' }, // Blue
    6: { index: 6, fill: '#c390db', stroke: '#894ab5' },  // Purple
    7: { index: 7, fill: '#565656', stroke: '#2d2d2d' }  // Charcoal (debugging)
  };

  Color.RED    = 1;
  Color.ORANGE = 2;
  Color.YELLOW = 3;
  Color.GREEN  = 4;
  Color.BLUE   = 5;
  Color.PURPLE = 6;
  Color.DEBUG  = 7;

  // Color.names = { red: 1, orange: 2, yellow: 3, green: 4, blue: 5, purple: 6 };

  Color.random = function () {
    return Color[Math.floor(Math.random() * 6) + 1];
  };

  // # Tetris.Grid
  //
  //
  var Grid = Tetris.Grid = function ( cols, rows ) {
    // If enabled, `print()` will be called each time the collision data
    // changes.
    this.debug = false;
    this.clear(cols, rows);
  };

  // Checks the grid for any solid rows and deletes them.
  Grid.prototype.checkCompletedRows = function () {
    var grid = this.grid;
    var cols = this.cols;
    var rows = this.rows;
    var x, y, bit, isValid;

    for ( y = 0; y < rows; y++ ) {
      isValid = true;

      for ( x = 0; x < cols; x++ ) {
        bit = grid[y][x];
        if ( !bit ) {
          isValid = false;
          break;
        }
      }

      if ( isValid ) {
        // for ( x = 0; x < cols; x++ ) {
        //   grid[y][x] = Color.DEBUG;
        // }
        this.deleteRow(y);
        return;
      }
    }
  };

  // Deletes a row and shifts all bits above it downwards to fill the empty
  // space.
  Grid.prototype.deleteRow = function ( rowIndex ) {
    var grid = this.grid;
    var cols = this.cols;
    var rows = this.rows;
    var x, y, bit, isValid;

    for ( y = rowIndex; y > 0; y-- ) {
      for ( x = 0; x < cols; x++ ) {
        if ( y - 1 > 0 ) {
          grid[y][x] = grid[y-1][x];
        }
      }
    }
  };

  // Clears the grid and optionally resizes it.
  Grid.prototype.clear = function ( cols, rows ) {
    var x, y, row;

    cols = cols || this.cols;
    rows = rows || this.rows;

    this.cols = cols;
    this.rows = rows;

    this.grid = create2dArray(cols, rows);
  };

  // Prints a textual representation of the current state of the grid to the
  // console.
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

  Grid.prototype.hitTestBlock = function ( block, x, y ) {
    if ( x === undefined ) {
      x = block.x;
    }
    if ( y === undefined ) {
      y = block.y;
    }
    return this.hitTestShape(block.shape.data, x, y);
  };

  Grid.prototype.hitTestBlockWithOffset = function ( block, offsetX, offsetY ) {
    return this.hitTestShape(block.shape.data, block.x + (offsetX || 0), block.y + (offsetY || 0));
  };

  // Returns `true` if the shape data at the given input coordinates is
  // colliding with an edge of the grid or overlapping another shape that
  // has been *written* to the grid already.

  // This is achieved by looping through each bit that makes up the shape and
  // calculating its position in the grid. If a solid bit (non-zero bit value)
  // falls outside of the grid bounds or overlaps with a non-zero bit already
  // written to the grid on its coordinate, then the entire shape is
  // considered to be in collision.

  // *Sounds complicated, but it's pretty simple!* ☺

  Grid.prototype.hitTestShape = function ( shapeData, gridX, gridY ) {
    var i, j, x, y;

    for ( j = 0; j < shapeData.length; j++ ) {
      for ( i = 0; i < shapeData[j].length; i++ ) {
        x = i + gridX;
        y = j + gridY;

        if ( shapeData[j][i] ) {
          if ( x < 0 || x >= this.cols || y < 0 || y >= this.rows ) {
            return true;
          } else if ( this.grid[y][x] ) {
            return true;
          }
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
    this.color = Color.random();
  };

  Block.prototype.moveTo = function ( x, y ) {
    this.x = x;
    this.y = y;
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
    this.data = create2dArray(size, size);
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
        rotated = create2dArray(size, size);
        for ( i = 0; i < size; i++ ) {
          for ( j = 0; j < size; j++ ) {
            rotated[i][j] = data[size - j - 1][i];
          }
        }
        data = rotated;
      }

      while ( amount < 0 ) {
        amount++;
        rotated = create2dArray(size, size);
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

  // # Helper Methods

  // Creates a two-dimensional array of a specific width and height. If no
  // fill value is specified the array is filled with zeros. 
  var create2dArray = Tetris.create2dArray = function ( cols, rows, fillValue ) {
    var arr = [];
    var x, y, row;

    if ( fillValue === undefined ) {
      fillValue = 0;
    }

    for ( y = 0; y < rows; y++ ) {
      row = [];
      for ( x = 0; x < cols; x++ ) {
        row.push(fillValue);
      }
      arr.push(row);
    }

    return arr;
  };

}).call(this);