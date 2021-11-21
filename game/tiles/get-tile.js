// import dirt from './configs/dirt';
// import grass from './configs/grass';
// import water from './configs/water';
// import stone from './configs/stone';
// import sand from './configs/sand';
const dirt = require('./configs/dirt');
const grass = require('./configs/grass');
const water = require('./configs/water');
const stone = require('./configs/stone');
const sand = require('./configs/sand');

// import dirtPath from './configs/dirt-path';
// import sandPath from './configs/sand-path';
// import stonePath from './configs/stone-path';
const dirtPath = require('./configs/dirt-path');
const sandPath = require('./configs/sand-path');
const stonePath = require('./configs/stone-path');

const configMap = {}

function registerConfig(config) {
  if (!config) {
    console.error('Tile config empty')
    return;
  }
  if (!config.id) {
    console.error('Tile config id empty')
    return;
  }
  if (config.id in configMap) {
    console.error('Tile config id already in use')
    return;
  }
  configMap[config.id] = config;
};

function getConfig(id) {
  if (id in configMap) {
    return configMap[id];
  }
  return null;
};

// config register
registerConfig(dirt);
registerConfig(grass);
registerConfig(water);
registerConfig(sand);
registerConfig(stone);
registerConfig(dirtPath);
registerConfig(sandPath);
registerConfig(stonePath);

module.exports = {
  registerConfig,
  getConfig,
}