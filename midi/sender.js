const sender = {
  tritonExtreme: {
    sendScaleTunning(value, key) {
      const keyDetails = modelsKeysDetails['tritonExtreme'][key];

      const sevenBitTuning = tritonExtremeBrain.get7bitsTuningParts();
      sevenBitTuning[keyDetails.portion][keyDetails.index] = value;

      tritonExtremeBrain.encodeTuningAndUpdate(sevenBitTuning);

      trMIDI.sendMessage(tritonExtremeBrain.getNewGlobal());
    },

    resetTuning() {
      tritonExtremeBrain.resetTuning();
    },

    sendZeroTunning() {
      tritonExtremeBrain.resetTuning();
      trMIDI.sendMessage(tritonExtremeBrain.getNewGlobal());
    },

    sendTranspose(transposeValue) {
      tritonExtremeBrain.encodeTransposeAndUpdate(transposeValue);
      trMIDI.sendMessage(tritonExtremeBrain.getNewGlobal());
    },

    sendZeroTranspose() {
      tritonExtremeBrain.resetTranspose();
      trMIDI.sendMessage(tritonExtremeBrain.getNewGlobal());
    },

    sendScalePreset(scaleType) {
      const presetData = scalePreToIndexes['zeroOne'][scaleType];
      const sevBitTuningParts = tritonExtremeBrain.get7bitsTuningParts();
      tritonExtremeBrain.encodePresetsAndUpdate(presetData, sevBitTuningParts);
      trMIDI.sendMessage(tritonExtremeBrain.getNewGlobal());
    },

    resetGlobal() {
      tritonExtremeBrain.resetGlobal();
      trMIDI.sendMessage(tritonExtremeBrain.getNewGlobal());
    },
  },

  zeroOne: {
    sendScaleTunning(value, key) {
      const keyDetails = modelsKeysDetails['zeroOne'][key];

      const sevenBitTuning = zeroOneBrain.get7bitsTuningParts();
      sevenBitTuning[keyDetails.portion][keyDetails.index] = value;

      zeroOneBrain.encodeTuningAndUpdate(sevenBitTuning);

      trMIDI.sendMessage(zeroOneBrain.getNewGlobal());
    },

    resetTuning() {
      zeroOneBrain.resetTuning();
    },

    sendZeroTunning() {
      zeroOneBrain.resetTuning();

      trMIDI.sendMessage(zeroOneBrain.getNewGlobal());
    },

    sendTranspose(transposeValue) {
      zeroOneBrain.encodeTransposeAndUpdate(transposeValue);
      trMIDI.sendMessage(zeroOneBrain.getNewGlobal());
    },

    sendZeroTranspose() {
      zeroOneBrain.resetTranspose();
      trMIDI.sendMessage(zeroOneBrain.getNewGlobal());
    },

    sendScalePreset(scaleType, scaleName) {
      const presetData = modelsScalesPresets['zeroOne'][scaleType][scaleName];
      const sevBitTuningParts = zeroOneBrain.get7bitsTuningParts();
      zeroOneBrain.encodePresetsAndUpdate(presetData, sevBitTuningParts);
      trMIDI.sendMessage(zeroOneBrain.getNewGlobal());
    },

    resetGlobal() {
      zeroOneBrain.resetGlobal();
      trMIDI.sendMessage(zeroOneBrain.getNewGlobal());
    },
  },

  pax: {
    sendScaleTunning(value, key) {
      const keyDetails = modelsKeysDetails['pax'][key];

      const sevenBitTuning = pa3xBrain.get7bitsTuningParts();
      sevenBitTuning[keyDetails.portion][keyDetails.index] = value;

      pa3xBrain.encodeTuningAndUpdate(sevenBitTuning);

      trMIDI.sendMessage(pa3xBrain.getNewGlobal());
    },

    resetTuning() {
      pa3xBrain.resetTuning();
    },

    sendZeroTunning() {
      pa3xBrain.resetTuning();
      trMIDI.sendMessage(pa3xBrain.getNewGlobal());
    },

    sendTranspose(transposeValue) {
      pa3xBrain.encodeTransposeAndUpdate(transposeValue);
      trMIDI.sendMessage(pa3xBrain.getNewTranspose());
    },

    sendZeroTranspose() {
      pa3xBrain.resetTranspose();
      trMIDI.sendMessage(pa3xBrain.getNewTranspose());
    },

    sendScalePreset(scaleType, scaleName) {
      const presetData = modelsScalesPresets['pax'][scaleType][scaleName];
      const sevBitTuningParts = pa3xBrain.get7bitsTuningParts();
      pa3xBrain.encodePresetsAndUpdate(presetData, sevBitTuningParts);

      trMIDI.sendMessage(pa3xBrain.getNewGlobal());
    },

    resetGlobal() {
      pa3xBrain.resetGlobal();
      trMIDI.sendMessage(pa3xBrain.getNewTranspose());
      setTimeout(() => trMIDI.sendMessage(pa3xBrain.getNewGlobal()), 75);
    },
  },
};
