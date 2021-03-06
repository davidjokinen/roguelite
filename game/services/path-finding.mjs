import BaseService from './base-service.mjs';

const tileWalkable = (tile) => {
  
}

class PathWorker extends BaseService {
  constructor(map, start, end) {
    super();
    this.map = map;
    this.start = start;
    this.end = end;

    this.searchList = [start];
    this.cameFromMap = {};
    this.gScore = {};
    this.gScore[start.id] = 0;
    this.fScore = {};
    this.fScore[start.id] = this.tileCost(start);

    // Just give up if it is too much work. 
    this.maxSearch = this.tileCost(start)*4;

    this.done = false;
    this.path = null;
  }

  tileCost(tile) {
    const difX = Math.abs(tile.x-this.end.x);
    const difY = Math.abs(tile.y-this.end.y);
    return ~~(Math.sqrt(difX*difX + difY*difY)*12);
  }

  reconstructPath(current) {
    const { cameFromMap, start } = this;
    const path = [current];
    while(cameFromMap[current.id] && current !== start) {
      path.push(cameFromMap[current.id]);
      current = cameFromMap[current.id];
    }
    return path.reverse();
  }

  work(limit) {
    const {
      searchList,
      gScore,
      fScore,
      cameFromMap,
      end
    } = this;
    while (searchList.length > 0 && limit > 0) {
      limit -= 1;

      let indexOfSmallesF = 0;
      for (let i=1;i<searchList.length;i++) {
        if (fScore[searchList[i].id] < fScore[searchList[indexOfSmallesF].id]) {
          indexOfSmallesF = i;
        }
      }
      const searchTile = searchList[indexOfSmallesF];
      searchList.splice(indexOfSmallesF, 1); 
      if (searchTile === end) {
        this.path = this.reconstructPath(searchTile);
        this.done = true;
        return limit;
      }

      this.map.getNeighbors(searchTile.x, searchTile.y).forEach(neighborTile => {
        // console.log(neighborTile, gScore[neighborTile.id], gScore)
        // TODO replace
        if (!neighborTile.isWalkable()) return;
        

        if (cameFromMap[neighborTile.id] !== undefined) return;
        let newG = gScore[searchTile.id] + 8;
        if (neighborTile.x - searchTile.x !== 0 && neighborTile.y - searchTile.y !== 0)
          newG += 4;
        cameFromMap[neighborTile.id] = searchTile;
        gScore[neighborTile.id] = newG;
        const tileCost = this.tileCost(neighborTile) 
        if (tileCost > this.maxSearch)
          return;
        fScore[neighborTile.id] = tileCost + newG;
        searchList.push(neighborTile);
      });
    }
    if (searchList.length === 0) {
      this.done = true;
      return limit;
    }
    return 0;
  }

}

export default class PathFinding extends BaseService {
  constructor() {
    super();
    this.id = 'path-finding';
    this.workers = [];
  }

  findPath(map, start, end) {
    const worker = new PathWorker(map, start, end);
    this.workers.push(worker);
    return worker;
  }

  update() {
    const limitJob = 30;
    let updateLimit = 1400;
    let index = 0;
    while(updateLimit > 0 && this.workers.length > 0) {
      const focusedWorker = this.workers[index];
      updateLimit -= limitJob;
      const leftover = focusedWorker.work(limitJob);
      updateLimit += leftover;
      if (focusedWorker.done) {
        this.workers.splice(index, 1);
      } else {
        index += 1;
      }
      if (index >= this.workers.length) {
        index = 0;
      }
    }
  }

}