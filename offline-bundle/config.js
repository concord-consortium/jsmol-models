module.exports = {
  jsPaths: [
    // This seems to cover all the models:
    'jsmol/j2s',
    'jsmol/idioma/en_GB.po',
    // If size of the bundle is important, you can list only files necessary for given interactive,
    // e.g. this is enough for DNA model:
    // "jsmol/j2s/core/corescript.z.js",
    // "jsmol/j2s/core/corebio.z.js",
    // "jsmol/j2s/J/render/MeshRenderer.js",
    // "jsmol/j2s/J/shape/Mesh.js",
    // "jsmol/j2s/core/coretext.z.js",
    // "jsmol/j2s/J/g3d/HermiteRenderer.js",
    // "jsmol/j2s/core/corescriptcmd.z.js",
    // "jsmol/j2s/J/renderbio/NucleicRenderer.js",
  ],
  modelPaths: [
    // Include all models by default:
    'models',
    // Only a few models can be provided, e.g.:
    // 'models/dna',
  ]
};
