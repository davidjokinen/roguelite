export const createCooldown = (timeout) => {
  let curTime = 0;
  return {
    updateTimeout: newTimeout => {
      timeout = newTimeout;
    },
    reset: () => {
      curTime = GameTime.now();
    },
    check: () => {
      return curTime+timeout >= GameTime.now();
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

export const getRandomInt = (max) => {
  return ~~(max*Math.random());
}

export function createEventlistener() {
  const list = [];
  return {
    add: newEvent => {
      list.push(newEvent);
    },
    trigger: function () {
      for (let i=0; i<list.length; i++) {
        list[i](...arguments);
      }
    },
    remove: removeEvent => {
      const index = list.indexOf(removeEvent);
      if (index < -1) return;
      list.splice(index, 1);
    },
  }
}