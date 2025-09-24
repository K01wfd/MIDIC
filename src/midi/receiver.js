trMIDI.addEventListener('newMessage', (e) => {
  const data = e.detail;
  const globalDumpReplay = data[4] === 0x51;

  if (globalDumpReplay) {
    updateArray(TRITON_MODF_GLOB, data);
    trMIDI.dispatchEvent(new CustomEvent('globalDataReceived'));
  }
});
