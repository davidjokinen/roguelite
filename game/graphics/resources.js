import { Texture, TextureMap, GroupMeshHandler } from 'simple2d';

import roguelikeChar from '../resources/roguelikeChar_transparent.png';
import roguelikeSheet from '../resources/roguelikeSheet_transparent.png';

import colors from '../resources/colors.png';

const handler = GroupMeshHandler.getRootHandler();

const tileHandler = handler.createChildHandler();
tileHandler.setDefaultZ(0.98);

const entityFloorHandler = handler.createChildHandler();
entityFloorHandler.setDefaultZ(0.999);
const entityHandler = handler.createChildHandler();
entityHandler.setDefaultZ(1);
// entityHandler.setOpacity(0.5);

const entityTopHandler = handler.createChildHandler();
entityTopHandler.setDefaultZ(1.0001);
const overlayHander = handler.createChildHandler();
overlayHander.setDefaultZ(1.0002);
overlayHander.setOpacity(0.5);

export const LAYERS = {
  tile: tileHandler,
  entityFloor: entityFloorHandler,
  entity: entityHandler,
  entityTops: entityTopHandler,
  overlay: overlayHander,
}

const roguelikeCharTexture = new Texture(roguelikeChar);
export const roguelikeCharTextureMap = new TextureMap(roguelikeCharTexture, TextureMap.OrginalUVScalerPadding(roguelikeCharTexture, 16, 16, 1));
// Makes referencing earier 
roguelikeCharTextureMap.countX = 54; // image width/17 (grid size)
roguelikeCharTextureMap.countY = 12;

const roguelikeSheetTexture = new Texture(roguelikeSheet);
export const roguelikeSheetTextureMap = new TextureMap(roguelikeSheetTexture, TextureMap.OrginalUVScalerPadding(roguelikeSheetTexture, 16, 16, 1));
roguelikeSheetTextureMap.countX = 57;
roguelikeSheetTextureMap.countY = 31;

const colorsTexture = new Texture(colors);
export const colorsTextureMap = new TextureMap(colorsTexture, TextureMap.OrginalUVScalerPadding(colorsTexture, 3, 3, 1));
colorsTextureMap.countX = 63;
colorsTextureMap.countY = 63;

export const SHEETS = {
  roguelikeChar: roguelikeCharTextureMap,
  roguelikeSheet: roguelikeSheetTextureMap,
  colors: colorsTextureMap,
}

