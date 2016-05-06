/* globals YT */
document.addEventListener('DOMContentLoaded', () => {
  let tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  let firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  let { OKBlock } = require('@all-user/ok-blocks');
  let { OKBlocksGroup } = require('@all-user/ok-blocks');
  require('@all-user/ok-patterns-lines')(OKBlock);

  const { computedStyles } = require('./helpers/computed_styles.js');
  const WRAPPER_SIZE = computedStyles().SIZE;
  const GRID_SIZE = WRAPPER_SIZE / 23;
  const MARGIN_SIZE = GRID_SIZE * 2;
  const MIN_BLOCK_SIZE = GRID_SIZE * 3;
  const SEC_BLOCK_SIZE = GRID_SIZE * 8;
  const LINE_WEIGHT = 3;
  const LINE_COLOR = 'transparent';
  // const PADDING_COLOR = '#aaa9a7';
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
  let videoIndex = 2;
  const SHOW_DURATION = 6;
  const wrapperWidth = GRID_SIZE * 23;
  const wrapperHeight = GRID_SIZE * 13;
  wrapper.style.width = `${wrapperWidth}px`;
  wrapper.style.height = `${wrapperHeight}px`;
  iframe.setAttribute('width', wrapperWidth - 2);
  iframe.setAttribute('height', wrapperHeight - 2);
  iframe.setAttribute('src', getVideoSrc(VIDEO_IDS[videoIndex]));
  iframe.addEventListener('load', window.onYouTubeIframeAPIReady);

  let player;
  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player('player', {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  const onPlayerReady = ev => {
    let video = ev.target;
    video.mute();
    video.setPlaybackRate(1);
  };
  const onPlayerStateChange = ev => {
    switch (ev.data) {
    case YT.PlayerState.PLAYING:
      console.log('playing');
      setTimeout(player.pauseVideo.bind(player), SHOW_DURATION * 1000);
      break;
    case YT.PlayerState.ENDED:
    case YT.PlayerState.PAUSED:
      console.log('ended, paused');
      player.loadVideoById(VIDEO_IDS[++videoIndex % VIDEO_IDS.length], player.getDuration() * Math.random());
      break;
    default:
    }
  };

  let minBlocks = new OKBlocksGroup('04:39', { pattern: 'Lines', size: MIN_BLOCK_SIZE, duration: 200 });
  minBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`min-block-${i}`);
    let style = block.dom.style;
    style.top = 0;
    style.left = `${(MIN_BLOCK_SIZE + MARGIN_SIZE) * i}px`;
    block.lineColor = LINE_COLOR;
    block.paddingColor = PADDING_COLOR;
    block.weight = LINE_WEIGHT;
  });
  minBlocks.appendTo(wrapper);
  let secBlocks = new OKBlocksGroup('**', { pattern: 'Lines', size: SEC_BLOCK_SIZE, duration: 200 });
  secBlocks.emblems.forEach((block, i) => {
    block.dom.classList.add(`sec-block-${i}`);
    let style = block.dom.style;
    style.top = `${GRID_SIZE * 5}px`;
    style.left = `${GRID_SIZE * 15 * i}px`;
    block.lineColor = LINE_COLOR;
    block.paddingColor = PADDING_COLOR;
    block.weight = LINE_WEIGHT;
  });
  secBlocks.appendTo(wrapper);
  secBlocks.options = { loop: true, displayTime: 1000 };
  secBlocks.animateFromString('1112131415161718192021222324252627282930');
  [...'_'.repeat(6)].forEach((_, i) => {
    let mask = document.querySelector(`.mask.num-${i}`);
    let style = mask.style;
    switch (i) {
    case 0:
    case 1:
    case 2:
    case 3:
      style.top = 0;
      style.left = `${(MIN_BLOCK_SIZE + MARGIN_SIZE) * i + MIN_BLOCK_SIZE}px`;
      style.width = `${MARGIN_SIZE}px`;
      style.height = `${MIN_BLOCK_SIZE}px`;
      break;
    case 4:
      style.top = `${GRID_SIZE * 5}px`;
      style.left = `${SEC_BLOCK_SIZE}px`;
      style.width = `${GRID_SIZE * 7}px`;
      style.height = `${SEC_BLOCK_SIZE}px`;
      break;
    case 5:
      style.top = `${GRID_SIZE * 3}px`;
      style.left = `${GRID_SIZE * 0}px`;
      style.width = `${GRID_SIZE * 23}px`;
      style.height = `${GRID_SIZE * 2}px`;
      break;
    default:
      throw new Error(`exception in switch. expression => ${i}`);
    }
  });
});
