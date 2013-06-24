/* jshint devel:true */
/* globals define */

// # Tetris.Grid

define(['tetris/utils'],
function( Utils ) {

  function Grid ( cols, rows ) {
    // If enabled, `print()` will be called each time the collision data
    // changes.
    this.debug = false;
    this.clear(cols, rows);
  }

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
    var x, y;

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
    cols = cols || this.cols;
    rows = rows || this.rows;

    this.cols = cols;
    this.rows = rows;

    this.grid = Utils.create2dArray(cols, rows);
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

  return Grid;
});