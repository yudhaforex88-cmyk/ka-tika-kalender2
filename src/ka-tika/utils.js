'use strict';

const { WITA_OFFSET_MINUTES } = require('./constants');

function floorDiv(a, b) {
  return Math.floor(a / b);
}

function mod(a, m) {
  return ((a % m) + m) % m;
}

function witaComponentsToUtcMs({ year, month, day, hour, minute = 0, second = 0 }) {
  const utcMs = Date.UTC(year, month - 1, day, hour, minute, second);
  return utcMs - WITA_OFFSET_MINUTES * 60 * 1000;
}

function parseInputToUtcMs(input) {
  if (input instanceof Date) return input.getTime();
  if (typeof input === 'number') return input;

  if (typeof input !== 'string') {
    throw new TypeError('Input waktu harus string, number(epoch ms), atau Date.');
  }

  const normalized = input.trim().replace('T', ' ');
  const m = normalized.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!m) {
    throw new Error('Format waktu tidak valid. Gunakan "YYYY-MM-DD HH:mm".');
  }

  const [, y, mo, d, h, mi, s = '0'] = m;
  return witaComponentsToUtcMs({
    year: Number(y),
    month: Number(mo),
    day: Number(d),
    hour: Number(h),
    minute: Number(mi),
    second: Number(s),
  });
}

function cycleName(list, delta) {
  return list[mod(delta, list.length)];
}

module.exports = {
  floorDiv,
  mod,
  witaComponentsToUtcMs,
  parseInputToUtcMs,
  cycleName,
};
