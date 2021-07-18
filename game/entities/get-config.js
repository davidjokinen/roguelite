import npcWander from './configs/npc-wander';
import npcSim from './configs/npc-sim';
import player from './configs/player';
import bush from './configs/bush';
import longBush from './configs/long-bush';
import tree from './configs/tree';
import smallTree from './configs/small-tree';
import deadTree from './configs/dead-tree';
import smallDeadTree from './configs/small-dead-tree';
import rock from './configs/rock';
import grass from './configs/grass';
import berryBush from './configs/berry-bush';

import berryPile from './configs/berry-pile';
import stonePile from './configs/stone-pile';
import woodPile from './configs/wood-pile';

import bed from './configs/bed';

const configMap = {};

export const actionMap = {};
export const actionToEntityMap = {};

function buildEntityActionMapping(config) {
  const id = config.id;
  if (!actionMap[id])
    actionMap[id] = {
      allActions: [],
    };
  if (!config.actions)
    return;
  const actionNames = Object.keys(config.actions);
  actionNames.forEach(action => {
    if (!(action in actionToEntityMap)) {
      actionToEntityMap[action] = [];
    }
    actionToEntityMap[action].push(id);

    actionMap[id].allActions.push(action);
    actionMap[id][action] = config.actions[action];
  });
}

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
  buildEntityActionMapping(config);
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
registerConfig(npcSim);
registerConfig(bush);
registerConfig(berryBush);
registerConfig(longBush);
registerConfig(tree);
registerConfig(smallTree);
registerConfig(deadTree);
registerConfig(smallDeadTree);
registerConfig(rock);
registerConfig(grass);
registerConfig(berryPile);
registerConfig(stonePile);
registerConfig(woodPile);
registerConfig(bed);
// console.log(actionToEntityMap)