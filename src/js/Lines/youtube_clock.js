// @flow
/* globals YT */

import type { YTInterface } from '../../index.js';
declare var YT: YTInterface;

import type { OKBlockOptions } from '@all-user/ok-blocks';
import type { ExtendedByLinesPattern } from '@all-user/ok-patterns-lines';

import { OKBlock, OKBlocksGroup } from '@all-user/ok-blocks';
import LinesPattern from '@all-user/ok-patterns-lines';
LinesPattern(OKBlock);
import detectKeyString from 'key-string/detectKeyString';
import moment from 'moment';
import throttle from 'lodash/throttle';
import shuffle from 'lodash/shuffle';
const pattern = 'Lines';

document.addEventListener('DOMContentLoaded', () => {
  const tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  if (firstScriptTag == null || firstScriptTag.parentNode == null) {
    throw new Error('Some kind of script tag is needed.');
  }
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  const WINDOW_RATIO = window.innerHeight / window.innerWidth;
  const APP_RATIO = 8 / 13;
  const VIDEO_RATIO = 9 / 16;
  const WRAPPER_SIZE = WINDOW_RATIO > APP_RATIO ? window.innerWidth : window.innerHeight / APP_RATIO;
  const GRID_SIZE = WRAPPER_SIZE / 13;
  const LINE_WEIGHT = 3;
  const COLORS = [
    'transparent',
    'white',
    '#fb8e19',
    '#b74be9',
    '#40beff',
    '#68dc78',
    '#f1569b',
    '#ffcc00',
    '#3695ff',
    '#b9ff12',
    '#003cff',
    '#b7b7b7',
    'black',
  ];
  let lineColorIndex = 0;
  let paddingColorIndex = 1;
  const LINE_COLOR = COLORS[lineColorIndex];
  const PADDING_COLOR = COLORS[paddingColorIndex];
  const VIDEO_IDS = shuffle([
    ['xmEhX5Ourzw', 164],
    ['ILHoyj0lRiY', 171],
    ['zsOb5sPcEiM', 180],
    ['0qfoYXaOqDY', 391],
    ['YKo6VPpvCUc', 12],
    ['1s_lTyhBFNY', 46],
    ['7eyYe-MN1Nc', 1903],
    ['5Ehd4cFEvnQ', 218],
    ['VOgpV0jwhDc', 108],
    ['PC77lsC_q_U', 149],
    ['tyHa3U-iRaM', 131],
    ['bNd8JkEptiM', 37],
    ['fmujLFHRrAA', 912],
    ['Wc_PzQvr-OQ', 65],
    ['FnxwlFVohR4', 353],
    ['OWgmXoCyaXc', 163],
    ['u6ogYNm4WFI', 74],
    ['qoLQizjh30k', 101],
    ['Vpv5bS9MK-w', 421],
    ['yEowbmxLqEM', 341],
    ['ldRhniqAI6s', 2129],
    ['-pVHC1DXQ7U', 229],
    ['3W3s2VWvYYI', 74],
    ['r0U83wtmk28', 105],
    ['laWkmljkrGo', 101],
    ['dL0lNGXoP8E', 146], // enter the void
    ['ISb8HjrcyJM', 533], // enter the void
    ['1t4zmiNR7tQ', 226], // drone
    ['cnYkifGvqHI', 260], // new york city
    ['lK_70f7PamE', 30], // better call saul
    ['rVoPzA0g3Ac', 277], // taking heads
  ]);

  if (document.body == null) {
    throw new Error('document.body is not found.');
  }
  document.body.style.backgroundColor = COLORS[paddingColorIndex];

  const getVideoSrc = id => {
    return `http://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&controls=0&showinfo=0&modestbranding=0`;
  };

  const iframe = document.querySelector('#player');
  const wrapper = document.querySelector('#wrapper');
  const videoWrapper = document.querySelector('#video-wrapper');
  let videoIndex = 0;
  const SHOW_DURATION = 20;
  const BUFFERING_DURATION = 10;
  const wrapperWidth = WRAPPER_SIZE;
  const wrapperHeight = WRAPPER_SIZE * APP_RATIO;
  if (wrapper == null) {
    throw new Error('#wrapper is not found.');
  }
  wrapper.style.width = `${wrapperWidth}px`;
  wrapper.style.height = `${wrapperHeight}px`;
  if (videoWrapper == null) {
    throw new Error('#video-wrapper is not found.');
  }
  videoWrapper.style.width = `${wrapperWidth - 2}px`;
  videoWrapper.style.height = `${wrapperHeight - 2}px`;
  if (iframe == null) {
    throw new Error('#player is not found.');
  }
  iframe.setAttribute('width', (wrapperHeight - 2) / VIDEO_RATIO + '');
  iframe.setAttribute('height', wrapperHeight - 2 + '');
  iframe.setAttribute('src', getVideoSrc(...VIDEO_IDS[videoIndex]));
  iframe.addEventListener('load', window.onYouTubeIframeAPIReady);

  let player;
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('player', {
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: err => {
          console.log('onerror');
          console.log(err);
          console.log(VIDEO_IDS[videoIndex]);
          playNext();
        }
      }
    });
  };

  const playNext = () => {
    let id;
    let duration;
    let startTime;
    [id, duration] = VIDEO_IDS[videoIndex = ++videoIndex % VIDEO_IDS.length];
    startTime = (duration - SHOW_DURATION) * Math.random();
    startTime = startTime < 0 ? 0 : startTime;
    console.log(id);
    console.log(duration);
    player.loadVideoById({
      videoId: id,
      startSeconds: startTime
    });
  };
  const onPlayerReady = ev => {
    const video = ev.target;
    video.mute();
    video.setPlaybackRate(1);
    console.log('status => ' + player.getPlayerState());
    setTimeout((_index => {
      console.log(player.getPlayerState());
      console.log(_index === videoIndex);
      if (player.getPlayerState() === YT.PlayerState.BUFFERING && _index === videoIndex) {
        playNext();
      }
    }).bind(null, videoIndex), BUFFERING_DURATION * 1000);
  };
  const onPlayerStateChange = ev => {
    console.log('onchange');
    switch (ev.data) {
    case -1:
      console.log('-1');
      break;
    case YT.PlayerState.PLAYING:
      console.log('playing');
      setTimeout(player.pauseVideo.bind(player), SHOW_DURATION * 1000);
      break;
    case YT.PlayerState.PAUSED:
      console.log('paused');
      playNext();
      break;
    case YT.PlayerState.BUFFERING:
      console.log('buffering');
      setTimeout((_index => {
        console.log(player.getPlayerState());
        console.log(_index === videoIndex);
        if (player.getPlayerState() === YT.PlayerState.BUFFERING && _index === videoIndex) {
          playNext();
        }
      }).bind(null, videoIndex), BUFFERING_DURATION * 1000);
      break;
    case YT.PlayerState.ENDED:
      console.log('ended');
      playNext();
      break;
    default:
    }
  };

  const minBlocks = new OKBlocksGroup(moment().format('HHmm'), { pattern, size: GRID_SIZE, duration: 200 });
  minBlocks.blocks[2].options = ({ size: GRID_SIZE * 2 }: OKBlockOptions);
  minBlocks.blocks[3].options = ({ size: GRID_SIZE * 3 }: OKBlockOptions);
  minBlocks.blocks.forEach((block, i) => {
    if (!(block instanceof OKBlock.patterns[pattern]._Class)) {
      throw new Error('block is not instance of LinesPattern');
    }
    block.dom.classList.add(`min-block-${i}`);
    block.lineColor = LINE_COLOR;
    block.paddingColor = PADDING_COLOR;
    block.weight = LINE_WEIGHT;
    const style = block.dom.style;
    switch (i) {
    case 0:
    case 1:
      style.top = 0 + '';
      style.left = `${GRID_SIZE * i}px`;
      break;
    case 2:
      style.top = `${GRID_SIZE}px`;
      style.left = 0 + '';
      break;
    case 3:
      style.top = 0 + '';
      style.left = `${GRID_SIZE * 2}px`;
      break;
    default:
    }
  });
  minBlocks.appendTo(wrapper);
  const secBlocks = new OKBlocksGroup(moment().format('ss'), { pattern, size: GRID_SIZE * 5, duration: 200 });
  secBlocks.blocks[1].options = { size: GRID_SIZE * 8 };
  secBlocks.blocks.forEach((block, i) => {
    if (!(block instanceof OKBlock.patterns[pattern]._Class)) {
      throw new Error('block is not instance of LinesPattern');
    }
    block.dom.classList.add(`sec-block-${i}`);
    block.lineColor = LINE_COLOR;
    block.paddingColor = PADDING_COLOR;
    block.weight = LINE_WEIGHT;
    const style = block.dom.style;
    switch (i) {
    case 0:
      style.top = `${GRID_SIZE * 3}px`;
      style.left = 0 + '';
      break;
    case 1:
      style.top = 0 + '';
      style.left = `${GRID_SIZE * 5}px`;
      break;
    default:
    }
  });
  secBlocks.appendTo(wrapper);

  let interruptMin = [null, null, null, null];
  let interruptSec = [null, null];
  const INTERRUPT_DURATION = 2000;
  const INTERRUPT_DISPLAY_TIME = 5000;
  const makeRandomInterruption = () => {
    const i = 6 * Math.random() | 0;
    let _arr;
    let _i;
    let _block;
    let _char;
    return new Promise((resolve, reject) => {
      if (i < 4) {
        _arr = interruptMin;
        _i = i;
        _block = minBlocks.blocks[_i];
      } else {
        _arr = interruptSec;
        _i = i - 4;
        _block = secBlocks.blocks[_i];
      }
      _arr[_i] = _block.allValidChars[_block.allValidChars.length * Math.random() | 0];
      _block.options = { duration: INTERRUPT_DURATION };
      _char = _block.char;
      setTimeout(resolve, INTERRUPT_DURATION + INTERRUPT_DISPLAY_TIME);
    }).then(() => {
      return new Promise((resolve, reject) => {
        _arr[_i] = _char;
        setTimeout(resolve, INTERRUPT_DURATION);
      });
    }).then(() => {
      _arr[_i] = null;
      _block.options = { duration: 200 };
    });
  };
  const makeInterruption = (minStr, secStr) => {
    const _minChars = minBlocks.toString();
    const _secChars = secBlocks.toString();
    return new Promise((resolve, reject) => {
      const validChars = minBlocks.blocks[0].allValidChars;
      if (minStr) {
        interruptMin = [...minStr];
      } else {
        interruptMin = interruptMin.map(() => validChars[validChars.length * Math.random() | 0]);
      }
      if (secStr) {
        interruptSec = [...secStr];
      } else {
        interruptSec = interruptSec.map(() => validChars[validChars.length * Math.random() | 0]);
      }
      minBlocks.options = { duration: INTERRUPT_DURATION };
      secBlocks.options = { duration: INTERRUPT_DURATION };
      setTimeout(resolve, INTERRUPT_DURATION + INTERRUPT_DISPLAY_TIME);
    }).then(() => {
      return new Promise((resolve, reject) => {
        interruptMin = [..._minChars];
        interruptSec = [..._secChars];
        setTimeout(resolve, INTERRUPT_DURATION);
      });
    }).then(() => {
      interruptMin.fill(null);
      interruptSec.fill(null);
      minBlocks.options = { duration: 200 };
      secBlocks.options = { duration: 200 };
    });
  };

  const intervalRandomInterruption = interval => {
    setTimeout(() => {
      makeRandomInterruption()
        .then(intervalRandomInterruption.bind(null, interval));
    }, interval);
  };
  const intervalInterruption = interval => {
    setTimeout(() => {
      makeInterruption()
        .then(intervalInterruption.bind(null, interval));
    }, interval);
  };

  // intervalInterruption(10000);
  // intervalRandomInterruption(6000);

  const masking = (str: string, arr) => {
    return arr.map((interrupt, i) => interrupt == null ? str[i] : interrupt);
  };
  const _updateClock = timestamp => {
    const now = moment();
    const minStr = minBlocks.toString();
    const secStr = secBlocks.toString();
    const nowMin = masking(now.format('HHmm'), interruptMin).join('');
    const nowSec = masking(now.format('ss'), interruptSec).join('');
    if (nowSec !== secStr) {
      secBlocks.map(nowSec);
    }
    if (nowMin !== minStr) {
      minBlocks.map(nowMin);
    }
  };
  const updateClock = throttle(_updateClock, 100);
  const handleRAF = timestamp => {
    updateClock(timestamp);
    requestAnimationFrame(handleRAF);
  };

  requestAnimationFrame(handleRAF);

  const changeWeight = (block, lighter) => {
    if (!(block instanceof OKBlock.patterns[pattern]._Class)) {
      throw new Error('block is not instance of LinesPattern');
    }
    block.lineColor = COLORS[lineColorIndex];
    if (lighter) {
      block.lighter();
    } else {
      block.bolder();
    }
  };
  const changeLineColor = block => {
    if (!(block instanceof OKBlock.patterns[pattern]._Class)) {
      throw new Error('block is not instance of LinesPattern');
    }
    block.lineColor = COLORS[lineColorIndex];
  };
  const changePaddingColor = block => {
    if (!(block instanceof OKBlock.patterns[pattern]._Class)) {
      throw new Error('block is not instance of LinesPattern');
    }
    block.paddingColor = COLORS[paddingColorIndex];
  };
  const lighter = block => changeWeight(block, true);
  const bolder  = block => changeWeight(block, false);
  document.addEventListener('keydown', (ev: KeyboardEvent) => {
    const key = detectKeyString(ev);
    switch (key) {
    case 'Shift+J':
      minBlocks.blocks.forEach(lighter);
      secBlocks.blocks.forEach(lighter);
      break;
    case 'Shift+K':
      minBlocks.blocks.forEach(bolder);
      secBlocks.blocks.forEach(bolder);
      break;
    case 'Shift+C':
      paddingColorIndex = ++paddingColorIndex % COLORS.length;
      minBlocks.blocks.forEach(changePaddingColor);
      secBlocks.blocks.forEach(changePaddingColor);
      if (document.body == null) {
        throw new Error('document.body is not found.');
      }
      document.body.style.backgroundColor = COLORS[paddingColorIndex];
      break;
    case 'Shift+L':
      lineColorIndex = ++lineColorIndex % COLORS.length;
      minBlocks.blocks.forEach(changeLineColor);
      secBlocks.blocks.forEach(changeLineColor);
      break;
    default:
    }
  });
});
