const transposeButtons = document.querySelectorAll('[data-id="transpose-btn"]');
const transposeValue = document.getElementById('transpose-value');

let currentTransposeValue = +transposeValue.textContent;

transposeButtons.forEach((btn) => {
  btn.addEventListener('click', (_) => {
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
  transposeValue.textContent = '0';
  currentTransposeValue = 0;
  transposeButtons.forEach((btn) => btn.classList.remove('btn-active'));
});
