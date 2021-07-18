export default {
  id: 'small-dead-tree',
  walkable: false,
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 27,y: 11},
  },
  actions: {
    chop: {
      drop: {
        id: 'wood-pile',
        count: 10
      }
    }
  }
};