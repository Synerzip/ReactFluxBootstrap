#!/bin/bash
#set -o pipefail npm run clean && NODE_ENV=production browserify js/app.js -t reactify -t 6to5ify -t envify | uglifyjs -cm -warnings=false --screw-ie8 > dist/bundle.js
set -o pipefail npm run clean && NODE_ENV=production browserify js/app.js -t babelify -t envify > dist/bundle.js
