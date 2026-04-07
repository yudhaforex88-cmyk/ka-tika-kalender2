'use strict';

const { floorDiv, mod } = require('../utils');

class SasihModule {
  constructor({ sasihNames }) {
    this.sasihNames = sasihNames;
  }

  compute(dinaDelta) {
    const sasihDelta = floorDiv(dinaDelta, 30);
    const namaSasih = this.sasihNames[mod(sasihDelta, this.sasihNames.length)];
    const dinaDalamSasih = mod(dinaDelta, 30) + 1;
    const polaAktif = mod(sasihDelta, 2) === 0 ? 'Pola A' : 'Pola B';

    let faseSasih = 'Dina Biasa';
    if (polaAktif === 'Pola A') {
      if (dinaDalamSasih === 1 || dinaDalamSasih === 20) faseSasih = 'Tilem';
      else if (dinaDalamSasih === 10 || dinaDalamSasih === 30) faseSasih = 'Purnama';
    } else {
      if (dinaDalamSasih === 1 || dinaDalamSasih === 20) faseSasih = 'Purnama';
      else if (dinaDalamSasih === 10 || dinaDalamSasih === 30) faseSasih = 'Tilem';
    }

    return {
      namaSasih,
      faseSasih,
      polaAktif,
      step: `Dina-${dinaDalamSasih}`,
    };
  }
}

module.exports = {
  SasihModule,
};
