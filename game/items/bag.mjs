
export class Bag {
  constructor(json) {
    this.items = [];
  }
}

export const createBag = (json) => {
  return new Bag(json);
};
