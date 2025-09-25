const tritonSynthBtn = document.getElementById('triton');
const zeroOneSynthBtn = document.getElementById('zeroOne');
const globalResetBtn = document.getElementById('reset-global');

alert('Please RESET first!');
let selectedSynths = [];

const savedSynths = JSON.parse(localStorage.getItem('midi'));
if (savedSynths && savedSynths.synths) {
  selectedSynths = [...savedSynths.synths];
}

selectedSynths.indexOf('triton') !== -1 && tritonSynthBtn.classList.add('btn-active');
selectedSynths.indexOf('zeroOne') !== -1 && zeroOneSynthBtn.classList.add('btn-active');
tritonSynthBtn.addEventListener('click', (_) => {
  tritonSynthBtn.classList.toggle('btn-active');
  if (tritonSynthBtn.classList.contains('btn-active')) {
    if (selectedSynths.indexOf('triton') === -1) {
      selectedSynths.push(tritonSynthBtn.value);
    }
  } else {
    const tritonIndex = selectedSynths.indexOf('triton');
    const synthName = selectedSynths[tritonIndex];
    selectedSynths = selectedSynths.filter((synth) => synth !== synthName);
  }
  saveState('synths', selectedSynths);
});
zeroOneSynthBtn.addEventListener('click', (_) => {
  zeroOneSynthBtn.classList.toggle('btn-active');
  if (zeroOneSynthBtn.classList.contains('btn-active')) {
    if (selectedSynths.indexOf('zeroOne') === -1) {
      selectedSynths.push(zeroOneSynthBtn.value);
    }
  } else {
    const tritonIndex = selectedSynths.indexOf('zeroOne');
    const synthName = selectedSynths[tritonIndex];
    selectedSynths = selectedSynths.filter((synth) => synth !== synthName);
  }
  saveState('synths', selectedSynths);
});
function saveState(key, data) {
  const saved = JSON.parse(localStorage.getItem('midi'));
  if (saved) {
    saved[key] = data;
    localStorage.setItem('midi', JSON.stringify(saved));
  } else {
    const state = { [key]: data };
    localStorage.setItem('midi', JSON.stringify(state));
  }
}
