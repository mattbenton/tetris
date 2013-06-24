require.config({
  "baseUrl": "scripts",
  "paths": {
    "jquery": "../vendor/jquery-2.0.2.min"
  }
});

require(['tetris/game'], function ( Game ) {
  var game = new Game();
});