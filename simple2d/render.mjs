import * as THREE from 'three';
// const THREE = require('three');
const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);

class ResizeImage {
  constructor(file, done) {
    this.file = file;
    this.done = done;
    this.init();
  }

  init() {
    var canvas = document.createElement("CANVAS");
    var context = canvas.getContext("2d"); 
    var myImg = new Image();
    myImg.onload = () => {
      const size = this.newSize(myImg);
      canvas.height = size.height;
      canvas.width = size.width;
      context.drawImage(myImg, 0, 0);
      if (this.done) 
        this.done(this);
    };
    myImg.src = this.file;
    this.canvas = canvas;
  }

  newSize(img) {
    const curHeight = img.height;
    const curWidth = img.width;
    this.orginalSize = {
      width: curWidth,
      height: curHeight,
    }
    let newHeight = 512;
    let newWidth = 512;
    while (newHeight < curHeight) {
      newHeight *= 2;
    }
    while (newWidth < curWidth) {
      newWidth *= 2;
    }
    if (newHeight > newWidth)
      newWidth = newHeight;
    if (newWidth > newHeight)
      newHeight = newWidth;
    this.size = {
      width: newWidth,
      height: newHeight,
    };
    return this.size;
  }

  url() {
    return this.canvas.toDataURL();
  }
}

// TODO: cleanup the static functions
export class TextureMap {
  constructor(texture, splitter) {
    this.texture = texture;
    this.splitter = splitter;
  }

  getTexture(index) {
    return new SubTexture(
      this.texture,
      this.splitter,
      index,
    );
  }

  static UVScaler(countX, countY, subX, size) {
    countY = countY || countX;
    subX = subX || 0;
    size = size || 256;

    const buffer = subX/size;
    const fullSize = 1-buffer;
    const scaleX = fullSize/countX;
    const scaleY = countY ? fullSize/countY : scaleX;
    return function(uvs, _i, start) {
      const _x = ~~(_i%countX);
      const _y = ~~(_i/countX);
      
      const PAD = scaleX/(size/countX);
      
      const HALF_PAD = PAD/2;
  
      const SIZE_X = scaleX - HALF_PAD;
      const SIZE_Y = scaleY - HALF_PAD;
  
      let x = _x * SIZE_X + 0 + HALF_PAD;
      let y = -_y * SIZE_Y + 1 - SIZE_Y + HALF_PAD;
      
      const min = 0 ;
      const max_x = min + SIZE_X;
      const max_y = min + SIZE_Y;
  
      const index = ~~(start*12) || 0;
      
      uvs[0+index] = min + x;
      uvs[1+index] = min + y;
      uvs[2+index] = max_x + x;
      uvs[3+index] = min + y;
      uvs[4+index] = max_x + x;
      uvs[5+index] = max_y + y;

      uvs[6+index] = max_x + x;
      uvs[7+index] = max_y + y;
      uvs[8+index] = min + x;
      uvs[9+index] = max_y + y;
      uvs[10+index] = min + x;
      uvs[11+index] = min + y;
    }
  }

