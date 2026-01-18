const transposeButtons = document.querySelectorAll('[data-id="transpose-btn"]');
const transposeValue = document.getElementById('transpose-value');

const userScaleButtons = document.querySelectorAll('[data-id="userscale-btn"]');
const cents = document.querySelectorAll('[type="number"]');
const centValueRange = document.getElementById('cent-range-value');
const centRange = document.getElementById('centRange');

const resetBtnWrapper = document.getElementById('reset-global-wrapper');
const resetBtn = document.getElementById('reset-global');
const disableTunningBtn = document.getElementById('disable-tunning');
const message = document.getElementById('message');

const globalState = {
  isScalePreset: false,
  isScaleTunning: false,
  isTunningDisabled: false,
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
    const btnPortion = +btn.dataset.portion;
    const key = btn.dataset.key;
    if (!globalState.isTunningDisabled) {
      selectedSynths.forEach((synth) => sender[synth].sendScaleTunning(btnValue, key));
    }
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
  selectedSynths.forEach((synth) => sender[synth].sendZeroTunning());

  currentTransposeValue = 0;
  transposeValue.textContent = 0;

  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
  scalePresetsButtons.forEach((btn) => btn.classList.remove('btn-active'));

  showMessage(
    '<svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M9 12l2 2l4 -4" /></svg>',
  );
});

disableTunningBtn.addEventListener('click', (e) => {
  disableTunningBtn.classList.toggle('btn-active');
  if (disableTunningBtn.classList.contains('btn-active')) {
    globalState.isTunningDisabled = true;
    userScaleButtons.forEach((btn) => btn.classList.add('btn-disabled'));
  } else {
    globalState.isTunningDisabled = false;
    userScaleButtons.forEach((btn) => {
      if (btn.classList.contains('btn-active')) {
        const adjCentElem = btn.nextElementSibling;
        adjCentElem.value = centValueRange.textContent;
      }
      btn.classList.remove('btn-active');
      btn.classList.remove('btn-disabled');
    });
  }
});

centRange.addEventListener('input', (e) => {
  if (!globalState.isTunningDisabled) {
    alert('please disable tunning first');
    centRange.value = -50;
  }
  const centVal = Math.floor(parseFloat(e.target.value)).toFixed();
  centValueRange.textContent = centVal;
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
