#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const klawSync = require('klaw-sync');
const config = require('./config');

const mainDir = path.join(__dirname, '..');
const outputDir = path.join(mainDir, 'jsmol-offline');

function isJSFile(file) {
  // java/util/Random.js for some reason is breaking the whole page. It seems we can skip it and JSmol works anyway.
  if (file.path.indexOf('java/util/Random.js') !== -1) return;
  return file.path.match(/\.js$/);
}

function isImgFile(file) {
  return file.path.match(/\.(jpg|jpeg|gif|png|svg)$/)
}

function flatten(arr) {
  return [].concat.apply([], arr);
}

function getAllPathsIn(paths, ignore = null, filterFunc = null) {
  if (filterFunc === null) filterFunc = function () { return true; };
  return flatten(paths
    .map(p => path.join(mainDir, p))
    .map(p => fs.statSync(p).isFile() ? [p] : klawSync(p, {nodir: true, ignore})
                                                .filter(filterFunc)
                                                .map(file => file.path)
  ));
}

console.log('Generating offline bundle in ', outputDir);

// Create or empty output dir.
fs.emptyDirSync(outputDir);
// Copy necessary JS libs.
// JSmol injects some scripts using <script> tag, so we need to copy a few files (core.z.js and package.js)
// and keep the original dir structure / paths.
fs.copySync(path.join(mainDir, 'jsmol/j2s/core/core.z.js'), path.join(outputDir, 'jsmol/j2s/core/core.z.js'));
fs.copySync(path.join(mainDir, 'jsmol/j2s/core/package.js'), path.join(outputDir, 'jsmol/j2s/core/package.js'));
// Copy libs used by embeddable.html.
fs.copySync(path.join(mainDir, 'jsmol/JSmol.min.js'), path.join(outputDir, 'jsmol/JSmol.min.js'));
fs.copySync(path.join(mainDir, 'iframe-phone/dist/iframe-phone.js'), path.join(outputDir, 'iframe-phone/dist/iframe-phone.js'));
fs.copySync(path.join(mainDir, 'shutterbug.js/dist/shutterbug.js'), path.join(outputDir, 'shutterbug.js/dist/shutterbug.js'));
fs.copySync(path.join(mainDir, 'offline-bundle/JSmol._getFileData.offline-patch.js'), path.join(outputDir, 'JSmol._getFileData.offline-patch.js'));

// Start building new content that will be injected into embeddable.html.
// 1. _getFileData overwrite that replaces all the Ajax calls with local HTML lookup.
let newContent = '<script type="text/javascript" src="JSmol._getFileData.offline-patch.js"></script>\n';

// 2. Include all the scripts from jsmol/j2s/core and jsmol/j2s/J dirs (defined in config).
//    It seems that so far it's enough, but it might be necessary to add more files in the future.
const j2sPaths = getAllPathsIn(config.jsPaths, null, isJSFile);

// 3. Include data from models dir (without images and binary files).
// Types based on Jmol._binaryTypes values + a few more.
const ignoredModelFiles = ['.DS_Store', '*.gz', '*.jpg', '*.jpeg', '*.gif', '*.png', '*.svg', '*.zip', '*.jmol', '*.bin',
                           '*.smol', '*.spartan', '*.mrc', '*.pse', '*.map', '*.omap'];
const modelPaths = getAllPathsIn(config.modelPaths, ignoredModelFiles);

// 4. Generate script tags for j2sPaths and modelPaths.
j2sPaths.concat(modelPaths).forEach(function (file) {
  const id = file.replace(`${mainDir}/`, '');
  const fileContent = fs.readFileSync(file, 'utf-8');
  newContent += `<script type="text/template" id="${id}">//<![CDATA[\n${fileContent}\n//]]></script>\n`;
});

// 5. Copy images from models dir.
const imagePaths = getAllPathsIn(config.modelPaths, null, isImgFile);
imagePaths.forEach(function (file) {
  fs.copySync(file, path.join(outputDir, file.replace(`${mainDir}/`, '')));
});

// Read embeddable.html content, insert new content it and save in output dir.
const embeddable = fs.readFileSync(path.join(mainDir, 'embeddable.html'), 'utf-8');
const pos = embeddable.indexOf('<!-- OFFLINE BUNDLE CONTENT -->');
const newEmbeddable = embeddable.substr(0, pos) + newContent + embeddable.substr(pos);
fs.writeFileSync(path.join(outputDir, 'embeddable.html'), newEmbeddable);