  static OrginalUVScaler(image, countX, countY, padding) {
    countY = countY || countX;
    padding = padding || 0;
    let subX = 0;
    let subY = 0;
    let width = 1;
    let height = 1;
    let bufferX = subX/width;
    let bufferY = subX/width;
    let fullSizeX = 1-bufferX;
    let fullSizeY = 1-bufferX;
    let paddingX = 0;
    let paddingY = 0;
    let paddingAddX = 0;
    let paddingAddY = 0;
    let scaleX = fullSizeX/countX;
    let scaleY = countY ? fullSizeX/countY : scaleX;
    image.onLoad(image => {
      subX = image.size.width - image.orginalSize.width ;
      subY = image.size.height - image.orginalSize.height ;
      
      width = image.size.width;
      height = image.size.height;
      bufferX = subX/width;
      bufferY = subY/height;
      // bufferX = subX/(width-(padding*countX));
      // bufferY = subY/(height-(padding*countX));
      fullSizeX = 1-bufferX;
      fullSizeY = 1-bufferY;
      paddingX = (padding)/image.orginalSize.width * fullSizeX;
      paddingY = (padding)/image.orginalSize.height;
      scaleX = (fullSizeX/countX)-(paddingX*(fullSizeX));
      scaleY = countY ? fullSizeY/countY*(1-paddingY*countY): scaleX;
      paddingAddX = (paddingX/(fullSizeX))
      paddingAddY = (paddingY)
    });
    return function(uvs, _i, start) {
      const _x = ~~(_i%countX);
      const _y = ~~(_i/countX);
      const PAD_X = 0;
      const HALF_PAD_X = PAD_X/2;
      const PAD_Y = 0;
      const HALF_PAD_Y = PAD_Y/2;
  
      const SIZE_X = scaleX ;
      const SIZE_Y = scaleY ;

      let ADD_PADDING_BACK_X = 0;//paddingX*(_x/countX);
      let ADD_PADDING_BACK_Y = paddingY*(_y/countY);
      // UV are % not pixel numbers
      // const UNIT_OF_PADDING_X = padding*_x;
      // const UNIT_OF_PADDING_Y = padding*_y;
      // if (padding != 0 && countX != 0) {
      //   ADD_PADDING_BACK_X = ;
      // }
      // if (padding != 0 && countY != 0) {
      //   ADD_PADDING_BACK_Y = (_y*padding)/height;
      // }
  
      let x = _x * SIZE_X + 0 + _x * paddingAddX;
      let y = -_y * SIZE_Y + 1 - SIZE_Y + ADD_PADDING_BACK_Y;
      
      const min_x = 0 + HALF_PAD_X + paddingAddX;
      const min_y = 0 + HALF_PAD_Y;
      const max_x = min_x + SIZE_X - PAD_X;
      const max_y = min_y + SIZE_Y - PAD_Y;
  
      const index = ~~(start*12) || 0;
      
      uvs[0+index] = min_x + x;
      uvs[1+index] = min_y + y;
      uvs[2+index] = max_x + x;
      uvs[3+index] = min_y + y;
      uvs[4+index] = max_x + x;
      uvs[5+index] = max_y + y;

      uvs[6+index] = max_x + x;
      uvs[7+index] = max_y + y;
      uvs[8+index] = min_x + x;
      uvs[9+index] = max_y + y;
      uvs[10+index] = min_x + x;
      uvs[11+index] = min_y + y;
    }
  }

