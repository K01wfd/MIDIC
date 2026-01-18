const tuningIndexes = {
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
    ASarp: { index: 3, portion: 2 },
    B: { index: 4, portion: 2 },
  },
  triton: { C: 1, CSharp: 2, D: 3, DSharp: 4, E: 5, F: 6, FSharp: 0, G: 1, GSharp: 2, A: 3, ASarp: 4, B: 5 },
  pa3x: { C: 2, CSharp: 3, D: 4, DSharp: 5, E: 6, F: 0, FSharp: 1, G: 2, GSharp: 3, A: 4, ASarp: 5, B: 6 },
};

const scalePreToIndexes = {
  zeroOne: {
    BC: { index1: 2, index2: 2, portions: 'both' },
    BCSharp: { index1: 3, index2: 3, portions: 'both' },
    BD: { index1: 4, index2: 4, portions: 'both' },
    BDSharp: { index1: 5, index2: 0, portions: 'first' },
    BE: { index1: 6, index2: 1, portions: 'first' },
    BF: { index1: 2, index2: 0, portions: 'both' },
    BFSharp: { index1: 3, index2: 1, portions: 'both' },
    BG: { index1: 4, index2: 2, portions: 'both' },
    BGSharp: { index1: 5, index2: 3, portions: 'both' },
    BA: { index1: 6, index2: 4, portions: 'both' },
    BASharp: { index1: 0, index2: 0, portions: 'both' },
    BB: { index1: 1, index2: 1, portions: 'both' },

    RC: { index1: 4, index2: 4, portions: 'both' },
    RD: { index1: 6, index2: 1, portions: 'first' },
    RE: { index1: 3, index2: 1, portions: 'both' },
    RF: { index1: 4, index2: 2, portions: 'both' },
    RG: { index1: 6, index2: 4, portions: 'both' },
    RA: { index1: 1, index2: 1, portions: 'both' },
    RB: { index1: 3, index2: 3, portions: 'both' },
  },
};

const synthsGlobal = {
  zeroOne: {
    original: [240, 66, 48, 43, 81, 0, 0, 0, 0, 0, 7, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 247],
    newGlobal: [],
  },
};
