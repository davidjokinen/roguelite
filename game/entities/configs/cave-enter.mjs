export default {
  id: 'cave-enter',
  name: 'Stairs',
  walkable: true,
  layer: 'floor',
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 36,y: 18},
  },
  onEnter: {
    action: 'teleport'
  }
};