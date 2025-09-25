const transposeButtons = document.querySelectorAll('[data-id="transpose-btn"]');
const transposeValue = document.getElementById('transpose-value');
const userScaleButtons = document.querySelectorAll('[data-id="userscale-btn"]');
const resetBtn = document.getElementById('reset-global');

let currentTransposeValue = +transposeValue.textContent;
let tunningValue = -50;

transposeButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) return;
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
  if (selectedSynths.length === 0) return;
  transposeValue.textContent = '0';
  currentTransposeValue = 0;
  selectedSynths.forEach((synth) => sender[synth].sendZeroTranspose());
  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
});

userScaleButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
    if (selectedSynths.length === 0) return;
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

resetBtn.addEventListener('click', (_) => {
  sender.triton.resetGlobal();
  sender.zeroOne.resetGlobal();
  currentTransposeValue = 0;
  transposeValue.textContent = 0;
  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
  userScaleButtons.forEach((btn) => btn.classList.remove('btn-active'));
});
