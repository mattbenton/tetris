/* jshint devel:true, unused:false */
/* globals Kinetic */


var Tetris = {};

(function() {

  Tetris.version = '0.0.1';

  Tetris.Game = function () {
    this.attachEvents();
    this.currentBlock = null;

    var $window = $(window);
    var width = $window.width();
    var height = $window.height();

    var stage = new Kinetic.Stage({
      container: 'container',
      width: width,
      height: height
    });

    var layer = new Kinetic.Layer();
    stage.add(layer);

    var block = new Tetris.BlockS(layer);

    this.currentBlock = block;

    var grid = new Tetris.Grid();
    this.grid = grid;
    // this.grid.stamp(block);
    // this.grid.print();

    setInterval(function() {
      grid.stamp(block, 0);
      block.y++;
      grid.stamp(block, 1);
      grid.print();
    }, 1000);
  };

  Tetris.Game.prototype.attachEvents = function () {
    var self = this;
    $(window).on('touchstart touchend touchmove', function ( event ) {
      self.onTouch(event);
    });
  };

  Tetris.Game.prototype.onTouch = function ( event ) {
    // console.log(event);

    if ( event.type === 'touchend' ) {
      if ( this.currentBlock ) {
        this.grid.stamp(this.currentBlock, 0);
        this.currentBlock.rotate();
        this.grid.stamp(this.currentBlock, 1);
        this.grid.print();
      }
    }
  };

  Tetris.Grid = function () {
    this.grid = [];
    this.cols = 0;
    this.rows = 0;

    this.reset(10, 10);
    this.print();
  };

  Tetris.Grid.prototype.stamp = function ( block, fill ) {
    var i, j, x, y;
    var shape = block.shapes[block.groupIndex];

    fill = fill || 0;

    for ( j = 0; j < shape.length; j++ ) {
      for ( i = 0; i < shape[j].length; i++ ) {
        x = block.x + i;
        y = block.y + j;

        if ( shape[j][i] && y < this.rows && x < this.cols ) {
          this.grid[y][x] = fill;
        }
      }
    }
  };

  Tetris.Grid.prototype.reset = function ( cols, rows ) {
    var i, j, row;

    this.grid = [];
    this.cols = cols;
    this.rows = rows;

    for ( j = 0; j < rows; j++ ) {
      row = [];
      for ( i = 0; i < cols; i++ ) {
        row.push(0);
      }
      this.grid.push(row);
    }
  };

  Tetris.Grid.prototype.print = function () {
    if ( console.clear ) {
      console.clear();
    } else {
      console.log('-------------------------------');
    }

    for ( var i = 0; i < this.grid.length; i++ ) {
      console.log(this.grid[i].join(' '));
    }
  };

  Tetris.Grid.size = 30;

  Tetris.Block = function ( layer ) {
    this.shapes = [];
    this.groups = [];
    this.groupIndex = 0;
    this.layer = layer;

    this.x = 0;
    this.y = 0;
  };

  Tetris.Block.prototype.destroy = function () {
    this.shapes = null;
    this.groups = null;
    this.layer = null;
  };

  Tetris.Block.prototype.rotate = function () {
    if ( this.groupIndex < this.groups.length - 1 ) {
      this.groupIndex++;
    } else {
      this.groupIndex = 0;
    }

    if ( this.currentGroup ) {
      this.currentGroup.remove();
      // this.layer.remove(this.currentGroup);
    }

    this.currentGroup = this.groups[this.groupIndex];
    this.layer.add(this.currentGroup);
    this.layer.draw();
  };

  Tetris.Block.prototype.build = function () {
    var size = Tetris.Grid.size;
    var i = this.shapes.length;
    var x, y;

    this.groups = [];

    while ( i-- ) {
      var shape = this.shapes[i];
      var group = new Kinetic.Group();

      for ( y = 0; y < shape.length; y++ ) {
        for ( x = 0; x < shape[y].length; x++ ) {
          if ( shape[y][x] ) {
            var rect = new Kinetic.Rect({
              x:          x * size,
              y:          y * size,
              width:      size,
              height:     size,
              fill:       'blue',
              stroke:     'black',
              strokeWidth: 2
            });

            group.add(rect);
          }
        }
      }

      this.groups.unshift(group);
    }
  };

  Tetris.BlockT = function ( layer ) {
    Tetris.Block.call(this, layer);

    this.shapes.push([[0, 1, 0], [1, 1, 1]]);
    this.shapes.push([[1, 0], [1, 1], [1, 0]]);
    this.shapes.push([[1, 1, 1], [0, 1, 0]]);
    this.shapes.push([[0, 1], [1, 1], [0, 1]]);

    this.build();
    this.rotate();
  };

  Tetris.BlockT.prototype   = new Tetris.Block();
  Tetris.BlockT.constructor = Tetris.BlockT;

  Tetris.BlockS = function ( layer ) {
    Tetris.Block.call(this, layer);

    this.shapes.push([[0, 1, 1], [1, 1, 0]]);
    this.shapes.push([[1, 0], [1, 1], [0, 1]]);

    this.build();
    this.rotate();
  };

  Tetris.BlockS.prototype   = new Tetris.Block();
  Tetris.BlockS.constructor = Tetris.BlockS;

})();

$(function() {
  var game = new Tetris.Game();
});