const tritonSynthBtn = document.getElementById('triton');
const zeroOneSynthBtn = document.getElementById('zeroOne');
const globalResetBtn = document.getElementById('reset-global');

let selectedSynths = [];

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
});
