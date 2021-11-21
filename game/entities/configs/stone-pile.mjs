export default {
  id: 'stone-pile',
  name: 'Stone Pile',
  walkable: true,
  layer: 'floor',
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 42,y: 10}
  },
  actions: {
    haul: true,
  }
};