let { OKBlock } = require('@all-user/ok-block');
let { OKBlocksGroup } = require('@all-user/ok-block');
require('@all-user/ok-patterns-lines')(OKBlock);

const { computedStyles } = require('./computed_styles.js');
const WRAPPER_SIZE = computedStyles().SIZE;
const MARGIN_SIZE = WRAPPER_SIZE / 24;
const MILLI_SEC_BLOCK_SIZE = MARGIN_SIZE * 6;
const SEC_BLOCK_SIZE = MARGIN_SIZE * 10;
const TEN_SEC_BLOCK_SIZE = MARGIN_SIZE * 3;
const MIN_BLOCK_SIZE = MARGIN_SIZE * 1.5;

document.addEventListener('DOMContentLoaded', () => {
  let minBlocks = new OKBlocksGroup('****', { pattern: 'Lines', size: MIN_BLOCK_SIZE, duration: 200 });
  minBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`min-block-${i}`);
    let style = block.dom.style;
    style.top = `${MIN_BLOCK_SIZE}px`;
    style.left = `${(MIN_BLOCK_SIZE + MARGIN_SIZE) * i}px`;
  });
  let secBlocks = new OKBlocksGroup('**', { pattern: 'Lines', duration: 200 });
  secBlocks.emblems[0].options = { size: TEN_SEC_BLOCK_SIZE };
  secBlocks.emblems[1].options = { size: SEC_BLOCK_SIZE };
  secBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`sec-block-${i}`);
    let style = block.dom.style;
    style.top = 0;
    style.left = `${(MIN_BLOCK_SIZE + MARGIN_SIZE) * 4 + (TEN_SEC_BLOCK_SIZE + MARGIN_SIZE) * i}px`;
  });
  let milliSecBlocks = new OKBlocksGroup('**', { pattern: 'Lines', size: MILLI_SEC_BLOCK_SIZE, duration: 0 });
  milliSecBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`milli-sec-block-${i}`);
    let style = block.dom.style;
    style.top = `${MARGIN_SIZE * 4}px`;
    style.left = `${(MILLI_SEC_BLOCK_SIZE + MARGIN_SIZE) * i}px`;
  });
  [...'_'.repeat(8)].forEach((_, i) => {
    let mask = document.querySelector(`.mask.${i}`);
    let style = mask.style;
    switch (i) {
    case 0:
      style.top = 0;
      style.left = 0;
      style.width = `${SEC_BLOCK_SIZE}px`;
      style.height = `${MIN_BLOCK_SIZE}px`;
      break;
    case 1, 2, 3, 4:
      style.top = `${MIN_BLOCK_SIZE}px`;
      style.left = `${(MIN_BLOCK_SIZE + MARGIN_SIZE) * i - MARGIN_SIZE}px`;
      style.width = `${MARGIN_SIZE}px`;
      style.height = `${MIN_BLOCK_SIZE}px`;
      break;
    case 5:
      style.top = `${MARGIN_SIZE * 3}px`;
      style.left = 0;
      style.width = `${MARGIN_SIZE * 13}px`;
      style.height = `${MARGIN_SIZE}px`;
      break;
    case 6:
      style.top = `${MARGIN_SIZE * 4}px`;
      style.left = `${MILLI_SEC_BLOCK_SIZE}px`;
      style.width = `${MARGIN_SIZE}px`;
      style.height = `${MILLI_SEC_BLOCK_SIZE}px`;
      break;
    case 7:
      style.top = 0;
      style.left = `${MARGIN_SIZE * 13}px`;
      style.width = `${MARGIN_SIZE}px`;
      style.height = `${SEC_BLOCK_SIZE}px`;
      break;
    default:
      throw new Error(`exception in switch. expression => ${i}`);
    }
  });

});
