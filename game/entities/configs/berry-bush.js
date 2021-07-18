export default {
  id: 'berry-bush',
  walkable: false,
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 24,y: 9}
  },
  actions: {
    harvest: {
      drop: {
        id: 'berry-pile',
        count: 20
      }
    }
  }
};