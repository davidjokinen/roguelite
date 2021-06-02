
import PlayerControl from './scripts/player-control';
import AiWander from './scripts/ai-wander';
import TreeLife from './scripts/tree-life';

export default function getScript(name) {
  switch(name) {
    case 'player-control': return PlayerControl;
    case 'ai-wander': return AiWander;
    case 'tree-life': return TreeLife;
  }
  return null;
};


