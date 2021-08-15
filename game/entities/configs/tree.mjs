export default {
  id: 'tree',
  name: 'Tree',
  walkable: false,
  // script: {
  //   main: 'tree-life'
  // },
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 13,y: 11},
    top: {x: 13,y: 10},
  },
  actions: {
    chop: {
      drop: {
        id: 'wood-pile',
        count: 30
      }
    }
  }
};