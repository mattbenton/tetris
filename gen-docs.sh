#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# docco --output $DIR/client/docs $DIR/client/js/*.js
docco --output $DIR/client/docs $DIR/client/scripts/tetris/*.js
cp $DIR/client/docs/game.html $DIR/client/docs/index.html
#docco --output $DIR/server/docs $DIR/client/js/*.js