  static OrginalUVScalerPadding(image, spriteWidth, spriteHeight, padding) {
    padding = padding || 0;
    let countX = 0;
    let countY = 0;
    let subX = 0;
    let subY = 0;
    let width = 1;
    let height = 1;
    let bufferX = subX/width;
    let bufferY = subX/width;
    let fullSizeX = 1-bufferX;
    let fullSizeY = 1-bufferX;
    let paddingX = 0;
    let paddingY = 0;
    let scaleX = fullSizeX/countX;
    let scaleY = countY ? fullSizeX/countY : scaleX;
    image.onLoad(image => {
      countX = (image.orginalSize.width+1) / (spriteWidth+padding);
      countY = (image.orginalSize.height+1) / (spriteHeight+padding);
      console.log(image, countX, countY);
      subX = image.size.width - image.orginalSize.width;
      subY = image.size.height - image.orginalSize.height;
      width = image.size.width;
      height = image.size.height;
      bufferX = subX/width;
      bufferY = subY/height;
      fullSizeX = 1-bufferX;
      fullSizeY = 1-bufferY;
      scaleX = spriteWidth/image.orginalSize.width*fullSizeX;
      scaleY = spriteHeight/image.orginalSize.height*fullSizeY;
      paddingX = (padding/spriteWidth)*scaleX;
      paddingY = (padding/spriteHeight)*scaleY;
    });
    return function(uvs, _i, start) {
      const _x = ~~(_i%countX);
      const _y = ~~(_i/countX);
      const PAD_X = paddingX/4;
      const HALF_PAD_X = PAD_X/2;
      const PAD_Y = paddingY/4;
      const HALF_PAD_Y = PAD_Y/2;
  
      const SIZE_X = scaleX ;
      const SIZE_Y = scaleY ;

      let ADD_PADDING_BACK_X =  _x * paddingX;
      let ADD_PADDING_BACK_Y =  _y * paddingY;
  
      let x = _x * SIZE_X + 0 + ADD_PADDING_BACK_X;
      let y = -_y * SIZE_Y + 1 - SIZE_Y - ADD_PADDING_BACK_Y;
      
      const min_x = 0 + HALF_PAD_X ;
      const min_y = 0 + HALF_PAD_Y;
      const max_x = min_x + SIZE_X - PAD_X;
      const max_y = min_y + SIZE_Y - PAD_Y;
  
      const index = ~~(start*12) || 0;
      
      uvs[0+index] = min_x + x;
      uvs[1+index] = min_y + y;
      uvs[2+index] = max_x + x;
      uvs[3+index] = min_y + y;
      uvs[4+index] = max_x + x;
      uvs[5+index] = max_y + y;

      uvs[6+index] = max_x + x;
      uvs[7+index] = max_y + y;
      uvs[8+index] = min_x + x;
      uvs[9+index] = max_y + y;
      uvs[10+index] = min_x + x;
      uvs[11+index] = min_y + y;
    }
  }
}

const defaultUV = TextureMap.UVScaler(1);

class BaseTexture {
  constructor() {
    this._loaded = false;
    this._texture = null;
    this._material = null;
    this._waiting = [];
    this._onLoad = [];
    this._onUpdated = [];
    this.uvSetter = defaultUV;
  }

  updateBuffer(buffer, pos, index) {
    if (index)
      this.index = index;
    pos = pos || 0;
    this.uvSetter(buffer.array, this.index, pos);
  }

  copyBuffer(buffer, pos) {
    buffer.copyAt(pos, this.uvBufferAtt, 0);
  }

  onLoad(promise) {
    if (this._loaded) {
      promise(this);
      return;
    }
    this._onLoad.push(promise);
  }

  onUpdate(promise) {
    // if (this._loaded) {
    //   promise(this);
    //   // return;
    // }
    this._onUpdated.push(promise);
  }

  updated() {
    this._onUpdated.forEach(promise => promise(this));
  }

  async _getMaterial() {
    return new Promise(resolve => {
      if (this._loaded)
        resolve(this._material);
      this._waiting.push(() => {
        resolve(this._material);
      })
    });
  }

  async getMaterial() {
    return await this._getMaterial();
  }
}

export class Texture extends BaseTexture {
  constructor(file) {
    super();
    this.file = file;
    this.load();
  }

  load() {
    const image = new ResizeImage(this.file, resizedImage => {
      this.size = resizedImage.size;
      this.orginalSize = resizedImage.orginalSize;
      const texture = loader.load(resizedImage.url(), () => {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestMipmapNearestFilter;
        
        // texture.anisotropy = 4;
        texture.needsUpdate = true;

        const material = new THREE.MeshBasicMaterial({
          map: texture,
          alphaTest: .15,
          transparent: true,
          opacity: 1,
          side : THREE.DoubleSide,
        });
        material.map.minFilter = THREE.NearestFilter;
        this._texture = texture;
        this._material = material;
        this._loaded = true;
        this._waiting.forEach(promise => promise());
        this._onLoad.forEach(promise => promise(this));
      });
      
    });
  }
}

export class CanvasTexture extends BaseTexture {
  constructor(size) {
    super();
    this.size = size;
    this.file = `${Math.random()}`;
    this.init();
  }

