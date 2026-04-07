'use strict';

const { floorDiv, mod } = require('../utils');

class WukuModule {
  constructor({ wukuNames }) {
    this.wukuNames = wukuNames;
  }

  compute(dinaDelta) {
    const wukuIndex = mod(floorDiv(dinaDelta, 7), 30);
    return this.wukuNames[wukuIndex];
  }
}

module.exports = {
  WukuModule,
};
