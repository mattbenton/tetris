/* jshint devel:true */
/* globals define */

// # Color

// Defines the colors each block can be and provides a convenience method to
// get a random color.

define(function(){

  var Color = {
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

  return Color;
});