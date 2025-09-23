export function encode7bitTo8(values: number[]) {
  if (values.length !== 7) {
    throw new Error('Block must contain exactly 7 values');
  }

  let flag = 0;
  const data: number[] = [];

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

export function toHex7bit(value: number) {
  // Wrap into 7-bit range (0–127)
  const byte = (value + 128) % 128;
  return byte.toString(16).toUpperCase().padStart(2, '0x');
}

export function updateGlobal(global: number[], source: number[]) {
  global = [...source];
}
