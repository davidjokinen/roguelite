export default {
  id: 'berry-pile',
  walkable: true,
  layer: 'floor',
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 56,y: 16}
  },
  actions: {
    haul: true,
    eat: true,
  }
};