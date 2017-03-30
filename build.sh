#!/bin/sh

rm -rf dist
mkdir dist
rsync -r --exclude /dist --exclude /local-server --exclude /deploy ./* ./dist/
