class SynthBrain {
  synth = '';
  defaultGlobal = [];
  newGlobal = [];

  sevenBitTuning = [];
  eightBitTuning = [];
  sevenBitTranspose = [];
  eightBitTranspose = [];

  extractTuningIndexes = [];
  updateTuningIndexes = [];

  defaultTranspose = [];
  newTranspose = [];
  extractTransposeIndexes = [];
  updateTransposeIndexes = [];
  isSeperateTranspose = false;
  transposeValIndex = 0;
  transposeValue = 0;
  whatTranspose = '0';

  constructor(staticData) {
    this.synth = staticData.modelId;
    this.defaultGlobal = staticData.global;
    this.newGlobal = staticData.global;
    this.defaultTranspose = staticData.transpose;
    this.newTranspose = staticData.transpose;
    this.extractTuningIndexes = staticData.extractTuningIndexes;
    this.updateTuningIndexes = staticData.updateTuningIndexes;
    this.extractTransposeIndexes = staticData.extractTransposeIndexes;
    this.updateTransposeIndexes = staticData.updateTransposeIndexs;
    this.transposeValIndex = staticData.transposeValueIndex;
    this.isSeperateTranspose = staticData.isSeperateTranspose;

    this.#initiateTuningParts();
    this.#initiateTransposeParts();
  }

  #initiateTuningParts() {
    const tuningChunk = this.defaultGlobal.slice(this.extractTuningIndexes[0], this.extractTuningIndexes[1]);

    this.eightBitTuning = [...tuningChunk.slice(0, 8), ...tuningChunk.slice(8)];

    this.sevenBitTuning = [...tuningChunk.slice(1, 8), ...tuningChunk.slice(9)];
  }

  #initiateTransposeParts() {
    this.eightBitTranspose = [...this.defaultTranspose.slice(0, 8)];
    this.sevenBitTranspose = [...this.defaultTranspose.slice(1, 8)];
  }

  // -------------------------

  resetTuning() {
    this.#initiateTuningParts();
    this.#updateTuningGlobal();
  }

  resetTranspose() {
    this.#initiateTransposeParts();
    this.#updateTransposeGlobal();
    this.transposeValue = 0;
    this.#updateTransposeState();
  }

  resetAll() {
    this.#initiateTuningParts();
    this.#initiateTransposeParts();
    this.#updateTuningGlobal();
    this.#updateTransposeGlobal();
    this.transposeValue = 0;
    this.#updateTransposeState();
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

  getModelId() {
    return this.synth;
  }

  #getHeadAndTail(updateIndexes) {
    const index1 = updateIndexes[0];
    const index2 = updateIndexes[1];
    const index3 = updateIndexes[2];
    const head = this.newGlobal.slice(index1, index2);
    const tail = this.newGlobal.slice(index3);
    return { head, tail };
  }

  // -----------------------
  #updateTuningGlobal() {
    const { head, tail } = this.#getHeadAndTail(this.updateTuningIndexes);

    this.newGlobal = [...head, ...this.eightBitTuning, ...tail];
  }

  #updateTransposeGlobal() {
    if (!this.isSeperateTranspose) {
      const { head, tail } = this.#getHeadAndTail(this.updateTransposeIndexes);
      this.newTranspose = [...this.eightBitTranspose];
      this.newGlobal = [...head, ...this.eightBitTranspose, ...tail];
    } else {
      this.newTranspose = [...this.eightBitTranspose];
    }
    this.#updateTransposeState();
  }

  #updateTransposeState() {
    if (this.transposeValue > 0) {
      this.whatTranspose = '1';
    } else if (this.transposeValue < 0) {
      this.whatTranspose = '-1';
    } else {
      this.whatTranspose = '0';
    }
  }

  // ----------------------
  encodeTuningAndUpdate(sevBitTuningParts) {
    const portion1 = sevBitTuningParts['1'];
    const portion2 = sevBitTuningParts['2'];

    let encodedPortion1 = encode7bitTo8(portion1);
    let encodedPortion2 = encode7bitTo8(portion2);

    if (this.synth.startsWith('pa')) {
      encodedPortion1 = encode7bitTo8PA3X(portion1);
      encodedPortion2 = encode7bitTo8PA3X(portion2);
      encodedPortion1[1] = 125;
    }

    this.sevenBitTuning = [...portion1, ...portion2];
    this.eightBitTuning = [...encodedPortion1, ...encodedPortion2];

    this.#updateTuningGlobal();
  }

  encodeTransposeAndUpdate(transposeValue) {
    // here we need to make sure all models with seperate transpose accept not encoded data
    this.transposeValue = transposeValue;
    if (this.isSeperateTranspose) {
      this.eightBitTranspose[this.transposeValIndex] = transposeValue;
    } else {
      this.sevenBitTranspose[this.transposeValIndex] = transposeValue - 64;
      const encodedTranspose = encode7bitTo8(this.sevenBitTranspose);
      this.eightBitTranspose = [...encodedTranspose];
    }
    this.transposeValue = transposeValue - 64;
    this.#updateTransposeGlobal();
  }

  encodePresetsAndUpdate(presetData, sevBitTuningParts) {
    const index1 = presetData.index1;
    const index2 = presetData.index2;

    const portions = presetData.portions;

    const portion1 = sevBitTuningParts['1'];
    const portion2 = sevBitTuningParts['2'];

    let encodedPortion1 = [];
    let encodedPortion2 = [];

    // if the preset is inside portion 1
    if (portions === 'first') {
      portion1[index1] = -50;
      portion1[index2] = -50;
      encodedPortion1 = encode7bitTo8(portion1);
      encodedPortion2 = encode7bitTo8(portion2);
      // if the preset is inside portion 2
    } else if (portions === 'second') {
      portion2[index1] = -50;
      portion2[index2] = -50;
      encodedPortion1 = encode7bitTo8(portion1);
      encodedPortion2 = encode7bitTo8(portion2);
      // if the preset is inside both portions
    } else {
      portion1[index1] = -50;
      portion2[index2] = -50;
      encodedPortion1 = encode7bitTo8(portion1);
      encodedPortion2 = encode7bitTo8(portion2);
    }

    if (this.synth.startsWith('pa')) {
      encodedPortion1 = encode7bitTo8PA3X(portion1);
      encodedPortion2 = encode7bitTo8PA3X(portion2);
      encodedPortion1[1] = 125;
    }
    this.eightBitTuning = [...encodedPortion1, ...encodedPortion2];
    this.#updateTuningGlobal();
  }
}

const tritonExtremeBrain = new SynthBrain(modelsStaticData.tritonExtreme);

const zeroOneBrain = new SynthBrain(modelsStaticData.zeroOne);

// if transpose Data not provided, empty obj, and transpose array provided, extract from array

const pa3xBrain = new SynthBrain(modelsStaticData.pax);
