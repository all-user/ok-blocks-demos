// @flow

import { computedStyles } from './helpers/computed_styles.js';
import { OKBlock, OKBlocksGroup } from '@all-user/ok-blocks';
import LinesPattern from '@all-user/ok-patterns-lines';
import type { ExtendedByLinesPattern } from '@all-user/ok-patterns-lines';
LinesPattern(OKBlock);

document.addEventListener('DOMContentLoaded', () => {
  let wrapper    = document.querySelector('#wrapper');
  const { SIZE } = computedStyles();
  const MARGIN   = SIZE / 35;
  const EMBLEM_SIZE = MARGIN * 3;
  const TITLE_COPY  = 'tokyo  2020   olympic';
  const SHORT_COPY  = 'hi!!   ';
  const DATE_COPY   = '8/9:sun';
  const BLANK_COPY  = '       ';
  const LONG_COPY   = 'olympicparalympicgame';
  const COPYS       = [
    TITLE_COPY,
    LONG_COPY,
    SHORT_COPY,
    '1234567890    ',
    BLANK_COPY,
    DATE_COPY,
    'happy     day!',
    BLANK_COPY,
    'hello  world!!',
    BLANK_COPY
  ];

  let group = new OKBlocksGroup(TITLE_COPY, { pattern: 'Lines', length: 21, size: EMBLEM_SIZE, displayTime: 1500 });

  group.blocks.forEach((e: ExtendedByLinesPattern<OKBlock>) => {
    e.dom.style.margin = `${ MARGIN }px`;
  });

  if (wrapper == null) {
    throw new Error('#wrapper is not found.');
  }
  group.appendTo(wrapper);

  wrapper.addEventListener('click', () => {
    if (group.isAnimating) {
      group.stopAnimate.call(group);
    } else {
      group.resumeAnimate.call(group);
    }
  });

  group.animateFromString(COPYS, { loop: true });

  window.group = group;
});
