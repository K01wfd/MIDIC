const transposeButtons = document.querySelectorAll('[data-id="transpose-btn"]');
const transposeValue = document.getElementById('transpose-value');

const userScaleButtons = document.querySelectorAll('[data-id="userscale-btn"]');
const cents = document.querySelectorAll('[type="number"]');
const centValueRange = document.getElementById('cent-range-value');
const centRange = document.getElementById('centRange');

const resetBtnWrapper = document.getElementById('reset-global-wrapper');
const scalePresetsButtons = document.querySelectorAll('[data-id="scale-preset-btn"]');

const resetBtn = document.getElementById('reset-global');
const enaMicroTunning = document.getElementById('enable-micro-tunning');
const message = document.getElementById('message');

const globalState = {
  isScalePreset: false,
  isScaleTunning: false,
  isMicroTuningEnabled: false,
  centValue: -50,
  isCentChanged: false,
  currentScaleButtons: [],
};

let currentTransposeValue = +transposeValue.textContent;

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
  if (currentTransposeValue === 0) return;
  transposeValue.textContent = '0';
  currentTransposeValue = 0;

  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  selectedSynths.forEach((synth) => sender[synth].sendZeroTranspose());
});

userScaleButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) {
      showMessage('Please Select a model');
      return;
    }

    if (globalState.isScalePreset && !globalState.isMicroTuningEnabled) {
      selectedSynths.forEach((synth) => sender[synth].resetTunning());
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
    const key = btn.dataset.key;

    if (globalState.currentScaleButtons.indexOf(key) === -1) globalState.currentScaleButtons.push(key);
    else globalState.currentScaleButtons = globalState.currentScaleButtons.filter((btn) => btn !== key);

    if (!globalState.isMicroTuningEnabled) {
      selectedSynths.forEach((synth) => sender[synth].sendScaleTunning(btnValue, key));
    }
  });
});

scalePresetsButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) {
      showMessage('Please Select a model');
      return;
    }

    if (globalState.isScaleTunning) {
      selectedSynths.forEach((synth) => sender[synth].resetTunning());
      userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
      globalState.isScaleTunning = false;
    }

    const scaleName = btn.value;
    const scaleType = btn.dataset.scale;
    btn.classList.add('btn-active');
    if (btn.classList.contains('btn-active')) {
      scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));
      btn.classList.toggle('btn-active');
      globalState.isScalePreset = true;
      selectedSynths.forEach((synth) => sender[synth].sendScalePreset(scaleType, scaleName));
    } else {
      btn.classList.remove('btn-active');
      globalState.isScalePreset = false;
      selectedSynths.forEach((synth) => sender[synth].sendZeroTunning());
    }
  });
});

resetBtn.addEventListener('click', (_) => {
  selectedSynths.forEach((synth) => sender[synth].resetGlobal());

  currentTransposeValue = 0;
  transposeValue.textContent = 0;

  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
  scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));

  showMessage(
    '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>',
  );
});

enaMicroTunning.addEventListener('click', (e) => {
  enaMicroTunning.classList.toggle('btn-active');
  globalState.isMicroTuningEnabled = !globalState.isMicroTuningEnabled;

  if (globalState.isMicroTuningEnabled) {
    userScaleButtons.forEach((btn) => btn.classList.add('btn-disabled'));
  } else {
    userScaleButtons.forEach((btn) => btn.classList.remove('btn-disabled'));
    if (!globalState.isScalePreset) selectedSynths.forEach((synth) => sender[synth].sendZeroTunning());
  }
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
});

centRange.addEventListener('input', (e) => {
  if (globalState.isMicroTuningEnabled) {
    const centVal = Math.floor(parseFloat(e.target.value)).toFixed();
    globalState.centValue = centVal;
    centValueRange.textContent = centVal;
    userScaleButtons.forEach((btn) => {
      if (btn.classList.contains('btn-active')) {
        const adjCentElem = btn.nextElementSibling;
        adjCentElem.value = centValueRange.textContent;
      }
    });
  }
});

function showMessage(msg) {
  message.innerHTML = msg;
  message.style.display = 'block';
  setTimeout(() => (message.style.display = 'none'), 4000);
}

document.addEventListener(
  'dblclick',
  function (event) {
    event.preventDefault();
  },
  { passive: false },
);
