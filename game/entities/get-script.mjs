
// import PlayerControl from './scripts/player-control.mjs';
import ServerPlayerControl from './scripts/server-player-control.mjs';
import AiWander from './scripts/ai-find.mjs';
import TreeLife from './scripts/tree-life.mjs';
import AiSim from './scripts/ai-sim.mjs';

export default function getScript(name) {
  switch(name) {
    // case 'player-control': return PlayerControl;
    case 'socket-player-control': return ServerPlayerControl;
    case 'ai-wander': return AiWander;
    case 'tree-life': return TreeLife;
    case 'ai-sim': return AiSim;
  }
  return null;
};


