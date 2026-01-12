const pa3xSynthBtn = document.getElementById('pa3x');
const tritonSynthBtn = document.getElementById('triton');
const zeroOneSynthBtn = document.getElementById('zeroOne');

// alert('Please RESET first!');
let selectedSynths = [];

const savedSynths = JSON.parse(localStorage.getItem('midi'));
if (savedSynths && savedSynths.synths) {
  selectedSynths = [...savedSynths.synths];
}

selectedSynths.indexOf('pa3x') !== -1 && pa3xSynthBtn.classList.add('btn-active');
selectedSynths.indexOf('triton') !== -1 && tritonSynthBtn.classList.add('btn-active');
selectedSynths.indexOf('zeroOne') !== -1 && zeroOneSynthBtn.classList.add('btn-active');

const buttons = [pa3xSynthBtn, tritonSynthBtn, zeroOneSynthBtn];

buttons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    btn.classList.toggle('btn-active');
    if (btn.classList.contains('btn-active')) {
      if (selectedSynths.indexOf(btn.value) === -1) {
        selectedSynths.push(btn.value);
      }
    } else {
      selectedSynths = selectedSynths.filter((synth) => synth !== btn.value);
    }
    saveState('synths', selectedSynths);
  });
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
