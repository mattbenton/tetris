define(['jquery', 'tetris/block', 'tetris/input', 'tetris/grid', 'tetris/renderer'],
function( $, Block, Input, Grid, Renderer ) {

  var Game = function () {
    this.input = new Input(this);

    var grid = this.grid = new Grid(10, 15);
    grid.debug = true;

    var block = this.currentBlock = new Block();
    block.shape.setType('T');
    // block.randomize();

    block.x = block.y = 2;

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
          this.dropBlock();
          y = block.y;
          this.lockBlock();
          this.newBlock();
          block = this.currentBlock;

          // y--;
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
        case Input.ROTATE_LEFT:
          // block.rotate(1);

          // if ( grid.hitTestBlock(block) ) {
          //   block.rotate(-1);
          // }

          this.tryRotate(1);
          break;
        case Input.ROTATE_RIGHT:
          this.tryRotate(-1);
          break;
        case Input.STAMP:
          grid.writeBlock(block, block.color.index);

          this.currentBlock = block = new Block();
          block.randomize();

          break;
      }

      if ( !grid.hitTestBlock(block, x, y) ) {
        block.x = x;

        // if ( y > block.y ) {
          block.y = y;
        // }
      }

      // grid.render();
      this.renderer.render();

      this.renderer.renderBlock(block);
    }
  };

  Game.prototype.dropBlock = function () {
    var block = this.currentBlock;

    do {
      block.y++;
      console.log('drop');
    } while ( !this.grid.hitTestBlock(block) );

    // Move the block up to compensate for the collision.
    block.y--;
  };

  Game.prototype.lockBlock = function () {
    var block = this.currentBlock;
    this.grid.writeBlock(block, block.color.index);
  };

  Game.prototype.newBlock = function () {
    this.currentBlock = new Block();
    this.currentBlock.randomize();
  };

  Game.prototype.tryRotate = function ( amount ) {
    var grid  = this.grid;
    var block = this.currentBlock;

    amount = amount || 1;

    block.rotate(amount);

    if ( !grid.hitTestBlock(block) ) {
      return true;
    }

    block.x--;
    if ( !grid.hitTestBlock(block) ) {
      return true;
    }
    block.x++;

    block.x++;
    if ( !grid.hitTestBlock(block) ) {
      return true;
    }
    block.x--;

    block.y--;
    if ( !grid.hitTestBlock(block) ) {
      return true;
    }
    block.y++;

    block.rotate(-amount);
    return false;
  };

  return Game;

});