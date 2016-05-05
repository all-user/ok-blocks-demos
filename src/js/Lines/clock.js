document.addEventListener('DOMContentLoaded', () => {
  let { OKBlock } = require('@all-user/ok-blocks');
  let { OKBlocksGroup } = require('@all-user/ok-blocks');
  require('@all-user/ok-patterns-lines')(OKBlock);

  const { computedStyles } = require('./helpers/computed_styles.js');
  const WRAPPER_SIZE = computedStyles().SIZE;
  const GRID_SIZE = WRAPPER_SIZE / 23;
  const MARGIN_SIZE = GRID_SIZE * 2;
  const MIN_BLOCK_SIZE = GRID_SIZE * 3;
  const SEC_BLOCK_SIZE = GRID_SIZE * 8;
  const LINE_WEIGHT = 3;
  const LINE_COLOR = 'transparent';
  // const PADDING_COLOR = '#aaa9a7';
  const PADDING_COLOR = 'white';
  // const VIDEO_SRC = 'https://www.youtube.com/embed/7eyYe-MN1Nc?rel=0&controls=0&showinfo=0&autoplay=1';
  // const VIDEO_SRC = 'https://www.youtube.com/embed/5Ehd4cFEvnQ?rel=0&controls=0&showinfo=0&autoplay=1';
  const VIDEO_SRC = 'https://www.youtube.com/embed/VOgpV0jwhDc?rel=0&controls=0&showinfo=0&autoplay=1&loop=1&playlist=VOgpV0jwhDc&modestbranding=0';
  // const VIDEO_SRC = 'https://www.youtube.com/embed/PC77lsC_q_U?rel=0&controls=0&showinfo=0&autoplay=1';
  // const VIDEO_SRC = 'https://www.youtube.com/embed/tyHa3U-iRaM?rel=0&controls=0&showinfo=0&autoplay=1';
  let iframe = document.querySelector('.container iframe');
  let wrapper = document.querySelector('#wrapper');
  const wrapperWidth = GRID_SIZE * 23;
  const wrapperHeight = GRID_SIZE * 13;
  wrapper.style.width = `${wrapperWidth}px`;
  wrapper.style.height = `${wrapperHeight}px`;
  iframe.setAttribute('width', wrapperWidth - 2);
  iframe.setAttribute('height', wrapperHeight - 2);
  iframe.setAttribute('src', VIDEO_SRC);
  let minBlocks = new OKBlocksGroup('04:39', { pattern: 'Lines', size: MIN_BLOCK_SIZE, duration: 200 });
  minBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`min-block-${i}`);
    let style = block.dom.style;
    style.top = 0;
    style.left = `${(MIN_BLOCK_SIZE + MARGIN_SIZE) * i}px`;
    block.lineColor = LINE_COLOR;
    block.paddingColor = PADDING_COLOR;
    block.weight = LINE_WEIGHT;
  });
  minBlocks.appendTo(wrapper);
  let secBlocks = new OKBlocksGroup('**', { pattern: 'Lines', size: SEC_BLOCK_SIZE, duration: 200 });
  secBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`sec-block-${i}`);
    let style = block.dom.style;
    style.top = `${GRID_SIZE * 5}px`;
    style.left = `${GRID_SIZE * 15 * i}px`;
    block.lineColor = LINE_COLOR;
    block.paddingColor = PADDING_COLOR;
    block.weight = LINE_WEIGHT;
  });
  secBlocks.appendTo(wrapper);
  secBlocks.options = { loop: true, displayTime: 1000 };
  secBlocks.animateFromString('1112131415161718192021222324252627282930');
  [...'_'.repeat(9)].forEach((_, i) => {
    let mask = document.querySelector(`.mask.num-${i}`);
    let style = mask.style;
    switch (i) {
    case 0:
    case 1:
    case 2:
    case 3:
      style.top = 0;
      style.left = `${(MIN_BLOCK_SIZE + MARGIN_SIZE) * i + MIN_BLOCK_SIZE}px`;
      style.width = `${MARGIN_SIZE}px`;
      style.height = `${MIN_BLOCK_SIZE}px`;
      break;
    case 4:
      style.top = `${GRID_SIZE * 5}px`;
      style.left = `${SEC_BLOCK_SIZE}px`;
      style.width = `${GRID_SIZE * 7}px`;
      style.height = `${SEC_BLOCK_SIZE}px`;
      break;
    case 5:
      style.top = `${GRID_SIZE * 3}px`;
      style.left = `${GRID_SIZE * 0}px`;
      style.width = `${GRID_SIZE * 23}px`;
      style.height = `${GRID_SIZE * 2}px`;
      break;
    default:
      throw new Error(`exception in switch. expression => ${i}`);
    }
  });
});
