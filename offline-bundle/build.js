#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const klawSync = require('klaw-sync');

const outputDir = path.resolve('..', 'jsmol-offline');
const absolutePathPrefix = path.resolve('..');

function isJSFile(file) {
  return file.path.match(/\.js$/);
}

function isImgFile(file) {
  return file.path.match(/\.(jpg|jpeg|gif|png|svg)$/)
}

console.log('Generating offline bundle in ', outputDir);

// Create or empty output dir.
fs.emptyDirSync(outputDir);
// Copy necessary JS libs.
// JSmol injects some scripts using <script> tag, so we need to copy a few files (core.z.js and package.js)
// and keep the original dir structure / paths.
fs.copySync('../jsmol/j2s/core/core.z.js', path.join(outputDir, 'jsmol/j2s/core/core.z.js'));
fs.copySync('../jsmol/j2s/core/package.js', path.join(outputDir, 'jsmol/j2s/core/package.js'));
// Copy libs used by embeddable.html.
fs.copySync('../jsmol/JSmol.min.js', path.join(outputDir, 'jsmol/JSmol.min.js'));
fs.copySync('../iframe-phone/dist/iframe-phone.js', path.join(outputDir, 'iframe-phone/dist/iframe-phone.js'));
fs.copySync('../shutterbug.js/dist/shutterbug.js', path.join(outputDir, 'shutterbug.js/dist/shutterbug.js'));
fs.copySync('JSmol._getFileData.offline-patch.js', path.join(outputDir, 'JSmol._getFileData.offline-patch.js'));

// Start building new content that will be injected into embeddable.html.
// 1. _getFileData overwrite that replaces all the Ajax calls with local HTML lookup.
let newContent = '<script type="text/javascript" src="JSmol._getFileData.offline-patch.js"></script>\n';

// 2. Include all the scripts from jsmol/j2s/core and jsmol/j2s/J dirs. It seems that so far it's enough, but
//    it might be necessary to add more files in the future.
const j2sPaths =        klawSync('../jsmol/j2s/core', {nodir: true})
                .concat(klawSync('../jsmol/j2s/J', {nodir: true}))
                .filter(isJSFile);

// 3. Include all data from models dir (without images and binary files).
// Types based on Jmol._binaryTypes values + a few more.
const ignoredModelFiles = ['.DS_Store', '*.gz', '*.jpg', '*.jpeg', '*.gif', '*.png', '*.svg', '*.zip', '*.jmol', '*.bin',
                           '*.smol', '*.spartan', '*.mrc', '*.pse', '*.map', '*.omap'];
const modelPaths = klawSync('../models', {nodir: true, ignore: ignoredModelFiles});

// 4. Generate script tags for j2sPaths and modelPaths.
j2sPaths.concat(modelPaths).forEach(function (file) {
  const id = file.path.replace(`${absolutePathPrefix}/`, '');
  const fileContent = fs.readFileSync(file.path, 'utf-8');
  newContent += `<script type="text/template" id="${id}">//<![CDATA[\n${fileContent}\n//]]></script>\n`;
});

// 5. Copy images from models dir.
const imagePaths = klawSync('../models', {nodir: true}).filter(isImgFile);
imagePaths.forEach(function (file) {
  fs.copySync(file.path, path.join(outputDir, file.path.replace(`${absolutePathPrefix}/`, '')));
});

// Read embeddable.html content, insert new content it and save in output dir.
const embeddable = fs.readFileSync('../embeddable.html', 'utf-8');
const pos = embeddable.indexOf('<!-- OFFLINE BUNDLE CONTENT -->');
const newEmbeddable = embeddable.substr(0, pos) + newContent + embeddable.substr(pos);
fs.writeFileSync(path.join(outputDir, 'embeddable.html'), newEmbeddable);
