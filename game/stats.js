
class Stats {
  constructor(json) {
    this.level = 1;

    this.health = 10;

    this.defense = 1;

    this.attack = 2;
  }
}


const createStats = (json) => {
  return new Stats(json);
};

module.exports = {
  createStats,
};