export default {
  id: 'small-tree',
  name: 'Tree',
  walkable: false,
  // script: {
  //   main: 'tree-life'
  // },
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 13,y: 9},
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