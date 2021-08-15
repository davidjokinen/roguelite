export default {
  id: 'dead-tree',
  name: 'Tree (dead)',
  walkable: false,
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 27,y: 10},
    top: {x: 27,y: 9},
  },
  actions: {
    chop: {
      drop: {
        id: 'wood-pile',
        count: 20
      }
    }
  }
};