

export const checkIfNotNextToTarget = (self, target) => {
  const difX = Math.abs(self.x-target.x);
  const difY = Math.abs(self.y-target.y);
  return difX > 1 || difY > 1;
};