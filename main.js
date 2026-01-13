const transposeButtons = document.querySelectorAll('[data-id="transpose-btn"]');
const transposeValue = document.getElementById('transpose-value');

const userScaleButtons = document.querySelectorAll('[data-id="userscale-btn"]');
const cents = document.querySelectorAll('[type="number"]');

const resetBtnWrapper = document.getElementById('reset-global-wrapper');
const resetBtn = document.getElementById('reset-global');
const message = document.getElementById('message');

const globalState = {
  isScalePreset: false,
  isScaleTunning: false,
};

let currentTransposeValue = +transposeValue.textContent;

transposeButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) {
      showMessage('Please Select a model');
      return;
    }
    if (globalState.isScalePreset || globalState.isScaleTunning) {
      selectedSynths.forEach((synth) => sender[synth].sendZeroTunning());
      userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
      scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));
      globalState.isScalePreset = false;
      globalState.isScaleTunning = false;
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

    setTimeout(() => {
      selectedSynths.forEach((synth) => sender[synth].sendTranspose(currentTransposeValue + 64));
    }, 100);
    if (currentTransposeValue === 0) transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  });
});

transposeValue.addEventListener('click', (_) => {
  if (selectedSynths.length === 0) {
    showMessage('Please Select a model');
    return;
  }
  if (currentTransposeValue === 0) return;
  transposeValue.textContent = '0';
  currentTransposeValue = 0;
  selectedSynths.forEach((synth) => sender[synth].sendZeroTunning());

  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
  scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));
  setTimeout(() => {
    selectedSynths.forEach((synth) => sender[synth].sendZeroTranspose());
  }, 100);
});

userScaleButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) {
      showMessage('Please Select a model');
      return;
    }

    if (globalState.isScalePreset) {
      resetTunningPortions();
      scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));
      globalState.isScalePreset = false;
    }

    let cent = null;
    cents.forEach((c) => {
      if (c.name === btn.dataset.key) {
        cent = c;
        return;
      }
    });
    const tunningValue = +cent.value;

    btn.classList.toggle('btn-active');
    if (!btn.classList.contains('btn-active')) {
      btn.value = 0;
      globalState.isScaleTunning = false;
    } else {
      btn.value = tunningValue;
      globalState.isScaleTunning = true;
    }

    const btnValue = +btn.value;
    const btnIndex = +btn.dataset.index;
    const btnPortion = +btn.dataset.portion;
    selectedSynths.forEach((synth) => sender[synth].sendScaleTunning(btnIndex, btnValue, btnPortion, btn.textContent));
  });
});

scalePresetsButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (sender.isTranspose) {
      showMessage('Transpose on');
      return;
    }
    if (selectedSynths.length === 0) {
      showMessage('Please Select a model');
      return;
    }
    userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
    const scaleType = btn.value;
    if (!btn.classList.contains('btn-active')) {
      scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));
      btn.classList.add('btn-active');
      globalState.isScalePreset = true;
      selectedSynths.forEach((synth) => sender[synth].sendScalePreset(scaleType));
    } else {
      btn.classList.remove('btn-active');
      userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
      globalState.isScalePreset = false;
      selectedSynths.forEach((synth) => sender[synth].sendZeroTunning());
    }
  });
});

resetBtn.addEventListener('click', (_) => {
  sender.triton.resetGlobal();
  sender.zeroOne.resetGlobal();
  sender.pa3x.resetGlobal();

  currentTransposeValue = 0;
  transposeValue.textContent = 0;

  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
  scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));

  showMessage('Clear');
});

function showMessage(msg) {
  message.textContent = msg;
  message.style.display = 'block';
  setTimeout(() => (message.style.display = 'none'), 4000);
}

document.addEventListener(
  'dblclick',
  function (event) {
    event.preventDefault();
  },
  { passive: false }
);
