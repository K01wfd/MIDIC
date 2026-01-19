const sender = {
  isTranspose: false,
  whatTranspose: null,
  transValState: 0,

  toggleTranspose: function (transposeValue) {
    if (transposeValue > 64) sender.whatTranspose = 'plus';
    else if (transposeValue === 64) sender.whatTranspose = null;
    else sender.whatTranspose = 'minus';
    sender.transValState = transposeValue - 64;
    if (sender.transValState !== 0) sender.isTranspose = true;
    else sender.isTranspose = false;
  },

  triton: {
    sendScaleTunning: function (index, value, portionNum) {
      const dumpHeader = TRITON_MODF_GLOB.slice(0, 14);
      const dumpTail = TRITON_MODF_GLOB.slice(30);
      if (portionNum === 1) {
        TRITON_TUNNING.tunningTemp1[index] = value;
        TRITON_TUNNING.tunningReady1 = encode7bitTo8(TRITON_TUNNING.tunningTemp1);
      } else {
        TRITON_TUNNING.tunningTemp2[index] = value;
        TRITON_TUNNING.tunningReady2 = encode7bitTo8(TRITON_TUNNING.tunningTemp2);
      }

      const tunningBody = [...TRITON_TUNNING.tunningReady1, ...TRITON_TUNNING.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      TRITON_MODF_GLOB = combined;
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },

    sendZeroTunning: function () {
      resetTunningPortions();
      const dumpHeader = TRITON_MODF_GLOB.slice(0, 14);
      const dumpTail = TRITON_MODF_GLOB.slice(30);
      const tunningBody = [...TRITON_TUNNING_DEFAULT.tunningReady1, ...TRITON_TUNNING_DEFAULT.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      TRITON_MODF_GLOB = combined;
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },

    sendScalePreset: function (scaleType, tunningValue) {
      resetTunningPortions();
      const dumpHeader = TRITON_MODF_GLOB.slice(0, 14);
      const dumpTail = TRITON_MODF_GLOB.slice(30);
      switch (scaleType) {
        case 'BC': {
          TRITON_TUNNING.tunningTemp1[3] = tunningValue;
          TRITON_TUNNING.tunningReady1 = encode7bitTo8(TRITON_TUNNING.tunningTemp1);
          TRITON_TUNNING.tunningTemp2[3] = tunningValue;
          TRITON_TUNNING.tunningReady2 = encode7bitTo8(TRITON_TUNNING.tunningTemp2);
          break;
        }
        case 'BD': {
          TRITON_TUNNING.tunningTemp1[5] = tunningValue;
          TRITON_TUNNING.tunningReady1 = encode7bitTo8(TRITON_TUNNING.tunningTemp1);
          TRITON_TUNNING.tunningTemp2[5] = tunningValue;
          TRITON_TUNNING.tunningReady2 = encode7bitTo8(TRITON_TUNNING.tunningTemp2);
          break;
        }
        case 'BG': {
          TRITON_TUNNING.tunningTemp1[5] = tunningValue;
          TRITON_TUNNING.tunningReady1 = encode7bitTo8(TRITON_TUNNING.tunningTemp1);
          TRITON_TUNNING.tunningTemp2[3] = tunningValue;
          TRITON_TUNNING.tunningReady2 = encode7bitTo8(TRITON_TUNNING.tunningTemp2);
          break;
        }
        case 'BA': {
          TRITON_TUNNING.tunningTemp2[0] = tunningValue;
          TRITON_TUNNING.tunningReady2 = encode7bitTo8(TRITON_TUNNING.tunningTemp2);
          TRITON_TUNNING.tunningTemp2[5] = tunningValue;
          TRITON_TUNNING.tunningReady2 = encode7bitTo8(TRITON_TUNNING.tunningTemp2);
          break;
        }
        default:
          return;
      }

      const tunningBody = [...TRITON_TUNNING.tunningReady1, ...TRITON_TUNNING.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      TRITON_MODF_GLOB = combined;
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },

    sendTranspose: function (transposeValue) {
      const convertedValue = '0x' + toHex7bit(transposeValue);
      const msg = [0xf0, 0x7f, 0x00, 0x04, 0x04, 0x00, convertedValue, 0xf7];
      trMIDI.sendMessage(msg);
      updateTritonTransposeGlob(transposeValue);
    },

    sendZeroTranspose() {
      updateTritonTransposeGlob(64);
      const convertedValue = '0x' + toHex7bit(64);
      const msg = [0xf0, 0x7f, 0x00, 0x04, 0x04, 0x00, convertedValue, 0xf7];
      trMIDI.sendMessage(msg);
    },

    resetGlobal: function () {
      this.sendZeroTranspose();
      setTimeout(() => this.sendZeroTunning(), 50);
    },
  },

  zeroOne: {
    sendScaleTunning(value, key) {
      const keyDetails = tuningIndexes['zeroOne'][key];

      const sevenBitTuning = zeroOneState.get7bitsTuningParts();
      sevenBitTuning[keyDetails.portion][keyDetails.index] = value;

      zeroOneState.encodeTuningAndUpdate(sevenBitTuning);

      trMIDI.sendMessage(zeroOneState.getNewGlobal());
    },

    resetTunning() {
      pa3xState.resetTunningParts();
    },

    sendZeroTunning() {
      zeroOneState.resetTunningParts();
      trMIDI.sendMessage(zeroOneState.getNewGlobal());
    },

    sendTranspose(transposeValue) {
      zeroOneState.encodeTransposeAndUpdate(transposeValue);
      trMIDI.sendMessage(zeroOneState.getNewGlobal());
    },

    sendZeroTranspose() {
      zeroOneState.resetTranspose();
      trMIDI.sendMessage(zeroOneState.getNewGlobal());
    },

    sendScalePreset(scaleType) {
      const presetData = scalePreToIndexes['zeroOne'][scaleType];
      const sevBitTuningParts = zeroOneState.get7bitsTuningParts();
      zeroOneState.encodePresetsAndUpdate(presetData, sevBitTuningParts);
      console.log(zeroOneState.getNewGlobal());
      trMIDI.sendMessage(zeroOneState.getNewGlobal());
    },

    resetGlobal() {
      zeroOneState.resetGlobal();
      trMIDI.sendMessage(zeroOneState.getNewGlobal());
    },
  },

  pa3x: {
    sendScaleTunning(value, key) {
      const keyDetails = tuningIndexes['pa3x'][key];

      const sevenBitTuning = pa3xState.get7bitsTuningParts();
      sevenBitTuning[keyDetails.portion][keyDetails.index] = value;

      pa3xState.encodeTuningAndUpdate(sevenBitTuning);

      trMIDI.sendMessage(pa3xState.getNewGlobal());
    },

    resetTunning() {
      pa3xState.resetTunningParts();
    },

    sendZeroTunning() {
      pa3xState.resetTunningParts();
      trMIDI.sendMessage(pa3xState.getNewGlobal());
    },

    sendTranspose(transposeValue) {
      pa3xState.encodeTransposeAndUpdate(transposeValue);
      trMIDI.sendMessage(pa3xState.getNewTranspose());
    },

    sendZeroTranspose() {
      pa3xState.resetTranspose();
      trMIDI.sendMessage(pa3xState.getNewTranspose());
    },

    sendScalePreset(scaleType) {
      const presetData = scalePreToIndexes['pa3x'][scaleType];
      const sevBitTuningParts = pa3xState.get7bitsTuningParts();
      pa3xState.encodePresetsAndUpdate(presetData, sevBitTuningParts);

      trMIDI.sendMessage(pa3xState.getNewGlobal());
    },

    resetGlobal() {
      pa3xState.resetGlobal();
      trMIDI.sendMessage(pa3xState.getNewTranspose());
      setTimeout(() => trMIDI.sendMessage(pa3xState.getNewGlobal()), 75);
    },
  },
};
