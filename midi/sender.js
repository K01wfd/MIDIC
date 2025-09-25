const sender = {
  triton: {
    requestGlobalDump: function () {
      const msg = ZERO_ONE_MESSAGES['globalRequest'];
      if (msg) trMIDI.sendMessage(msg);
    },
    sendScaleTunning: function (index, value, portionNum) {
      const dumpHeader = TRITON_MODF_GLOB.slice(0, 14);
      const dumpTail = TRITON_MODF_GLOB.slice(30);
      if (portionNum === 1) {
        TRITON_MESSAGES.tunningTemp1[index] = value;
        TRITON_MESSAGES.tunningReady1 = encode7bitTo8(TRITON_MESSAGES.tunningTemp1);
      } else {
        TRITON_MESSAGES.tunningTemp2[index] = value;
        TRITON_MESSAGES.tunningReady2 = encode7bitTo8(TRITON_MESSAGES.tunningTemp2);
      }

      const tunningBody = [...TRITON_MESSAGES.tunningReady1, ...TRITON_MESSAGES.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      TRITON_MODF_GLOB = combined;
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },
    sendZeroTunning: function () {
      const dumpHeader = TRITON_MODF_GLOB.slice(0, 14);
      const dumpTail = TRITON_MODF_GLOB.slice(30);
      const tunningBody = [...TRITON_TUNNING_DEFAULT.tunningReady1, ...TRITON_TUNNING_DEFAULT.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      TRITON_MODF_GLOB = combined;
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },
    sendScalePreset: function (scaleType, tunningValue) {
      TRITON_MESSAGES = JSON.parse(JSON.stringify(TRITON_TUNNING_DEFAULT));
      const dumpHeader = TRITON_MODF_GLOB.slice(0, 14);
      const dumpTail = TRITON_MODF_GLOB.slice(30);
      switch (scaleType) {
        case 'BC': {
          TRITON_MESSAGES.tunningTemp1[3] = tunningValue;
          TRITON_MESSAGES.tunningReady1 = encode7bitTo8(TRITON_MESSAGES.tunningTemp1);
          TRITON_MESSAGES.tunningTemp2[3] = tunningValue;
          TRITON_MESSAGES.tunningReady2 = encode7bitTo8(TRITON_MESSAGES.tunningTemp2);
          break;
        }
        case 'BD': {
          TRITON_MESSAGES.tunningTemp1[5] = tunningValue;
          TRITON_MESSAGES.tunningReady1 = encode7bitTo8(TRITON_MESSAGES.tunningTemp1);
          TRITON_MESSAGES.tunningTemp2[5] = tunningValue;
          TRITON_MESSAGES.tunningReady2 = encode7bitTo8(TRITON_MESSAGES.tunningTemp2);
          break;
        }
        case 'BG': {
          TRITON_MESSAGES.tunningTemp1[5] = tunningValue;
          TRITON_MESSAGES.tunningReady1 = encode7bitTo8(TRITON_MESSAGES.tunningTemp1);
          TRITON_MESSAGES.tunningTemp2[3] = tunningValue;
          TRITON_MESSAGES.tunningReady2 = encode7bitTo8(TRITON_MESSAGES.tunningTemp2);
          break;
        }
        case 'BA': {
          TRITON_MESSAGES.tunningTemp2[0] = tunningValue;
          TRITON_MESSAGES.tunningReady2 = encode7bitTo8(TRITON_MESSAGES.tunningTemp2);
          TRITON_MESSAGES.tunningTemp2[5] = tunningValue;
          TRITON_MESSAGES.tunningReady2 = encode7bitTo8(TRITON_MESSAGES.tunningTemp2);
          break;
        }
        default:
          return;
      }

      const tunningBody = [...TRITON_MESSAGES.tunningReady1, ...TRITON_MESSAGES.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      TRITON_MODF_GLOB = combined;
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },
    sendTranspose: function (transposeValue) {
      const convertedValue = '0x' + toHex7bit(transposeValue);
      const msg = [0xf0, 0x7f, 0x00, 0x04, 0x04, 0x00, convertedValue, 0xf7];
      trMIDI.sendMessage(msg);
      updateTritonTransposeGlob(transposeValue - 64);
    },
    sendZeroTranspose() {
      const convertedValue = '0x' + toHex7bit(64);
      const msg = [0xf0, 0x7f, 0x00, 0x04, 0x04, 0x00, convertedValue, 0xf7];
      trMIDI.sendMessage(msg);
      updateTritonTransposeGlob(0);
    },
    resetGlobal: function () {
      trMIDI.sendMessage(TRITON_DEF_GLOB);
    },
  },
  zeroOne: {
    requestGlobalDump() {},
    sendScaleTunning(index, value, portionNum, key = '') {
      let keyIndex = index;
      switch (key) {
        case 'C': {
          keyIndex = 0;
          break;
        }
        case 'C#': {
          keyIndex = 1;
          break;
        }
        case 'D': {
          keyIndex = 2;
          break;
        }
        case 'D#': {
          keyIndex = 3;
          break;
        }
        case 'E': {
          keyIndex = 4;
          break;
        }
        case 'F': {
          keyIndex = 5;
          break;
        }
        case 'F#': {
          keyIndex = 6;
          break;
        }
        case 'G': {
          keyIndex = 0;
          break;
        }
        case 'G#': {
          keyIndex = 1;
          break;
        }
        case 'A': {
          keyIndex = 2;
          break;
        }
        case 'A#': {
          keyIndex = 3;
          break;
        }
        case 'B': {
          keyIndex = 4;
          break;
        }
        default: {
          break;
        }
      }
      const dumpHeader = ZERO_ONE_MODF_GLOBAL.slice(0, 14);
      const dumpTail = ZERO_ONE_MODF_GLOBAL.slice(-1);
      if (portionNum === 1) {
        ZERO_ONE_MESSAGES.tunningTemp1[keyIndex] = value;
        ZERO_ONE_MESSAGES.tunningReady1 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp1);
      } else if (portionNum === 2 && key === 'F#') {
        ZERO_ONE_MESSAGES.tunningTemp1[keyIndex] = value;
        ZERO_ONE_MESSAGES.tunningReady1 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp1);
      } else {
        ZERO_ONE_MESSAGES.tunningTemp2[keyIndex] = value;
        ZERO_ONE_MESSAGES.tunningReady2 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp2);
      }
      const tunningBody = [...ZERO_ONE_MESSAGES.tunningReady1, ...ZERO_ONE_MESSAGES.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      ZERO_ONE_MODF_GLOBAL = combined;
      trMIDI.sendMessage(ZERO_ONE_MODF_GLOBAL);
    },
    sendZeroTunning() {
      const dumpHeader = ZERO_ONE_MODF_GLOBAL.slice(0, 14);
      const dumpTail = ZERO_ONE_MODF_GLOBAL.slice(-1);
      const tunningBody = [...ZERO_ONE_TUNNING_DEFAULT.tunningReady1, ...ZERO_ONE_TUNNING_DEFAULT.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      ZERO_ONE_MODF_GLOBAL = combined;
      trMIDI.sendMessage(ZERO_ONE_MODF_GLOBAL);
    },
    sendScalePreset(scaleType, tunningValue) {
      ZERO_ONE_MESSAGES = JSON.parse(JSON.stringify(ZERO_ONE_TUNNING_DEFAULT));
      const dumpHeader = ZERO_ONE_MODF_GLOBAL.slice(0, 14);
      const dumpTail = ZERO_ONE_MODF_GLOBAL.slice(-1);

      switch (scaleType) {
        case 'BC': {
          ZERO_ONE_MESSAGES.tunningTemp1[2] = tunningValue;
          ZERO_ONE_MESSAGES.tunningReady1 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp1);
          ZERO_ONE_MESSAGES.tunningTemp2[2] = tunningValue;
          ZERO_ONE_MESSAGES.tunningReady2 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp2);
          break;
        }
        case 'BD': {
          ZERO_ONE_MESSAGES.tunningTemp1[4] = tunningValue;
          ZERO_ONE_MESSAGES.tunningReady1 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp1);
          ZERO_ONE_MESSAGES.tunningTemp2[4] = tunningValue;
          ZERO_ONE_MESSAGES.tunningReady2 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp2);
          break;
        }
        case 'BG': {
          ZERO_ONE_MESSAGES.tunningTemp1[4] = tunningValue;
          ZERO_ONE_MESSAGES.tunningReady1 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp1);
          ZERO_ONE_MESSAGES.tunningTemp2[2] = tunningValue;
          ZERO_ONE_MESSAGES.tunningReady2 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp2);
          break;
        }
        case 'BA': {
          ZERO_ONE_MESSAGES.tunningTemp1[6] = tunningValue;
          ZERO_ONE_MESSAGES.tunningReady1 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp1);
          ZERO_ONE_MESSAGES.tunningTemp2[4] = tunningValue;
          ZERO_ONE_MESSAGES.tunningReady2 = encode7bitTo8(ZERO_ONE_MESSAGES.tunningTemp2);
          break;
        }
        default:
          return;
      }
      const tunningBody = [...ZERO_ONE_MESSAGES.tunningReady1, ...ZERO_ONE_MESSAGES.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      ZERO_ONE_MODF_GLOBAL = combined;
      trMIDI.sendMessage(ZERO_ONE_MODF_GLOBAL);
    },

    sendZeroTranspose() {
      updateZeroOneTransposeGlob(0);
      const dump = ZERO_ONE_MODF_GLOBAL;
      trMIDI.sendMessage(dump);
    },
    sendTranspose(transposeValue) {
      updateZeroOneTransposeGlob(transposeValue - 64);
      const dump = ZERO_ONE_MODF_GLOBAL;
      trMIDI.sendMessage(dump);
    },
    resetGlobal() {
      trMIDI.sendMessage(ZER_ONE_GLOBAL);
    },
  },
};
