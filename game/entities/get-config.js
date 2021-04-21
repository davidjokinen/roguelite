import npcWander from './configs/npc-wander';
import player from './configs/player';
import bush from './configs/bush';
import longBush from './configs/long-bush';
import tree from './configs/tree';

const configMap = {}

export function registerConfig(config) {
  if (!config) {
    console.error('Entity config empty')
    return;
  }
  if (!config.id) {
    console.error('Entity config id empty')
    return;
  }
  if (config.id in configMap) {
    console.error('Entity config id already in use')
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
registerConfig(player);
registerConfig(npcWander);
registerConfig(bush);
registerConfig(longBush);
registerConfig(tree);