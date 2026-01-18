class SynthState {
  defaultGlobal = [];
  newGlobal = [];
  synth = null;

  sevenBitTuning = [];
  eightBitTuning = [];
  sevenBitTranspose = [];
  eightBitTranspose = [];

  tuningPartsIndexes = [];
  tuningPartsMrgIndexes = [];

  defaultTranspose = [];
  newTranspose = [];
  indexInTransposePart = null;
  transposeMrgIndexes = [];
  transposeValue = 0;
  whatTranspose = '0';
  constructor(
    synth,
    global,
    eightBitTuningPartIndexes,
    tuningPartsMrgIndexes,
    transposePart,
    indexInTransposePart,
    transposeMrgIndexes = [],
  ) {
    this.defaultGlobal = global;
    this.newGlobal = global;

    this.synth = synth;

    this.tuningPartsIndexes = eightBitTuningPartIndexes;
    this.tuningPartsMrgIndexes = tuningPartsMrgIndexes;

    this.defaultTranspose = transposePart;
    this.newTranspose = transposePart;
    this.transposeMrgIndexes = transposeMrgIndexes;
    this.indexInTransposePart = indexInTransposePart;

    this.#initiateTuningParts();
    this.#initiateTransposeParts();
  }

  #initiateTuningParts() {
    const tuningChunk = this.defaultGlobal.slice(this.tuningPartsIndexes[0], this.tuningPartsIndexes[1]);
    this.eightBitTuning = [...tuningChunk.slice(0, 8), ...tuningChunk.slice(8)];
    this.sevenBitTuning = [...tuningChunk.slice(1, 8), ...tuningChunk.slice(9)];
  }

  #initiateTransposeParts() {
    this.eightBitTranspose = [...this.defaultTranspose.slice(0, 8)];
    this.sevenBitTranspose = [...this.defaultTranspose.slice(1, 8)];
  }

  // -------------------------

  resetTunningParts() {
    this.#initiateTuningParts();
    this.updateTuningGlobal();
  }

  resetTranspose() {
    this.#initiateTransposeParts();
    this.transposeValue = 0;
    this.updateTransposeState();
  }

  resetGlobal() {
    this.#initiateTuningParts();
    this.#initiateTransposeParts();
    this.updateTuningGlobal();
  }

  // -----------------------
  getNewGlobal() {
    return this.newGlobal;
  }

  getOriginalGlobal() {
    return this.defaultGlobal;
  }

  getNewTranspose() {
    return this.newTranspose;
  }

  get7bitsTuningParts() {
    return { 1: this.sevenBitTuning.slice(0, 7), 2: this.sevenBitTuning.slice(7) };
  }

  get7bitTransposePart() {
    return this.sevenBitTranspose;
  }

  // -----------------------
  updateTuningGlobal() {
    const head = this.newGlobal.slice(this.tuningPartsMrgIndexes[0][0], this.tuningPartsMrgIndexes[0][1]);
    const tail = this.newGlobal.slice(this.tuningPartsMrgIndexes[1]);
    this.newGlobal = [...head, ...this.eightBitTuning, ...tail];
  }

  updateTransposeGlobal() {
    if (this.transposeMrgIndexes.length > 0) {
      const head = this.newGlobal.slice(this.transposeMrgIndexes[0][0], this.transposeMrgIndexes[0][1]);
      const tail = this.newGlobal.slice(this.transposeMrgIndexes[1]);
      this.newGlobal = [...head, ...this.eightBitTranspose, ...tail];
    } else {
      this.newTranspose = [...this.eightBitTranspose];
    }
    this.updateTransposeState();
  }

  // ----------------------
  encodeTuningAndUpdate(sevBitTuningParts) {
    const portion1 = sevBitTuningParts['1'];
    const portion2 = sevBitTuningParts['2'];

    this.sevenBitTuning = [...portion1, ...portion2];

    const encodedPortion1 = encode7bitTo8(portion1);
    const encodedPortion2 = encode7bitTo8(portion2);
    this.eightBitTuning = [...encodedPortion1, ...encodedPortion2];

    this.updateTuningGlobal();
  }

  encodeTransposeAndUpdate(transposeValue) {
    this.sevenBitTranspose[this.indexInTransposePart] = transposeValue - 64;
    this.transposeValue = transposeValue;
    const encodedTranspose = encode7bitTo8(this.sevenBitTranspose);
    this.eightBitTranspose = [...encodedTranspose];
    this.updateTransposeGlobal();
  }

  updateTransposeState() {
    if (this.transposeValue > 0) {
      this.whatTranspose = '1';
    } else if (this.transposeValue < 1) {
      this.whatTranspose = '-1';
    } else {
      this.whatTranspose = '0';
    }
  }
}

const zeroOneState = new SynthState(
  'zeroOne',
  [240, 66, 48, 43, 81, 0, 0, 0, 0, 0, 7, 7, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 247],
  [14, -1],
  [[0, 14], -1],
  [0, 0, 0, 0, 7, 7, 4, 0],
  1,
  [[0, 6], 14],
);

// if transpose Data not provided, empty obj, and transpose array provided, extract from array

const pa3xState = new SynthState(
  'pa3x',
  [240, 66, 127, 96, 1, 1, 0, 125, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 247],
  [6, -1],
  [[0, 6], -1],
  [240, 127, 127, 4, 4, 0, 64, 247],
  [],
);
