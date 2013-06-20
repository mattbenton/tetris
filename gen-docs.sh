#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

docco --output $DIR/client/docs $DIR/client/js/*.js
cp $DIR/client/docs/blocks.html $DIR/client/docs/index.html
#docco --output $DIR/server/docs $DIR/client/js/*.js