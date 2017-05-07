// @flow

function computedStyles() {
  const container = document.querySelector('.container');
  if (container == null) {
    throw new Error('.container is not found.');
  }
  const Styles = getComputedStyle(container);
  const WIDTH   = +Styles.width.replace('px', '');
  const PADDING = +Styles.paddingLeft.replace('px', '');
  const SIZE    = WIDTH - PADDING * 2;

  return { WIDTH, PADDING, SIZE };
}

export { computedStyles };
