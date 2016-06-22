function Random(seed) {
    this.chance = new Chance(seed);
}

Random.prototype.next = function() {
    return this.chance.random();
}
