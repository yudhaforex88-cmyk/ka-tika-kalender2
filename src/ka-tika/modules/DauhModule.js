'use strict';

const { mod } = require('../utils');

class DauhModule {
  compute(tick) {
    return {
      tick,
      nilai: mod(tick, 3) + 1,
    };
  }
}

module.exports = {
  DauhModule,
};
