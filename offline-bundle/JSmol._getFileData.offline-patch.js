Jmol._getFileData = function(fileName, fSuccess, doProcess) {
  if (fileName.startsWith('file:/')) {
    // Sometimes JSmol resolves paths to:
    // file:/<full-path-of-the-jsmol-dir>/<path-of-the-file>
    // We want to get rid of `file:/<full-path-of-the-jsmol-dir>/` part and leave just relative path, as this is ID
    // of the script tag that contains its content in embeddable-offline.html. Example:
    // fileName = "file:/Users/piotr/Concord/PascoInteractive/jsmol/models/dna/dna1.pdb"
    // window.location.pathname = "/Users/piotr/Concord/PascoInteractive/jsmol/embeddable-offline.html"
    // final fileName = "models/dna/dna1.pdb"
    var path = window.location.pathname;
    path = path.substr(0, path.lastIndexOf('/') + 1);
    fileName = fileName.replace('file:' + path, '');
  }
  var isBinary = Jmol._isBinaryUrl(fileName);
  if (isBinary) {
    console.warning('trying to load binary file:', fileName);
  }
  var data = null;
  var localElement = document.getElementById(fileName);
  if (localElement) {
    data = localElement.innerText;
    if (data.startsWith('//<![CDATA[')) {
      data = data.slice('//<![CDATA['.length, -'//]]>'.length);
    }
  } else {
    console.error('missing data:', fileName);
  }
  if (!doProcess)
    return data;
  if (data == null) {
    data = "";
    isBinary = false;
  }
  isBinary && (isBinary = Jmol._canSyncBinary(true));
  return (isBinary ? Jmol._strToBytes(data) : JU.SB.newS(data));
};
