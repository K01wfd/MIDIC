const tritonSynthBtn = document.getElementById('triton') as HTMLButtonElement;
const zeroOneSynthBtn = document.getElementById('zeroOne') as HTMLButtonElement;
const globalResetBtn = document.getElementById('reset-global') as HTMLButtonElement;

let selectedSynths: string[] = [];

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
  console.log(selectedSynths);
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
  console.log(selectedSynths);
});
