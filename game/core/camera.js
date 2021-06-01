export function enableCameraMovement(camera, mouse) {
  const click = {x:0,y:0,down:false,startTime:0};
  const onClickDown = mouse.addOnClickDown((e) => {
    // console.log(e)
    if(e.button==2){
      document.body.style.cursor = "move";
      click.x = e.pageX;
      click.y = e.pageY;
      click.startTime = Date.now();
      click.down = true
    }
  });
  const onClickUp = mouse.addOnClickUp((e) => {
    if(e.button==2){
      document.body.style.cursor = "auto";
      click.down = false
    }
  });
  const onMove = mouse.addOnMove((e) => {
    // console.log(e)
    if(!click.down)return;
    const scale = 400*1/(camera.position.z);//camera.camera.scale;
    // console.log(camera.position)
    let x = 0.0+ camera.position.x- (e.pageX - click.x)/scale;
    let y = 0.0 +camera.position.y+ (e.pageY - click.y)/scale;
    let z = camera.position.z;
    camera.position.set(x, y, z);
    // console.log(x, y)
    click.x = e.pageX;
    click.y = e.pageY;
  });
  // return;
  const onZoom = mouse.addOnZoom((e) => {
    const SCREEN_WIDTH = window.innerWidth;
    const SCREEN_HEIGHT = window.innerHeight;
    let scale = camera.position.z;
    // console.log(scsale+1);
    // if(scale+((e.wheelDelta)/1800.0)>=.14&&scale+((e.wheelDelta)/1800.0)<20) {
      const oldScale = scale + 0;
      scale -= (e.wheelDelta)/10.0;
      if (scale < -1) scale = -1;
      // scale = camera.camera.scale;
      const oldX = camera.position.x;
      const oldY = camera.position.y;
      const posX = (mouse.x);
      const posY = (mouse.y);
      const addX = (posX*(1-scale/oldScale));
      const addY = (posY*(1-scale/oldScale));
      // console.log(posX, addX, addY, scale, oldScale)
      let x = camera.position.x //+ addX;
      // x -= (oldX* (1-scale/oldScale));
      let y = camera.position.y //+addY;
      // y -= (oldY* (1-scale/oldScale));
      camera.position.set(x, y, scale);
    // }
  });
}