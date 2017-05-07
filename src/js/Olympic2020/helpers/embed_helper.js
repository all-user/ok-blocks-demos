// @flow

import type { InputValues } from '@all-user/ok-blocks-demos.types';
import { computedStyles } from './computed_styles.js';
const { OKBlocksGroup } = require('@all-user/ok-blocks');

const forms = {};

function getInputValues(): InputValues {
  forms.verticalInput = forms.verticalInput || document.querySelector('#vertical');
  forms.horizonInput  = forms.horizonInput  || document.querySelector('#horizon');
  forms.displayInput  = forms.displayInput  || document.querySelector('#display');
  forms.durationInput = forms.durationInput || document.querySelector('#duration');
  forms.messageInput  = forms.messageInput  || document.querySelector('#message');
  forms.iWidthInput   = forms.iWidthInput   || document.querySelector('#i-width');
  forms.iHeightInput  = forms.iHeightInput  || document.querySelector('#i-height');

  const vertical = forms.verticalInput.value | 0;
  const horizon  = forms.horizonInput.value | 0;
  const display  = forms.displayInput.value | 0;
  const duration = forms.durationInput.value | 0;
  const msg      = forms.messageInput.value.split('\n');
  const width    = forms.iWidthInput.value;
  const height   = forms.iHeightInput.value;

  return { vertical, horizon, display, duration, msg, width, height };
}

function clickButtonHandler(params: InputValues, wrapper: HTMLElement) {
  let { msg } = params;

  if (typeof params !== 'object') {
    new Error('clickButtonHandler arg expect type is object.');
  }

  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }

  let group = generateSignboard(params);
  group.appendTo(wrapper);

  wrapper.addEventListener('click', () => {
    if (group.isAnimating) {
      group.stopAnimate.call(group);
    } else {
      group.resumeAnimate.call(group);
    }
  });

  msg.push(msg.shift());

  setTimeout(() => {
    group.animateFromString(params.msg, { loop: true });
  }, group.blocks[0].displayTime);
}

function generateSignboard(params: InputValues): OKBlocksGroup { // object => OKBlocksGroup
  const { SIZE } = computedStyles();

  let { pattern, vertical, horizon, display, duration, msg } = params;

  vertical = vertical || 3;
  horizon  = horizon  || 7;
  display  = display  || 1500;
  let margin     = SIZE / (horizon * 5);
  let emblemSize = margin * 3;

  let group = new OKBlocksGroup(msg[0], { pattern: pattern, length: vertical * horizon, size: emblemSize, displayTime: display, duration: duration });

  group.blocks.forEach(e => {
    e.dom.style.margin = `${ margin }px`;
  });

  return group;
}

export { clickButtonHandler, getInputValues };
