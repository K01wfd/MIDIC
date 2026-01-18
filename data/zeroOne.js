// let ZERO_ONE_TUNNING = {
//   tunningTemp1: [0, 0, 0, 0, 0, 0, 0],
//   tunningReady1: [0, 0, 0, 0, 0, 0, 0, 0],
//   tunningTemp2: [0, 0, 0, 0, 0, 3, 3],
//   tunningReady2: [0, 0, 0, 0, 0, 0, 3, 3],
// };

// const ZERO_ONE_TUNNING_DEFAULT = {
//   tunningTemp1: [0, 0, 0, 0, 0, 0, 0],
//   tunningReady1: [0, 0, 0, 0, 0, 0, 0, 0],
//   tunningTemp2: [0, 0, 0, 0, 0, 3, 3],
//   tunningReady2: [0, 0, 0, 0, 0, 0, 3, 3],
// };

let ZERO_ONE_TRANSPOSE_TEMP = [0, 0, 0, 7, 7, 4, 0];
let ZERO_ONE_TRANSPOSE = [0, 0, 0, 0, 7, 7, 4, 0];

let zOneOriginalGlobal = [
  240, 66, 48, 43, 81, 0, 0, 0, 0, 0, 7, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 247,
];

let zOneNewGlobal = [240, 66, 48, 43, 81, 0, 0, 0, 0, 0, 7, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 247];

function getTuningPortion(synth) {
  let tuningPortion = [];
  if (synth === 'zeroOne') {
    tuningPortion = synthsGlobal[synth].slice(14, -1);
  }
  return tuningPortion;
}

function devidePortions() {}
const zOneData = {
  portions: {},
};
