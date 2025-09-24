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

function toHex7bit(value) {
  // Wrap into 7-bit range (0–127)
  const byte = (value + 128) % 128;
  return byte.toString(16).toUpperCase().padStart(2, '0x');
}

function updateArray(global, source) {
  global = [...source];
}

// TODO: to cpmplete transpose for zero one start here

function updateTritonTransposeGlob(transposeValue) {
  const dumpHeader = TRITON_MODF_GLOB.slice(0, 6);
  const dumpTail = TRITON_MODF_GLOB.slice(14);
  TRITON_TRANSPOSE_PORTION_TEMP[1] = transposeValue;
  const encodedTranspose = encode7bitTo8(TRITON_TRANSPOSE_PORTION_TEMP);
  updateArray(TRITON_TRANSPOSE_PORTION, encodedTranspose);

  const combined = [...dumpHeader, ...TRITON_TRANSPOSE_PORTION, ...dumpTail];
  updateArray(TRITON_MODF_GLOB, combined);
}
function updateZeroOneTransposeGlob(transposeValue) {
  const dumpHeader = ZERO_ONE_MODF_GLOBAL.slice(0, 6);
  const dumpTail = ZERO_ONE_MODF_GLOBAL.slice(14);
  ZERO_ONE_TRANSPOSE_TEMP[1] = transposeValue;
  const encodedTranspose = encode7bitTo8(ZERO_ONE_TRANSPOSE_TEMP);
  updateArray(ZERO_ONE_TRANSPOSE, encodedTranspose);

  const combined = [...dumpHeader, ...ZERO_ONE_TRANSPOSE, ...dumpTail];
  updateArray(ZERO_ONE_MODF_GLOBAL, combined);
}
