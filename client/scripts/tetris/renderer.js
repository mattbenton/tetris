/* jshint devel:true */
/* globals define */

define(['tetris/color'], function( Color ){

  function Renderer ( grid ) {
    this.grid = grid;
    this.size = 25;
    this.context = $('#grid')[0].getContext('2d');
  }

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

  return Renderer;
});