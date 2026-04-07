'use strict';

const { KaTikaStateMachine } = require('./ka-tika/KaTikaStateMachine');

module.exports = {
  KaTikaStateMachine,
};

if (require.main === module) {
  const machine = new KaTikaStateMachine();
  const sample = machine.resolve('2026-08-10 12:00');
  console.log(JSON.stringify(sample, null, 2));
}
