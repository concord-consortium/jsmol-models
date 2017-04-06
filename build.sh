#!/bin/sh

# Basic build.
rm -rf dist
mkdir dist
rsync -r --exclude /dist --exclude /local-server --exclude /deploy --exclude offline-bundle ./* ./dist/

# Offline bundle build.
cd offline-bundle && npm install && ./build.js
cd ..

# Compress offline package and put it in dist folder that will be deployed by s3_website.
# It will be available at /jsmol-offline.tar.gz.
tar -czf ./dist/jsmol-offline.tar.gz jsmol-offline
