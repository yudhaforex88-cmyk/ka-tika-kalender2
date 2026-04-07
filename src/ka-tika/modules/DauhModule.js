'use strict';

const { WITA_OFFSET_MINUTES } = require('../constants');
const { mod } = require('../utils');

class DauhModule {
  constructor({ anchor }) {
    this.anchor = anchor;
    this.anchorDaySerial = Date.UTC(anchor.year, anchor.month - 1, anchor.day) / 86400000;
  }

  toWitaParts(utcMs) {
    const shifted = new Date(utcMs + WITA_OFFSET_MINUTES * 60 * 1000);
    return {
      year: shifted.getUTCFullYear(),
      month: shifted.getUTCMonth() + 1,
      day: shifted.getUTCDate(),
      hour: shifted.getUTCHours(),
      minute: shifted.getUTCMinutes(),
      second: shifted.getUTCSeconds(),
    };
  }

  computeTick(requestUtcMs) {
    const wita = this.toWitaParts(requestUtcMs);
    const daySerial = Date.UTC(wita.year, wita.month - 1, wita.day) / 86400000;
    const dayDelta = daySerial - this.anchorDaySerial;
    const minuteOfDay = wita.hour * 60 + wita.minute + wita.second / 60;

    if (minuteOfDay >= 18 * 60) return (2 * dayDelta);      // Sandikala
    if (minuteOfDay >= 5 * 60 + 30) return (2 * dayDelta) - 1; // Galang Kangin
    return (2 * dayDelta) - 2; // sebelum Galang Kangin -> event terakhir Sandikala hari sebelumnya
  }

  compute(requestUtcMs) {
    const tick = this.computeTick(requestUtcMs);
    return {
      tick,
      nilai: mod(tick, 3) + 1,
    };
  }
}

module.exports = {
  DauhModule,
};
