const modelsKeysDetails = {
  zeroOne: {
    C: { index: 0, portion: 1 },
    CSharp: { index: 1, portion: 1 },
    D: { index: 2, portion: 1 },
    DSharp: { index: 3, portion: 1 },
    E: { index: 4, portion: 1 },
    F: { index: 5, portion: 1 },
    FSharp: { index: 6, portion: 1 },
    G: { index: 0, portion: 2 },
    GSharp: { index: 1, portion: 2 },
    A: { index: 2, portion: 2 },
    ASharp: { index: 3, portion: 2 },
    B: { index: 4, portion: 2 },
  },

  tritonExtreme: {
    C: { index: 1, portion: 1 },
    CSharp: { index: 2, portion: 1 },
    D: { index: 3, portion: 1 },
    DSharp: { index: 4, portion: 1 },
    E: { index: 5, portion: 1 },
    F: { index: 6, portion: 1 },
    FSharp: { index: 0, portion: 2 },
    G: { index: 1, portion: 2 },
    GSharp: { index: 2, portion: 2 },
    A: { index: 3, portion: 2 },
    ASharp: { index: 4, portion: 2 },
    B: { index: 5, portion: 2 },
  },

  pax: {
    C: { index: 2, portion: 1 },
    CSharp: { index: 3, portion: 1 },
    D: { index: 4, portion: 1 },
    DSharp: { index: 5, portion: 1 },
    E: { index: 6, portion: 1 },
    F: { index: 0, portion: 2 },
    FSharp: { index: 1, portion: 2 },
    G: { index: 2, portion: 2 },
    GSharp: { index: 3, portion: 2 },
    A: { index: 4, portion: 2 },
    ASharp: { index: 5, portion: 2 },
    B: { index: 6, portion: 2 },
  },
};

const bayatKeys = {
  BC: { key1: 'D', key2: 'A' },
  BCSharp: { key1: 'DSharp', key2: 'ASharp' },
  BD: { key1: 'E', key2: 'B' },
  BDSharp: { key1: 'F', key2: 'C' },
  BE: { key1: 'FSharp', key2: 'CSharp' },
  BF: { key1: 'G', key2: 'D' },
  BFSharp: { key1: 'GSharp', key2: 'DSharp' },
  BG: { key1: 'A', key2: 'E' },
  BGSharp: { key1: 'ASharp', key2: 'F' },
  BA: { key1: 'B', key2: 'FSharp' },
  BASharp: { key1: 'C', key2: 'G' },
  BB: { key1: 'CSharp', key2: 'GSharp' },
};

const rastKeys = {
  RC: bayatKeys.BD,
  RD: bayatKeys.BE,
  RE: bayatKeys.BFSharp,
  RF: bayatKeys.BG,
  RG: bayatKeys.BA,
  RA: bayatKeys.BB,
  RB: bayatKeys.BCSharp,
};

const modelsScalesPresets = {
  zeroOne: {
    bayat: generateModelPresets(bayatKeys, 'zeroOne'),
    rast: generateModelPresets(rastKeys, 'zeroOne'),
  },
  pax: {
    bayat: generateModelPresets(bayatKeys, 'pax'),
    rast: generateModelPresets(rastKeys, 'pax'),
  },
  tritonExtreme: {
    bayat: generateModelPresets(bayatKeys, 'tritonExtreme'),
    rast: generateModelPresets(rastKeys, 'tritonExtreme'),
  },
};

function getPresetKeysInfos(scaleKeys, synth) {
  const portionsArr = [];
  let index1 = 0;
  let index2 = 0;
  const currIndex1 = modelsKeysDetails[synth][scaleKeys.key1].index;
  const portion1 = modelsKeysDetails[synth][scaleKeys.key1].portion;
  portionsArr.push(portion1);

  const currIndex2 = modelsKeysDetails[synth][scaleKeys.key2].index;
  const portion2 = modelsKeysDetails[synth][scaleKeys.key2].portion;
  portionsArr.push(portion2);

  const portions =
    portionsArr[0] + portionsArr[1] === 2 ? 'first' : portionsArr[0] + portionsArr[1] === 4 ? 'second' : 'both';

  index1 = currIndex1;
  index2 = currIndex2;
  if (portionsArr[0] === 2) {
    index1 = currIndex2;
    index2 = currIndex1;
  }
  return { index1, index2, portions };
}

function generateModelPresets(scaleKeysData, model) {
  const data = {};
  Object.entries(scaleKeysData).forEach(([key, val]) => {
    const keysData = val;

    const presetData = getPresetKeysInfos(keysData, model);
    const combined = { ...presetData };
    data[key] = combined;
  });
  return data;
}

