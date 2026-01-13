const pa3xSynthBtn = document.getElementById('pa3x');
const tritonSynthBtn = document.getElementById('triton');
const zeroOneSynthBtn = document.getElementById('zeroOne');
const colorRange = document.getElementById('colorRange');
const scalePresetsButtons = document.querySelectorAll('[data-id="scale-preset-btn"]');

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

// Get current css primary color
const style = window.getComputedStyle(document.body);
const value = style.getPropertyValue('--color-primary');
const cssHue = Number(value.slice(4, 7));

colorRange.value = cssHue;
const colorMin = colorRange.min;
const colorMax = colorRange.max;

colorRange.addEventListener('input', (e) => {
  const percent = (e.target.value - colorMin) / (colorMax - colorMin);
  const hue = Math.round(percent * 360);

  document.documentElement.style.setProperty('--color-primary', `hsl(${hue}, 100%, 35%)`);
  document.documentElement.style.setProperty('--shadow-color', `hsla(${hue}, 100%, 35%, 0.5)`);
});
