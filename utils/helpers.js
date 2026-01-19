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
