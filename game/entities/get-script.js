
import PlayerControl from './scripts/player-control';
import AiWander from './scripts/ai-wander';

export default function getScript(name) {
  switch(name) {
    case 'player-control': return PlayerControl;
    case 'ai-wander': return AiWander;
  }
  return null;
};


