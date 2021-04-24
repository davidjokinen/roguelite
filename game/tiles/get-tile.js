import dirt from './configs/dirt';
import grass from './configs/grass'
import water from './configs/water'

const configMap = {}

export function registerConfig(config) {
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

export function getConfig(id) {
  if (id in configMap) {
    return configMap[id];
  }
  return null;
};

// config register
registerConfig(dirt);
registerConfig(grass);
registerConfig(water);