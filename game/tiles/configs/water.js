// export default 
module.exports = {
  id: 'water',
  name: 'Water',
  walkable: false,
  sprite: {
    sheet: 'roguelikeSheet',
    default: {x: 3, y: 1},
    edges: {
      top: {x: 3,y: 0},
      bottom: {x: 3,y: 2},
      left: {x: 2,y: 1},
      right: {x: 4,y: 1},
      topleft: {x: 2,y: 0},
      topright: {x: 4,y: 0},
      bottomleft: {x: 2,y: 2},
      bottomright: {x: 4,y: 2},
      cornertopleft: {x: 0,y: 1},
      cornertopright: {x: 1,y: 1},
      cornerbottomleft: {x: 0,y: 2},
      cornerbottomright: {x: 1,y: 2},
    }
  }
};