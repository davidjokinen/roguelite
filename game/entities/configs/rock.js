export default {
  id: 'rock',
  name: 'Rock',
  walkable: false,
  sprite: {
    sheet: 'roguelikeSheet',
    randomTiles: [
      {x: 54, y: 21},
      {x: 55, y: 21},
      {x: 56, y: 21},
    ],
    default: {x: 54,y: 21}
  },
  actions: {
    mine: {
      drop: {
        id: 'rock-pile',
        count: 20
      }
    }
  }
};