(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _embed_helper = require('./helpers/embed_helper.js');

document.addEventListener('DOMContentLoaded', function () {
    var wrapper = document.querySelector('#wrapper');
    var messageInput = document.querySelector('#message');
    var embedOutput = document.querySelector('#embed-output');
    var genButton = document.querySelector('#generate-button');
    var codeButton = document.querySelector('#embed-button');

    var PATTERN = 'Lines';
    var TITLE_COPY = 'tokyo  2020   olympic';
    var SHORT_COPY = 'hi!!   ';
    var DATE_COPY = '8/9:sun';
    var BLANK_COPY = '       ';
    var LONG_COPY = 'olympicparalympicgame';
    var COPYS = [TITLE_COPY, LONG_COPY, SHORT_COPY, BLANK_COPY, '1234567890    ', BLANK_COPY, DATE_COPY, 'happy  day!', BLANK_COPY, 'hello  world!!'];

    var params = {
        pattern: PATTERN,
        vertical: 3,
        horizon: 7,
        display: 1500,
        duration: 200,
        msg: COPYS
    };

    messageInput.textContent = COPYS.join('\n');

    (0, _embed_helper.clickButtonHandler)(params);

    genButton.addEventListener('click', function (e) {
        var options = (0, _embed_helper.getInputValues)();
        options.pattern = PATTERN;
        (0, _embed_helper.clickButtonHandler)(options);
        scroll(0, 0);
    });

    codeButton.addEventListener('click', function (e) {
        var embedCode = genEmbedCode();
        embedOutput.value = embedCode;
    });
});

function genEmbedCode() {
    var _getInputValues = (0, _embed_helper.getInputValues)();

    var width = _getInputValues.width;
    var height = _getInputValues.height;
    var vertical = _getInputValues.vertical;
    var horizon = _getInputValues.horizon;
    var display = _getInputValues.display;
    var duration = _getInputValues.duration;
    var msg = _getInputValues.msg;


    return '<iframe style="width:' + width + ';height:' + height + ';border:none;" src="https://all-user.github.io/olympic2020/demo/embed_response/index.html?vertical=' + vertical + '&horizon=' + horizon + '&display=' + display + '&duration=' + duration + '&msg=' + fixedEncodeURIComponent(msg) + '"></iframe>';
}

function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}

},{"./helpers/embed_helper.js":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function computedStyles() {
    var WIDTH = +getComputedStyle(document.querySelector('.container')).width.replace('px', '');
    var PADDING = +getComputedStyle(document.querySelector('.container')).paddingLeft.replace('px', '');
    var SIZE = WIDTH - PADDING * 2;

    return { WIDTH: WIDTH, PADDING: PADDING, SIZE: SIZE };
}

exports.computedStyles = computedStyles;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getInputValues = exports.clickButtonHandler = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _computed_styles = require('./computed_styles.js');

var UP_KEY = 75;
var DOWN_KEY = 74;

var forms = {};

function getInputValues() {
    forms.verticalInput = forms.verticalInput || document.querySelector('#vertical');
    forms.horizonInput = forms.horizonInput || document.querySelector('#horizon');
    forms.displayInput = forms.displayInput || document.querySelector('#display');
    forms.durationInput = forms.durationInput || document.querySelector('#duration');
    forms.messageInput = forms.messageInput || document.querySelector('#message');
    forms.iWidthInput = forms.iWidthInput || document.querySelector('#i-width');
    forms.iHeightInput = forms.iHeightInput || document.querySelector('#i-height');

    var vertical = forms.verticalInput.value | 0;
    var horizon = forms.horizonInput.value | 0;
    var display = forms.displayInput.value | 0;
    var duration = forms.durationInput.value | 0;
    var msg = forms.messageInput.value.split('\n');
    var width = forms.iWidthInput.value;
    var height = forms.iHeightInput.value;

    return { vertical: vertical, horizon: horizon, display: display, duration: duration, msg: msg, width: width, height: height };
}

function clickButtonHandler(params) {

    if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
        new Error('clickButtonHandler arg expect type is object.');
    }

    while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
    }

    var group = generateSignboard(params);
    group.appendTo(wrapper);

    wrapper.addEventListener('click', function () {
        if (group.isAnimating) {
            group.stopAnimate.call(group);
        } else {
            group.resumeAnimate.call(group);
        }
    });

    params.msg = params.msg.slice(1).concat(params.msg[0]);

    document.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case UP_KEY:
                group.emblems.forEach(function (emb) {
                    emb.bolder();
                });
                break;
            case DOWN_KEY:
                group.emblems.forEach(function (emb) {
                    emb.lighter();
                });
                break;
        }
    });

    setTimeout(function () {
        group.animateFromString(params.msg, { loop: true });
    }, group.emblems[0].displayTime);
}

function generateSignboard(params) {
    // object => OKBlocksGroup

    var _computedStyles = (0, _computed_styles.computedStyles)();

    var SIZE = _computedStyles.SIZE;


    if (!(typeof params === 'undefined' ? 'undefined' : _typeof(params)) === 'object') {
        return;
    }

    var pattern = params.pattern;
    var vertical = params.vertical;
    var horizon = params.horizon;
    var display = params.display;
    var duration = params.duration;
    var msg = params.msg;


    vertical = vertical || 3;
    horizon = horizon || 7;
    display = display || 1500;
    var emblemSize = SIZE / horizon;

    var group = new OKBlocksGroup(msg[0], { pattern: pattern, length: vertical * horizon, size: emblemSize, displayTime: display, duration: duration });

    group.emblems.forEach(function (e) {
        e.dom.style.margin = '0px';
    });

    return group;
}

exports.clickButtonHandler = clickButtonHandler;
exports.getInputValues = getInputValues;

},{"./computed_styles.js":2}]},{},[1]);
