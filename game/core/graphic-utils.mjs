import { SHEETS } from '../graphics/resources.mjs';

export const getTextureID = (data, sheet) => {
  let targetTextureMap = SHEETS[sheet || 'roguelikeChar'];
  if (data !== undefined && typeof data === 'number')
    return data;
  if (data !== undefined && typeof data === 'object') {
    const countX = targetTextureMap.countX || 0;
    return data.x + countX * data.y;
  }
  return null;
}
