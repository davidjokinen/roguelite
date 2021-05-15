import { getTextureID } from './utils';
import { SHEETS } from './resources.js';

export function getEdgeData(entity) {
  if (!entity.data) return null;
  if (!entity.data.sprite) return null;
  if (!entity.data.sprite.edges) return null;
  return entity.data.sprite.edges;
}

export function newEdgeHits() {
  return {
    right: false,
    left: false,
    top: false,
    bottom: false,
    topleft: false,
    topright: false,
    bottomleft: false,
    bottomright: false,
    cornertopleft: false,
    cornertopright: false,
    cornerbottomleft: false,
    cornerbottomright: false,
  };
}

export function getEdgesTextureID(sheet, edges, hits) {
  let newTextureId = null;
  if (edges.right && !hits.right && hits.left) 
    newTextureId = getTextureID(edges.right, sheet);
  if (edges.left && hits.right && !hits.left) 
    newTextureId = getTextureID(edges.left, sheet);
  if (edges.top && hits.bottom && !hits.top) 
    newTextureId = getTextureID(edges.top, sheet);
  if (edges.bottom && hits.top && !hits.bottom) 
    newTextureId = getTextureID(edges.bottom, sheet);
  if (edges.topleft && !hits.top && hits.bottom && !hits.left && hits.right) 
    newTextureId = getTextureID(edges.topleft, sheet);
  if (edges.topright && !hits.top && hits.bottom && hits.left && !hits.right) 
    newTextureId = getTextureID(edges.topright, sheet);
  if (edges.bottomleft && hits.top && !hits.bottom && !hits.left && hits.right) 
    newTextureId = getTextureID(edges.bottomleft, sheet);
  if (edges.bottomright && hits.top && !hits.bottom && hits.left && !hits.right) 
    newTextureId = getTextureID(edges.bottomright, sheet);
  if (edges.cornerbottomright && hits.top && hits.left && !hits.cornertopleft) 
    newTextureId = getTextureID(edges.cornerbottomright, sheet);
  if (edges.cornertopleft && hits.bottom && hits.right && !hits.cornerbottomright) 
    newTextureId = getTextureID(edges.cornertopleft, sheet);
  if (edges.cornertopright && hits.bottom && hits.left && !hits.cornerbottomleft) 
    newTextureId = getTextureID(edges.cornertopright, sheet);
  if (edges.cornerbottomleft && hits.top && hits.right && !hits.cornertopright) 
    newTextureId = getTextureID(edges.cornerbottomleft, sheet);
  return newTextureId;
}

export function getTextureData(data) {
  let targetTextureMap = SHEETS['roguelikeChar'];
  let targetTextureId = 0;
  let topTargetTextureId = null;
  if (data.sprite) {
    if (data.sprite.sheet !== undefined && data.sprite.sheet in SHEETS)
      targetTextureMap = SHEETS[data.sprite.sheet];
    if (data.sprite.randomTiles) {
      const randomLength = data.sprite.randomTiles.length;
      const randomPick = data.sprite.randomTiles[~~(randomLength*Math.random())]
      const newTargetTextureId = getTextureID(randomPick, data.sprite.sheet)
      if (newTargetTextureId)
        targetTextureId = newTargetTextureId;
      if (data.sprite.top) {
        topTargetTextureId = getTextureID(data.sprite.top, data.sprite.sheet)
      }
    } else {
      const newTargetTextureId = getTextureID(data.sprite.default, data.sprite.sheet)
      if (newTargetTextureId)
        targetTextureId = newTargetTextureId;
      if (data.sprite.top) {
        topTargetTextureId = getTextureID(data.sprite.top, data.sprite.sheet)
      }
    }
  }
  return {
    targetTextureMap,
    targetTextureId,
    topTargetTextureId,
  }
};