  init() {
    const canvas = document.createElement("CANVAS");
    const context = canvas.getContext("2d");//, {alpha: false}); 
    const size = this.newSize(this.size);
    canvas.height = size.height;
    canvas.width = size.width;
    this.canvas = canvas;
    this.context = context;
    const texture = new THREE.Texture(this.canvas);

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.NearestFilter;
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.anisotropy = 16;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      alphaTest: 0.5,
      // transparent: true,
      side : THREE.DoubleSide,
    });

    this._texture = texture;
    this._material = material;
    this._loaded = true;
    this._waiting.forEach(promise => promise());
    this._onLoad.forEach(promise => promise(this));
  }

  update() {
    this._texture.needsUpdate = true;
    this._onUpdated.forEach(promise => promise(this));
  }

  newSize(img) {
    const curHeight = img.height;
    const curWidth = img.width;
    this.orginalSize = {
      width: curWidth,
      height: curHeight,
    }
    let newHeight = 8;
    let newWidth = 8;
    while (newHeight < curHeight) {
      newHeight *= 2;
    }
    while (newWidth < curWidth) {
      newWidth *= 2;
    }
    this.size = {
      width: newWidth,
      height: newHeight,
    };
    return this.size;
  }

  url() {
    return this.canvas.toDataURL();
  }
}

export class SubTexture {
  constructor(texture, uvSetter, index ) {
    this.texture = texture;
    this.uvSetter = uvSetter;
    this.index = index;
    this.uvBufferAtt = null;
    this._onUpdate = [];
    texture.onLoad(() => {
      this._updated();
    });
    texture.onUpdate(() => {
      this._updated();
    });
  }

  _updated() {
    this._onUpdate.forEach(promise => promise());
  }

  onUpdate(promise) {
    this._onUpdate.push(promise);
  }

  updateBuffer(buffer, pos, index) {
    if (index)
      this.index = index;
    pos = pos || 0;
    this.uvSetter(buffer.array, this.index, pos);
  }

  copyBuffer(buffer, pos) {
    buffer.copyAt(pos, this.uvBufferAtt, 0);
  }
}

export class AnimationTexture {
  constructor(list) {
    this.list = list;
    this.MAX_TIME = this.getMaxTime();

    this.animation = true;
    this.lastCount = 0;
  }

  get texture() {
    return this.getTexture().texture;
  }

  needsUpdate() {
    return true;
    const currentAnimation = 0;
    for (let i=0;i<this.list.length;i++) {
      const actionTime = this.list[i].time || 0;
      currentAnimation = i;
      if (time < actionTime)
        break
    }
    return currentAnimation !== this.lastCount;
  }

  getMaxTime() {
    let count = 0;
    for (let i=0;i<this.list.length;i++) {
      count += this.list[i].time || 0;
    }
    return count;
  }

  getTexture() {
    let time = Date.now() % this.MAX_TIME;
    for (let i=0;i<this.list.length;i++) {
      const actionTime = this.list[i].time || 0;
      if (time < actionTime) {
        this.lastCount = i;
        return this.list[i].texture;
      }
      time -= actionTime;
    }
  }

  updateBuffer(buffer, pos, index) {
    this.getTexture().updateBuffer(buffer, pos, index);
  }
}

let _groupMeshHander = null;
export class GroupMeshHandler {
  constructor() {
    this.scene = null;
    this.meshes = {}
    this.allMeshes = [];
    this.children = [];
    this.parent = null;

    this.focus = null;
    this.opacity = 1;

    this.defaultZPosition = null;
  }
  
  reset() {
    console.log(this.children)
    this.allMeshes.forEach(mesh => mesh.reset());
    this.children.forEach(child => child.reset());
  }

  getScene() {
    if (this.scene)
      return this.scene;
    if (this.parent)
      return this.parent.getScene();
    return null;
  }

  static getRootHandler() {
    if (!_groupMeshHander) {
      _groupMeshHander = new GroupMeshHandler();
    }
    if (_groupMeshHander.focus) {
      return _groupMeshHander.focus;
    }
    return _groupMeshHander;
  }

