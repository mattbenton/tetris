/* jshint devel:true */
/* globals define */

// # Utils

define(function(){

  var Utils = {};

  // Creates a two-dimensional array of a specific width and height. If no
  // fill value is specified the array is filled with zeros. 
  Utils.create2dArray = function ( cols, rows, fillValue ) {
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

  return Utils;
});