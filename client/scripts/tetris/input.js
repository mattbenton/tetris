/* jshint devel:true */
/* globals define */

define(['jquery'], function( $ ) {

  // # Input

  // Handles input from the player.

  function Input ( game ) {
    this.game = game;
    this.addListeners();
  }

  Input.LEFT   = 37;
  Input.UP     = 38;
  Input.RIGHT  = 39;
  Input.DOWN   = 40;
  Input.ROTATE_LEFT = 69;
  Input.ROTATE_RIGHT = 81;
  Input.STAMP  = 32;

  Input.keys = [Input.LEFT, Input.UP, Input.RIGHT, Input.DOWN, Input.ROTATE_LEFT, Input.ROTATE_RIGHT, Input.STAMP];

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

  return Input;
});