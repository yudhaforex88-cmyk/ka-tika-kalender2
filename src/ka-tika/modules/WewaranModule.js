'use strict';

const { cycleName } = require('../utils');

class WewaranModule {
  constructor({ names }) {
    this.names = names;
  }

  compute(dinaDelta) {
    return {
      ekaWara: cycleName(this.names.ekaWara, dinaDelta),
      dwiWara: cycleName(this.names.dwiWara, dinaDelta),
      triWara: cycleName(this.names.triWaraCustom, dinaDelta),
      caturWara: cycleName(this.names.caturWara, dinaDelta),
      pancaWara: cycleName(this.names.pancaWaraCustom, dinaDelta),
      sadWara: cycleName(this.names.sadWara, dinaDelta),
      saptaWara: cycleName(this.names.saptaWara, dinaDelta),
      astaWara: cycleName(this.names.astaWara, dinaDelta),
      sangaWara: cycleName(this.names.sangaWara, dinaDelta),
      dasaWara: cycleName(this.names.dasaWara, dinaDelta),
    };
  }
}

module.exports = {
  WewaranModule,
};
