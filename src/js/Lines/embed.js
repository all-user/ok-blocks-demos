// @flow

const { OKBlock } = require('@all-user/ok-blocks');
require('@all-user/ok-patterns-lines')(OKBlock);
import { clickButtonHandler, getInputValues } from './helpers/embed_helper.js';
import type { InputValues } from '../../index.js';

const PATTERN    = 'Lines';
document.addEventListener('DOMContentLoaded', () => {
  const wrapper      = document.querySelector('#wrapper');
  const messageInput = document.querySelector('#message');
  const embedOutput  = document.querySelector('#embed-output');
  const genButton    = document.querySelector('#generate-button');
  const codeButton   = document.querySelector('#embed-button');

  const TITLE_COPY = 'tokyo  2020   olympic';
  const SHORT_COPY = 'hi!!   ';
  const DATE_COPY  = '8/9:sun';
  const BLANK_COPY = '       ';
  const LONG_COPY  = 'olympicparalympicgame';
  const COPYS      = [
    TITLE_COPY,
    LONG_COPY,
    SHORT_COPY,
    BLANK_COPY,
    '1234567890    ',
    BLANK_COPY,
    DATE_COPY,
    'happy  day!',
    BLANK_COPY,
    'hello  world!!'
  ];

  if (messageInput == null) {
    throw new Error('#message is not found.');
  }
  messageInput.textContent = COPYS.join('\n');

  if (wrapper == null) {
    throw new Error('#wrapper is not found.');
  }
  const params = {
    pattern: PATTERN,
    vertical: 3,
    horizon: 7,
    display: 1500,
    duration: 200,
    msg: COPYS
  };
  clickButtonHandler(params, wrapper);

  if (genButton == null) {
    throw new Error('#generate-button is not found.');
  }
  genButton.addEventListener('click', () => {
    const options: InputValues = getInputValues();
    options.pattern = PATTERN;
    clickButtonHandler(options, wrapper);
    window.scroll(0, 0);
  });

  if (codeButton == null) {
    throw new Error('#embed-button is not found.');
  }
  codeButton.addEventListener('click', () => {
    const embedCode = genEmbedCode();
    if (embedOutput == null) {
      throw new Error('#embed-output is not found');
    }
    if (!(embedOutput instanceof HTMLInputElement)) {
      console.error('#embed-output sould be HTMLInputElement.');
      return;
    }
    embedOutput.value = embedCode;
  });

});

function genEmbedCode() {
  const { width, height, vertical, horizon, display, duration, msg } = getInputValues();
  if (typeof width !== 'string' || typeof height !== 'string') {
    throw new Error('height and width should be css string(e.g., 100vw).');
  }
  return `<iframe style="width:${ width };height:${ height };border:none;" src="https://all-user.github.io/ok-blocks/demos/Lines/embed_response/index.html?vertical=${ vertical }&horizon=${ horizon }&display=${ display }&duration=${ duration }&msg=${ fixedEncodeURIComponent(msg) }&pattern=${ PATTERN }"></iframe>`;
}

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str.join(',')).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16);
  });
}