  createChildHandler() {
    const handler = new GroupMeshHandler(); 
    handler.setOpacity(this.opacity);
    this.children.push(handler);
    handler.parent = this;
    return handler;
  }

  createSprite() {
    const handler = GroupMeshHandler.getRootHandler();
    const before = handler.focus;
    handler.focus = this;
    const sprite = new Sprite(...arguments);
    handler.focus = before;
    return sprite;
  }

  checkMeshes() {
    for(let i=0;i<this.allMeshes.length;i++) {
      this.allMeshes[i].update();
    }
    for(let i=0;i<this.children.length;i++) {
      this.children[i].checkMeshes();
    }
  }

  getMesh(texture) {
    const { file } = texture;
    if (!(file in this.meshes)) {
      const mesh = new GroupMesh(this, texture);
      this.allMeshes.push(mesh);
      this.meshes[file] = mesh;
    }
    return this.meshes[file];
  }

  setDefaultZ(z) {
    this.defaultZPosition = z;
  }

  setOpacity(opacity) {
    this.opacity = opacity;
  }
}

export class GroupMesh {
  constructor(handler, texture, maxsize) {
    this.texture = texture;
    this.opacity = 1;
    this.size = 0;
    this.handler = handler;
    this.maxsize = maxsize || 20;
    this.sprites = new Array(this.maxsize);
    this.geometry = new THREE.BufferGeometry();

    this.posBufferAtt = this._createPosBuffer();
    this.uvBufferAtt = this._createUVBuffer();

    this.geometry.setAttribute( 'position', this.posBufferAtt);
    this.geometry.setAttribute( 'uv', this.uvBufferAtt);

    this.geometry.computeVertexNormals();
    this.geometry.renderOrder = handler.defaultZPosition*100;
    this.geometry.depthTest = false;

    this.texture.getMaterial().then(material => {
      this.material = material;
      // remember about alphaTest
      this.material.opacity = handler.opacity;
      this.mesh = new THREE.Mesh( this.geometry, material );
      this.mesh.renderOrder = handler.defaultZPosition*100;
      material.depthTest = false;
      this.mesh.frustumCulled = false;
      if (this.handler) {
        const scene = this.handler.getScene();
        scene.add( this.mesh );
      }
    })
    
    this.updateNormals = false;
    this.updateUVs = false;
    this.updatePos = false;

    this._textures = [];
    this._sprites = [];
  }

  reset() {
    this.size = 0;
    this.updatePos = true;
    this.updateUVs = true;
    this.resized = true;
    this.update();
  }

  update() {
    // TODO improve?
    for (let i=0;i<this._textures.length;i++) {
      const texture = this._textures[i];
      if (texture.animation) 
        if (texture.needsUpdate()) {
          this.updateUVs = true;
          break;
        }
    }
    const updateUVs = this.updateUVs;
    const updatePos = this.updatePos;
    const resized = this.resized;
    const sprites = this.sprites;
    const uvBufferAtt = this.uvBufferAtt;
    const posBufferAttArray = this.posBufferAtt.array;
    if (updateUVs || updatePos) {
      const length = this.size;
      this.geometry.setDrawRange(0,length*6);
      for (let i=0;i<length;i++) {
        const sprite = sprites[i];
        if (sprite === undefined) continue;
        if (sprite === null) continue;
        if (!resized && !sprite.needsUpdate) continue;

        if (updateUVs)
          sprite.applyUV(uvBufferAtt);
        
        if (updatePos)
          sprite.applyVertices(posBufferAttArray);
        sprite.needsUpdate = false;
      }
      if (updateUVs)
        this.uvBufferAtt.needsUpdate = true;
      if (updatePos) {
        this.posBufferAtt.needsUpdate = true;
        // this.geometry.computeBoundingSphere();
      }
      this.updatePos = false;
      this.updateUVs = false;
      this.resized = false;
    }
    // if (this.updatePos) {
    //   this.updatePos = false;
    //   for (let i=0;i<this.sprites.length;i++) {
    //     const sprite = this.sprites[i];
    //     sprite.applyVertices(this.posBufferAtt.array);
    //   }
    // }
    if (this.updateNormals) {
      this.updateNormals = false;
      // this.geometry.computeVertexNormals();
    }
  }

