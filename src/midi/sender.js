const sender = {
  triton: {
    requestGlobalDump: function () {
      const msg = TRITON_MESSAGES['globalRequest'];
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

      updateArray(TRITON_MODF_GLOB, combined);
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },
    sendZeroTunning: function () {
      const dumpHeader = TRITON_MODF_GLOB.slice(0, 14);
      const dumpTail = TRITON_MODF_GLOB.slice(30);
      const tunningBody = [...TRITON_TUNNING_DEFAULT.tunningReady1, ...TRITON_TUNNING_DEFAULT.tunningReady2];
      const combined = [...dumpHeader, ...tunningBody, ...dumpTail];
      updateArray(TRITON_MODF_GLOB, combined);
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },
    resetGlobal: function () {
      trMIDI.sendMessage(TRITON_DEF_GLOB);
    },
    sendScalePreset: function (scaleType, tunningValue) {
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
      updateArray(TRITON_MODF_GLOB, combined);
      trMIDI.sendMessage(TRITON_MODF_GLOB);
    },
    sendTranspose: function (transposeValue) {
      const convertedValue = +toHex7bit(transposeValue);
      const msg = [0xf0, 0x7f, 0x00, 0x04, 0x04, 0x00, convertedValue, 0xf7];
      // trMIDI.sendMessage(msg);
      updateTritonTransposeGlob(transposeValue - 64);
      console.log(TRITON_MODF_GLOB);
    },
  },
  zeroOne: {
    requestGlobalDump() {},
    sendScaleTunning(index, value, portionNum) {},
    sendScalePreset(scaleType, tunningValue) {},
    sendZeroTunning() {},
    resetGlobal() {},

    sendTranspose(transposeValue) {
      updateZeroOneTransposeGlob(transposeValue - 64);
      const dump = ZERO_ONE_MODF_GLOBAL;
      // trMIDI.sendMessage(dump);
      console.log(ZERO_ONE_MODF_GLOBAL);
    },
  },
};
