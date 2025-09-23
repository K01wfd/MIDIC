import { TRITON_MODF_GLOB } from '../data/messages';
import { updateGlobal } from '../utils/helpers';
import { trMIDI } from './connection';

trMIDI.addEventListener('newMessage', (e: CustomEventInit) => {
  const data = e.detail;
  const globalDumpReplay = data[4] === 0x51;

  if (globalDumpReplay) {
    updateGlobal(TRITON_MODF_GLOB, data);
    trMIDI.dispatchEvent(new CustomEvent('globalDataReceived'));
  }
});
