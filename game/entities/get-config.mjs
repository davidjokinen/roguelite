import npcWander from './configs/npc-wander.mjs';
import npcSim from './configs/npc-sim.mjs';
import player from './configs/player.mjs';
import bush from './configs/bush.mjs';
import longBush from './configs/long-bush.mjs';
import tree from './configs/tree.mjs';
import smallTree from './configs/small-tree.mjs';
import deadTree from './configs/dead-tree.mjs';
import smallDeadTree from './configs/small-dead-tree.mjs';
import rock from './configs/rock.mjs';
import grass from './configs/grass.mjs';
import berryBush from './configs/berry-bush.mjs';

import berryPile from './configs/berry-pile.mjs';
import stonePile from './configs/stone-pile.mjs';
import woodPile from './configs/wood-pile.mjs';

import bed from './configs/bed.mjs';

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