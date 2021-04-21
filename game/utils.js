
export const createCooldown = (timeout) => {
  let curTime = 0;
  return {
    updateTimeout: newTimeout => {
      timeout = newTimeout;
    },
    reset: () => {
      curTime = Date.now();
    },
    check: () => {
      return curTime+timeout >= Date.now();
    }
  }
}

export const loopXbyX = (startX, startY, width, height, promise) => {
  for(let x=0;x<width;x++) {
    for(let y=0;y<height;y++) {
      const newX = startX+x;
      const newY = startY+y;
      promise(newX, newY);
    }
  }
}