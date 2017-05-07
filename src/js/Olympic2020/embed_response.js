// @flow

let { OKBlock } = require('@all-user/ok-blocks');
require('@all-user/ok-patterns-olympic2020')(OKBlock);
import { clickButtonHandler } from './helpers/embed_helper.js';
import type { InputValues } from '@all-user/ok-blocks-demos.types';

document.addEventListener('DOMContentLoaded', () => {
  let pairs  = decodeURIComponent(location.search.slice(1)).split('&');
  let params = pairs.reduce((params, s) => {
    let keyValue = s.split('=');
    params[keyValue[0]] = keyValue[1];
    return params;
  }, {});

  params.msg = params.msg.split(',');

  const wrapper = document.querySelector('#wrapper');
  if (wrapper == null) {
    throw new Error('#wrapper is not found.');
  }
  if (typeof params.display !== 'number') {
    params.display = 0;
  }
  if (typeof params.duration !== 'number') {
    params.duration = 0;
  }
  if (typeof params.vertical !== 'number') {
    params.vertical = 0;
  }
  if (typeof params.horizon !== 'number') {
    params.horizon = 0;
  }
  clickButtonHandler((params: InputValues), wrapper);
});
