// @flow

import type { InputValues, FormsObject, HasValueProperty } from '../../../index.js';
import { computedStyles } from './computed_styles.js';
import { OKBlock, OKBlocksGroup } from '@all-user/ok-blocks';
import type { ExtendedByLinesPattern } from '@all-user/ok-patterns-lines';

const UP_KEY   = 75;
const DOWN_KEY = 74;

const forms: FormsObject = {};


function getInputValues(): InputValues {
  forms.verticalInput = forms.verticalInput || document.querySelector('#vertical');
  forms.horizonInput  = forms.horizonInput  || document.querySelector('#horizon');
  forms.displayInput  = forms.displayInput  || document.querySelector('#display');
  forms.durationInput = forms.durationInput || document.querySelector('#duration');
  forms.messageInput  = forms.messageInput  || document.querySelector('#message');
  forms.iWidthInput   = forms.iWidthInput   || document.querySelector('#i-width');
  forms.iHeightInput  = forms.iHeightInput  || document.querySelector('#i-height');

  const vertical = ensureNumberValueFromHasValuePropertyHTMLElement(forms.verticalInput, HTMLInputElement);
  const horizon  = ensureNumberValueFromHasValuePropertyHTMLElement(forms.horizonInput, HTMLInputElement);
  const display  = ensureNumberValueFromHasValuePropertyHTMLElement(forms.displayInput, HTMLInputElement);
  const duration = ensureNumberValueFromHasValuePropertyHTMLElement(forms.durationInput, HTMLInputElement);
  const msg      = ensureStringValueFromHasValuePropertyHTMLElement(forms.messageInput, HTMLTextAreaElement).split('\n');
  const width    = ensureStringValueFromHasValuePropertyHTMLElement(forms.iWidthInput, HTMLInputElement);
  const height   = ensureStringValueFromHasValuePropertyHTMLElement(forms.iHeightInput, HTMLInputElement);

  return { vertical, horizon, display, duration, msg, width, height };
}

function clickButtonHandler(params: InputValues, wrapper: HTMLElement) {
  const { msg } = params;
  const pattern = 'Lines';

  if (typeof params !== 'object') {
    new Error('clickButtonHandler arg expect type is object.');
  }

  while (wrapper.firstChild) {
    wrapper.removeChild(wrapper.firstChild);
  }
  const group = generateSignboard(params);
  group.appendTo(wrapper);

  wrapper.addEventListener('click', () => {
    if (group.isAnimating) {
      group.stopAnimate.call(group);
    } else {
      group.resumeAnimate.call(group);
    }
  });


  msg.push(msg.shift());

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    switch (e.keyCode) {
    case UP_KEY:
      group.blocks.forEach((block: ExtendedByLinesPattern<OKBlock>) => {
        block.bolder();
      });
      break;
    case DOWN_KEY:
      group.blocks.forEach((block: ExtendedByLinesPattern<OKBlock>) => {
        block.lighter();
      });
      break;
    }
  });

  setTimeout(() => {
    group.animateFromString(msg, { loop: true });
  }, group.blocks[0].displayTime);
}

function generateSignboard(params: InputValues): OKBlocksGroup { // object => OKBlocksGroup
  const { SIZE } = computedStyles();

  let { pattern, vertical, horizon, display, duration, msg } = params;

  if (pattern == null) { throw new Error('params.pattern is not set.'); }
  vertical = vertical || 3;
  horizon  = horizon  || 7;
  display  = display  || 1500;
  const margin     = SIZE / (horizon * 5);
  const emblemSize = margin * 3;

  const group = new OKBlocksGroup(msg[0], { pattern: pattern, length: vertical * horizon, size: emblemSize, displayTime: display, duration: duration });

  group.blocks.forEach((e: ExtendedByLinesPattern<OKBlock>) => {
    e.dom.style.margin = `${ margin }px`;
  });

  return group;
}

function ensureNumberValueFromHasValuePropertyHTMLElement(el: ?HTMLElement, HasValuePropertyClass: Class<HasValueProperty>): number {
  if (el instanceof HasValuePropertyClass) {
    const value = parseInt((el: HasValueProperty).value, 10);
    if (Number.isNaN(value)) {
      console.error('inputed value is not a number', value);
      throw new Error('inputed value is not a number');
    } else {
      return value;
    }
  } else if (el == null) {
    console.error('given argument is null or undefined', el);
    throw new Error('given argument is null or undefined');
  } else {
    console.error('given argument is not HTMLInputElement', el);
    throw new Error('given argument is not HTMLInputElement');
  }
}

function ensureStringValueFromHasValuePropertyHTMLElement(el: ?HTMLElement, HasValuePropertyClass: Class<HasValueProperty>): string {
  if (el instanceof HasValuePropertyClass) {
    return (el: HasValueProperty).value;
  } else if (el == null) {
    console.error('given argument is null or undefined', el);
    throw new Error('given argument is null or undefined');
  } else {
    console.error('given argument is not HTMLInputElement', el);
    throw new Error('given argument is not HTMLInputElement');
  }
}

export { clickButtonHandler, getInputValues };
