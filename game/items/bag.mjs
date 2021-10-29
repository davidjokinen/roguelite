
class Bag {
  constructor(json) {
    this.items = [];
  }
}

const createBag = (json) => {
  return new Bag(json);
};

module.exports = {
  createBag,
};