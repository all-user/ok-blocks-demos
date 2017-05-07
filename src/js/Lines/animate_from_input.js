// @flow

import { computedStyles } from './helpers/computed_styles.js';
const { OKBlock } = require('@all-user/ok-blocks');
require('@all-user/ok-patterns-lines')(OKBlock);

document.addEventListener('DOMContentLoaded', () => {
  const wrapper    = document.querySelector('#wrapper');
  const { SIZE } = computedStyles();
  const size       = SIZE > 675 ? 675 : SIZE;
  const MARGIN   = size / 5;
  const sizeS      = MARGIN * 3;

  const init = 't';
  const olms = [];
  olms.push(OKBlock.factory(init[0], { pattern: 'Lines', size: sizeS }));
//     olms.push(OKBlock.factory(init[1], { pattern: 'Lines', size: sizeS }));
//     olms.push(OKBlock.factory(init[2], { pattern: 'Lines', size: sizeS }));
//     olms.push(OKBlock.factory(init[3], { pattern: 'Lines', size: sizeS }));
  olms.forEach(e => { e.dom.style.margin = `${ MARGIN }px auto`; });
  olms.forEach(olm => {
    if (wrapper == null) {
      throw new Error('#wrapper is not found.');
    }
    wrapper.appendChild(olm.dom);
  });

  const input = document.querySelector('#user-input');
  if (input == null) {
    throw new Error('#user-input is not found.');
  }
  input.addEventListener('input', e => {
    if (e.target !== input) {
      console.error('event.target is not equal #user-input.');
      return;
    }
    if (e.target instanceof HTMLInputElement) {
      (e.target: HTMLInputElement);
    } else {
      return;
    }
    const str = (init + e.target.value).slice(-init.length);
    [...str].forEach((c, idx) => {
      olms[idx].to(c);
    });
  });
});
