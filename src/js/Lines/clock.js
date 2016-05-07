/* globals YT */
import keyStringDetector from 'key-string';
const moment = require('moment');
const throttle = require('lodash/throttle');

document.addEventListener('DOMContentLoaded', () => {
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  let { OKBlock } = require('@all-user/ok-blocks');
  let { OKBlocksGroup } = require('@all-user/ok-blocks');
  require('@all-user/ok-patterns-lines')(OKBlock);

  const WINDOW_RATIO = innerHeight / innerWidth;
  const APP_RATIO = 8 / 13;
  const VIDEO_RATIO = 9 / 16;
  const WRAPPER_SIZE = WINDOW_RATIO > APP_RATIO ? innerWidth : innerHeight / APP_RATIO;
  const GRID_SIZE = WRAPPER_SIZE / 13;
  const LINE_WEIGHT = 3;
  const LINE_COLOR = 'transparent';
  const PADDING_COLOR = 'white';
  const VIDEO_IDS = [
    '7eyYe-MN1Nc',
    '5Ehd4cFEvnQ',
    'VOgpV0jwhDc',
    'PC77lsC_q_U',
    'tyHa3U-iRaM'
  ];
  const getVideoSrc = id => {
    return `http://www.youtube.com/embed/${id}?enablejsapi=1&autoplay=1&controls=0&showinfo=0&modestbranding=0`;
  };

  let iframe = document.querySelector('#player');
  let wrapper = document.querySelector('#wrapper');
  let videoWrapper = document.querySelector('#video-wrapper');
  let videoIndex = 2;
  const SHOW_DURATION = 10;
  const wrapperWidth = WRAPPER_SIZE;
  const wrapperHeight = WRAPPER_SIZE * APP_RATIO;
  wrapper.style.width = `${wrapperWidth}px`;
  wrapper.style.height = `${wrapperHeight}px`;
  videoWrapper.style.width = `${wrapperWidth - 2}px`;
  videoWrapper.style.height = `${wrapperHeight - 2}px`;
  iframe.setAttribute('width', (wrapperHeight - 2) / VIDEO_RATIO);
  iframe.setAttribute('height', wrapperHeight - 2);
  iframe.setAttribute('src', getVideoSrc(VIDEO_IDS[videoIndex]));
  iframe.addEventListener('load', window.onYouTubeIframeAPIReady);

  let player;
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('player', {
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: err => { console.log(`onerror => ${err}`); }
      }
    });
  };

  const onPlayerReady = ev => {
    let video = ev.target;
    video.mute();
    video.setPlaybackRate(1);
  };
  let duration = 0;
  let first = true;
  const onPlayerStateChange = ev => {
    switch (ev.data) {
    case YT.PlayerState.PLAYING:
      console.log('playing');
      if (first) {
        setTimeout(player.pauseVideo.bind(player), SHOW_DURATION * 1000);
        first = false;
      }
      break;
    case YT.PlayerState.ENDED:
    case YT.PlayerState.PAUSED:
      console.log('ended, paused');
      duration = (player.getDuration() - SHOW_DURATION) * Math.random();
      duration = duration < 0 ? 0 : duration;
      console.log(duration);
      player.loadVideoById({
        videoId: VIDEO_IDS[++videoIndex % VIDEO_IDS.length],
        startSeconds: duration,
        endSeconds: duration + SHOW_DURATION
      });
      break;
    default:
    }
  };

  let minBlocks = new OKBlocksGroup(moment().format('HHmm'), { pattern: 'Lines', size: GRID_SIZE, duration: 200 });
  minBlocks.emblems[2].options = { size: GRID_SIZE * 2 };
  minBlocks.emblems[3].options = { size: GRID_SIZE * 3 };
  minBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`min-block-${i}`);
    block.lineColor = LINE_COLOR;
    block.paddingColor = PADDING_COLOR;
    block.weight = LINE_WEIGHT;
    let style = block.dom.style;
    switch (i) {
    case 0:
    case 1:
      style.top = 0;
      style.left = `${GRID_SIZE * i}px`;
      break;
    case 2:
      style.top = `${GRID_SIZE}px`;
      style.left = 0;
      break;
    case 3:
      style.top = 0;
      style.left = `${GRID_SIZE * 2}px`;
      break;
    default:
    }
  });
  minBlocks.appendTo(wrapper);
  let secBlocks = new OKBlocksGroup(moment().format('ss'), { pattern: 'Lines', size: GRID_SIZE * 5, duration: 200 });
  secBlocks.emblems[1].options = { size: GRID_SIZE * 8 };
  secBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`sec-block-${i}`);
    block.lineColor = LINE_COLOR;
    block.paddingColor = PADDING_COLOR;
    block.weight = LINE_WEIGHT;
    let style = block.dom.style;
    switch (i) {
    case 0:
      style.top = `${GRID_SIZE * 3}px`;
      style.left = 0;
      break;
    case 1:
      style.top = 0;
      style.left = `${GRID_SIZE * 5}px`;
      break;
    default:
    }
  });
  secBlocks.appendTo(wrapper);

  const _updateClock = timestamp => {
    const now = moment();
    const secStr = secBlocks.toString();
    const nowSec = now.format('ss');
    if (nowSec === secStr) { return; }
    secBlocks.map(nowSec);
    if (nowSec !== '00') { return; }
    const nowMin = now.format('HHmm');
    minBlocks.map(nowMin);
  };
  const updateClock = throttle(_updateClock, 100);
  const handleRAF = timestamp => {
    updateClock(timestamp);
    requestAnimationFrame(handleRAF);
  };

  requestAnimationFrame(handleRAF);

  const changeWeight = (block, lighter) => {
    if (lighter) {
      block.lighter();
    } else {
      block.bolder();
    }
  };
  const lighter = block => changeWeight(block, true);
  const bolder  = block => changeWeight(block, false);
  const detector = new keyStringDetector();
  document.addEventListener('keydown', ev => {
    let key = detector.detect(ev);
    switch (key) {
    case 'J':
      minBlocks.emblems.forEach(lighter);
      secBlocks.emblems.forEach(lighter);
      break;
    case 'K':
      minBlocks.emblems.forEach(bolder);
      secBlocks.emblems.forEach(bolder);
      break;
    default:
    }
  });
});
