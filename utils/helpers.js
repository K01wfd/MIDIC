function encode7bitTo8(values) {
  if (values.length !== 7) {
    throw new Error('Block must contain exactly 7 values');
  }

  let flag = 0;
  const data = [];

  values.forEach((val, i) => {
    if (val < 0) {
      flag |= 1 << i; // set bit i for negative value
      data.push((128 + val) & 0x7f); // e.g. -1 → 127, -2 → 126
    } else {
      data.push(val & 0x7f); // positive or zero
    }
  });

  return [flag, ...data];
}

function encode7bitTo8PA3X(values) {
  if (values.length !== 7) {
    throw new Error('Block must contain exactly 7 values');
  }

  let flag = 0;
  const data = [];

  for (let i = 0; i < values.length; i++) {
    if (values[values.length - 1 - i] < 0) {
      flag |= 1 << i; // set bit i for negative value
      data.push((128 + values[i]) & 0x7f); // e.g. -1 → 127, -2 → 126
    } else {
      data.push(values[i] & 0x7f); // positive or zero
    }
  }
  return [flag, ...data];
}
function toHex7bit(value) {
  // Wrap into 7-bit range (0–127)
  const byte = (value + 128) % 128;
  return byte.toString(16).toUpperCase().padStart(2, '0x');
}

function resetTunningPortions() {
  TRITON_TUNNING = JSON.parse(JSON.stringify(TRITON_TUNNING_DEFAULT));
  ZERO_ONE_TUNNING = JSON.parse(JSON.stringify(ZERO_ONE_TUNNING_DEFAULT));
  PA3X_TUNNING = JSON.parse(JSON.stringify(PA3X_TUNNING_DEFAULT));
  PA3X_TUNNING_BODY = PA3X_TUNNING_BODY_DEFAULT;
}
function updateTritonTransposeGlob(transposeValue) {
  // Update the global
  const dumpHeader = TRITON_MODF_GLOB.slice(0, 6);
  const dumpTail = TRITON_MODF_GLOB.slice(14);
  TRITON_TRANSPOSE_PORTION_TEMP[1] = transposeValue - 64;
  TRITON_TRANSPOSE_PORTION = encode7bitTo8(TRITON_TRANSPOSE_PORTION_TEMP);
  TRITON_MODF_GLOB = [...dumpHeader, ...TRITON_TRANSPOSE_PORTION, ...dumpTail];
}

function updateZeroOneTransposeGlob(transposeValue) {
  const dumpHeader = ZERO_ONE_MODF_GLOBAL.slice(0, 6);
  const dumpTail = ZERO_ONE_MODF_GLOBAL.slice(14);

  ZERO_ONE_TRANSPOSE_TEMP[1] = transposeValue - 64;
  ZERO_ONE_TRANSPOSE = encode7bitTo8(ZERO_ONE_TRANSPOSE_TEMP);
  ZERO_ONE_MODF_GLOBAL = [...dumpHeader, ...ZERO_ONE_TRANSPOSE, ...dumpTail];
}

function zeroOnePresetTunning(keyIndex1, keyIndex2, portions = '') {
  if (portions === 'first') {
    ZERO_ONE_TUNNING.tunningTemp1[keyIndex1] = -50;
    ZERO_ONE_TUNNING.tunningReady1 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp1);
    ZERO_ONE_TUNNING.tunningTemp1[keyIndex2] = -50;
    ZERO_ONE_TUNNING.tunningReady1 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp1);
  } else if (portions === 'second') {
    ZERO_ONE_TUNNING.tunningTemp2[keyIndex1] = -50;
    ZERO_ONE_TUNNING.tunningReady2 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp2);
    ZERO_ONE_TUNNING.tunningTemp2[keyIndex2] = -50;
    ZERO_ONE_TUNNING.tunningReady2 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp2);
  } else {
    ZERO_ONE_TUNNING.tunningTemp1[keyIndex1] = -50;
    ZERO_ONE_TUNNING.tunningReady1 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp1);
    ZERO_ONE_TUNNING.tunningTemp2[keyIndex2] = -50;
    ZERO_ONE_TUNNING.tunningReady2 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp2);
  }
}
