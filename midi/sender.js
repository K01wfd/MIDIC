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
    sendScaleTunning(value, portionNum, key = '') {
      let keyIndex = switchKeyIndex(key, 'zeroOne');
      const dumpHeader = ZERO_ONE_MODF_GLOBAL.slice(0, 14);
      const dumpTail = ZERO_ONE_MODF_GLOBAL.slice(-1);

      if (portionNum === 1) {
        let newKeyIndex = null;
        if (sender.isTranspose && sender.whatTranspose === 'plus') newKeyIndex = keyIndex + sender.transValState;
        else newKeyIndex = keyIndex;
        if (newKeyIndex > keyIndex) newKeyIndex = keyIndex;

        ZERO_ONE_TUNNING.tunningTemp1[newKeyIndex] = value;
        ZERO_ONE_TUNNING.tunningReady1 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp1);
      } else if (portionNum === 2 && key === 'F#') {
        ZERO_ONE_TUNNING.tunningTemp1[keyIndex] = value;
        ZERO_ONE_TUNNING.tunningReady1 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp1);
      } else {
        ZERO_ONE_TUNNING.tunningTemp2[keyIndex] = value;
        ZERO_ONE_TUNNING.tunningReady2 = encode7bitTo8(ZERO_ONE_TUNNING.tunningTemp2);
      }

      const tunningBody = [...ZERO_ONE_TUNNING.tunningReady1, ...ZERO_ONE_TUNNING.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      ZERO_ONE_MODF_GLOBAL = combined;

      trMIDI.sendMessage(ZERO_ONE_MODF_GLOBAL);
    },

    sendZeroTunning() {
      resetTunningPortions();
      const dumpHeader = ZERO_ONE_MODF_GLOBAL.slice(0, 14);
      const dumpTail = ZERO_ONE_MODF_GLOBAL.slice(-1);
      const tunningBody = [...ZERO_ONE_TUNNING_DEFAULT.tunningReady1, ...ZERO_ONE_TUNNING_DEFAULT.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      ZERO_ONE_MODF_GLOBAL = combined;
      trMIDI.sendMessage(ZERO_ONE_MODF_GLOBAL);
    },

    sendScalePreset(scaleType) {
      ZERO_ONE_TUNNING = JSON.parse(JSON.stringify(ZERO_ONE_TUNNING_DEFAULT));
      const dumpHeader = ZERO_ONE_MODF_GLOBAL.slice(0, 14);
      const dumpTail = ZERO_ONE_MODF_GLOBAL.slice(-1);
      switch (scaleType) {
        case 'BC': {
          zeroOnePresetTunning(2, 2);
          break;
        }
        case 'BC#': {
          zeroOnePresetTunning(3, 3);
          break;
        }
        case 'BD': {
          zeroOnePresetTunning(4, 4);
          break;
        }
        case 'BD#': {
          zeroOnePresetTunning(5, 0, 'first');
          break;
        }
        case 'BE': {
          zeroOnePresetTunning(6, 1, 'first');
          break;
        }
        case 'BF': {
          zeroOnePresetTunning(2, 0);
          break;
        }
        case 'BF#': {
          zeroOnePresetTunning(3, 1);
          break;
        }

        case 'BG': {
          zeroOnePresetTunning(4, 2);
          break;
        }
        case 'BG#': {
          zeroOnePresetTunning(5, 3);
          break;
        }
        case 'BA': {
          zeroOnePresetTunning(6, 4);
          break;
        }
        case 'BA#': {
          zeroOnePresetTunning(0, 0);
          break;
        }
        case 'BB': {
          zeroOnePresetTunning(1, 1);
          break;
        }
        case 'RC': {
          zeroOnePresetTunning(4, 4);
          break;
        }
        case 'RD': {
          zeroOnePresetTunning(6, 1, 'first');
          break;
        }
        case 'RE': {
          zeroOnePresetTunning(3, 1);
          break;
        }
        case 'RF': {
          zeroOnePresetTunning(4, 2);
          break;
        }
        case 'RG': {
          zeroOnePresetTunning(6, 4);
          break;
        }
        case 'RA': {
          zeroOnePresetTunning(1, 1);
          break;
        }
        case 'RB': {
          zeroOnePresetTunning(3, 3);
          break;
        }
        default:
          return;
      }
      const tunningBody = [...ZERO_ONE_TUNNING.tunningReady1, ...ZERO_ONE_TUNNING.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      ZERO_ONE_MODF_GLOBAL = combined;
      trMIDI.sendMessage(ZERO_ONE_MODF_GLOBAL);
    },

    sendZeroTranspose() {
      updateZeroOneTransposeGlob(64);
      const dump = ZERO_ONE_MODF_GLOBAL;
      trMIDI.sendMessage(dump);
      sender.isTranspose = false;
      sender.whatTranspose = null;
      sender.transValState = 0;
    },

    sendTranspose(transposeValue) {
      sender.toggleTranspose(transposeValue);
      updateZeroOneTransposeGlob(transposeValue);
      const dump = ZERO_ONE_MODF_GLOBAL;
      trMIDI.sendMessage(dump);
    },

    resetGlobal() {
      ZERO_ONE_MODF_GLOBAL = JSON.parse(JSON.stringify(ZERO_ONE_GLOBAL));
      trMIDI.sendMessage(ZERO_ONE_MODF_GLOBAL);
    },
  },

  pa3x: {
    sendTranspose(transposeValue) {
      sender.toggleTranspose(transposeValue);
      PA3X_TRANSPOSE[6] = transposeValue;
      trMIDI.sendMessage(PA3X_TRANSPOSE);
    },

    sendZeroTranspose() {
      PA3X_TRANSPOSE[6] = 64;
      const msg = PA3X_TRANSPOSE;
      trMIDI.sendMessage(msg);
    },

    sendScaleTunning(index, value, portionNum, key = '') {
      let keyIndex = index;
      const dumpHeader = PA3X_TUNNING_BODY.slice(0, 6);
      const dumpTail = PA3X_TUNNING_BODY.slice(-1);

      switch (key) {
        case 'C': {
          keyIndex = 2;
          break;
        }
        case 'C#': {
          keyIndex = 3;
          break;
        }
        case 'D': {
          keyIndex = 4;
          break;
        }
        case 'D#': {
          keyIndex = 5;
          break;
        }
        case 'E': {
          keyIndex = 6;
          break;
        }
        case 'F': {
          keyIndex = 0;
          break;
        }
        case 'F#': {
          keyIndex = 1;
          break;
        }
        case 'G': {
          keyIndex = 2;
          break;
        }
        case 'G#': {
          keyIndex = 3;
          break;
        }
        case 'A': {
          keyIndex = 4;
          break;
        }
        case 'A#': {
          keyIndex = 5;
          break;
        }
        case 'B': {
          keyIndex = 6;
          break;
        }
        default: {
          break;
        }
      }
      if (portionNum === 1 && key !== 'F') {
        PA3X_TUNNING.tunningTemp1[keyIndex] = value;
        PA3X_TUNNING.tunningReady1 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp1);
      } else if (portionNum === 1 && key === 'F') {
        PA3X_TUNNING.tunningTemp2[keyIndex] = value;
        PA3X_TUNNING.tunningReady2 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp2);
      } else {
        PA3X_TUNNING.tunningTemp2[keyIndex] = value;
        PA3X_TUNNING.tunningReady2 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp2);
      }
      PA3X_TUNNING.tunningReady1[1] = 125;
      const tunningBody = [...PA3X_TUNNING.tunningReady1, ...PA3X_TUNNING.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      PA3X_TUNNING_BODY = combined;
      trMIDI.sendMessage(PA3X_TUNNING_BODY);
    },

    sendZeroTunning() {
      resetTunningPortions();
      trMIDI.sendMessage(PA3X_TUNNING_BODY);
    },

    sendScalePreset(scaleType, tunningValue = -50) {
      PA3X_TUNNING = JSON.parse(JSON.stringify(PA3X_TUNNING_DEFAULT));
      const dumpHeader = PA3X_TUNNING_BODY.slice(0, 6);
      const dumpTail = PA3X_TUNNING_BODY.slice(-1);

      switch (scaleType) {
        case 'BC': {
          PA3X_TUNNING.tunningTemp1[4] = tunningValue;
          PA3X_TUNNING.tunningReady1 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp1);
          PA3X_TUNNING.tunningReady1[1] = 125;

          PA3X_TUNNING.tunningTemp2[4] = tunningValue;
          PA3X_TUNNING.tunningReady2 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp2);
          break;
        }
        case 'BD': {
          PA3X_TUNNING.tunningTemp1[6] = tunningValue;
          PA3X_TUNNING.tunningReady1 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp1);
          PA3X_TUNNING.tunningReady1[1] = 125;

          PA3X_TUNNING.tunningTemp2[6] = tunningValue;
          PA3X_TUNNING.tunningReady2 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp2);
          break;
        }
        case 'BG': {
          PA3X_TUNNING.tunningTemp1[6] = tunningValue;
          PA3X_TUNNING.tunningReady1 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp1);
          PA3X_TUNNING.tunningReady1[1] = 125;

          PA3X_TUNNING.tunningTemp2[4] = tunningValue;
          PA3X_TUNNING.tunningReady2 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp2);
          break;
        }
        case 'BA': {
          PA3X_TUNNING.tunningReady1 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp1);
          PA3X_TUNNING.tunningReady1[1] = 125;

          PA3X_TUNNING.tunningTemp2[1] = tunningValue;
          PA3X_TUNNING.tunningTemp2[6] = tunningValue;
          PA3X_TUNNING.tunningReady2 = encode7bitTo8PA3X(PA3X_TUNNING.tunningTemp2);
          break;
        }
        default:
          return;
      }
      const tunningBody = [...PA3X_TUNNING.tunningReady1, ...PA3X_TUNNING.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      PA3X_TUNNING_BODY = combined;
      trMIDI.sendMessage(PA3X_TUNNING_BODY);
    },

    resetGlobal() {
      this.sendZeroTranspose();
      setTimeout(() => this.sendZeroTunning(), 50);
    },
  },
};
