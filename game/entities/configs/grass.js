export default {
  id: 'grass',
  walkable: true,
  layer: 'floor',
  sprite: {
    sheet: 'roguelikeSheet',
    randomTiles: [
      {x: 22, y: 10},
      {x: 22, y: 11},
    ],
    default: {x: 22,y: 10}
  },
  actions: {
    cut: true,
  }
};