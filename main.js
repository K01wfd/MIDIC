const transposeButtons = document.querySelectorAll('[data-id="transpose-btn"]');
const transposeValue = document.getElementById('transpose-value');
const userScaleButtons = document.querySelectorAll('[data-id="userscale-btn"]');
const scalePresetsButtons = document.querySelectorAll('[data-id="scale-preset-btn"]');
const resetBtnWrapper = document.getElementById('reset-global-wrapper');
const resetBtn = document.getElementById('reset-global');
const message = document.getElementById('message');
const k01controllerBtn = document.getElementById('k01-controller');

let currentTransposeValue = +transposeValue.textContent;
let tunningValue = -50;
let resetTimes = 0;

transposeButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) {
      showMessage('Please Select a model');
      return;
    }
    const btnType = btn.id === 'transpose+' ? '+' : '-';

    if (btnType === '+' && currentTransposeValue < 12) {
      currentTransposeValue++;
      transposeValue.textContent = currentTransposeValue.toString();
      if (currentTransposeValue > 0) btn.classList.add('btn-active');
    } else if (btnType === '-' && currentTransposeValue > -12) {
      currentTransposeValue--;
      transposeValue.textContent = currentTransposeValue.toString();
      if (currentTransposeValue < 0) btn.classList.add('btn-active');
    }
    selectedSynths.forEach((synth) => sender[synth].sendTranspose(currentTransposeValue + 64));
    if (currentTransposeValue === 0) transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  });
});

transposeValue.addEventListener('click', (_) => {
  if (selectedSynths.length === 0) {
    showMessage('Please Select a model');
    return;
  }
  transposeValue.textContent = '0';
  currentTransposeValue = 0;
  selectedSynths.forEach((synth) => sender[synth].sendZeroTranspose());
  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
});

userScaleButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) {
      showMessage('Please Select a model');
      return;
    }
    btn.classList.toggle('btn-active');
    if (!btn.classList.contains('btn-active')) {
      btn.value = 0;
    } else {
      btn.value = tunningValue;
    }
    const btnValue = +btn.value;
    const btnIndex = +btn.dataset.index;
    const btnPortion = +btn.dataset.portion;
    selectedSynths.forEach((synth) => sender[synth].sendScaleTunning(btnIndex, btnValue, btnPortion, btn.textContent));
  });
});

scalePresetsButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) {
      showMessage('Please Select a model');
      return;
    }
    userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
    const scaleType = btn.value;
    if (!btn.classList.contains('btn-active')) {
      scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));
      btn.classList.add('btn-active');
      selectedSynths.forEach((synth) => sender[synth].sendScalePreset(scaleType, tunningValue));
    } else {
      btn.classList.remove('btn-active');
      userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
      selectedSynths.forEach((synth) => sender[synth].sendZeroTunning());
    }
  });
});

resetBtn.addEventListener('click', (_) => {
  if (resetTimes > 0) {
    showMessage('Global was recently reseted!');
    return;
  }

  sender.triton.resetGlobal();
  sender.zeroOne.resetGlobal();

  currentTransposeValue = 0;
  transposeValue.textContent = 0;

  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
  tritonSynthBtn.classList.remove('btn-active');
  zeroOneSynthBtn.classList.remove('btn-active');

  showIcon(resetBtnWrapper, '✅');

  localStorage.removeItem('midi');
  selectedSynths = [];
  resetTimes++;
});

function showMessage(msg) {
  message.textContent = msg;
  message.style.display = 'block';
  setTimeout(() => (message.style.display = 'none'), 4000);
}

function showIcon(targetElement, icon) {
  const iconElement = document.createElement('span');
  iconElement.innerHTML = icon;
  iconElement.classList.add('icon');
  targetElement.appendChild(iconElement);
}

k01controllerBtn.addEventListener('click', (_) => {
  window.location.replace('https://k01wfd.github.io/KORG01WFD_MIDI_CONTROLLER/');
});
document.addEventListener(
  'dblclick',
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);
