'use strict';

const { floorDiv, mod } = require('../utils');

class SasihModule {
  constructor({ sasihNames }) {
    this.sasihNames = sasihNames;
    this.siklusDinaPerSasih = 27; // 3 fase utama, masing-masing dipisahkan 8 dina
  }

  compute(dinaDelta) {
    const sasihDelta = floorDiv(dinaDelta, this.siklusDinaPerSasih);
    const namaSasih = this.sasihNames[mod(sasihDelta, this.sasihNames.length)];
    const dinaDalamSasih = mod(dinaDelta, this.siklusDinaPerSasih) + 1;
    const polaAktif = mod(sasihDelta, 2) === 0 ? 'Pola A' : 'Pola B';

    let faseUtama = 'Transisi 8 Dina';
    if (polaAktif === 'Pola A') {
      if (dinaDalamSasih === 1 || dinaDalamSasih === 19) faseUtama = 'Tilem';
      else if (dinaDalamSasih === 10) faseUtama = 'Purnama';
    } else {
      if (dinaDalamSasih === 1 || dinaDalamSasih === 19) faseUtama = 'Purnama';
      else if (dinaDalamSasih === 10) faseUtama = 'Tilem';
    }

    return {
      namaSasih,
      polaAktif,
      step: `Dina-${dinaDalamSasih}`,
      faseUtama,
    };
  }
}

module.exports = {
  SasihModule,
};
