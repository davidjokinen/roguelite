
import PlayerControl from './scripts/player-control';
import AiWander from './scripts/ai-find';
import TreeLife from './scripts/tree-life';
import AiSim from './scripts/ai-sim';

export default function getScript(name) {
  switch(name) {
    case 'player-control': return PlayerControl;
    case 'ai-wander': return AiWander;
    case 'tree-life': return TreeLife;
    case 'ai-sim': return AiSim;
  }
  return null;
};


