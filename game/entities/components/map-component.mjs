import Component from "../component.mjs";
import { createEventlistener } from '../../core/utils.mjs';
import WalkAction from '../../actions/walk-action.mjs';

export default class MapComponent extends Component {
  constructor() {
    super();

    this._curTile = null;
    this._map = null;

    this.lastDirX = 0;
    this.lastDirY = 0;

    this._onMapChange = createEventlistener();
  }

  initComponent(map, world) {
    const parent = this.parent;

    this._map = map;
    this._RegisterHandler('update.position', (m) => { this._onChangePosition(m); });

    teleportCheck:if (parent.data && parent.data.onEnter) {
      if (parent.data.onEnter.action === 'teleport') {
        if (!parent.params) break teleportCheck;
        const teleport = parent.params.teleport;
        if (!teleport) break teleportCheck;
        const mapTarget = teleport.map;
        const teleportX = teleport.x;
        const teleportY = teleport.y;
        this._RegisterHandler('tile.onEnter', (m) => { this._OnEnterTile({
            entity: m.entity,
            mapTarget,
            teleportX,
            teleportY,
          }); 
        });
      }
    }

    parent.addOnMapChange = (evt) => {
      this._onMapChange.add(evt);
    };
  
    parent.removeOnMapChange = (evt) => {
      this._onMapChange.remove(evt);
    };

    parent.getMap = () => this._map;

    parent.setMap = (map, dontSwitchMap) => {
      if (map === this._map) return;
      
      const oldMap = this._map;
      parent.updateMap(map, dontSwitchMap);
      
      this.broadcast({
        topic: 'update.position',
        skipTileTrigger: true,
        mapChanged: oldMap !== map,
      });
    };

    parent.updateMap = (map, dontSwitchMap) => {
      if (map === this._map) return;
  
      const oldMap = this._map;
      this._map = map;

      if (!dontSwitchMap) {
        if (!oldMap) return;
        const entity = this.parent;
        const map = entity.map;
        entity.remove();
        oldMap.removeEntity(entity, true)
        entity.world = this.world;
        map.addEntity(entity);
        map.world.entitySwitchMap(entity);
      }
        
      if (!dontSwitchMap)
        this._onMapChange.trigger();
    }
  }

  destroy() {
    const parent = this.parent;

    if (parent.world) {
      parent.world.removeEntity(parent);
    }

    if (this._curTile) {
      this._curTile.entities.splice(this._curTile.entities.indexOf(parent), 1);
    }

    parent.addOnMapChang = null;
    parent.removeOnMapChange = null;
    parent.setMap = null;
    parent.getMap = null;
  }

  _OnEnterTile(event) {
    const entity = event.entity
    const teleportX = event.teleportX
    const teleportY = event.teleportY
    const mapTarget = event.mapTarget;
    const mapComp = entity.getComponent('MapComponent');
    const lastDirX = mapComp.lastDirX;
    const lastDirY = mapComp.lastDirY;
    if (entity === this.parent) return;
    entity.x = teleportX;
    entity.y = teleportY;
    if (entity._map !== mapTarget) {
      entity.updateMap(mapTarget);
    }
    if (entity.getComponent('GraphicComponent')) {
      entity.getComponent('GraphicComponent').addEffect('FadeEffect');
    }
    entity.broadcast({
      topic: 'update.position',
      skipTileTrigger: true,
      teleported: true,
      mapChanged: mapTarget !== entity._map,
    });
    if (lastDirX === undefined || lastDirX === null)
      return;
    entity.queueAction(new WalkAction(lastDirX, lastDirY));
  }

  _onChangePosition(event) {
    const parent = this.parent;
    const map = this._map;
    const skipTileTrigger = event.skipTileTrigger;
    const teleported = event.teleported;
    const init = event.init;
    if (!map) return;
    const tile = map.getTile(~~parent.x, ~~parent.y);
    if (!tile) return;
    if (this._curTile === tile) return;

    if (this._curTile) {
      this._curTile.entities.splice(this._curTile.entities.indexOf(parent), 1);
      if (!teleported) {
        this.lastDirX = tile.x - this._curTile.x;
        this.lastDirY = tile.y - this._curTile.y;
      }
    }

    this._curTile = tile;
    tile.entities.push(parent);
    if (init) return;

    let collide = null;
    for (let i=0; i<tile.entities.length; i++) {
      if (parent === tile.entities[i]) continue;
      if (!tile.entities[i].walkable) {
        collide = tile.entities[i];
        break;
      }
    }
    if (collide) {
      parent.broadcast({
        topic: 'entity.collide',
        entity: parent,
        hit: collide,
        tile: tile,
      });
    }
    if (!skipTileTrigger && !teleported) {
      tile.broadcast({
        topic: 'tile.onEnter',
        entity: parent
      });
    }
  }

  
}