// --------------------------------------------------------------------------------------------------------------
const synthsGlobals = {
  zeroOne: [240, 66, 48, 43, 81, 0, 0, 0, 0, 0, 7, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 247],
  tritonExtreme: [
    240, 66, 48, 80, 81, 1, 0, 0, 0, 3, 3, 28, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 75, 0, 101, 121, 98, 111, 97, 114, 100, 0, 32, 32,
    32, 32, 32, 32, 32, 0, 32, 79, 114, 103, 97, 110, 32, 0, 32, 32, 32, 32, 32, 32, 32, 0, 32, 32, 32, 66, 101, 108, 108, 0,
    47, 77, 97, 108, 108, 101, 116, 0, 32, 32, 32, 32, 32, 83, 116, 0, 114, 105, 110, 103, 115, 32, 32, 0, 32, 32, 32, 32,
    32, 32, 32, 0, 86, 111, 99, 97, 108, 47, 65, 0, 105, 114, 121, 32, 32, 32, 32, 0, 32, 32, 66, 114, 97, 115, 115, 0, 32,
    32, 32, 32, 32, 32, 32, 0, 32, 32, 32, 32, 87, 111, 111, 0, 100, 119, 105, 110, 100, 47, 82, 0, 101, 101, 100, 32, 32,
    32, 71, 0, 117, 105, 116, 97, 114, 47, 80, 0, 108, 117, 99, 107, 101, 100, 32, 0, 32, 66, 97, 115, 115, 32, 32, 0, 32,
    32, 32, 32, 32, 32, 32, 0, 32, 32, 32, 83, 108, 111, 119, 0, 83, 121, 110, 116, 104, 32, 32, 0, 32, 32, 32, 32, 32, 70,
    97, 0, 115, 116, 83, 121, 110, 116, 104, 0, 32, 32, 32, 32, 32, 32, 32, 0, 76, 101, 97, 100, 83, 121, 110, 0, 116, 104,
    32, 32, 32, 32, 32, 0, 32, 32, 77, 111, 116, 105, 111, 0, 110, 83, 121, 110, 116, 104, 32, 0, 32, 32, 32, 32, 83, 69, 32,
    0, 32, 32, 32, 32, 32, 32, 32, 0, 32, 32, 32, 32, 32, 32, 72, 0, 105, 116, 47, 65, 114, 112, 103, 0, 32, 32, 32, 32, 32,
    32, 32, 0, 32, 68, 114, 117, 109, 115, 32, 0, 32, 32, 32, 32, 32, 32, 32, 0, 32, 32, 32, 75, 101, 121, 98, 0, 111, 97,
    114, 100, 32, 32, 32, 0, 32, 32, 32, 32, 32, 79, 114, 0, 103, 97, 110, 32, 32, 32, 32, 0, 32, 32, 32, 32, 32, 32, 32, 0,
    66, 101, 108, 108, 47, 77, 97, 0, 108, 108, 101, 116, 47, 80, 101, 0, 114, 99, 83, 116, 114, 105, 110, 0, 103, 115, 32,
    32, 32, 32, 32, 0, 32, 32, 32, 32, 66, 114, 97, 0, 115, 115, 82, 101, 101, 100, 32, 0, 32, 32, 32, 32, 32, 32, 79, 0,
    114, 99, 104, 101, 115, 116, 114, 0, 97, 108, 32, 32, 32, 32, 32, 0, 32, 87, 111, 114, 108, 100, 32, 0, 32, 32, 32, 32,
    32, 32, 32, 0, 32, 32, 32, 71, 117, 105, 116, 0, 97, 114, 47, 80, 108, 117, 99, 0, 107, 101, 100, 32, 32, 80, 97, 0, 100,
    115, 32, 32, 32, 32, 32, 0, 32, 32, 32, 32, 32, 32, 32, 0, 77, 111, 116, 105, 111, 110, 32, 0, 83, 121, 110, 116, 104,
    32, 32, 0, 32, 32, 83, 121, 110, 116, 104, 0, 32, 32, 32, 32, 32, 32, 32, 0, 32, 32, 32, 32, 76, 101, 97, 0, 100, 83,
    112, 108, 105, 116, 115, 0, 32, 32, 32, 32, 32, 32, 66, 0, 97, 115, 115, 83, 112, 108, 105, 0, 116, 115, 32, 32, 32, 32,
    32, 0, 32, 67, 111, 109, 112, 108, 101, 0, 120, 32, 38, 32, 83, 69, 32, 0, 32, 32, 32, 82, 104, 121, 116, 0, 104, 109,
    105, 99, 32, 80, 97, 0, 116, 116, 101, 114, 110, 68, 115, 0, 47, 72, 105, 116, 115, 32, 32, 0, 32, 32, 32, 32, 32, 32,
    32, 0, 127, 0, 0, 0, 0, 127, 127, 0, 0, 0, 0, 127, 0, 0, 0, 0, 12, 127, 127, 0, 0, 12, 127, 0, 0, 0, 0, 12, 127, 127, 0,
    0, 0, 12, 247,
  ],
  pax: [240, 66, 127, 96, 1, 1, 0, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 247],
};

const modelsStaticData = {
  pax: {
    supported: true,
    modelId: 'pax',
    global: [240, 66, 127, 96, 1, 1, 0, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 247],
    transpose: [240, 127, 127, 4, 4, 0, 64, 247],
    extractTuningIndexes: [6, -1],
    updateTuningIndexes: [0, 6, -1],
    extractTransposeIndexes: [],
    updateTransposeIndexs: [],
    transposeValueIndex: 6,
    isSeperateTranspose: true,
  },
  tritonExtreme: {
    supported: true,
    modelId: 'tritonExtreme',
    global: synthsGlobals.tritonExtreme,
    transpose: [0, 0, 0, 3, 3, 28, 0, 7],
    extractTuningIndexes: [14, 30],
    updateTuningIndexes: [0, 14, 30],
    extractTransposeIndexes: [6, 14],
    updateTransposeIndexs: [0, 6, 14],
    transposeValueIndex: 1,
    isSeperateTranspose: false,
  },
  zeroOne: {
    supported: true,
    modelId: 'zeroOne',
    global: synthsGlobals.zeroOne,
    transpose: [0, 0, 0, 0, 7, 7, 4, 0],
    extractTuningIndexes: [14, -1],
    updateTuningIndexes: [0, 14, -1],
    extractTransposeIndexes: [6, 14],
    updateTransposeIndexs: [0, 6, 14],
    transposeValueIndex: 1,
    isSeperateTranspose: false,
  },
};
