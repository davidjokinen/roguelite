import { Texture, TextureMap, GroupMeshHandler } from 'simple2d';

import roguelikeChar from './resources/roguelikeChar_transparent.png';
import roguelikeSheet from './resources/roguelikeSheet_transparent.png';

const handler = GroupMeshHandler.getRootHandler();

const tileHandler = handler.createChildHandler();
tileHandler.setDefaultZ(0);
const entityFloorHandler = handler.createChildHandler();
entityFloorHandler.setDefaultZ(0.999);
const entityHandler = handler.createChildHandler();
entityHandler.setDefaultZ(1);
const entityTopHandler = handler.createChildHandler();
entityTopHandler.setDefaultZ(1.0001);

export const LAYERS = {
  tile: tileHandler,
  entityFloor: entityFloorHandler,
  entity: entityHandler,
  entityTops: entityTopHandler
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

export const SHEETS = {
  roguelikeChar: roguelikeCharTextureMap,
  roguelikeSheet: roguelikeSheetTextureMap,
}