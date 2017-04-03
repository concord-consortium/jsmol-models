#!/bin/sh

# Basic build
rm -rf dist
mkdir dist
rsync -r --exclude /dist --exclude /local-server --exclude /deploy --exclude offline-bundle ./* ./dist/

# Offline bundle build (available as /jsmol-offline.tar.gz)
./offline-bundle/build.js
tar -czf ./dist/jsmol-offline.tar.gz jsmol-offline
