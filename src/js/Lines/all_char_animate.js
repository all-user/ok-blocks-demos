// @flow

import { computedStyles } from './helpers/computed_styles.js';
let { OKBlock } = require('@all-user/ok-blocks');
require('@all-user/ok-patterns-lines')(OKBlock);

document.addEventListener('DOMContentLoaded', () => {
  let wrapper    = document.querySelector('#wrapper');
  let olms       = [];
  const { SIZE } = computedStyles();
  let size       = SIZE > 500 ? 500 : SIZE;
  const MARGIN   = size / 15;
  let sizeL      = size - MARGIN * 2;
  let sizeS      = MARGIN * 3;

  olms.push(OKBlock.factory('a', { pattern: 'Lines', size: sizeS,  displayTime: 3111, random: true }));
  olms.push(OKBlock.factory('z', { pattern: 'Lines', size: sizeS,  displayTime: 6399, random: true }));
  olms.push(OKBlock.factory('t', { pattern: 'Lines', size: sizeS,  displayTime: 1477, random: true }));
  olms.forEach(e => { e.dom.style.margin = `${ MARGIN }px`; });

  let bigOKBlock = OKBlock.factory('/', { pattern: 'Lines', size: sizeL, displayTime: 1000, duration: 200 });
  bigOKBlock.dom.style.margin = `${ MARGIN }px`;
  olms.push(bigOKBlock);

  const allValidChars = bigOKBlock.allValidChars;

  olms.forEach((olm) => {
    olm.dom.addEventListener('click', () => {
      if (olm.isAnimating) {
        olm.stopAnimate.call(olm);
      } else {
        if (olm.resumeAnimate) {
          olm.resumeAnimate.call(olm);
        }
      }
    });

    if (wrapper == null) {
      throw new Error('#wrapper is not found.');
    }
    wrapper.appendChild(olm.dom);

    setTimeout(() => {
      olm.animateFromString(allValidChars, { loop: true });
    }, 1000);
  });
});