  _createPosBuffer() {
    const vertices = new Float32Array( 18 * this.maxsize );
    const posBufferAtt = new THREE.BufferAttribute( vertices, 3 );
    posBufferAtt.setUsage(THREE.DynamicDrawUsage);
    return posBufferAtt;
  }

  _createUVBuffer() {
    const uvs = new Float32Array( 12 * this.maxsize );
    const uvBufferAtt = new THREE.BufferAttribute( uvs, 2 );
    uvBufferAtt.setUsage(THREE.DynamicDrawUsage);
    return uvBufferAtt;
  }

  _expandBuffers() {
    this.geometry.deleteAttribute( 'normal' );
    const uvs = new Float32Array( 12 * this.maxsize );
    const uvBufferAtt = new THREE.BufferAttribute( uvs, 2 );
    uvBufferAtt.setUsage(THREE.DynamicDrawUsage);
    uvBufferAtt.copyAt(0, this.uvBufferAtt, 0);
    delete this.uvBufferAtt;
    this.uvBufferAtt = uvBufferAtt;
    this.geometry.setAttribute( 'uv', this.uvBufferAtt);
    this.updatePos = true;

    const vertices = new Float32Array( 18 * this.maxsize );
    const posBufferAtt = new THREE.BufferAttribute( vertices, 3 );
    posBufferAtt.setUsage(THREE.DynamicDrawUsage);
    posBufferAtt.copyAt(0, this.posBufferAtt, 0);
    this.resized = true;
    
    this.posBufferAtt = posBufferAtt;
    this.geometry.setAttribute( 'position', this.posBufferAtt);
    this.updateUVs = true;
    const newNormals = new Float32Array( 18 * this.maxsize );
    // faster than calling computeVertexNormals
    for (let i=0;i<newNormals.length;i++) {
      if (i%3===2) 
        newNormals[i] = 1;
      else 
        newNormals[i] = 0;
    }
    this.geometry.setAttribute( 'normal', new THREE.BufferAttribute(newNormals, 3 ) );    
  }

  updateSpritePos(sprite) {
    // sprite.applyVertices(this.posBufferAtt.array);
    this.updatePos = true;
  }

  updateSpriteTexture(sprite) {
    // sprite.applyUV(this.uvBufferAtt.array);
    this.updateUVs = true;
  }

  addTexture(texture) {
    if (texture.animation)
      this._textures.push(texture);
  }

  remove(sprite) {
    const removePos = this.sprites.indexOf(sprite);
    // const removePos = this.sprites._link.pos;
    const lastPos = this.size - 1;
    if (lastPos < 0) return;
    this.sprites[lastPos].needsUpdate = true;
    this.sprites[removePos].needsUpdate = true;
    this.sprites[lastPos]._link.pos = this.sprites[removePos]._link.pos;
    this.sprites[removePos] = this.sprites[lastPos];
    this.size -= 1;
    this.updatePos = true;
    this.updateUVs = true;
  }

  addSprite(sprite) {
    const pos = this.size;
    if (this.maxsize <= pos) {
      this.maxsize = ~~(this.maxsize * 1.4) + 10;
      const newSprites = new Array(this.maxsize);
      this.sprites.forEach((e,i) => {
        newSprites[i] = e;
      });
      delete this.sprites;
      this.sprites = newSprites;
      this._expandBuffers();
    }
    this.sprites[pos] = sprite;
    this.size += 1;
    this.geometry.setDrawRange( 0, this.size*6 );
    sprite._link = {
      pos: pos,
      mesh: this,
      remove: () => {
        this.remove(sprite);
      },
    };
    this.updateSpriteTexture(sprite);
    this.updateSpritePos(sprite);
    // this.updateNormals = true;
  }


}

