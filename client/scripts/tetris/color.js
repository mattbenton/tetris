/* jshint devel:true */
/* globals define */

// # Color

// Defines the colors each block can be and provides a convenience method to
// get a random color.

define(function(){

  var Color = {
    1: { index: 1, fill: '#36abfb', stroke: '#2e72d5' }, // Cyan
    2: { index: 2, fill: '#1762ee', stroke: '#1b4196' }, // Blue
    // 2: { index: 2, fill: '#36abfb', stroke: '#2e72d5' }, // Blue
    3: { index: 3, fill: '#f79210', stroke: '#c04207' }, // Orang
    4: { index: 4, fill: '#ffd101', stroke: '#d77e06' }, // Yellow
    5: { index: 5, fill: '#13cb15', stroke: '#067a0b' }, // Green
    6: { index: 6, fill: '#c390db', stroke: '#894ab5' }, // Purple
    7: { index: 7, fill: '#f14d43', stroke: '#7c1413' }, // Red
    8: { index: 8, fill: '#565656', stroke: '#2d2d2d' }  // Charcoal (debugging)
  };

  Color.CYAN   = 1;
  Color.BLUE   = 2;
  Color.ORANGE = 3;
  Color.YELLOW = 4;
  Color.GREEN  = 5;
  Color.PURPLE = 6;
  Color.RED    = 7;
  Color.DEBUG  = 8;

  // Color.RED    = 1;
  // Color.ORANGE = 2;
  // Color.YELLOW = 3;
  // Color.GREEN  = 4;
  // Color.BLUE   = 5;
  // Color.PURPLE = 6;
  // Color.DEBUG  = 7;

  // Color.names = { red: 1, orange: 2, yellow: 3, green: 4, blue: 5, purple: 6 };

  Color.random = function () {
    return Color[Math.floor(Math.random() * 7) + 1];
  };

  return Color;
});