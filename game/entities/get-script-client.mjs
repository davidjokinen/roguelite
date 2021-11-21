
import PlayerControl from './scripts/player-control.mjs';
import SocketPlayerControl from './scripts/socket-player-control.mjs';
import AiWander from './scripts/ai-find.mjs';
import TreeLife from './scripts/tree-life.mjs';
import SocketAiSim from './scripts/socket-ai-sim.mjs';

export default function getScript(name) {
  switch(name) {
    // case 'player-control': return PlayerControl;
    case 'socket-player-control': return SocketPlayerControl;
    // case 'ai-wander': return AiWander;
    // case 'tree-life': return TreeLife;
    case 'ai-sim': return SocketAiSim;
  }
  return null;
};