let id = 0;
class Sprite {

  constructor( texture, x, y, w, h ) {
    this._id = id++;
    const handle = GroupMeshHandler.getRootHandler();

    this._x = x || 0;
    this._y = y || 0;
    this._z = handle.defaultZPosition || 1;
    this._w = w || 1;
    this._h = h || 1;

    this._onPositionChange = [];

    this.needsUpdate = true;

    this.texture = null;
    this._link = null;
    this._removed = false;
    if (texture)
      this.setTexture(texture);

    texture.onUpdate(() => {
      this.needsUpdate = true;
      this._updateTexture();
      // console.log('test');
    });
  }

  _updateTexture() {
    if (this._link) {
      this.needsUpdate = true;
      this._link.mesh.updateSpriteTexture(this);
    }
  }
  
  remove() {
    if (this._removed) return;
    this._link.remove();
    this._removed = true;
    this.needsUpdate = true;
  }

  applyVertices(buffer) {
    const pos = this._link.pos || 0;
    const index = pos*18;
    const _x = this._x;
    const _y = this._y;
    const _z = this._z;
    const _w = this._w;
    const _h = this._h;

    buffer[index+0] = _x +  0;
    buffer[index+1] = _y +  0;
    buffer[index+2] = _z;

    buffer[index+3] =  _x + _w;
    buffer[index+4] = _y +  0;
    buffer[index+5] = _z;

    buffer[index+6] = _x + _w;
    buffer[index+7] = _y + _h;
    buffer[index+8] = _z;
    //
    buffer[index+9] = _x + _w;
    buffer[index+10] = _y + _h;
    buffer[index+11] = _z;

    buffer[index+12] = _x +  0;
    buffer[index+13] = _y + _h;
    buffer[index+14] = _z;

    buffer[index+15] = _x +  0;
    buffer[index+16] = _y +  0;
    buffer[index+17] = _z;
  }

  applyUV(buffer) {
    this.texture.updateBuffer(buffer, this._link.pos);
  }

  setTexture(texture) {
    this.texture = texture;
    if (this._link) {
      // TODO: Check to see texture has a different base texture.
      this._updateTexture();
      return;
    }
    // Setting texture for the first time.
    const handle = GroupMeshHandler.getRootHandler();
    // Ugg animation something here

    // TODO: Clean this up
    if (texture.texture) {
      texture = texture.texture
    }
    const mesh = handle.getMesh(texture);
    mesh.addTexture(this.texture);
    mesh.addSprite(this);
  }

  addPosition(x,y,z) {
    this._x += x;
    this._y += y;
    this._z += z;
    this._link.mesh.updateSpritePos(this);
    this.needsUpdate = true;
    this._onPositionChange.forEach(event => event(x, y));
  }

  updatePosition(x,y,z) {
    this._x = x;
    this._y = y;
    // if (z) this._z = z;
    this._link.mesh.updateSpritePos(this);
    this.needsUpdate = true;
    this._onPositionChange.forEach(event => event(x, y));
  }

  updateSize(w, h) {
    this._w = w || 1;
    this._h = h || 1;
    this._link.mesh.updateSpritePos(this);
    this.needsUpdate = true;
  }

  addOnPositionChange(event) {
    this._onPositionChange.push(event);
  }

  removeOnPositionChange(event) {
    const index = this._onPositionChange.indexOf(event);
		if (index < -1) return;
		this._onPositionChange.splice(index, 1); 
  }
}

class GroupSprite {

}

// module.exports =
// export  {
//   TextureMap,
//   Texture,
//   CanvasTexture,
//   SubTexture,
//   AnimationTexture,
//   GroupMeshHandler,
//   Sprite
// }