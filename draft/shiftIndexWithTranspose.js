function shiftPortionIndex(newIndex, portion) {
  if (portion === 1 && newIndex > 6) {
    if (newIndex > 12) {
      portion = 1;
      newIndex = newIndex - 12;
    } else {
      portion = 2;
      newIndex = newIndex - 7;
    }
  }
  if (portion === 1 && newIndex < 1) {
    if (newIndex < -5) {
      portion = 1;
      newIndex = newIndex + 12;
    } else {
      portion = 2;
      newIndex = newIndex + 5;
    }
  }

  if (portion === 2 && newIndex > 5) {
    if (newIndex > 11) {
      newIndex = newIndex - 12;
      portion = 2;
    } else {
      portion = 1;
      newIndex = newIndex - 5;
    }
  }

  if (portion === 2 && newIndex < 0) {
    if (newIndex < -6) {
      portion = 2;
      newIndex = newIndex + 12;
    } else {
      portion = 1;
      newIndex = newIndex + 7;
    }
  }
  return { portion, newIndex };
}
