/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @example
 * step 1: let a = new gl3Audio(bgmGainValue, soundGainValue) <- float(0.0 to 1.0)
 * step 2: a.load(url, index, loop, background) <- string, int, boolean, boolean
 * step 3: a.src[index].loaded then a.src[index].play()
 */

/**
 * gl3Audio
 * @class gl3Audio
 */
var gl3Audio = function () {
    /**
     * @constructor
     * @param {number} bgmGainValue - BGM の再生音量
     * @param {number} soundGainValue - 効果音の再生音量
     */
    function gl3Audio(bgmGainValue, soundGainValue) {
        _classCallCheck(this, gl3Audio);

        /**
         * オーディオコンテキスト
         * @type {AudioContext}
         */
        this.ctx = null;
        /**
         * ダイナミックコンプレッサーノード
         * @type {DynamicsCompressorNode}
         */
        this.comp = null;
        /**
         * BGM 用のゲインノード
         * @type {GainNode}
         */
        this.bgmGain = null;
        /**
         * 効果音用のゲインノード
         * @type {GainNode}
         */
        this.soundGain = null;
        /**
         * オーディオソースをラップしたクラスの配列
         * @type {Array.<AudioSrc>}
         */
        this.src = null;
        if (typeof AudioContext != 'undefined' || typeof webkitAudioContext != 'undefined') {
            if (typeof AudioContext != 'undefined') {
                this.ctx = new AudioContext();
            } else {
                this.ctx = new webkitAudioContext();
            }
            this.comp = this.ctx.createDynamicsCompressor();
            this.comp.connect(this.ctx.destination);
            this.bgmGain = this.ctx.createGain();
            this.bgmGain.connect(this.comp);
            this.bgmGain.gain.setValueAtTime(bgmGainValue, 0);
            this.soundGain = this.ctx.createGain();
            this.soundGain.connect(this.comp);
            this.soundGain.gain.setValueAtTime(soundGainValue, 0);
            this.src = [];
        } else {
            throw new Error('not found AudioContext');
        }
    }

    /**
     * ファイルをロードする
     * @param {string} path - オーディオファイルのパス
     * @param {number} index - 内部プロパティの配列に格納するインデックス
     * @param {boolean} loop - ループ再生を設定するかどうか
     * @param {boolean} background - BGM として設定するかどうか
     * @param {function} callback - 読み込みと初期化が完了したあと呼ばれるコールバック
     */


    _createClass(gl3Audio, [{
        key: 'load',
        value: function load(path, index, loop, background, callback) {
            var ctx = this.ctx;
            var gain = background ? this.bgmGain : this.soundGain;
            var src = this.src;
            src[index] = null;
            var xml = new XMLHttpRequest();
            xml.open('GET', path, true);
            xml.setRequestHeader('Pragma', 'no-cache');
            xml.setRequestHeader('Cache-Control', 'no-cache');
            xml.responseType = 'arraybuffer';
            xml.onload = function () {
                ctx.decodeAudioData(xml.response, function (buf) {
                    src[index] = new AudioSrc(ctx, gain, buf, loop, background);
                    src[index].loaded = true;
                    console.log('%c◆%c audio number: %c' + index + '%c, audio loaded: %c' + path, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                    callback();
                }, function (e) {
                    console.log(e);
                });
            };
            xml.send();
        }

        /**
         * ロードの完了をチェックする
         * @return {boolean} ロードが完了しているかどうか
         */

    }, {
        key: 'loadComplete',
        value: function loadComplete() {
            var i = void 0,
                f = void 0;
            f = true;
            for (i = 0; i < this.src.length; i++) {
                f = f && this.src[i] != null && this.src[i].loaded;
            }
            return f;
        }
    }]);

    return gl3Audio;
}();

/**
 * オーディオやソースファイルを管理するためのクラス
 * @class AudioSrc
 */


exports.default = gl3Audio;

var AudioSrc = function () {
    /**
     * @constructor
     * @param {AudioContext} ctx - 対象となるオーディオコンテキスト
     * @param {GainNode} gain - 対象となるゲインノード
     * @param {ArrayBuffer} audioBuffer - バイナリのオーディオソース
     * @param {boolean} bool - ループ再生を設定するかどうか
     * @param {boolean} background - BGM として設定するかどうか
     */
    function AudioSrc(ctx, gain, audioBuffer, loop, background) {
        _classCallCheck(this, AudioSrc);

        /**
         * 対象となるオーディオコンテキスト
         * @type {AudioContext}
         */
        this.ctx = ctx;
        /**
         * 対象となるゲインノード
         * @type {GainNode}
         */
        this.gain = gain;
        /**
         * ソースファイルのバイナリデータ
         * @type {ArrayBuffer}
         */
        this.audioBuffer = audioBuffer;
        /**
         * オーディオバッファソースノードを格納する配列
         * @type {Array.<AudioBufferSourceNode>}
         */
        this.bufferSource = [];
        /**
         * アクティブなバッファソースのインデックス
         * @type {number}
         */
        this.activeBufferSource = 0;
        /**
         * ループするかどうかのフラグ
         * @type {boolean}
         */
        this.loop = loop;
        /**
         * ロード済みかどうかを示すフラグ
         * @type {boolean}
         */
        this.loaded = false;
        /**
         * FFT サイズ
         * @type {number}
         */
        this.fftLoop = 16;
        /**
         * このフラグが立っている場合再生中のデータを一度取得する
         * @type {boolean}
         */
        this.update = false;
        /**
         * BGM かどうかを示すフラグ
         * @type {boolean}
         */
        this.background = background;
        /**
         * スクリプトプロセッサーノード
         * @type {ScriptProcessorNode}
         */
        this.node = this.ctx.createScriptProcessor(2048, 1, 1);
        /**
         * アナライザノード
         * @type {AnalyserNode}
         */
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.8;
        this.analyser.fftSize = this.fftLoop * 2;
        /**
         * データを取得する際に利用する型付き配列
         * @type {Uint8Array}
         */
        this.onData = new Uint8Array(this.analyser.frequencyBinCount);
    }

    /**
     * オーディオを再生する
     */


    _createClass(AudioSrc, [{
        key: 'play',
        value: function play() {
            var _this = this;

            var i = void 0,
                j = void 0,
                k = void 0;
            var self = this;
            i = this.bufferSource.length;
            k = -1;
            if (i > 0) {
                for (j = 0; j < i; j++) {
                    if (!this.bufferSource[j].playnow) {
                        this.bufferSource[j] = null;
                        this.bufferSource[j] = this.ctx.createBufferSource();
                        k = j;
                        break;
                    }
                }
                if (k < 0) {
                    this.bufferSource[this.bufferSource.length] = this.ctx.createBufferSource();
                    k = this.bufferSource.length - 1;
                }
            } else {
                this.bufferSource[0] = this.ctx.createBufferSource();
                k = 0;
            }
            this.activeBufferSource = k;
            this.bufferSource[k].buffer = this.audioBuffer;
            this.bufferSource[k].loop = this.loop;
            this.bufferSource[k].playbackRate.value = 1.0;
            if (!this.loop) {
                this.bufferSource[k].onended = function () {
                    _this.stop(0);
                    _this.playnow = false;
                };
            }
            if (this.background) {
                this.bufferSource[k].connect(this.analyser);
                this.analyser.connect(this.node);
                this.node.connect(this.ctx.destination);
                this.node.onaudioprocess = function (eve) {
                    onprocessEvent(eve);
                };
            }
            this.bufferSource[k].connect(this.gain);
            this.bufferSource[k].start(0);
            this.bufferSource[k].playnow = true;

            function onprocessEvent(eve) {
                if (self.update) {
                    self.update = false;
                    self.analyser.getByteFrequencyData(self.onData);
                }
            }
        }

        /**
         * オーディオの再生を止める
         */

    }, {
        key: 'stop',
        value: function stop() {
            this.bufferSource[this.activeBufferSource].stop(0);
            this.playnow = false;
        }
    }]);

    return AudioSrc;
}();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @example
 * let wrapper = new gl3.Gui.Wrapper();
 * document.body.appendChild(wrapper.getElement());
 *
 * let slider = new gl3.Gui.Slider('test', 50, 0, 100, 1);
 * slider.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(slider.getElement());
 *
 * let check = new gl3.Gui.Checkbox('hoge', false);
 * check.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(check.getElement());
 *
 * let radio = new gl3.Gui.Radio('hoge', null, false);
 * radio.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(radio.getElement());
 *
 * let select = new gl3.Gui.Select('fuga', ['foo', 'baa'], 0);
 * select.add('change', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(select.getElement());
 *
 * let spin = new gl3.Gui.Spin('hoge', 0.0, -1.0, 1.0, 0.1);
 * spin.add('input', (eve, self) => {console.log(self.getValue());});
 * wrapper.append(spin.getElement());
 *
 * let color = new gl3.Gui.Color('fuga', '#ff0000');
 * color.add('change', (eve, self) => {console.log(self.getValue(), self.getFloatValue());});
 * wrapper.append(color.getElement());
 */

/**
 * gl3Gui
 * @class gl3Gui
 */
var gl3Gui = function () {
  _createClass(gl3Gui, null, [{
    key: 'WIDTH',
    get: function get() {
      return 400;
    }
    /**
     * @constructor
     */

  }]);

  function gl3Gui() {
    _classCallCheck(this, gl3Gui);

    /**
     * GUIWrapper
     * @type {GUIWrapper}
     */
    this.Wrapper = GUIWrapper;
    /**
     * GUIElement
     * @type {GUIElement}
     */
    this.Element = GUIElement;
    /**
     * GUISlider
     * @type {GUISlider}
     */
    this.Slider = GUISlider;
    /**
     * GUICheckbox
     * @type {GUICheckbox}
     */
    this.Checkbox = GUICheckbox;
    /**
     * GUIRadio
     * @type {GUIRadio}
     */
    this.Radio = GUIRadio;
    /**
     * GUISelect
     * @type {GUISelect}
     */
    this.Select = GUISelect;
    /**
     * GUISpin
     * @type {GUISpin}
     */
    this.Spin = GUISpin;
    /**
     * GUIColor
     * @type {GUIColor}
     */
    this.Color = GUIColor;
  }

  return gl3Gui;
}();

/**
 * GUIWrapper
 * @class GUIWrapper
 */


exports.default = gl3Gui;

var GUIWrapper = function () {
  /**
   * @constructor
   */
  function GUIWrapper() {
    var _this = this;

    _classCallCheck(this, GUIWrapper);

    /**
     * GUI 全体を包むラッパー DOM
     * @type {HTMLDivElement}
     */
    this.element = document.createElement('div');
    this.element.style.position = 'absolute';
    this.element.style.top = '0px';
    this.element.style.right = '0px';
    this.element.style.width = gl3Gui.WIDTH + 'px';
    this.element.style.height = '100%';
    this.element.style.transition = 'right 0.8s cubic-bezier(0, 0, 0, 1.0)';
    /**
     * GUI パーツを包むラッパー DOM
     * @type {HTMLDivElement}
     */
    this.wrapper = document.createElement('div');
    this.wrapper.style.backgroundColor = 'rgba(64, 64, 64, 0.5)';
    this.wrapper.style.height = '100%';
    this.wrapper.style.overflow = 'auto';
    /**
     * GUI 折りたたみトグル
     * @type {HTMLDivElement}
     */
    this.toggle = document.createElement('div');
    this.toggle.className = 'visible';
    this.toggle.textContent = '▶';
    this.toggle.style.fontSize = '18px';
    this.toggle.style.lineHeight = '32px';
    this.toggle.style.color = 'rgba(240, 240, 240, 0.5)';
    this.toggle.style.backgroundColor = 'rgba(32, 32, 32, 0.5)';
    this.toggle.style.position = 'absolute';
    this.toggle.style.top = '0px';
    this.toggle.style.right = gl3Gui.WIDTH + 'px';
    this.toggle.style.width = '32px';
    this.toggle.style.height = '32px';
    this.toggle.style.cursor = 'pointer';
    this.toggle.style.transform = 'rotate(0deg)';
    this.toggle.style.transition = 'transform 0.5s cubic-bezier(0, 0, 0, 1.0)';

    this.element.appendChild(this.toggle);
    this.element.appendChild(this.wrapper);

    this.toggle.addEventListener('click', function () {
      _this.toggle.classList.toggle('visible');
      if (_this.toggle.classList.contains('visible')) {
        _this.element.style.right = '0px';
        _this.toggle.style.transform = 'rotate(0deg)';
      } else {
        _this.element.style.right = '-' + gl3Gui.WIDTH + 'px';
        _this.toggle.style.transform = 'rotate(-180deg)';
      }
    });
  }
  /**
   * エレメントを返す
   * @return {HTMLDivElement}
   */


  _createClass(GUIWrapper, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
    /**
     * 子要素をアペンドする
     * @param {HTMLElement} element - アペンドする要素
     */

  }, {
    key: 'append',
    value: function append(element) {
      this.wrapper.appendChild(element);
    }
  }]);

  return GUIWrapper;
}();

/**
 * GUIElement
 * @class GUIElement
 */


var GUIElement = function () {
  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   */
  function GUIElement() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    _classCallCheck(this, GUIElement);

    /**
     * エレメントラッパー DOM
     * @type {HTMLDivElement}
     */
    this.element = document.createElement('div');
    this.element.style.fontSize = 'small';
    this.element.style.textAlign = 'center';
    this.element.style.width = gl3Gui.WIDTH + 'px';
    this.element.style.height = '30px';
    this.element.style.lineHeight = '30px';
    this.element.style.display = 'flex';
    this.element.style.flexDirection = 'row';
    this.element.style.justifyContent = 'flex-start';
    /**
     * ラベル用エレメント DOM
     * @type {HTMLSpanElement}
     */
    this.label = document.createElement('span');
    this.label.textContent = text;
    this.label.style.color = '#222';
    this.label.style.textShadow = '0px 0px 5px white';
    this.label.style.display = 'inline-block';
    this.label.style.margin = 'auto 5px';
    this.label.style.width = '120px';
    this.label.style.overflow = 'hidden';
    this.element.appendChild(this.label);
    /**
     * 値表示用 DOM
     * @type {HTMLSpanElement}
     */
    this.value = document.createElement('span');
    this.value.style.backgroundColor = 'rgba(0, 0, 0, 0.25)';
    this.value.style.color = 'whitesmoke';
    this.value.style.fontSize = 'x-small';
    this.value.style.textShadow = '0px 0px 5px black';
    this.value.style.display = 'inline-block';
    this.value.style.margin = 'auto 5px';
    this.value.style.width = '80px';
    this.value.style.overflow = 'hidden';
    this.element.appendChild(this.value);
    /**
     * コントロール DOM
     * @type {HTMLElement}
     */
    this.control = null;
    /**
     * ラベルに設定するテキスト
     * @type {string}
     */
    this.text = text;
    /**
     * イベントリスナ
     * @type {object}
     */
    this.listeners = {};
  }
  /**
   * イベントリスナを登録する
   * @param {string} type - イベントタイプ
   * @param {function} func - 登録する関数
   */


  _createClass(GUIElement, [{
    key: 'add',
    value: function add(type, func) {
      if (this.control == null || type == null || func == null) {
        return;
      }
      if (Object.prototype.toString.call(type) !== '[object String]') {
        return;
      }
      if (Object.prototype.toString.call(func) !== '[object Function]') {
        return;
      }
      this.listeners[type] = func;
    }
    /**
     * イベントを発火する
     * @param {string} type - 発火するイベントタイプ
     * @param {Event} eve - Event オブジェクト
     */

  }, {
    key: 'emit',
    value: function emit(type, eve) {
      if (this.control == null || !this.listeners.hasOwnProperty(type)) {
        return;
      }
      this.listeners[type](eve, this);
    }
    /**
     * イベントリスナを登録解除する
     */

  }, {
    key: 'remove',
    value: function remove() {
      if (this.control == null || !this.listeners.hasOwnProperty(type)) {
        return;
      }
      this.listeners[type] = null;
      delete this.listeners[type];
    }
    /**
     * ラベルテキストとコントロールの値を更新する
     * @param {mixed} value - 設定する値
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.value.textContent = value;
      this.control.value = value;
    }
    /**
     * コントロールに設定されている値を返す
     * @return {mixed} コントロールに設定されている値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.value;
    }
    /**
     * コントロールエレメントを返す
     * @return {HTMLElement}
     */

  }, {
    key: 'getControl',
    value: function getControl() {
      return this.control;
    }
    /**
     * ラベルに設定されているテキストを返す
     * @return {string} ラベルに設定されている値
     */

  }, {
    key: 'getText',
    value: function getText() {
      return this.text;
    }
    /**
     * エレメントを返す
     * @return {HTMLDivElement}
     */

  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }]);

  return GUIElement;
}();

/**
 * GUISlider
 * @class GUISlider
 */


var GUISlider = function (_GUIElement) {
  _inherits(GUISlider, _GUIElement);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {number} [value=0] - コントロールに設定する値
   * @param {number} [min=0] - スライダーの最小値
   * @param {number} [max=100] - スライダーの最大値
   * @param {number} [step=1] - スライダーのステップ数
   */
  function GUISlider() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
    var step = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

    _classCallCheck(this, GUISlider);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this2 = _possibleConstructorReturn(this, (GUISlider.__proto__ || Object.getPrototypeOf(GUISlider)).call(this, text));

    _this2.control = document.createElement('input');
    _this2.control.setAttribute('type', 'range');
    _this2.control.setAttribute('min', min);
    _this2.control.setAttribute('max', max);
    _this2.control.setAttribute('step', step);
    _this2.control.value = value;
    _this2.control.style.margin = 'auto';
    _this2.control.style.verticalAlign = 'middle';
    _this2.element.appendChild(_this2.control);

    // set
    _this2.setValue(_this2.control.value);

    // event
    _this2.control.addEventListener('input', function (eve) {
      _this2.emit('input', eve);
      _this2.setValue(_this2.control.value);
    }, false);
    return _this2;
  }
  /**
   * スライダーの最小値をセットする
   * @param {number} min - 最小値に設定する値
   */


  _createClass(GUISlider, [{
    key: 'setMin',
    value: function setMin(min) {
      this.control.setAttribute('min', min);
    }
    /**
     * スライダーの最大値をセットする
     * @param {number} max - 最大値に設定する値
     */

  }, {
    key: 'setMax',
    value: function setMax(max) {
      this.control.setAttribute('max', max);
    }
    /**
     * スライダーのステップ数をセットする
     * @param {number} step - ステップ数に設定する値
     */

  }, {
    key: 'setStep',
    value: function setStep(step) {
      this.control.setAttribute('step', step);
    }
  }]);

  return GUISlider;
}(GUIElement);

/**
 * GUICheckbox
 * @class GUICheckbox
 */


var GUICheckbox = function (_GUIElement2) {
  _inherits(GUICheckbox, _GUIElement2);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {boolean} [checked=false] - コントロールに設定する値
   */
  function GUICheckbox() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var checked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    _classCallCheck(this, GUICheckbox);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this3 = _possibleConstructorReturn(this, (GUICheckbox.__proto__ || Object.getPrototypeOf(GUICheckbox)).call(this, text));

    _this3.control = document.createElement('input');
    _this3.control.setAttribute('type', 'checkbox');
    _this3.control.checked = checked;
    _this3.control.style.margin = 'auto';
    _this3.control.style.verticalAlign = 'middle';
    _this3.element.appendChild(_this3.control);

    // set
    _this3.setValue(_this3.control.checked);

    // event
    _this3.control.addEventListener('change', function (eve) {
      _this3.emit('change', eve);
      _this3.setValue(_this3.control.checked);
    }, false);
    return _this3;
  }
  /**
   * コントロールに値を設定する
   * @param {boolean} checked - コントロールに設定する値
   */


  _createClass(GUICheckbox, [{
    key: 'setValue',
    value: function setValue(checked) {
      this.value.textContent = checked;
      this.control.checked = checked;
    }
    /**
     * コントロールの値を返す
     * @return {boolean} コントロールの値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.checked;
    }
  }]);

  return GUICheckbox;
}(GUIElement);

/**
 * GUIRadio
 * @class GUIRadio
 */


var GUIRadio = function (_GUIElement3) {
  _inherits(GUIRadio, _GUIElement3);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {string} [name='gl3radio'] - エレメントに設定する名前
   * @param {boolean} [checked=false] - コントロールに設定する値
   */
  function GUIRadio() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'gl3radio';
    var checked = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _classCallCheck(this, GUIRadio);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this4 = _possibleConstructorReturn(this, (GUIRadio.__proto__ || Object.getPrototypeOf(GUIRadio)).call(this, text));

    _this4.control = document.createElement('input');
    _this4.control.setAttribute('type', 'radio');
    _this4.control.setAttribute('name', name);
    _this4.control.checked = checked;
    _this4.control.style.margin = 'auto';
    _this4.control.style.verticalAlign = 'middle';
    _this4.element.appendChild(_this4.control);

    // set
    _this4.setValue(_this4.control.checked);

    // event
    _this4.control.addEventListener('change', function (eve) {
      _this4.emit('change', eve);
      _this4.setValue(_this4.control.checked);
    }, false);
    return _this4;
  }
  /**
   * コントロールに値を設定する
   * @param {boolean} checked - コントロールに設定する値
   */


  _createClass(GUIRadio, [{
    key: 'setValue',
    value: function setValue(checked) {
      this.value.textContent = '---';
      this.control.checked = checked;
    }
    /**
     * コントロールの値を返す
     * @return {boolean} コントロールの値
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.control.checked;
    }
  }]);

  return GUIRadio;
}(GUIElement);

/**
 * GUISelect
 * @class GUISelect
 */


var GUISelect = function (_GUIElement4) {
  _inherits(GUISelect, _GUIElement4);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {Array.<string>} [list=[]] - リストに登録するアイテムを指定する文字列の配列
   * @param {number} [selectedIndex=0] - コントロールで選択するインデックス
   */
  function GUISelect() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var list = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var selectedIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    _classCallCheck(this, GUISelect);

    /**
     * コントロールエレメント
     * @type {HTMLSelectElement}
     */
    var _this5 = _possibleConstructorReturn(this, (GUISelect.__proto__ || Object.getPrototypeOf(GUISelect)).call(this, text));

    _this5.control = document.createElement('select');
    list.map(function (v) {
      var opt = new Option(v, v);
      _this5.control.add(opt);
    });
    _this5.control.selectedIndex = selectedIndex;
    _this5.control.style.width = '130px';
    _this5.control.style.margin = 'auto';
    _this5.control.style.verticalAlign = 'middle';
    _this5.element.appendChild(_this5.control);

    // set
    _this5.setValue(_this5.control.value);

    // event
    _this5.control.addEventListener('change', function (eve) {
      _this5.emit('change', eve);
      _this5.setValue(_this5.control.value);
    }, false);
    return _this5;
  }
  /**
   * コントロールで選択するインデックスを指定する
   * @param {number} index - 指定するインデックス
   */


  _createClass(GUISelect, [{
    key: 'setSelectedIndex',
    value: function setSelectedIndex(index) {
      this.control.selectedIndex = index;
    }
    /**
     * コントロールが現在選択しているインデックスを返す
     * @return {number} 現在選択しているインデックス
     */

  }, {
    key: 'getSelectedIndex',
    value: function getSelectedIndex() {
      return this.control.selectedIndex;
    }
  }]);

  return GUISelect;
}(GUIElement);

/**
 * GUISpin
 * @class GUISpin
 */


var GUISpin = function (_GUIElement5) {
  _inherits(GUISpin, _GUIElement5);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {number} [value=0.0] - コントロールに設定する値
   * @param {number} [min=-1.0] - スピンする際の最小値
   * @param {number} [max=1.0] - スピンする際の最大値
   * @param {number} [step=0.1] - スピンするステップ数
   */
  function GUISpin() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0.0;
    var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1.0;
    var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.0;
    var step = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.1;

    _classCallCheck(this, GUISpin);

    /**
     * コントロールエレメント
     * @type {HTMLInputElement}
     */
    var _this6 = _possibleConstructorReturn(this, (GUISpin.__proto__ || Object.getPrototypeOf(GUISpin)).call(this, text));

    _this6.control = document.createElement('input');
    _this6.control.setAttribute('type', 'number');
    _this6.control.setAttribute('min', min);
    _this6.control.setAttribute('max', max);
    _this6.control.setAttribute('step', step);
    _this6.control.value = value;
    _this6.control.style.margin = 'auto';
    _this6.control.style.verticalAlign = 'middle';
    _this6.element.appendChild(_this6.control);

    // set
    _this6.setValue(_this6.control.value);

    // event
    _this6.control.addEventListener('input', function (eve) {
      _this6.emit('input', eve);
      _this6.setValue(_this6.control.value);
    }, false);
    return _this6;
  }
  /**
   * スピンの最小値を設定する
   * @param {number} min - 設定する最小値
   */


  _createClass(GUISpin, [{
    key: 'setMin',
    value: function setMin(min) {
      this.control.setAttribute('min', min);
    }
    /**
     * スピンの最大値を設定する
     * @param {number} max - 設定する最大値
     */

  }, {
    key: 'setMax',
    value: function setMax(max) {
      this.control.setAttribute('max', max);
    }
    /**
     * スピンのステップ数を設定する
     * @param {number} step - 設定するステップ数
     */

  }, {
    key: 'setStep',
    value: function setStep(step) {
      this.control.setAttribute('step', step);
    }
  }]);

  return GUISpin;
}(GUIElement);

/**
 * GUIColor
 * @class GUIColor
 */


var GUIColor = function (_GUIElement6) {
  _inherits(GUIColor, _GUIElement6);

  /**
   * @constructor
   * @param {string} [text=''] - エレメントに設定するテキスト
   * @param {string} [value='#000000'] - コントロールに設定する値
   */
  function GUIColor() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '#000000';

    _classCallCheck(this, GUIColor);

    /**
     * コントロールを包むコンテナエレメント
     * @type {HTMLDivElement}
     */
    var _this7 = _possibleConstructorReturn(this, (GUIColor.__proto__ || Object.getPrototypeOf(GUIColor)).call(this, text));

    _this7.container = document.createElement('div');
    _this7.container.style.lineHeight = '0';
    _this7.container.style.margin = '2px auto';
    _this7.container.style.width = '100px';
    /**
     * 余白兼選択カラー表示エレメント
     * @type {HTMLDivElement}
     */
    _this7.label = document.createElement('div');
    _this7.label.style.margin = '0px';
    _this7.label.style.width = 'calc(100% - 2px)';
    _this7.label.style.height = '24px';
    _this7.label.style.border = '1px solid whitesmoke';
    _this7.label.style.boxShadow = '0px 0px 0px 1px #222';
    /**
     * コントロールエレメントの役割を担う canvas
     * @type {HTMLCanvasElement}
     */
    _this7.control = document.createElement('canvas');
    _this7.control.style.margin = '0px';
    _this7.control.style.display = 'none';
    _this7.control.width = 100;
    _this7.control.height = 100;

    // append
    _this7.element.appendChild(_this7.container);
    _this7.container.appendChild(_this7.label);
    _this7.container.appendChild(_this7.control);

    /**
     * コントロール用 canvas の 2d コンテキスト
     * @type {CanvasRenderingContext2D}
     */
    _this7.ctx = _this7.control.getContext('2d');
    var grad = _this7.ctx.createLinearGradient(0, 0, _this7.control.width, 0);
    var arr = ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff', '#ff0000'];
    for (var i = 0, j = arr.length; i < j; ++i) {
      grad.addColorStop(i / (j - 1), arr[i]);
    }
    _this7.ctx.fillStyle = grad;
    _this7.ctx.fillRect(0, 0, _this7.control.width, _this7.control.height);
    grad = _this7.ctx.createLinearGradient(0, 0, 0, _this7.control.height);
    arr = ['rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 0.0)', 'rgba(0, 0, 0, 0.0)', 'rgba(0, 0, 0, 1.0)'];
    for (var _i = 0, _j = arr.length; _i < _j; ++_i) {
      grad.addColorStop(_i / (_j - 1), arr[_i]);
    }
    _this7.ctx.fillStyle = grad;
    _this7.ctx.fillRect(0, 0, _this7.control.width, _this7.control.height);

    /**
     * 自身に設定されている色を表す文字列の値
     * @type {string}
     */
    _this7.colorValue = value;
    /**
     * クリック時にのみ colorValue を更新するための一時キャッシュ変数
     * @type {string}
     */
    _this7.tempColorValue = null;

    // set
    _this7.setValue(value);

    // event
    _this7.container.addEventListener('mouseover', function () {
      _this7.control.style.display = 'block';
      _this7.tempColorValue = _this7.colorValue;
    });
    _this7.container.addEventListener('mouseout', function () {
      _this7.control.style.display = 'none';
      if (_this7.tempColorValue != null) {
        _this7.setValue(_this7.tempColorValue);
        _this7.tempColorValue = null;
      }
    });
    _this7.control.addEventListener('mousemove', function (eve) {
      var imageData = _this7.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
      var color = _this7.getColor8bitString(imageData.data);
      _this7.setValue(color);
    });

    _this7.control.addEventListener('click', function (eve) {
      var imageData = _this7.ctx.getImageData(eve.offsetX, eve.offsetY, 1, 1);
      eve.currentTarget.value = _this7.getColor8bitString(imageData.data);
      _this7.tempColorValue = null;
      _this7.control.style.display = 'none';
      _this7.emit('change', eve);
    }, false);
    return _this7;
  }
  /**
   * 自身のプロパティに色を設定する
   * @param {string} value - CSS 色表現のうち 16 進数表記のもの
   */


  _createClass(GUIColor, [{
    key: 'setValue',
    value: function setValue(value) {
      this.value.textContent = value;
      this.colorValue = value;
      this.container.style.backgroundColor = this.colorValue;
    }
    /**
     * 自身に設定されている色を表す文字列を返す
     * @return {string} 16 進数表記の色を表す文字列
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      return this.colorValue;
    }
    /**
     * 自身に設定されている色を表す文字列を 0.0 から 1.0 の値に変換し配列で返す
     * @return {Array.<number>} 浮動小数で表現した色の値の配列
     */

  }, {
    key: 'getFloatValue',
    value: function getFloatValue() {
      return this.getColorFloatArray(this.colorValue);
    }
    /**
     * canvas.imageData から取得する数値の配列を元に 16 進数表記文字列を生成して返す
     * @param {Array.<number>} color - 最低でも 3 つの要素を持つ数値の配列
     * @return {string} 16 進数表記の色の値の文字列
     */

  }, {
    key: 'getColor8bitString',
    value: function getColor8bitString(color) {
      var r = this.zeroPadding(color[0].toString(16), 2);
      var g = this.zeroPadding(color[1].toString(16), 2);
      var b = this.zeroPadding(color[2].toString(16), 2);
      return '#' + r + g + b;
    }
    /**
     * 16 進数表記の色表現文字列を元に 0.0 から 1.0 の値に変換した配列を生成し返す
     * @param {string} color - 16 進数表記の色の値の文字列
     * @return {Array.<number>} RGB の 3 つの値を 0.0 から 1.0 に変換した値の配列
     */

  }, {
    key: 'getColorFloatArray',
    value: function getColorFloatArray(color) {
      if (color == null || Object.prototype.toString.call(color) !== '[object String]') {
        return null;
      }
      if (color.search(/^#+[\d|a-f|A-F]+$/) === -1) {
        return null;
      }
      var s = color.replace('#', '');
      if (s.length !== 3 && s.length !== 6) {
        return null;
      }
      var t = s.length / 3;
      return [parseInt(color.substr(1, t), 16) / 255, parseInt(color.substr(1 + t, t), 16) / 255, parseInt(color.substr(1 + t * 2, t), 16) / 255];
    }
    /**
     * 数値を指定された桁数に整形した文字列を返す
     * @param {number} number - 整形したい数値
     * @param {number} count - 整形する桁数
     * @return {string} 16 進数表記の色の値の文字列
     */

  }, {
    key: 'zeroPadding',
    value: function zeroPadding(number, count) {
      var a = new Array(count).join('0');
      return (a + number).slice(-count);
    }
  }]);

  return GUIColor;
}(GUIElement);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * gl3Math
 * @class gl3Math
 */
var gl3Math =
/**
 * @constructor
 */
function gl3Math() {
    _classCallCheck(this, gl3Math);

    /**
     * Mat4
     * @type {Mat4}
     */
    this.Mat4 = Mat4;
    /**
     * Vec3
     * @type {Vec3}
     */
    this.Vec3 = Vec3;
    /**
     * Vec2
     * @type {Vec2}
     */
    this.Vec2 = Vec2;
    /**
     * Qtn
     * @type {Qtn}
     */
    this.Qtn = Qtn;
};

/**
 * Mat4
 * @class Mat4
 */


exports.default = gl3Math;

var Mat4 = function () {
    function Mat4() {
        _classCallCheck(this, Mat4);
    }

    _createClass(Mat4, null, [{
        key: "create",

        /**
         * 4x4 の正方行列を生成する
         * @return {Float32Array} 行列格納用の配列
         */
        value: function create() {
            return new Float32Array(16);
        }
        /**
         * 行列を単位化する（参照に注意）
         * @param {Float32Array.<Mat4>} dest - 単位化する行列
         * @return {Float32Array.<Mat4>} 単位化した行列
         */

    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 1;dest[1] = 0;dest[2] = 0;dest[3] = 0;
            dest[4] = 0;dest[5] = 1;dest[6] = 0;dest[7] = 0;
            dest[8] = 0;dest[9] = 0;dest[10] = 1;dest[11] = 0;
            dest[12] = 0;dest[13] = 0;dest[14] = 0;dest[15] = 1;
            return dest;
        }
        /**
         * 行列を乗算する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat0 - 乗算される行列
         * @param {Float32Array.<Mat4>} mat1 - 乗算する行列
         * @param {Float32Array.<Mat4>} [dest] - 乗算結果を格納する行列
         * @return {Float32Array.<Mat4>} 乗算結果の行列
         */

    }, {
        key: "multiply",
        value: function multiply(mat0, mat1, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var a = mat0[0],
                b = mat0[1],
                c = mat0[2],
                d = mat0[3],
                e = mat0[4],
                f = mat0[5],
                g = mat0[6],
                h = mat0[7],
                i = mat0[8],
                j = mat0[9],
                k = mat0[10],
                l = mat0[11],
                m = mat0[12],
                n = mat0[13],
                o = mat0[14],
                p = mat0[15],
                A = mat1[0],
                B = mat1[1],
                C = mat1[2],
                D = mat1[3],
                E = mat1[4],
                F = mat1[5],
                G = mat1[6],
                H = mat1[7],
                I = mat1[8],
                J = mat1[9],
                K = mat1[10],
                L = mat1[11],
                M = mat1[12],
                N = mat1[13],
                O = mat1[14],
                P = mat1[15];
            out[0] = A * a + B * e + C * i + D * m;
            out[1] = A * b + B * f + C * j + D * n;
            out[2] = A * c + B * g + C * k + D * o;
            out[3] = A * d + B * h + C * l + D * p;
            out[4] = E * a + F * e + G * i + H * m;
            out[5] = E * b + F * f + G * j + H * n;
            out[6] = E * c + F * g + G * k + H * o;
            out[7] = E * d + F * h + G * l + H * p;
            out[8] = I * a + J * e + K * i + L * m;
            out[9] = I * b + J * f + K * j + L * n;
            out[10] = I * c + J * g + K * k + L * o;
            out[11] = I * d + J * h + K * l + L * p;
            out[12] = M * a + N * e + O * i + P * m;
            out[13] = M * b + N * f + O * j + P * n;
            out[14] = M * c + N * g + O * k + P * o;
            out[15] = M * d + N * h + O * l + P * p;
            return out;
        }
        /**
         * 行列に拡大縮小を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {Float32Array.<Vec3>} vec - XYZ の各軸に対して拡縮を適用する値の行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "scale",
        value: function scale(mat, vec, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0] * vec[0];
            out[1] = mat[1] * vec[0];
            out[2] = mat[2] * vec[0];
            out[3] = mat[3] * vec[0];
            out[4] = mat[4] * vec[1];
            out[5] = mat[5] * vec[1];
            out[6] = mat[6] * vec[1];
            out[7] = mat[7] * vec[1];
            out[8] = mat[8] * vec[2];
            out[9] = mat[9] * vec[2];
            out[10] = mat[10] * vec[2];
            out[11] = mat[11] * vec[2];
            out[12] = mat[12];
            out[13] = mat[13];
            out[14] = mat[14];
            out[15] = mat[15];
            return out;
        }
        /**
         * 行列に平行移動を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {Float32Array.<Vec3>} vec - XYZ の各軸に対して平行移動を適用する値の行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "translate",
        value: function translate(mat, vec, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0];out[1] = mat[1];out[2] = mat[2];out[3] = mat[3];
            out[4] = mat[4];out[5] = mat[5];out[6] = mat[6];out[7] = mat[7];
            out[8] = mat[8];out[9] = mat[9];out[10] = mat[10];out[11] = mat[11];
            out[12] = mat[0] * vec[0] + mat[4] * vec[1] + mat[8] * vec[2] + mat[12];
            out[13] = mat[1] * vec[0] + mat[5] * vec[1] + mat[9] * vec[2] + mat[13];
            out[14] = mat[2] * vec[0] + mat[6] * vec[1] + mat[10] * vec[2] + mat[14];
            out[15] = mat[3] * vec[0] + mat[7] * vec[1] + mat[11] * vec[2] + mat[15];
            return out;
        }
        /**
         * 行列に回転を適用する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用を受ける行列
         * @param {number} angle - 回転量を表す値（ラジアン）
         * @param {Float32Array.<Vec3>} axis - 回転の軸
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "rotate",
        value: function rotate(mat, angle, axis, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (!sq) {
                return null;
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            if (sq != 1) {
                sq = 1 / sq;a *= sq;b *= sq;c *= sq;
            }
            var d = Math.sin(angle),
                e = Math.cos(angle),
                f = 1 - e,
                g = mat[0],
                h = mat[1],
                i = mat[2],
                j = mat[3],
                k = mat[4],
                l = mat[5],
                m = mat[6],
                n = mat[7],
                o = mat[8],
                p = mat[9],
                q = mat[10],
                r = mat[11],
                s = a * a * f + e,
                t = b * a * f + c * d,
                u = c * a * f - b * d,
                v = a * b * f - c * d,
                w = b * b * f + e,
                x = c * b * f + a * d,
                y = a * c * f + b * d,
                z = b * c * f - a * d,
                A = c * c * f + e;
            if (angle) {
                if (mat != out) {
                    out[12] = mat[12];out[13] = mat[13];
                    out[14] = mat[14];out[15] = mat[15];
                }
            } else {
                out = mat;
            }
            out[0] = g * s + k * t + o * u;
            out[1] = h * s + l * t + p * u;
            out[2] = i * s + m * t + q * u;
            out[3] = j * s + n * t + r * u;
            out[4] = g * v + k * w + o * x;
            out[5] = h * v + l * w + p * x;
            out[6] = i * v + m * w + q * x;
            out[7] = j * v + n * w + r * x;
            out[8] = g * y + k * z + o * A;
            out[9] = h * y + l * z + p * A;
            out[10] = i * y + m * z + q * A;
            out[11] = j * y + n * z + r * A;
            return out;
        }
        /**
         * ビュー座標変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Vec3>} eye - 視点位置
         * @param {Float32Array.<Vec3>} center - 注視点
         * @param {Float32Array.<Vec3>} up - 上方向を示すベクトル
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "lookAt",
        value: function lookAt(eye, center, up, dest) {
            var eyeX = eye[0],
                eyeY = eye[1],
                eyeZ = eye[2],
                centerX = center[0],
                centerY = center[1],
                centerZ = center[2],
                upX = up[0],
                upY = up[1],
                upZ = up[2];
            if (eyeX == centerX && eyeY == centerY && eyeZ == centerZ) {
                return Mat4.identity(dest);
            }
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var x0 = void 0,
                x1 = void 0,
                x2 = void 0,
                y0 = void 0,
                y1 = void 0,
                y2 = void 0,
                z0 = void 0,
                z1 = void 0,
                z2 = void 0,
                l = void 0;
            z0 = eyeX - center[0];z1 = eyeY - center[1];z2 = eyeZ - center[2];
            l = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
            z0 *= l;z1 *= l;z2 *= l;
            x0 = upY * z2 - upZ * z1;
            x1 = upZ * z0 - upX * z2;
            x2 = upX * z1 - upY * z0;
            l = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
            if (!l) {
                x0 = 0;x1 = 0;x2 = 0;
            } else {
                l = 1 / l;
                x0 *= l;x1 *= l;x2 *= l;
            }
            y0 = z1 * x2 - z2 * x1;y1 = z2 * x0 - z0 * x2;y2 = z0 * x1 - z1 * x0;
            l = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
            if (!l) {
                y0 = 0;y1 = 0;y2 = 0;
            } else {
                l = 1 / l;
                y0 *= l;y1 *= l;y2 *= l;
            }
            out[0] = x0;out[1] = y0;out[2] = z0;out[3] = 0;
            out[4] = x1;out[5] = y1;out[6] = z1;out[7] = 0;
            out[8] = x2;out[9] = y2;out[10] = z2;out[11] = 0;
            out[12] = -(x0 * eyeX + x1 * eyeY + x2 * eyeZ);
            out[13] = -(y0 * eyeX + y1 * eyeY + y2 * eyeZ);
            out[14] = -(z0 * eyeX + z1 * eyeY + z2 * eyeZ);
            out[15] = 1;
            return out;
        }
        /**
         * 透視投影変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {number} fovy - 視野角（度数法）
         * @param {number} aspect - アスペクト比（幅 / 高さ）
         * @param {number} near - ニアクリップ面までの距離
         * @param {number} far - ファークリップ面までの距離
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "perspective",
        value: function perspective(fovy, aspect, near, far, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var t = near * Math.tan(fovy * Math.PI / 360);
            var r = t * aspect;
            var a = r * 2,
                b = t * 2,
                c = far - near;
            out[0] = near * 2 / a;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = near * 2 / b;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = -(far + near) / c;
            out[11] = -1;
            out[12] = 0;
            out[13] = 0;
            out[14] = -(far * near * 2) / c;
            out[15] = 0;
            return out;
        }
        /**
         * 正射影投影変換行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {number} left - 左端
         * @param {number} right - 右端
         * @param {number} top - 上端
         * @param {number} bottom - 下端
         * @param {number} near - ニアクリップ面までの距離
         * @param {number} far - ファークリップ面までの距離
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "ortho",
        value: function ortho(left, right, top, bottom, near, far, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var h = right - left;
            var v = top - bottom;
            var d = far - near;
            out[0] = 2 / h;
            out[1] = 0;
            out[2] = 0;
            out[3] = 0;
            out[4] = 0;
            out[5] = 2 / v;
            out[6] = 0;
            out[7] = 0;
            out[8] = 0;
            out[9] = 0;
            out[10] = -2 / d;
            out[11] = 0;
            out[12] = -(left + right) / h;
            out[13] = -(top + bottom) / v;
            out[14] = -(far + near) / d;
            out[15] = 1;
            return out;
        }
        /**
         * 転置行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "transpose",
        value: function transpose(mat, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            out[0] = mat[0];out[1] = mat[4];
            out[2] = mat[8];out[3] = mat[12];
            out[4] = mat[1];out[5] = mat[5];
            out[6] = mat[9];out[7] = mat[13];
            out[8] = mat[2];out[9] = mat[6];
            out[10] = mat[10];out[11] = mat[14];
            out[12] = mat[3];out[13] = mat[7];
            out[14] = mat[11];out[15] = mat[15];
            return out;
        }
        /**
         * 逆行列を生成する（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Float32Array.<Mat4>} [dest] - 結果を格納する行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "inverse",
        value: function inverse(mat, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var a = mat[0],
                b = mat[1],
                c = mat[2],
                d = mat[3],
                e = mat[4],
                f = mat[5],
                g = mat[6],
                h = mat[7],
                i = mat[8],
                j = mat[9],
                k = mat[10],
                l = mat[11],
                m = mat[12],
                n = mat[13],
                o = mat[14],
                p = mat[15],
                q = a * f - b * e,
                r = a * g - c * e,
                s = a * h - d * e,
                t = b * g - c * f,
                u = b * h - d * f,
                v = c * h - d * g,
                w = i * n - j * m,
                x = i * o - k * m,
                y = i * p - l * m,
                z = j * o - k * n,
                A = j * p - l * n,
                B = k * p - l * o,
                ivd = 1 / (q * B - r * A + s * z + t * y - u * x + v * w);
            out[0] = (f * B - g * A + h * z) * ivd;
            out[1] = (-b * B + c * A - d * z) * ivd;
            out[2] = (n * v - o * u + p * t) * ivd;
            out[3] = (-j * v + k * u - l * t) * ivd;
            out[4] = (-e * B + g * y - h * x) * ivd;
            out[5] = (a * B - c * y + d * x) * ivd;
            out[6] = (-m * v + o * s - p * r) * ivd;
            out[7] = (i * v - k * s + l * r) * ivd;
            out[8] = (e * A - f * y + h * w) * ivd;
            out[9] = (-a * A + b * y - d * w) * ivd;
            out[10] = (m * u - n * s + p * q) * ivd;
            out[11] = (-i * u + j * s - l * q) * ivd;
            out[12] = (-e * z + f * x - g * w) * ivd;
            out[13] = (a * z - b * x + c * w) * ivd;
            out[14] = (-m * t + n * r - o * q) * ivd;
            out[15] = (i * t - j * r + k * q) * ivd;
            return out;
        }
        /**
         * 行列にベクトルを乗算する（ベクトルに行列を適用する）
         * @param {Float32Array.<Mat4>} mat - 適用する行列
         * @param {Array.<number>} vec - 乗算するベクトル（4 つの要素を持つ配列）
         * @return {Float32Array} 結果のベクトル
         */

    }, {
        key: "toVecIV",
        value: function toVecIV(mat, vec) {
            var a = mat[0],
                b = mat[1],
                c = mat[2],
                d = mat[3],
                e = mat[4],
                f = mat[5],
                g = mat[6],
                h = mat[7],
                i = mat[8],
                j = mat[9],
                k = mat[10],
                l = mat[11],
                m = mat[12],
                n = mat[13],
                o = mat[14],
                p = mat[15];
            var x = vec[0],
                y = vec[1],
                z = vec[2],
                w = vec[3];
            var out = [];
            out[0] = x * a + y * e + z * i + w * m;
            out[1] = x * b + y * f + z * j + w * n;
            out[2] = x * c + y * g + z * k + w * o;
            out[3] = x * d + y * h + z * l + w * p;
            vec = out;
            return out;
        }
        /**
         * カメラのプロパティに相当する情報を受け取り行列を生成する
         * @param {Float32Array.<Vec3>} position - カメラの座標
         * @param {Float32Array.<Vec3>} centerPoint - カメラの注視点
         * @param {Float32Array.<Vec3>} upDirection - カメラの上方向
         * @param {number} fovy - 視野角
         * @param {number} aspect - アスペクト比
         * @param {number} near - ニアクリップ面
         * @param {number} far - ファークリップ面
         * @param {Float32Array.<Mat4>} vmat - ビュー座標変換行列の結果を格納する行列
         * @param {Float32Array.<Mat4>} pmat - 透視投影座標変換行列の結果を格納する行列
         * @param {Float32Array.<Mat4>} dest - ビュー x 透視投影変換行列の結果を格納する行列
         */

    }, {
        key: "vpFromCameraProperty",
        value: function vpFromCameraProperty(position, centerPoint, upDirection, fovy, aspect, near, far, vmat, pmat, dest) {
            Mat4.lookAt(position, centerPoint, upDirection, vmat);
            Mat4.perspective(fovy, aspect, near, far, pmat);
            Mat4.multiply(pmat, vmat, dest);
        }
        /**
         * MVP 行列に相当する行列を受け取りベクトルを変換して返す
         * @param {Float32Array.<Mat4>} mat - MVP 行列
         * @param {Array.<number>} vec - MVP 行列と乗算するベクトル
         * @param {number} width - ビューポートの幅
         * @param {number} height - ビューポートの高さ
         * @return {Array.<number>} 結果のベクトル（2 つの要素を持つベクトル）
         */

    }, {
        key: "screenPositionFromMvp",
        value: function screenPositionFromMvp(mat, vec, width, height) {
            var halfWidth = width * 0.5;
            var halfHeight = height * 0.5;
            var v = Mat4.toVecIV(mat, [vec[0], vec[1], vec[2], 1.0]);
            if (v[3] <= 0.0) {
                return [NaN, NaN];
            }
            v[0] /= v[3];v[1] /= v[3];v[2] /= v[3];
            return [halfWidth + v[0] * halfWidth, halfHeight - v[1] * halfHeight];
        }
    }]);

    return Mat4;
}();

/**
 * Vec3
 * @class Vec3
 */


var Vec3 = function () {
    function Vec3() {
        _classCallCheck(this, Vec3);
    }

    _createClass(Vec3, null, [{
        key: "create",

        /**
         * 3 つの要素を持つベクトルを生成する
         * @return {Float32Array} ベクトル格納用の配列
         */
        value: function create() {
            return new Float32Array(3);
        }
        /**
         * ベクトルの長さ（大きさ）を返す
         * @param {Float32Array.<Vec3>} v - 3 つの要素を持つベクトル
         * @return {number} ベクトルの長さ（大きさ）
         */

    }, {
        key: "len",
        value: function len(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
        }
        /**
         * 2 つの座標（始点・終点）を結ぶベクトルを返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つ始点座標
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つ終点座標
         * @return {Float32Array.<Vec3>} 視点と終点を結ぶベクトル
         */

    }, {
        key: "distance",
        value: function distance(v0, v1) {
            var n = Vec3.create();
            n[0] = v1[0] - v0[0];
            n[1] = v1[1] - v0[1];
            n[2] = v1[2] - v0[2];
            return n;
        }
        /**
         * ベクトルを正規化した結果を返す
         * @param {Float32Array.<Vec3>} v - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 正規化したベクトル
         */

    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec3.create();
            var l = Vec3.len(v);
            if (l > 0) {
                var e = 1.0 / l;
                n[0] = v[0] * e;
                n[1] = v[1] * e;
                n[2] = v[2] * e;
            } else {
                n[0] = 0.0;
                n[1] = 0.0;
                n[2] = 0.0;
            }
            return n;
        }
        /**
         * 2 つのベクトルの内積の結果を返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @return {number} 内積の結果
         */

    }, {
        key: "dot",
        value: function dot(v0, v1) {
            return v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
        }
        /**
         * 2 つのベクトルの外積の結果を返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 外積の結果
         */

    }, {
        key: "cross",
        value: function cross(v0, v1) {
            var n = Vec3.create();
            n[0] = v0[1] * v1[2] - v0[2] * v1[1];
            n[1] = v0[2] * v1[0] - v0[0] * v1[2];
            n[2] = v0[0] * v1[1] - v0[1] * v1[0];
            return n;
        }
        /**
         * 3 つのベクトルから面法線を求めて返す
         * @param {Float32Array.<Vec3>} v0 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v1 - 3 つの要素を持つベクトル
         * @param {Float32Array.<Vec3>} v2 - 3 つの要素を持つベクトル
         * @return {Float32Array.<Vec3>} 面法線ベクトル
         */

    }, {
        key: "faceNormal",
        value: function faceNormal(v0, v1, v2) {
            var n = Vec3.create();
            var vec1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
            var vec2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
            n[0] = vec1[1] * vec2[2] - vec1[2] * vec2[1];
            n[1] = vec1[2] * vec2[0] - vec1[0] * vec2[2];
            n[2] = vec1[0] * vec2[1] - vec1[1] * vec2[0];
            return Vec3.normalize(n);
        }
    }]);

    return Vec3;
}();

/**
 * Vec2
 * @class Vec2
 */


var Vec2 = function () {
    function Vec2() {
        _classCallCheck(this, Vec2);
    }

    _createClass(Vec2, null, [{
        key: "create",

        /**
         * 2 つの要素を持つベクトルを生成する
         * @return {Float32Array} ベクトル格納用の配列
         */
        value: function create() {
            return new Float32Array(2);
        }
        /**
         * ベクトルの長さ（大きさ）を返す
         * @param {Float32Array.<Vec2>} v - 2 つの要素を持つベクトル
         * @return {number} ベクトルの長さ（大きさ）
         */

    }, {
        key: "len",
        value: function len(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        }
        /**
         * 2 つの座標（始点・終点）を結ぶベクトルを返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つ始点座標
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つ終点座標
         * @return {Float32Array.<Vec2>} 視点と終点を結ぶベクトル
         */

    }, {
        key: "distance",
        value: function distance(v0, v1) {
            var n = Vec2.create();
            n[0] = v1[0] - v0[0];
            n[1] = v1[1] - v0[1];
            return n;
        }
        /**
         * ベクトルを正規化した結果を返す
         * @param {Float32Array.<Vec2>} v - 2 つの要素を持つベクトル
         * @return {Float32Array.<Vec2>} 正規化したベクトル
         */

    }, {
        key: "normalize",
        value: function normalize(v) {
            var n = Vec2.create();
            var l = Vec2.len(v);
            if (l > 0) {
                var e = 1.0 / l;
                n[0] = v[0] * e;
                n[1] = v[1] * e;
            }
            return n;
        }
        /**
         * 2 つのベクトルの内積の結果を返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つベクトル
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つベクトル
         * @return {number} 内積の結果
         */

    }, {
        key: "dot",
        value: function dot(v0, v1) {
            return v0[0] * v1[0] + v0[1] * v1[1];
        }
        /**
         * 2 つのベクトルの外積の結果を返す
         * @param {Float32Array.<Vec2>} v0 - 2 つの要素を持つベクトル
         * @param {Float32Array.<Vec2>} v1 - 2 つの要素を持つベクトル
         * @return {Float32Array.<Vec2>} 外積の結果
         */

    }, {
        key: "cross",
        value: function cross(v0, v1) {
            var n = Vec2.create();
            return v0[0] * v1[1] - v0[1] * v1[0];
        }
    }]);

    return Vec2;
}();

/**
 * Qtn
 * @class Qtn
 */


var Qtn = function () {
    function Qtn() {
        _classCallCheck(this, Qtn);
    }

    _createClass(Qtn, null, [{
        key: "create",

        /**
         * 4 つの要素からなるクォータニオンのデータ構造を生成する（虚部 x, y, z, 実部 w の順序で定義）
         * @return {Float32Array} クォータニオンデータ格納用の配列
         */
        value: function create() {
            return new Float32Array(4);
        }
        /**
         * クォータニオンを初期化する（参照に注意）
         * @param {Float32Array.<Qtn>} dest - 初期化するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "identity",
        value: function identity(dest) {
            dest[0] = 0;dest[1] = 0;dest[2] = 0;dest[3] = 1;
            return dest;
        }
        /**
         * 共役四元数を生成して返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn - 元となるクォータニオン
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "inverse",
        value: function inverse(qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            out[0] = -qtn[0];
            out[1] = -qtn[1];
            out[2] = -qtn[2];
            out[3] = qtn[3];
            return out;
        }
        /**
         * 虚部を正規化して返す（参照に注意）
         * @param {Float32Array.<Qtn>} qtn - 元となるクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "normalize",
        value: function normalize(dest) {
            var x = dest[0],
                y = dest[1],
                z = dest[2];
            var l = Math.sqrt(x * x + y * y + z * z);
            if (l === 0) {
                dest[0] = 0;
                dest[1] = 0;
                dest[2] = 0;
            } else {
                l = 1 / l;
                dest[0] = x * l;
                dest[1] = y * l;
                dest[2] = z * l;
            }
            return dest;
        }
        /**
         * クォータニオンを乗算した結果を返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn0 - 乗算されるクォータニオン
         * @param {Float32Array.<Qtn>} qtn1 - 乗算するクォータニオン
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "multiply",
        value: function multiply(qtn0, qtn1, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var ax = qtn0[0],
                ay = qtn0[1],
                az = qtn0[2],
                aw = qtn0[3];
            var bx = qtn1[0],
                by = qtn1[1],
                bz = qtn1[2],
                bw = qtn1[3];
            out[0] = ax * bw + aw * bx + ay * bz - az * by;
            out[1] = ay * bw + aw * by + az * bx - ax * bz;
            out[2] = az * bw + aw * bz + ax * by - ay * bx;
            out[3] = aw * bw - ax * bx - ay * by - az * bz;
            return out;
        }
        /**
         * クォータニオンに回転を適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {number} angle - 回転する量（ラジアン）
         * @param {Array.<number>} axis - 3 つの要素を持つ軸ベクトル
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "rotate",
        value: function rotate(angle, axis, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var a = axis[0],
                b = axis[1],
                c = axis[2];
            var sq = Math.sqrt(axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2]);
            if (sq !== 0) {
                var l = 1 / sq;
                a *= l;
                b *= l;
                c *= l;
            }
            var s = Math.sin(angle * 0.5);
            out[0] = a * s;
            out[1] = b * s;
            out[2] = c * s;
            out[3] = Math.cos(angle * 0.5);
            return out;
        }
        /**
         * ベクトルにクォータニオンを適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {Array.<number>} vec - 3 つの要素を持つベクトル
         * @param {Float32Array.<Qtn>} qtn - クォータニオン
         * @param {Array.<number>} [dest] - 3 つの要素を持つベクトル
         * @return {Array.<number>} 結果のベクトル
         */

    }, {
        key: "toVecIII",
        value: function toVecIII(vec, qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = [0.0, 0.0, 0.0];
            }
            var qp = Qtn.create();
            var qq = Qtn.create();
            var qr = Qtn.create();
            Qtn.inverse(qtn, qr);
            qp[0] = vec[0];
            qp[1] = vec[1];
            qp[2] = vec[2];
            Qtn.multiply(qr, qp, qq);
            Qtn.multiply(qq, qtn, qr);
            out[0] = qr[0];
            out[1] = qr[1];
            out[2] = qr[2];
            return out;
        }
        /**
         * 4x4 行列にクォータニオンを適用し返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn - クォータニオン
         * @param {Float32Array.<Mat4>} [dest] - 4x4 行列
         * @return {Float32Array.<Mat4>} 結果の行列
         */

    }, {
        key: "toMatIV",
        value: function toMatIV(qtn, dest) {
            var out = dest;
            if (dest == null) {
                out = Mat4.create();
            }
            var x = qtn[0],
                y = qtn[1],
                z = qtn[2],
                w = qtn[3];
            var x2 = x + x,
                y2 = y + y,
                z2 = z + z;
            var xx = x * x2,
                xy = x * y2,
                xz = x * z2;
            var yy = y * y2,
                yz = y * z2,
                zz = z * z2;
            var wx = w * x2,
                wy = w * y2,
                wz = w * z2;
            out[0] = 1 - (yy + zz);
            out[1] = xy - wz;
            out[2] = xz + wy;
            out[3] = 0;
            out[4] = xy + wz;
            out[5] = 1 - (xx + zz);
            out[6] = yz - wx;
            out[7] = 0;
            out[8] = xz - wy;
            out[9] = yz + wx;
            out[10] = 1 - (xx + yy);
            out[11] = 0;
            out[12] = 0;
            out[13] = 0;
            out[14] = 0;
            out[15] = 1;
            return out;
        }
        /**
         * 2 つのクォータニオンの球面線形補間を行った結果を返す（参照に注意・戻り値としても結果を返す）
         * @param {Float32Array.<Qtn>} qtn0 - クォータニオン
         * @param {Float32Array.<Qtn>} qtn1 - クォータニオン
         * @param {number} time - 補間係数（0.0 から 1.0 で指定）
         * @param {Float32Array.<Qtn>} [dest] - 結果を格納するクォータニオン
         * @return {Float32Array.<Qtn>} 結果のクォータニオン
         */

    }, {
        key: "slerp",
        value: function slerp(qtn0, qtn1, time, dest) {
            var out = dest;
            if (dest == null) {
                out = Qtn.create();
            }
            var ht = qtn0[0] * qtn1[0] + qtn0[1] * qtn1[1] + qtn0[2] * qtn1[2] + qtn0[3] * qtn1[3];
            var hs = 1.0 - ht * ht;
            if (hs <= 0.0) {
                out[0] = qtn0[0];
                out[1] = qtn0[1];
                out[2] = qtn0[2];
                out[3] = qtn0[3];
            } else {
                hs = Math.sqrt(hs);
                if (Math.abs(hs) < 0.0001) {
                    out[0] = qtn0[0] * 0.5 + qtn1[0] * 0.5;
                    out[1] = qtn0[1] * 0.5 + qtn1[1] * 0.5;
                    out[2] = qtn0[2] * 0.5 + qtn1[2] * 0.5;
                    out[3] = qtn0[3] * 0.5 + qtn1[3] * 0.5;
                } else {
                    var ph = Math.acos(ht);
                    var pt = ph * time;
                    var t0 = Math.sin(ph - pt) / hs;
                    var t1 = Math.sin(pt) / hs;
                    out[0] = qtn0[0] * t0 + qtn1[0] * t1;
                    out[1] = qtn0[1] * t0 + qtn1[1] * t1;
                    out[2] = qtn0[2] * t0 + qtn1[2] * t1;
                    out[3] = qtn0[3] * t0 + qtn1[3] * t1;
                }
            }
            return out;
        }
    }]);

    return Qtn;
}();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * gl3Mesh
 * @class
 */
var gl3Mesh = function () {
    function gl3Mesh() {
        _classCallCheck(this, gl3Mesh);
    }

    _createClass(gl3Mesh, null, [{
        key: "plane",

        /**
         * 板ポリゴンの頂点情報を生成する
         * @param {number} width - 板ポリゴンの一辺の幅
         * @param {number} height - 板ポリゴンの一辺の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let planeData = gl3.Mesh.plane(2.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */
        value: function plane(width, height, color) {
            var w = void 0,
                h = void 0;
            w = width / 2;
            h = height / 2;
            if (color) {
                tc = color;
            } else {
                tc = [1.0, 1.0, 1.0, 1.0];
            }
            var pos = [-w, h, 0.0, w, h, 0.0, -w, -h, 0.0, w, -h, 0.0];
            var nor = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0];
            var col = [color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]];
            var st = [0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 1.0, 1.0];
            var idx = [0, 1, 2, 2, 1, 3];
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 円（XY 平面展開）の頂点情報を生成する
         * @param {number} split - 円の円周の分割数
         * @param {number} rad - 円の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let circleData = gl3.Mesh.circle(64, 1.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "circle",
        value: function circle(split, rad, color) {
            var i = void 0,
                j = 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, 0.0, 0.0);
            nor.push(0.0, 0.0, 1.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            for (i = 0; i < split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var ry = Math.sin(r);
                pos.push(rx * rad, ry * rad, 0.0);
                nor.push(0.0, 0.0, 1.0);
                col.push(color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (ry + 1.0) * 0.5);
                if (i === split - 1) {
                    idx.push(0, j + 1, 1);
                } else {
                    idx.push(0, j + 1, j + 2);
                }
                ++j;
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * キューブの頂点情報を生成する
         * @param {number} side - 正立方体の一辺の長さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線 ※キューブの中心から各頂点に向かって伸びるベクトルなので注意
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let cubeData = gl3.Mesh.cube(2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cube",
        value: function cube(side, color) {
            var hs = side * 0.5;
            var pos = [-hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs, -hs, -hs, hs, -hs, -hs, hs, hs, hs, hs, hs, hs, hs, -hs, -hs, -hs, -hs, hs, -hs, -hs, hs, -hs, hs, -hs, -hs, hs, hs, -hs, -hs, hs, hs, -hs, hs, hs, hs, hs, -hs, hs, -hs, -hs, -hs, -hs, -hs, hs, -hs, hs, hs, -hs, hs, -hs];
            var v = 1.0 / Math.sqrt(3.0);
            var nor = [-v, -v, v, v, -v, v, v, v, v, -v, v, v, -v, -v, -v, -v, v, -v, v, v, -v, v, -v, -v, -v, v, -v, -v, v, v, v, v, v, v, v, -v, -v, -v, -v, v, -v, -v, v, -v, v, -v, -v, v, v, -v, -v, v, v, -v, v, v, v, v, -v, v, -v, -v, -v, -v, -v, v, -v, v, v, -v, v, -v];
            var col = [];
            for (var i = 0; i < pos.length / 3; i++) {
                col.push(color[0], color[1], color[2], color[3]);
            }
            var st = [0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
            var idx = [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23];
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 三角錐の頂点情報を生成する
         * @param {number} split - 底面円の円周の分割数
         * @param {number} rad - 底面円の半径
         * @param {number} height - 三角錐の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let coneData = gl3.Mesh.cone(64, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cone",
        value: function cone(split, rad, height, color) {
            var i = void 0,
                j = 0;
            var h = height / 2.0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, -h, 0.0);
            nor.push(0.0, -1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            for (i = 0; i <= split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var rz = Math.sin(r);
                pos.push(rx * rad, -h, rz * rad, rx * rad, -h, rz * rad);
                nor.push(0.0, -1.0, 0.0, rx, 0.0, rz);
                col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5);
                if (i !== split) {
                    idx.push(0, j + 1, j + 3);
                    idx.push(j + 4, j + 2, split * 2 + 3);
                }
                j += 2;
            }
            pos.push(0.0, h, 0.0);
            nor.push(0.0, 1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5);
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 円柱の頂点情報を生成する
         * @param {number} split - 円柱の円周の分割数
         * @param {number} topRad - 円柱の天面の半径
         * @param {number} bottomRad - 円柱の底面の半径
         * @param {number} height - 円柱の高さ
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let cylinderData = gl3.Mesh.cylinder(64, 0.5, 1.0, 2.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "cylinder",
        value: function cylinder(split, topRad, bottomRad, height, color) {
            var i = void 0,
                j = 2;
            var h = height / 2.0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            pos.push(0.0, h, 0.0, 0.0, -h, 0.0);
            nor.push(0.0, 1.0, 0.0, 0.0, -1.0, 0.0);
            col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
            st.push(0.5, 0.5, 0.5, 0.5);
            for (i = 0; i <= split; i++) {
                var r = Math.PI * 2.0 / split * i;
                var rx = Math.cos(r);
                var rz = Math.sin(r);
                pos.push(rx * topRad, h, rz * topRad, rx * topRad, h, rz * topRad, rx * bottomRad, -h, rz * bottomRad, rx * bottomRad, -h, rz * bottomRad);
                nor.push(0.0, 1.0, 0.0, rx, 0.0, rz, 0.0, -1.0, 0.0, rx, 0.0, rz);
                col.push(color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]);
                st.push((rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, 1.0 - i / split, 0.0, (rx + 1.0) * 0.5, 1.0 - (rz + 1.0) * 0.5, 1.0 - i / split, 1.0);
                if (i !== split) {
                    idx.push(0, j + 4, j, 1, j + 2, j + 6, j + 5, j + 7, j + 1, j + 1, j + 7, j + 3);
                }
                j += 4;
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 球体の頂点情報を生成する
         * @param {number} row - 球の縦方向（緯度方向）の分割数
         * @param {number} column - 球の横方向（経度方向）の分割数
         * @param {number} rad - 球の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let sphereData = gl3.Mesh.sphere(64, 64, 1.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "sphere",
        value: function sphere(row, column, rad, color) {
            var i = void 0,
                j = void 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            for (i = 0; i <= row; i++) {
                var r = Math.PI / row * i;
                var ry = Math.cos(r);
                var rr = Math.sin(r);
                for (j = 0; j <= column; j++) {
                    var tr = Math.PI * 2 / column * j;
                    var tx = rr * rad * Math.cos(tr);
                    var ty = ry * rad;
                    var tz = rr * rad * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    pos.push(tx, ty, tz);
                    nor.push(rx, ry, rz);
                    col.push(color[0], color[1], color[2], color[3]);
                    st.push(1 - 1 / column * j, 1 / row * i);
                }
            }
            for (i = 0; i < row; i++) {
                for (j = 0; j < column; j++) {
                    var _r = (column + 1) * i + j;
                    idx.push(_r, _r + 1, _r + column + 2);
                    idx.push(_r, _r + column + 2, _r + column + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * トーラスの頂点情報を生成する
         * @param {number} row - 輪の分割数
         * @param {number} column - パイプ断面の分割数
         * @param {number} irad - パイプ断面の半径
         * @param {number} orad - パイプ全体の半径
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let torusData = gl3.Mesh.torus(64, 64, 0.25, 0.75, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "torus",
        value: function torus(row, column, irad, orad, color) {
            var i = void 0,
                j = void 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            for (i = 0; i <= row; i++) {
                var r = Math.PI * 2 / row * i;
                var rr = Math.cos(r);
                var ry = Math.sin(r);
                for (j = 0; j <= column; j++) {
                    var tr = Math.PI * 2 / column * j;
                    var tx = (rr * irad + orad) * Math.cos(tr);
                    var ty = ry * irad;
                    var tz = (rr * irad + orad) * Math.sin(tr);
                    var rx = rr * Math.cos(tr);
                    var rz = rr * Math.sin(tr);
                    var rs = 1 / column * j;
                    var rt = 1 / row * i + 0.5;
                    if (rt > 1.0) {
                        rt -= 1.0;
                    }
                    rt = 1.0 - rt;
                    pos.push(tx, ty, tz);
                    nor.push(rx, ry, rz);
                    col.push(color[0], color[1], color[2], color[3]);
                    st.push(rs, rt);
                }
            }
            for (i = 0; i < row; i++) {
                for (j = 0; j < column; j++) {
                    var _r2 = (column + 1) * i + j;
                    idx.push(_r2, _r2 + column + 1, _r2 + 1);
                    idx.push(_r2 + column + 1, _r2 + column + 2, _r2 + 1);
                }
            }
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }

        /**
         * 正二十面体の頂点情報を生成する
         * @param {number} rad - サイズ（黄金比に対する比率）
         * @param {Array.<number>} color - RGBA を 0.0 から 1.0 の範囲で指定した配列
         * @return {object}
         * @property {Array.<number>} position - 頂点座標
         * @property {Array.<number>} normal - 頂点法線
         * @property {Array.<number>} color - 頂点カラー
         * @property {Array.<number>} texCoord - テクスチャ座標
         * @property {Array.<number>} index - 頂点インデックス（gl.TRIANGLES）
         * @example
         * let icosaData = gl3.Mesh.icosahedron(1.0, [1.0, 1.0, 1.0, 1.0]);
         */

    }, {
        key: "icosahedron",
        value: function icosahedron(rad, color) {
            var i = void 0,
                j = void 0;
            var pos = [],
                nor = [],
                col = [],
                st = [],
                idx = [];
            var c = (1.0 + Math.sqrt(5.0)) / 2.0;
            var t = c * rad;
            var l = Math.sqrt(1.0 + c * c);
            var r = [1.0 / l, c / l];
            pos = [-rad, t, 0.0, rad, t, 0.0, -rad, -t, 0.0, rad, -t, 0.0, 0.0, -rad, t, 0.0, rad, t, 0.0, -rad, -t, 0.0, rad, -t, t, 0.0, -rad, t, 0.0, rad, -t, 0.0, -rad, -t, 0.0, rad];
            nor = [-r[0], r[1], 0.0, r[0], r[1], 0.0, -r[0], -r[1], 0.0, r[0], -r[1], 0.0, 0.0, -r[0], r[1], 0.0, r[0], r[1], 0.0, -r[0], -r[1], 0.0, r[0], -r[1], r[1], 0.0, -r[0], r[1], 0.0, r[0], -r[1], 0.0, -r[0], -r[1], 0.0, r[0]];
            col = [color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3], color[0], color[1], color[2], color[3]];
            for (var _i = 0, _j = nor.length; _i < _j; _i += 3) {
                var u = (Math.atan2(nor[_i + 2], -nor[_i]) + Math.PI) / (Math.PI * 2.0);
                var v = 1.0 - (nor[_i + 1] + 1.0) / 2.0;
                st.push(u, v);
            }
            idx = [0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11, 4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3, 6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1];
            return { position: pos, normal: nor, color: col, texCoord: st, index: idx };
        }
    }]);

    return gl3Mesh;
}();

exports.default = gl3Mesh;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * gl3Util
 * @class gl3Util
 */
var gl3Util = function () {
    function gl3Util() {
        _classCallCheck(this, gl3Util);
    }

    _createClass(gl3Util, null, [{
        key: "hsva",

        /**
         * HSV カラーを生成して配列で返す
         * @param {number} h - 色相
         * @param {number} s - 彩度
         * @param {number} v - 明度
         * @param {number} a - アルファ
         * @return {Array.<number>} RGBA を 0.0 から 1.0 の範囲に正規化した色の配列
         */
        value: function hsva(h, s, v, a) {
            if (s > 1 || v > 1 || a > 1) {
                return;
            }
            var th = h % 360;
            var i = Math.floor(th / 60);
            var f = th / 60 - i;
            var m = v * (1 - s);
            var n = v * (1 - s * f);
            var k = v * (1 - s * (1 - f));
            var color = new Array();
            if (!s > 0 && !s < 0) {
                color.push(v, v, v, a);
            } else {
                var r = new Array(v, n, m, m, k, v);
                var g = new Array(k, v, v, n, m, m);
                var b = new Array(m, m, k, v, v, n);
                color.push(r[i], g[i], b[i], a);
            }
            return color;
        }

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeLiner",
        value: function easeLiner(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeOutCubic",
        value: function easeOutCubic(t) {
            return (t = t / 1 - 1) * t * t + 1;
        }

        /**
         * イージング
         * @param {number} t - 0.0 から 1.0 の値
         * @return {number} イージングした結果
         */

    }, {
        key: "easeQuintic",
        value: function easeQuintic(t) {
            var ts = (t = t / 1) * t;
            var tc = ts * t;
            return tc * ts;
        }

        /**
         * 度数法の角度から弧度法の値へ変換する
         * @param {number} deg - 度数法の角度
         * @return {number} 弧度法の値
         */

    }, {
        key: "degToRad",
        value: function degToRad(deg) {
            return deg % 360 * Math.PI / 180;
        }

        /**
         * 赤道半径（km）
         * @type {number}
         */

    }, {
        key: "lonToMer",


        /**
         * 経度を元にメルカトル座標を返す
         * @param {number} lon - 経度
         * @return {number} メルカトル座標系における X
         */
        value: function lonToMer(lon) {
            return gl3Util.EARTH_RADIUS * gl3Util.degToRad(lon);
        }

        /**
         * 緯度を元にメルカトル座標を返す
         * @param {number} lat - 緯度
         * @param {number} [flatten=0] - 扁平率
         * @return {number} メルカトル座標系における Y
         */

    }, {
        key: "latToMer",
        value: function latToMer(lat) {
            var flatten = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var flattening = flatten;
            if (isNaN(parseFloat(flatten))) {
                flattening = 0;
            }
            var clamp = 0.0001;
            if (lat >= 90 - clamp) {
                lat = 90 - clamp;
            }
            if (lat <= -90 + clamp) {
                lat = -90 + clamp;
            }
            var temp = 1 - flattening;
            var es = 1.0 - temp * temp;
            var eccent = Math.sqrt(es);
            var phi = gl3Util.degToRad(lat);
            var sinphi = Math.sin(phi);
            var con = eccent * sinphi;
            var com = 0.5 * eccent;
            con = Math.pow((1.0 - con) / (1.0 + con), com);
            var ts = Math.tan(0.5 * (Math.PI * 0.5 - phi)) / con;
            return gl3Util.EARTH_RADIUS * Math.log(ts);
        }

        /**
         * 緯度経度をメルカトル座標系に変換して返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} [flatten=0] - 扁平率
         * @return {obj}
         * @property {number} x - メルカトル座標系における X 座標
         * @property {number} y - メルカトル座標系における Y 座標
         */

    }, {
        key: "lonLatToMer",
        value: function lonLatToMer(lon, lat) {
            var flatten = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            return {
                x: gl3Util.lonToMer(lon),
                y: gl3Util.latToMer(lat, flattening)
            };
        }

        /**
         * メルカトル座標を緯度経度に変換して返す
         * @param {number} x - メルカトル座標系における X 座標
         * @param {number} y - メルカトル座標系における Y 座標
         * @return {obj}
         * @property {number} lon - 経度
         * @property {number} lat - 緯度
         */

    }, {
        key: "merToLonLat",
        value: function merToLonLat(x, y) {
            var lon = x / gl3Util.EARTH_HALF_CIRCUM * 180;
            var lat = y / gl3Util.EARTH_HALF_CIRCUM * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return {
                lon: lon,
                lat: lat
            };
        }

        /**
         * 経度からタイルインデックスを求めて返す
         * @param {number} lon - 経度
         * @param {number} zoom - ズームレベル
         * @return {number} 経度方向のタイルインデックス
         */

    }, {
        key: "lonToTile",
        value: function lonToTile(lon, zoom) {
            return Math.floor((lon / 180 + 1) * Math.pow(2, zoom) / 2);
        }

        /**
         * 緯度からタイルインデックスを求めて返す
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {number} 緯度方向のタイルインデックス
         */

    }, {
        key: "latToTile",
        value: function latToTile(lat, zoom) {
            return Math.floor((-Math.log(Math.tan((45 + lat / 2) * Math.PI / 180)) + Math.PI) * Math.pow(2, zoom) / (2 * Math.PI));
        }

        /**
         * 緯度経度をタイルインデックスに変換して返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {obj}
         * @property {number} lon - 経度方向のタイルインデックス
         * @property {number} lat - 緯度方向のタイルインデックス
         */

    }, {
        key: "lonLatToTile",
        value: function lonLatToTile(lon, lat, zoom) {
            return {
                lon: gl3Util.lonToTile(lon, zoom),
                lat: gl3Util.latToTile(lat, zoom)
            };
        }

        /**
         * タイルインデックスから経度を求めて返す
         * @param {number} lon - 経度方向のタイルインデックス
         * @param {number} zoom - ズームレベル
         * @return {number} 経度
         */

    }, {
        key: "tileToLon",
        value: function tileToLon(lon, zoom) {
            return lon / Math.pow(2, zoom) * 360 - 180;
        }

        /**
         * タイルインデックスから緯度を求めて返す
         * @param {number} lat - 緯度方向のタイルインデックス
         * @param {number} zoom - ズームレベル
         * @return {number} 緯度
         */

    }, {
        key: "tileToLat",
        value: function tileToLat(lat, zoom) {
            var y = lat / Math.pow(2, zoom) * 2 * Math.PI - Math.PI;
            return 2 * Math.atan(Math.pow(Math.E, -y)) * 180 / Math.PI - 90;
        }

        /**
         * タイルインデックスから緯度経度を求めて返す
         * @param {number} lon - 経度
         * @param {number} lat - 緯度
         * @param {number} zoom - ズームレベル
         * @return {obj}
         * @property {number} lon - 経度方向のタイルインデックス
         * @property {number} lat - 緯度方向のタイルインデックス
         */

    }, {
        key: "tileToLonLat",
        value: function tileToLonLat(lon, lat, zoom) {
            return {
                lon: gl3Util.tileToLon(lon, zoom),
                lat: gl3Util.tileToLat(lat, zoom)
            };
        }
    }, {
        key: "EARTH_RADIUS",
        get: function get() {
            return 6378.137;
        }

        /**
         * 赤道円周（km）
         * @type {number}
         */

    }, {
        key: "EARTH_CIRCUM",
        get: function get() {
            return gl3Util.EARTH_RADIUS * Math.PI * 2.0;
        }

        /**
         * 赤道円周の半分（km）
         * @type {number}
         */

    }, {
        key: "EARTH_HALF_CIRCUM",
        get: function get() {
            return gl3Util.EARTH_RADIUS * Math.PI;
        }

        /**
         * メルカトル座標系における最大緯度
         * @type {number}
         */

    }, {
        key: "EARTH_MAX_LAT",
        get: function get() {
            return 85.05112878;
        }
    }]);

    return gl3Util;
}();

exports.default = gl3Util;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gl3Audio = __webpack_require__(0);

var _gl3Audio2 = _interopRequireDefault(_gl3Audio);

var _gl3Math = __webpack_require__(2);

var _gl3Math2 = _interopRequireDefault(_gl3Math);

var _gl3Mesh = __webpack_require__(3);

var _gl3Mesh2 = _interopRequireDefault(_gl3Mesh);

var _gl3Util = __webpack_require__(4);

var _gl3Util2 = _interopRequireDefault(_gl3Util);

var _gl3Gui = __webpack_require__(1);

var _gl3Gui2 = _interopRequireDefault(_gl3Gui);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * glcubic
 * @class gl3
 */
var gl3 = function () {
    /**
     * @constructor
     */
    function gl3() {
        _classCallCheck(this, gl3);

        /**
         * version
         * @const
         * @type {string}
         */
        this.VERSION = '0.2.3';
        /**
         * pi * 2
         * @const
         * @type {number}
         */
        this.PI2 = 6.28318530717958647692528676655900576;
        /**
         * pi
         * @const
         * @type {number}
         */
        this.PI = 3.14159265358979323846264338327950288;
        /**
         * pi / 2
         * @const
         * @type {number}
         */
        this.PIH = 1.57079632679489661923132169163975144;
        /**
         * pi / 4
         * @const
         * @type {number}
         */
        this.PIH2 = 0.78539816339744830961566084581987572;
        /**
         * gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS を利用して得られるテクスチャユニットの最大利用可能数
         * @const
         * @type {number}
         */
        this.TEXTURE_UNIT_COUNT = null;

        /**
         * glcubic が正しく初期化されたどうかのフラグ
         * @type {boolean}
         */
        this.ready = false;
        /**
         * glcubic と紐付いている canvas element
         * @type {HTMLCanvasElement}
         */
        this.canvas = null;
        /**
         * glcubic と紐付いている canvas から取得した WebGL Rendering Context
         * @type {WebGLRenderingContext}
         */
        this.gl = null;
        /**
         * WebGL2RenderingContext として初期化したかどうかを表す真偽値
         * @type {bool}
         */
        this.isWebGL2 = false;
        /**
         * cubic としてのログ出力をするかどうか
         * @type {bool}
         */
        this.isConsoleOutput = true;
        /**
         * glcubic が内部的に持っているテクスチャ格納用の配列
         * @type {Array.<WebGLTexture>}
         */
        this.textures = null;
        /**
         * WebGL の拡張機能を格納するオブジェクト
         * @type {Object}
         */
        this.ext = null;

        /**
         * gl3Audio クラスのインスタンス
         * @type {gl3Audio}
         */
        this.Audio = _gl3Audio2.default;
        /**
         * gl3Mesh クラスのインスタンス
         * @type {gl3Mesh}
         */
        this.Mesh = _gl3Mesh2.default;
        /**
         * gl3Util クラスのインスタンス
         * @type {gl3Util}
         */
        this.Util = _gl3Util2.default;
        /**
         * gl3Gui クラスのインスタンス
         * @type {gl3Gui}
         */
        this.Gui = new _gl3Gui2.default();
        /**
         * gl3Math クラスのインスタンス
         * @type {gl3Math}
         */
        this.Math = new _gl3Math2.default();
    }

    /**
     * glcubic を初期化する
     * @param {HTMLCanvasElement|string} canvas - canvas element か canvas に付与されている ID 文字列
     * @param {Object} initOptions - canvas.getContext で第二引数に渡す初期化時オプション
     * @param {Object} cubicOptions
     * @property {bool} webgl2Mode - webgl2 を有効化する場合 true
     * @property {bool} consoleMessage - console に cubic のログを出力するかどうか
     * @return {boolean} 初期化が正しく行われたかどうかを表す真偽値
     */


    _createClass(gl3, [{
        key: 'init',
        value: function init(canvas, initOptions, cubicOptions) {
            var opt = initOptions || {};
            this.ready = false;
            if (canvas == null) {
                return false;
            }
            if (canvas instanceof HTMLCanvasElement) {
                this.canvas = canvas;
            } else if (Object.prototype.toString.call(canvas) === '[object String]') {
                this.canvas = document.getElementById(canvas);
            }
            if (this.canvas == null) {
                return false;
            }
            if (cubicOptions != null) {
                if (cubicOptions.hasOwnProperty('webgl2Mode') === true && cubicOptions.webgl2Mode === true) {
                    this.gl = this.canvas.getContext('webgl2', opt);
                    this.isWebGL2 = true;
                }
                if (cubicOptions.hasOwnProperty('consoleMessage') === true && cubicOptions.consoleMessage !== true) {
                    this.isConsoleOutput = false;
                }
            }
            if (this.gl == null) {
                this.gl = this.canvas.getContext('webgl', opt) || this.canvas.getContext('experimental-webgl', opt);
            }
            if (this.gl != null) {
                this.ready = true;
                this.TEXTURE_UNIT_COUNT = this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
                this.textures = new Array(this.TEXTURE_UNIT_COUNT);
                this.ext = {
                    elementIndexUint: this.gl.getExtension('OES_element_index_uint'),
                    textureFloat: this.gl.getExtension('OES_texture_float'),
                    textureHalfFloat: this.gl.getExtension('OES_texture_half_float'),
                    drawBuffers: this.gl.getExtension('WEBGL_draw_buffers')
                };
                if (this.isConsoleOutput === true) {
                    console.log('%c◆%c glcubic.js %c◆%c : version %c' + this.VERSION, 'color: crimson', '', 'color: crimson', '', 'color: royalblue');
                }
            }
            return this.ready;
        }

        /**
         * フレームバッファをクリアする
         * @param {Array.<number>} color - クリアする色（0.0 ~ 1.0）
         * @param {number} [depth] - クリアする深度
         * @param {number} [stencil] - クリアするステンシル値
         */

    }, {
        key: 'sceneClear',
        value: function sceneClear(color, depth, stencil) {
            var gl = this.gl;
            var flg = gl.COLOR_BUFFER_BIT;
            gl.clearColor(color[0], color[1], color[2], color[3]);
            if (depth != null) {
                gl.clearDepth(depth);
                flg = flg | gl.DEPTH_BUFFER_BIT;
            }
            if (stencil != null) {
                gl.clearStencil(stencil);
                flg = flg | gl.STENCIL_BUFFER_BIT;
            }
            gl.clear(flg);
        }

        /**
         * ビューポートを設定する
         * @param {number} [x] - x（左端原点）
         * @param {number} [y] - y（下端原点）
         * @param {number} [width] - 横の幅
         * @param {number} [height] - 縦の高さ
         */

    }, {
        key: 'sceneView',
        value: function sceneView(x, y, width, height) {
            var X = x || 0;
            var Y = y || 0;
            var w = width || window.innerWidth;
            var h = height || window.innerHeight;
            this.gl.viewport(X, Y, w, h);
        }

        /**
         * gl.drawArrays をコールするラッパー
         * @param {number} primitive - プリミティブタイプ
         * @param {number} vertexCount - 描画する頂点の個数
         * @param {number} [offset=0] - 描画する頂点の開始オフセット
         */

    }, {
        key: 'drawArrays',
        value: function drawArrays(primitive, vertexCount) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawArrays(primitive, offset, vertexCount);
        }

        /**
         * gl.drawElements をコールするラッパー
         * @param {number} primitive - プリミティブタイプ
         * @param {number} indexLength - 描画するインデックスの個数
         * @param {number} [offset=0] - 描画するインデックスの開始オフセット
         */

    }, {
        key: 'drawElements',
        value: function drawElements(primitive, indexLength) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_SHORT, offset);
        }

        /**
         * gl.drawElements をコールするラッパー（gl.UNSIGNED_INT） ※要拡張機能（WebGL 1.0）
         * @param {number} primitive - プリミティブタイプ
         * @param {number} indexLength - 描画するインデックスの個数
         * @param {number} [offset=0] - 描画するインデックスの開始オフセット
         */

    }, {
        key: 'drawElementsInt',
        value: function drawElementsInt(primitive, indexLength) {
            var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

            this.gl.drawElements(primitive, indexLength, this.gl.UNSIGNED_INT, offset);
        }

        /**
         * VBO（Vertex Buffer Object）を生成して返す
         * @param {Array.<number>} data - 頂点情報を格納した配列
         * @return {WebGLBuffer} 生成した頂点バッファ
         */

    }, {
        key: 'createVbo',
        value: function createVbo(data) {
            if (data == null) {
                return;
            }
            var vbo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
            return vbo;
        }

        /**
         * IBO（Index Buffer Object）を生成して返す
         * @param {Array.<number>} data - インデックス情報を格納した配列
         * @return {WebGLBuffer} 生成したインデックスバッファ
         */

    }, {
        key: 'createIbo',
        value: function createIbo(data) {
            if (data == null) {
                return;
            }
            var ibo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
            return ibo;
        }

        /**
         * IBO（Index Buffer Object）を生成して返す（gl.UNSIGNED_INT） ※要拡張機能（WebGL 1.0）
         * @param {Array.<number>} data - インデックス情報を格納した配列
         * @return {WebGLBuffer} 生成したインデックスバッファ
         */

    }, {
        key: 'createIboInt',
        value: function createIboInt(data) {
            if (data == null) {
                return;
            }
            var ibo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, ibo);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(data), this.gl.STATIC_DRAW);
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
            return ibo;
        }

        /**
         * ファイルを元にテクスチャを生成して返す
         * @param {string} source - ファイルパス
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @param {function} callback - 画像のロードが完了しテクスチャを生成した後に呼ばれるコールバック
         */

    }, {
        key: 'createTextureFromFile',
        value: function createTextureFromFile(source, number, callback) {
            var _this = this;

            if (source == null || number == null) {
                return;
            }
            var img = new Image();
            var gl = this.gl;
            img.onload = function () {
                _this.textures[number] = { texture: null, type: null, loaded: false };
                var tex = gl.createTexture();
                gl.activeTexture(gl.TEXTURE0 + number);
                gl.bindTexture(gl.TEXTURE_2D, tex);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                _this.textures[number].texture = tex;
                _this.textures[number].type = gl.TEXTURE_2D;
                _this.textures[number].loaded = true;
                if (_this.isConsoleOutput === true) {
                    console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source, 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                }
                gl.bindTexture(gl.TEXTURE_2D, null);
                if (callback != null) {
                    callback(number);
                }
            };
            img.src = source;
        }

        /**
         * オブジェクトを元にテクスチャを生成して返す
         * @param {object} object - ロード済みの Image オブジェクトや Canvas オブジェクト
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         */

    }, {
        key: 'createTextureFromObject',
        value: function createTextureFromObject(object, number) {
            if (object == null || number == null) {
                return;
            }
            var gl = this.gl;
            var tex = gl.createTexture();
            this.textures[number] = { texture: null, type: null, loaded: false };
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, object);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            this.textures[number].texture = tex;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, object attached', 'color: crimson', '', 'color: blue', '');
            }
            gl.bindTexture(gl.TEXTURE_2D, null);
        }

        /**
         * 画像を元にキューブマップテクスチャを生成する
         * @param {Array.<string>} source - ファイルパスを格納した配列
         * @param {Array.<number>} target - キューブマップテクスチャに設定するターゲットの配列
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @param {function} callback - 画像のロードが完了しテクスチャを生成した後に呼ばれるコールバック
         */

    }, {
        key: 'createTextureCubeFromFile',
        value: function createTextureCubeFromFile(source, target, number, callback) {
            var _this2 = this;

            if (source == null || target == null || number == null) {
                return;
            }
            var cImg = [];
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            for (var i = 0; i < source.length; i++) {
                cImg[i] = { image: new Image(), loaded: false };
                cImg[i].image.onload = function (index) {
                    return function () {
                        cImg[index].loaded = true;
                        if (cImg.length === 6) {
                            var f = true;
                            cImg.map(function (v) {
                                f = f && v.loaded;
                            });
                            if (f === true) {
                                var tex = gl.createTexture();
                                gl.activeTexture(gl.TEXTURE0 + number);
                                gl.bindTexture(gl.TEXTURE_CUBE_MAP, tex);
                                for (var j = 0; j < source.length; j++) {
                                    gl.texImage2D(target[j], 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cImg[j].image);
                                }
                                gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                                gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                                _this2.textures[number].texture = tex;
                                _this2.textures[number].type = gl.TEXTURE_CUBE_MAP;
                                _this2.textures[number].loaded = true;
                                if (_this2.isConsoleOutput === true) {
                                    console.log('%c◆%c texture number: %c' + number + '%c, file loaded: %c' + source[0] + '...', 'color: crimson', '', 'color: blue', '', 'color: goldenrod');
                                }
                                gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
                                if (callback != null) {
                                    callback(number);
                                }
                            }
                        }
                    };
                }(i);
                cImg[i].image.src = source[i];
            }
        }

        /**
         * glcubic が持つ配列のインデックスとテクスチャユニットを指定してテクスチャをバインドする
         * @param {number} unit - テクスチャユニット
         * @param {number} number - glcubic が持つ配列のインデックス
         */

    }, {
        key: 'bindTexture',
        value: function bindTexture(unit, number) {
            if (this.textures[number] == null) {
                return;
            }
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(this.textures[number].type, this.textures[number].texture);
        }

        /**
         * glcubic が持つ配列内のテクスチャ用画像が全てロード済みかどうか確認する
         * @return {boolean} ロードが完了しているかどうかのフラグ
         */

    }, {
        key: 'isTextureLoaded',
        value: function isTextureLoaded() {
            var i = void 0,
                j = void 0,
                f = void 0,
                g = void 0;
            f = true;g = false;
            for (i = 0, j = this.textures.length; i < j; i++) {
                if (this.textures[i] != null) {
                    g = true;
                    f = f && this.textures[i].loaded;
                }
            }
            if (g) {
                return f;
            } else {
                return false;
            }
        }

        /**
         * フレームバッファを生成しカラーバッファにテクスチャを設定してオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebuffer',
        value: function createFramebuffer(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created', 'color: crimson', '', 'color: blue', '');
            }
            return { framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファにテクスチャを設定、ステンシル有効でオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthStencilRenderbuffer - 深度バッファ兼ステンシルバッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebufferStencil',
        value: function createFramebufferStencil(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthStencilRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, depthStencilRenderBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created (enable stencil)', 'color: crimson', '', 'color: blue', '');
            }
            return { framebuffer: frameBuffer, depthStencilRenderbuffer: depthStencilRenderBuffer, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファに浮動小数点テクスチャを設定してオブジェクトとして返す ※要拡張機能（WebGL 1.0）
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebufferFloat',
        value: function createFramebufferFloat(width, height, number) {
            if (width == null || height == null || number == null) {
                return;
            }
            if (this.ext == null || this.ext.textureFloat == null && this.ext.textureHalfFloat == null) {
                console.log('float texture not support');
                return;
            }
            var gl = this.gl;
            var flg = this.ext.textureFloat != null ? gl.FLOAT : this.ext.textureHalfFloat.HALF_FLOAT_OES;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_2D, fTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, flg, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fTexture, 0);
            gl.bindTexture(gl.TEXTURE_2D, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_2D;
            this.textures[number].loaded = true;
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, framebuffer created (enable float)', 'color: crimson', '', 'color: blue', '');
            }
            return { framebuffer: frameBuffer, depthRenderbuffer: null, texture: fTexture };
        }

        /**
         * フレームバッファを生成しカラーバッファにキューブテクスチャを設定してオブジェクトとして返す
         * @param {number} width - フレームバッファの横幅
         * @param {number} height - フレームバッファの高さ
         * @param {Array.<number>} target - キューブマップテクスチャに設定するターゲットの配列
         * @param {number} number - glcubic が内部的に持つ配列のインデックス ※非テクスチャユニット
         * @return {object} 生成した各種オブジェクトはラップして返却する
         * @property {WebGLFramebuffer} framebuffer - フレームバッファ
         * @property {WebGLRenderbuffer} depthRenderBuffer - 深度バッファとして設定したレンダーバッファ
         * @property {WebGLTexture} texture - カラーバッファとして設定したテクスチャ
         */

    }, {
        key: 'createFramebufferCube',
        value: function createFramebufferCube(width, height, target, number) {
            if (width == null || height == null || target == null || number == null) {
                return;
            }
            var gl = this.gl;
            this.textures[number] = { texture: null, type: null, loaded: false };
            var frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            var depthRenderBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, depthRenderBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, width, height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthRenderBuffer);
            var fTexture = gl.createTexture();
            gl.activeTexture(gl.TEXTURE0 + number);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, fTexture);
            for (var i = 0; i < target.length; i++) {
                gl.texImage2D(target[i], 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            }
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
            gl.bindRenderbuffer(gl.RENDERBUFFER, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            this.textures[number].texture = fTexture;
            this.textures[number].type = gl.TEXTURE_CUBE_MAP;
            this.textures[number].loaded = true;
            if (this.isConsoleOutput === true) {
                console.log('%c◆%c texture number: %c' + number + '%c, framebuffer cube created', 'color: crimson', '', 'color: blue', '');
            }
            return { framebuffer: frameBuffer, depthRenderbuffer: depthRenderBuffer, texture: fTexture };
        }

        /**
         * HTML 内に存在する ID 文字列から script タグを参照しプログラムオブジェクトを生成する
         * @param {string} vsId - 頂点シェーダのソースが記述された script タグの ID 文字列
         * @param {string} fsId - フラグメントシェーダのソースが記述された script タグの ID 文字列
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス
         */

    }, {
        key: 'createProgramFromId',
        value: function createProgramFromId(vsId, fsId, attLocation, attStride, uniLocation, uniType) {
            if (this.gl == null) {
                return null;
            }
            var i = void 0;
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            mng.vs = mng.createShaderFromId(vsId);
            mng.fs = mng.createShaderFromId(fsId);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            if (mng.prg == null) {
                return mng;
            }
            mng.attL = new Array(attLocation.length);
            mng.attS = new Array(attLocation.length);
            for (i = 0; i < attLocation.length; i++) {
                mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
                mng.attS[i] = attStride[i];
            }
            mng.uniL = new Array(uniLocation.length);
            for (i = 0; i < uniLocation.length; i++) {
                mng.uniL[i] = this.gl.getUniformLocation(mng.prg, uniLocation[i]);
            }
            mng.uniT = uniType;
            mng.locationCheck(attLocation, uniLocation);
            return mng;
        }

        /**
         * シェーダのソースコード文字列からプログラムオブジェクトを生成する
         * @param {string} vs - 頂点シェーダのソース
         * @param {string} fs - フラグメントシェーダのソース
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス
         */

    }, {
        key: 'createProgramFromSource',
        value: function createProgramFromSource(vs, fs, attLocation, attStride, uniLocation, uniType) {
            if (this.gl == null) {
                return null;
            }
            var i = void 0;
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            mng.vs = mng.createShaderFromSource(vs, this.gl.VERTEX_SHADER);
            mng.fs = mng.createShaderFromSource(fs, this.gl.FRAGMENT_SHADER);
            mng.prg = mng.createProgram(mng.vs, mng.fs);
            if (mng.prg == null) {
                return mng;
            }
            mng.attL = new Array(attLocation.length);
            mng.attS = new Array(attLocation.length);
            for (i = 0; i < attLocation.length; i++) {
                mng.attL[i] = this.gl.getAttribLocation(mng.prg, attLocation[i]);
                mng.attS[i] = attStride[i];
            }
            mng.uniL = new Array(uniLocation.length);
            for (i = 0; i < uniLocation.length; i++) {
                mng.uniL[i] = this.gl.getUniformLocation(mng.prg, uniLocation[i]);
            }
            mng.uniT = uniType;
            mng.locationCheck(attLocation, uniLocation);
            return mng;
        }

        /**
         * ファイルからシェーダのソースコードを取得しプログラムオブジェクトを生成する
         * @param {string} vsPath - 頂点シェーダのソースが記述されたファイルのパス
         * @param {string} fsPath - フラグメントシェーダのソースが記述されたファイルのパス
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @param {function} callback - ソースコードのロードが完了しプログラムオブジェクトを生成した後に呼ばれるコールバック
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス ※ロード前にインスタンスは戻り値として返却される
         */

    }, {
        key: 'createProgramFromFile',
        value: function createProgramFromFile(vsPath, fsPath, attLocation, attStride, uniLocation, uniType, callback) {
            if (this.gl == null) {
                return null;
            }
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            var src = {
                vs: {
                    targetUrl: vsPath,
                    source: null
                },
                fs: {
                    targetUrl: fsPath,
                    source: null
                }
            };
            xhr(this.gl, src.vs);
            xhr(this.gl, src.fs);
            function xhr(gl, target) {
                var xml = new XMLHttpRequest();
                xml.open('GET', target.targetUrl, true);
                xml.setRequestHeader('Pragma', 'no-cache');
                xml.setRequestHeader('Cache-Control', 'no-cache');
                xml.onload = function () {
                    if (this.isConsoleOutput === true) {
                        console.log('%c◆%c shader file loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
                    }
                    target.source = xml.responseText;
                    loadCheck(gl);
                };
                xml.send();
            }
            function loadCheck(gl) {
                if (src.vs.source == null || src.fs.source == null) {
                    return;
                }
                var i = void 0;
                mng.vs = mng.createShaderFromSource(src.vs.source, gl.VERTEX_SHADER);
                mng.fs = mng.createShaderFromSource(src.fs.source, gl.FRAGMENT_SHADER);
                mng.prg = mng.createProgram(mng.vs, mng.fs);
                if (mng.prg == null) {
                    return mng;
                }
                mng.attL = new Array(attLocation.length);
                mng.attS = new Array(attLocation.length);
                for (i = 0; i < attLocation.length; i++) {
                    mng.attL[i] = gl.getAttribLocation(mng.prg, attLocation[i]);
                    mng.attS[i] = attStride[i];
                }
                mng.uniL = new Array(uniLocation.length);
                for (i = 0; i < uniLocation.length; i++) {
                    mng.uniL[i] = gl.getUniformLocation(mng.prg, uniLocation[i]);
                }
                mng.uniT = uniType;
                mng.locationCheck(attLocation, uniLocation);
                callback(mng);
            }
            return mng;
        }

        /**
         * ファイルからシェーダのソースコードを取得しプログラムオブジェクトを生成する（transform feedback 対応版）
         * @param {string} vsPath - 頂点シェーダのソースが記述されたファイルのパス
         * @param {string} fsPath - フラグメントシェーダのソースが記述されたファイルのパス
         * @param {Array.<string>} attLocation - attribute 変数名の配列
         * @param {Array.<number>} attStride - attribute 変数のストライドの配列
         * @param {Array.<string>} uniLocation - uniform 変数名の配列
         * @param {Array.<string>} uniType - uniform 変数更新メソッドの名前を示す文字列 ※例：'matrix4fv'
         * @param {Array.<string>} varying - 出力変数名の配列
         * @param {function} callback - ソースコードのロードが完了しプログラムオブジェクトを生成した後に呼ばれるコールバック
         * @return {ProgramManager} プログラムマネージャークラスのインスタンス ※ロード前にインスタンスは戻り値として返却される
         */

    }, {
        key: 'createProgramFromFileTF',
        value: function createProgramFromFileTF(vsPath, fsPath, attLocation, attStride, uniLocation, uniType, varyings, callback) {
            if (this.gl == null) {
                return null;
            }
            var mng = new ProgramManager(this.gl, this.isWebGL2);
            var src = {
                vs: {
                    targetUrl: vsPath,
                    source: null
                },
                fs: {
                    targetUrl: fsPath,
                    source: null
                }
            };
            xhr(this.gl, src.vs);
            xhr(this.gl, src.fs);
            function xhr(gl, target) {
                var xml = new XMLHttpRequest();
                xml.open('GET', target.targetUrl, true);
                xml.setRequestHeader('Pragma', 'no-cache');
                xml.setRequestHeader('Cache-Control', 'no-cache');
                xml.onload = function () {
                    if (this.isConsoleOutput === true) {
                        console.log('%c◆%c shader file loaded: %c' + target.targetUrl, 'color: crimson', '', 'color: goldenrod');
                    }
                    target.source = xml.responseText;
                    loadCheck(gl);
                };
                xml.send();
            }
            function loadCheck(gl) {
                if (src.vs.source == null || src.fs.source == null) {
                    return;
                }
                var i = void 0;
                mng.vs = mng.createShaderFromSource(src.vs.source, gl.VERTEX_SHADER);
                mng.fs = mng.createShaderFromSource(src.fs.source, gl.FRAGMENT_SHADER);
                mng.prg = mng.createProgramTF(mng.vs, mng.fs, varyings);
                if (mng.prg == null) {
                    return mng;
                }
                mng.attL = new Array(attLocation.length);
                mng.attS = new Array(attLocation.length);
                for (i = 0; i < attLocation.length; i++) {
                    mng.attL[i] = gl.getAttribLocation(mng.prg, attLocation[i]);
                    mng.attS[i] = attStride[i];
                }
                mng.uniL = new Array(uniLocation.length);
                for (i = 0; i < uniLocation.length; i++) {
                    mng.uniL[i] = gl.getUniformLocation(mng.prg, uniLocation[i]);
                }
                mng.uniT = uniType;
                mng.locationCheck(attLocation, uniLocation);
                callback(mng);
            }
            return mng;
        }

        /**
         * バッファオブジェクトを削除する
         * @param {WebGLBuffer} buffer - 削除するバッファオブジェクト
         */

    }, {
        key: 'deleteBuffer',
        value: function deleteBuffer(buffer) {
            if (this.gl.isBuffer(buffer) !== true) {
                return;
            }
            this.gl.deleteBuffer(buffer);
            buffer = null;
        }

        /**
         * テクスチャオブジェクトを削除する
         * @param {WebGLTexture} texture - 削除するテクスチャオブジェクト
         */

    }, {
        key: 'deleteTexture',
        value: function deleteTexture(texture) {
            if (this.gl.isTexture(texture) !== true) {
                return;
            }
            this.gl.deleteTexture(texture);
            texture = null;
        }

        /**
         * フレームバッファやレンダーバッファを削除する
         * @param {object} obj - フレームバッファ生成メソッドが返すオブジェクト
         */

    }, {
        key: 'deleteFramebuffer',
        value: function deleteFramebuffer(obj) {
            if (obj == null) {
                return;
            }
            for (var v in obj) {
                if (obj[v] instanceof WebGLFramebuffer && this.gl.isFramebuffer(obj[v]) === true) {
                    this.gl.deleteFramebuffer(obj[v]);
                    obj[v] = null;
                    continue;
                }
                if (obj[v] instanceof WebGLRenderbuffer && this.gl.isRenderbuffer(obj[v]) === true) {
                    this.gl.deleteRenderbuffer(obj[v]);
                    obj[v] = null;
                    continue;
                }
                if (obj[v] instanceof WebGLTexture && this.gl.isTexture(obj[v]) === true) {
                    this.gl.deleteTexture(obj[v]);
                    obj[v] = null;
                }
            }
            obj = null;
        }

        /**
         * シェーダオブジェクトを削除する
         * @param {WebGLShader} shader - シェーダオブジェクト
         */

    }, {
        key: 'deleteShader',
        value: function deleteShader(shader) {
            if (this.gl.isShader(shader) !== true) {
                return;
            }
            this.gl.deleteShader(shader);
            shader = null;
        }

        /**
         * プログラムオブジェクトを削除する
         * @param {WebGLProgram} program - プログラムオブジェクト
         */

    }, {
        key: 'deleteProgram',
        value: function deleteProgram(program) {
            if (this.gl.isProgram(program) !== true) {
                return;
            }
            this.gl.deleteProgram(program);
            program = null;
        }

        /**
         * ProgramManager クラスを内部プロパティごと削除する
         * @param {ProgramManager} prg - ProgramManager クラスのインスタンス
         */

    }, {
        key: 'deleteProgramManager',
        value: function deleteProgramManager(prg) {
            if (prg == null || !(prg instanceof ProgramManager)) {
                return;
            }
            this.deleteShader(prg.vs);
            this.deleteShader(prg.fs);
            this.deleteProgram(prg.prg);
            prg.attL = null;
            prg.attS = null;
            prg.uniL = null;
            prg.uniT = null;
            prg = null;
        }
    }]);

    return gl3;
}();

/**
 * プログラムオブジェクトやシェーダを管理するマネージャ
 * @class ProgramManager
 */


exports.default = gl3;

var ProgramManager = function () {
    /**
     * @constructor
     * @param {WebGLRenderingContext} gl - 自身が属する WebGL Rendering Context
     * @param {bool} [webgl2Mode=false] - webgl2 を有効化したかどうか
     */
    function ProgramManager(gl) {
        var webgl2Mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        _classCallCheck(this, ProgramManager);

        /**
         * 自身が属する WebGL Rendering Context
         * @type {WebGLRenderingContext}
         */
        this.gl = gl;
        /**
         * WebGL2RenderingContext として初期化したかどうかを表す真偽値
         * @type {bool}
         */
        this.isWebGL2 = webgl2Mode;
        /**
         * 頂点シェーダのシェーダオブジェクト
         * @type {WebGLShader}
         */
        this.vs = null;
        /**
         * フラグメントシェーダのシェーダオブジェクト
         * @type {WebGLShader}
         */
        this.fs = null;
        /**
         * プログラムオブジェクト
         * @type {WebGLProgram}
         */
        this.prg = null;
        /**
         * アトリビュートロケーションの配列
         * @type {Array.<number>}
         */
        this.attL = null;
        /**
         * アトリビュート変数のストライドの配列
         * @type {Array.<number>}
         */
        this.attS = null;
        /**
         * ユニフォームロケーションの配列
         * @type {Array.<WebGLUniformLocation>}
         */
        this.uniL = null;
        /**
         * ユニフォーム変数のタイプの配列
         * @type {Array.<string>}
         */
        this.uniT = null;
        /**
         * エラー関連情報を格納する
         * @type {object}
         * @property {string} vs - 頂点シェーダのコンパイルエラー
         * @property {string} fs - フラグメントシェーダのコンパイルエラー
         * @property {string} prg - プログラムオブジェクトのリンクエラー
         */
        this.error = { vs: null, fs: null, prg: null };
    }

    /**
     * script タグの ID を元にソースコードを取得しシェーダオブジェクトを生成する
     * @param {string} id - script タグに付加された ID 文字列
     * @return {WebGLShader} 生成したシェーダオブジェクト
     */


    _createClass(ProgramManager, [{
        key: 'createShaderFromId',
        value: function createShaderFromId(id) {
            var shader = void 0;
            var scriptElement = document.getElementById(id);
            if (!scriptElement) {
                return;
            }
            switch (scriptElement.type) {
                case 'x-shader/x-vertex':
                    shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                    break;
                case 'x-shader/x-fragment':
                    shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                    break;
                default:
                    return;
            }
            var source = scriptElement.text;
            if (this.isWebGL2 !== true) {
                if (source.search(/^#version 300 es/) > -1) {
                    console.warn('◆ can not use glsl es 3.0');
                    return;
                }
            }
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                var err = this.gl.getShaderInfoLog(shader);
                if (scriptElement.type === 'x-shader/x-vertex') {
                    this.error.vs = err;
                } else {
                    this.error.fs = err;
                }
                console.warn('◆ compile failed of shader: ' + err);
            }
        }

        /**
         * シェーダのソースコードを文字列で引数から取得しシェーダオブジェクトを生成する
         * @param {string} source - シェーダのソースコード
         * @param {number} type - gl.VERTEX_SHADER or gl.FRAGMENT_SHADER
         * @return {WebGLShader} 生成したシェーダオブジェクト
         */

    }, {
        key: 'createShaderFromSource',
        value: function createShaderFromSource(source, type) {
            var shader = void 0;
            switch (type) {
                case this.gl.VERTEX_SHADER:
                    shader = this.gl.createShader(this.gl.VERTEX_SHADER);
                    break;
                case this.gl.FRAGMENT_SHADER:
                    shader = this.gl.createShader(this.gl.FRAGMENT_SHADER);
                    break;
                default:
                    return;
            }
            if (this.isWebGL2 !== true) {
                if (source.search(/^#version 300 es/) > -1) {
                    console.warn('◆ can not use glsl es 3.0');
                    return;
                }
            }
            this.gl.shaderSource(shader, source);
            this.gl.compileShader(shader);
            if (this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
                return shader;
            } else {
                var err = this.gl.getShaderInfoLog(shader);
                if (type === this.gl.VERTEX_SHADER) {
                    this.error.vs = err;
                } else {
                    this.error.fs = err;
                }
                console.warn('◆ compile failed of shader: ' + err);
            }
        }

        /**
         * シェーダオブジェクトを引数から取得しプログラムオブジェクトを生成する
         * @param {WebGLShader} vs - 頂点シェーダのシェーダオブジェクト
         * @param {WebGLShader} fs - フラグメントシェーダのシェーダオブジェクト
         * @return {WebGLProgram} 生成したプログラムオブジェクト
         */

    }, {
        key: 'createProgram',
        value: function createProgram(vs, fs) {
            if (vs == null || fs == null) {
                return null;
            }
            var program = this.gl.createProgram();
            this.gl.attachShader(program, vs);
            this.gl.attachShader(program, fs);
            this.gl.linkProgram(program);
            if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                this.gl.useProgram(program);
                return program;
            } else {
                var err = this.gl.getProgramInfoLog(program);
                this.error.prg = err;
                console.warn('◆ link program failed: ' + err);
            }
        }

        /**
         * シェーダオブジェクトを引数から取得しプログラムオブジェクトを生成する
         * @param {WebGLShader} vs - 頂点シェーダのシェーダオブジェクト
         * @param {WebGLShader} fs - フラグメントシェーダのシェーダオブジェクト
         * @param {Array.<string>} varying - 出力変数名の配列
         * @return {WebGLProgram} 生成したプログラムオブジェクト
         */

    }, {
        key: 'createProgramTF',
        value: function createProgramTF(vs, fs, varyings) {
            if (vs == null || fs == null) {
                return null;
            }
            var program = this.gl.createProgram();
            this.gl.attachShader(program, vs);
            this.gl.attachShader(program, fs);
            this.gl.transformFeedbackVaryings(program, varyings, this.gl.SEPARATE_ATTRIBS);
            this.gl.linkProgram(program);
            if (this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
                this.gl.useProgram(program);
                return program;
            } else {
                var err = this.gl.getProgramInfoLog(program);
                this.error.prg = err;
                console.warn('◆ link program failed: ' + err);
            }
        }

        /**
         * 自身の内部プロパティとして存在するプログラムオブジェクトを設定する
         */

    }, {
        key: 'useProgram',
        value: function useProgram() {
            this.gl.useProgram(this.prg);
        }

        /**
         * VBO と IBO をバインドして有効化する
         * @param {Array.<WebGLBuffer>} vbo - VBO を格納した配列
         * @param {WebGLBuffer} [ibo] - IBO
         */

    }, {
        key: 'setAttribute',
        value: function setAttribute(vbo, ibo) {
            var gl = this.gl;
            for (var i in vbo) {
                if (this.attL[i] >= 0) {
                    gl.bindBuffer(gl.ARRAY_BUFFER, vbo[i]);
                    gl.enableVertexAttribArray(this.attL[i]);
                    gl.vertexAttribPointer(this.attL[i], this.attS[i], gl.FLOAT, false, 0, 0);
                }
            }
            if (ibo != null) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
            }
        }

        /**
         * シェーダにユニフォーム変数に設定する値をプッシュする
         * @param {Array.<mixed>} mixed - ユニフォーム変数に設定する値を格納した配列
         */

    }, {
        key: 'pushShader',
        value: function pushShader(mixed) {
            var gl = this.gl;
            for (var i = 0, j = this.uniT.length; i < j; i++) {
                var uni = 'uniform' + this.uniT[i].replace(/matrix/i, 'Matrix');
                if (gl[uni] != null) {
                    if (uni.search(/Matrix/) !== -1) {
                        gl[uni](this.uniL[i], false, mixed[i]);
                    } else {
                        gl[uni](this.uniL[i], mixed[i]);
                    }
                } else {
                    console.warn('◆ not support uniform type: ' + this.uniT[i]);
                }
            }
        }

        /**
         * アトリビュートロケーションとユニフォームロケーションが正しく取得できたかチェックする
         * @param {Array.<number>} attLocation - 取得したアトリビュートロケーションの配列
         * @param {Array.<WebGLUniformLocation>} uniLocation - 取得したユニフォームロケーションの配列
         */

    }, {
        key: 'locationCheck',
        value: function locationCheck(attLocation, uniLocation) {
            var i = void 0,
                l = void 0;
            for (i = 0, l = attLocation.length; i < l; i++) {
                if (this.attL[i] == null || this.attL[i] < 0) {
                    console.warn('◆ invalid attribute location: %c"' + attLocation[i] + '"', 'color: crimson');
                }
            }
            for (i = 0, l = uniLocation.length; i < l; i++) {
                if (this.uniL[i] == null || this.uniL[i] < 0) {
                    console.warn('◆ invalid uniform location: %c"' + uniLocation[i] + '"', 'color: crimson');
                }
            }
        }
    }]);

    return ProgramManager;
}();

window.gl3 = window.gl3 || new gl3();

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYWVhOGM1ZWFhOTM4M2RlN2UzZDUiLCJ3ZWJwYWNrOi8vLy4vZ2wzQXVkaW8uanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzR3VpLmpzIiwid2VicGFjazovLy8uL2dsM01hdGguanMiLCJ3ZWJwYWNrOi8vLy4vZ2wzTWVzaC5qcyIsIndlYnBhY2s6Ly8vLi9nbDNVdGlsLmpzIiwid2VicGFjazovLy8uL2dsM0NvcmUuanMiXSwibmFtZXMiOlsiZ2wzQXVkaW8iLCJiZ21HYWluVmFsdWUiLCJzb3VuZEdhaW5WYWx1ZSIsImN0eCIsImNvbXAiLCJiZ21HYWluIiwic291bmRHYWluIiwic3JjIiwiQXVkaW9Db250ZXh0Iiwid2Via2l0QXVkaW9Db250ZXh0IiwiY3JlYXRlRHluYW1pY3NDb21wcmVzc29yIiwiY29ubmVjdCIsImRlc3RpbmF0aW9uIiwiY3JlYXRlR2FpbiIsImdhaW4iLCJzZXRWYWx1ZUF0VGltZSIsIkVycm9yIiwicGF0aCIsImluZGV4IiwibG9vcCIsImJhY2tncm91bmQiLCJjYWxsYmFjayIsInhtbCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsInNldFJlcXVlc3RIZWFkZXIiLCJyZXNwb25zZVR5cGUiLCJvbmxvYWQiLCJkZWNvZGVBdWRpb0RhdGEiLCJyZXNwb25zZSIsImJ1ZiIsIkF1ZGlvU3JjIiwibG9hZGVkIiwiY29uc29sZSIsImxvZyIsImUiLCJzZW5kIiwiaSIsImYiLCJsZW5ndGgiLCJhdWRpb0J1ZmZlciIsImJ1ZmZlclNvdXJjZSIsImFjdGl2ZUJ1ZmZlclNvdXJjZSIsImZmdExvb3AiLCJ1cGRhdGUiLCJub2RlIiwiY3JlYXRlU2NyaXB0UHJvY2Vzc29yIiwiYW5hbHlzZXIiLCJjcmVhdGVBbmFseXNlciIsInNtb290aGluZ1RpbWVDb25zdGFudCIsImZmdFNpemUiLCJvbkRhdGEiLCJVaW50OEFycmF5IiwiZnJlcXVlbmN5QmluQ291bnQiLCJqIiwiayIsInNlbGYiLCJwbGF5bm93IiwiY3JlYXRlQnVmZmVyU291cmNlIiwiYnVmZmVyIiwicGxheWJhY2tSYXRlIiwidmFsdWUiLCJvbmVuZGVkIiwic3RvcCIsIm9uYXVkaW9wcm9jZXNzIiwiZXZlIiwib25wcm9jZXNzRXZlbnQiLCJzdGFydCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwiZ2wzR3VpIiwiV3JhcHBlciIsIkdVSVdyYXBwZXIiLCJFbGVtZW50IiwiR1VJRWxlbWVudCIsIlNsaWRlciIsIkdVSVNsaWRlciIsIkNoZWNrYm94IiwiR1VJQ2hlY2tib3giLCJSYWRpbyIsIkdVSVJhZGlvIiwiU2VsZWN0IiwiR1VJU2VsZWN0IiwiU3BpbiIsIkdVSVNwaW4iLCJDb2xvciIsIkdVSUNvbG9yIiwiZWxlbWVudCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInN0eWxlIiwicG9zaXRpb24iLCJ0b3AiLCJyaWdodCIsIndpZHRoIiwiV0lEVEgiLCJoZWlnaHQiLCJ0cmFuc2l0aW9uIiwid3JhcHBlciIsImJhY2tncm91bmRDb2xvciIsIm92ZXJmbG93IiwidG9nZ2xlIiwiY2xhc3NOYW1lIiwidGV4dENvbnRlbnQiLCJmb250U2l6ZSIsImxpbmVIZWlnaHQiLCJjb2xvciIsImN1cnNvciIsInRyYW5zZm9ybSIsImFwcGVuZENoaWxkIiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwidGV4dCIsInRleHRBbGlnbiIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJsYWJlbCIsInRleHRTaGFkb3ciLCJtYXJnaW4iLCJjb250cm9sIiwibGlzdGVuZXJzIiwidHlwZSIsImZ1bmMiLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJoYXNPd25Qcm9wZXJ0eSIsIm1pbiIsIm1heCIsInN0ZXAiLCJzZXRBdHRyaWJ1dGUiLCJ2ZXJ0aWNhbEFsaWduIiwic2V0VmFsdWUiLCJlbWl0IiwiY2hlY2tlZCIsIm5hbWUiLCJsaXN0Iiwic2VsZWN0ZWRJbmRleCIsIm1hcCIsInYiLCJvcHQiLCJPcHRpb24iLCJhZGQiLCJjb250YWluZXIiLCJib3JkZXIiLCJib3hTaGFkb3ciLCJnZXRDb250ZXh0IiwiZ3JhZCIsImNyZWF0ZUxpbmVhckdyYWRpZW50IiwiYXJyIiwiYWRkQ29sb3JTdG9wIiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJjb2xvclZhbHVlIiwidGVtcENvbG9yVmFsdWUiLCJpbWFnZURhdGEiLCJnZXRJbWFnZURhdGEiLCJvZmZzZXRYIiwib2Zmc2V0WSIsImdldENvbG9yOGJpdFN0cmluZyIsImRhdGEiLCJjdXJyZW50VGFyZ2V0IiwiZ2V0Q29sb3JGbG9hdEFycmF5IiwiciIsInplcm9QYWRkaW5nIiwiZyIsImIiLCJzZWFyY2giLCJzIiwicmVwbGFjZSIsInQiLCJwYXJzZUludCIsInN1YnN0ciIsIm51bWJlciIsImNvdW50IiwiYSIsIkFycmF5Iiwiam9pbiIsInNsaWNlIiwiZ2wzTWF0aCIsIk1hdDQiLCJWZWMzIiwiVmVjMiIsIlF0biIsIkZsb2F0MzJBcnJheSIsImRlc3QiLCJtYXQwIiwibWF0MSIsIm91dCIsImNyZWF0ZSIsImMiLCJkIiwiaCIsImwiLCJtIiwibiIsIm8iLCJwIiwiQSIsIkIiLCJDIiwiRCIsIkUiLCJGIiwiRyIsIkgiLCJJIiwiSiIsIksiLCJMIiwiTSIsIk4iLCJPIiwiUCIsIm1hdCIsInZlYyIsImFuZ2xlIiwiYXhpcyIsInNxIiwiTWF0aCIsInNxcnQiLCJzaW4iLCJjb3MiLCJxIiwidSIsInciLCJ4IiwieSIsInoiLCJleWUiLCJjZW50ZXIiLCJ1cCIsImV5ZVgiLCJleWVZIiwiZXllWiIsImNlbnRlclgiLCJjZW50ZXJZIiwiY2VudGVyWiIsInVwWCIsInVwWSIsInVwWiIsImlkZW50aXR5IiwieDAiLCJ4MSIsIngyIiwieTAiLCJ5MSIsInkyIiwiejAiLCJ6MSIsInoyIiwiZm92eSIsImFzcGVjdCIsIm5lYXIiLCJmYXIiLCJ0YW4iLCJQSSIsImxlZnQiLCJib3R0b20iLCJpdmQiLCJjZW50ZXJQb2ludCIsInVwRGlyZWN0aW9uIiwidm1hdCIsInBtYXQiLCJsb29rQXQiLCJwZXJzcGVjdGl2ZSIsIm11bHRpcGx5IiwiaGFsZldpZHRoIiwiaGFsZkhlaWdodCIsInRvVmVjSVYiLCJOYU4iLCJ2MCIsInYxIiwibGVuIiwidjIiLCJ2ZWMxIiwidmVjMiIsIm5vcm1hbGl6ZSIsInF0biIsInF0bjAiLCJxdG4xIiwiYXgiLCJheSIsImF6IiwiYXciLCJieCIsImJ5IiwiYnoiLCJidyIsInFwIiwicXEiLCJxciIsImludmVyc2UiLCJ4eCIsInh5IiwieHoiLCJ5eSIsInl6IiwienoiLCJ3eCIsInd5Iiwid3oiLCJ0aW1lIiwiaHQiLCJocyIsImFicyIsInBoIiwiYWNvcyIsInB0IiwidDAiLCJ0MSIsImdsM01lc2giLCJ0YyIsInBvcyIsIm5vciIsImNvbCIsInN0IiwiaWR4Iiwibm9ybWFsIiwidGV4Q29vcmQiLCJzcGxpdCIsInJhZCIsInB1c2giLCJyeCIsInJ5Iiwic2lkZSIsInJ6IiwidG9wUmFkIiwiYm90dG9tUmFkIiwicm93IiwiY29sdW1uIiwicnIiLCJ0ciIsInR4IiwidHkiLCJ0eiIsImlyYWQiLCJvcmFkIiwicnMiLCJydCIsImF0YW4yIiwiZ2wzVXRpbCIsInRoIiwiZmxvb3IiLCJ0cyIsImRlZyIsImxvbiIsIkVBUlRIX1JBRElVUyIsImRlZ1RvUmFkIiwibGF0IiwiZmxhdHRlbiIsImZsYXR0ZW5pbmciLCJpc05hTiIsInBhcnNlRmxvYXQiLCJjbGFtcCIsInRlbXAiLCJlcyIsImVjY2VudCIsInBoaSIsInNpbnBoaSIsImNvbiIsImNvbSIsInBvdyIsImxvblRvTWVyIiwibGF0VG9NZXIiLCJFQVJUSF9IQUxGX0NJUkNVTSIsImF0YW4iLCJleHAiLCJ6b29tIiwibG9uVG9UaWxlIiwibGF0VG9UaWxlIiwidGlsZVRvTG9uIiwidGlsZVRvTGF0IiwiZ2wzIiwiVkVSU0lPTiIsIlBJMiIsIlBJSCIsIlBJSDIiLCJURVhUVVJFX1VOSVRfQ09VTlQiLCJyZWFkeSIsImNhbnZhcyIsImdsIiwiaXNXZWJHTDIiLCJpc0NvbnNvbGVPdXRwdXQiLCJ0ZXh0dXJlcyIsImV4dCIsIkF1ZGlvIiwiTWVzaCIsIlV0aWwiLCJHdWkiLCJpbml0T3B0aW9ucyIsImN1YmljT3B0aW9ucyIsIkhUTUxDYW52YXNFbGVtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3ZWJnbDJNb2RlIiwiY29uc29sZU1lc3NhZ2UiLCJnZXRQYXJhbWV0ZXIiLCJNQVhfQ09NQklORURfVEVYVFVSRV9JTUFHRV9VTklUUyIsImVsZW1lbnRJbmRleFVpbnQiLCJnZXRFeHRlbnNpb24iLCJ0ZXh0dXJlRmxvYXQiLCJ0ZXh0dXJlSGFsZkZsb2F0IiwiZHJhd0J1ZmZlcnMiLCJkZXB0aCIsInN0ZW5jaWwiLCJmbGciLCJDT0xPUl9CVUZGRVJfQklUIiwiY2xlYXJDb2xvciIsImNsZWFyRGVwdGgiLCJERVBUSF9CVUZGRVJfQklUIiwiY2xlYXJTdGVuY2lsIiwiU1RFTkNJTF9CVUZGRVJfQklUIiwiY2xlYXIiLCJYIiwiWSIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInZpZXdwb3J0IiwicHJpbWl0aXZlIiwidmVydGV4Q291bnQiLCJvZmZzZXQiLCJkcmF3QXJyYXlzIiwiaW5kZXhMZW5ndGgiLCJkcmF3RWxlbWVudHMiLCJVTlNJR05FRF9TSE9SVCIsIlVOU0lHTkVEX0lOVCIsInZibyIsImNyZWF0ZUJ1ZmZlciIsImJpbmRCdWZmZXIiLCJBUlJBWV9CVUZGRVIiLCJidWZmZXJEYXRhIiwiU1RBVElDX0RSQVciLCJpYm8iLCJFTEVNRU5UX0FSUkFZX0JVRkZFUiIsIkludDE2QXJyYXkiLCJVaW50MzJBcnJheSIsInNvdXJjZSIsImltZyIsIkltYWdlIiwidGV4dHVyZSIsInRleCIsImNyZWF0ZVRleHR1cmUiLCJhY3RpdmVUZXh0dXJlIiwiVEVYVFVSRTAiLCJiaW5kVGV4dHVyZSIsIlRFWFRVUkVfMkQiLCJ0ZXhJbWFnZTJEIiwiUkdCQSIsIlVOU0lHTkVEX0JZVEUiLCJnZW5lcmF0ZU1pcG1hcCIsInRleFBhcmFtZXRlcmkiLCJURVhUVVJFX01JTl9GSUxURVIiLCJMSU5FQVIiLCJURVhUVVJFX01BR19GSUxURVIiLCJURVhUVVJFX1dSQVBfUyIsIkNMQU1QX1RPX0VER0UiLCJURVhUVVJFX1dSQVBfVCIsIm9iamVjdCIsInRhcmdldCIsImNJbWciLCJpbWFnZSIsIlRFWFRVUkVfQ1VCRV9NQVAiLCJ1bml0IiwiZnJhbWVCdWZmZXIiLCJjcmVhdGVGcmFtZWJ1ZmZlciIsImJpbmRGcmFtZWJ1ZmZlciIsIkZSQU1FQlVGRkVSIiwiZGVwdGhSZW5kZXJCdWZmZXIiLCJjcmVhdGVSZW5kZXJidWZmZXIiLCJiaW5kUmVuZGVyYnVmZmVyIiwiUkVOREVSQlVGRkVSIiwicmVuZGVyYnVmZmVyU3RvcmFnZSIsIkRFUFRIX0NPTVBPTkVOVDE2IiwiZnJhbWVidWZmZXJSZW5kZXJidWZmZXIiLCJERVBUSF9BVFRBQ0hNRU5UIiwiZlRleHR1cmUiLCJmcmFtZWJ1ZmZlclRleHR1cmUyRCIsIkNPTE9SX0FUVEFDSE1FTlQwIiwiZnJhbWVidWZmZXIiLCJkZXB0aFJlbmRlcmJ1ZmZlciIsImRlcHRoU3RlbmNpbFJlbmRlckJ1ZmZlciIsIkRFUFRIX1NURU5DSUwiLCJERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQiLCJkZXB0aFN0ZW5jaWxSZW5kZXJidWZmZXIiLCJGTE9BVCIsIkhBTEZfRkxPQVRfT0VTIiwiTkVBUkVTVCIsInZzSWQiLCJmc0lkIiwiYXR0TG9jYXRpb24iLCJhdHRTdHJpZGUiLCJ1bmlMb2NhdGlvbiIsInVuaVR5cGUiLCJtbmciLCJQcm9ncmFtTWFuYWdlciIsInZzIiwiY3JlYXRlU2hhZGVyRnJvbUlkIiwiZnMiLCJwcmciLCJjcmVhdGVQcm9ncmFtIiwiYXR0TCIsImF0dFMiLCJnZXRBdHRyaWJMb2NhdGlvbiIsInVuaUwiLCJnZXRVbmlmb3JtTG9jYXRpb24iLCJ1bmlUIiwibG9jYXRpb25DaGVjayIsImNyZWF0ZVNoYWRlckZyb21Tb3VyY2UiLCJWRVJURVhfU0hBREVSIiwiRlJBR01FTlRfU0hBREVSIiwidnNQYXRoIiwiZnNQYXRoIiwidGFyZ2V0VXJsIiwieGhyIiwicmVzcG9uc2VUZXh0IiwibG9hZENoZWNrIiwidmFyeWluZ3MiLCJjcmVhdGVQcm9ncmFtVEYiLCJpc0J1ZmZlciIsImRlbGV0ZUJ1ZmZlciIsImlzVGV4dHVyZSIsImRlbGV0ZVRleHR1cmUiLCJvYmoiLCJXZWJHTEZyYW1lYnVmZmVyIiwiaXNGcmFtZWJ1ZmZlciIsImRlbGV0ZUZyYW1lYnVmZmVyIiwiV2ViR0xSZW5kZXJidWZmZXIiLCJpc1JlbmRlcmJ1ZmZlciIsImRlbGV0ZVJlbmRlcmJ1ZmZlciIsIldlYkdMVGV4dHVyZSIsInNoYWRlciIsImlzU2hhZGVyIiwiZGVsZXRlU2hhZGVyIiwicHJvZ3JhbSIsImlzUHJvZ3JhbSIsImRlbGV0ZVByb2dyYW0iLCJlcnJvciIsImlkIiwic2NyaXB0RWxlbWVudCIsImNyZWF0ZVNoYWRlciIsIndhcm4iLCJzaGFkZXJTb3VyY2UiLCJjb21waWxlU2hhZGVyIiwiZ2V0U2hhZGVyUGFyYW1ldGVyIiwiQ09NUElMRV9TVEFUVVMiLCJlcnIiLCJnZXRTaGFkZXJJbmZvTG9nIiwiYXR0YWNoU2hhZGVyIiwibGlua1Byb2dyYW0iLCJnZXRQcm9ncmFtUGFyYW1ldGVyIiwiTElOS19TVEFUVVMiLCJ1c2VQcm9ncmFtIiwiZ2V0UHJvZ3JhbUluZm9Mb2ciLCJ0cmFuc2Zvcm1GZWVkYmFja1ZhcnlpbmdzIiwiU0VQQVJBVEVfQVRUUklCUyIsImVuYWJsZVZlcnRleEF0dHJpYkFycmF5IiwidmVydGV4QXR0cmliUG9pbnRlciIsIm1peGVkIiwidW5pIl0sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLG1EQUEyQyxjQUFjOztBQUV6RDtBQUNBO0FBQ0E7QUFDQTtBQUNB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YUUsVyxFQUFZO0FBQ25DLGdCQUFJemMsVUFBSjtBQUFBLGdCQUFPOEosVUFBUDtBQUNBLGlCQUFJOUosSUFBSSxDQUFKLEVBQU84SixJQUFJeVMsWUFBWXJjLE1BQTNCLEVBQW1DRixJQUFJOEosQ0FBdkMsRUFBMEM5SixHQUExQyxFQUE4QztBQUMxQyxvQkFBRyxLQUFLa2QsSUFBTCxDQUFVbGQsQ0FBVixLQUFnQixJQUFoQixJQUF3QixLQUFLa2QsSUFBTCxDQUFVbGQsQ0FBVixJQUFlLENBQTFDLEVBQTRDO0FBQ3hDSiw0QkFBUThmLElBQVIsQ0FBYSxzQ0FBc0NuRCxZQUFZdmMsQ0FBWixDQUF0QyxHQUF1RCxHQUFwRSxFQUF5RSxnQkFBekU7QUFDSDtBQUNKO0FBQ0QsaUJBQUlBLElBQUksQ0FBSixFQUFPOEosSUFBSTJTLFlBQVl2YyxNQUEzQixFQUFtQ0YsSUFBSThKLENBQXZDLEVBQTBDOUosR0FBMUMsRUFBOEM7QUFDMUMsb0JBQUcsS0FBS3FkLElBQUwsQ0FBVXJkLENBQVYsS0FBZ0IsSUFBaEIsSUFBd0IsS0FBS3FkLElBQUwsQ0FBVXJkLENBQVYsSUFBZSxDQUExQyxFQUE0QztBQUN4Q0osNEJBQVE4ZixJQUFSLENBQWEsb0NBQW9DakQsWUFBWXpjLENBQVosQ0FBcEMsR0FBcUQsR0FBbEUsRUFBdUUsZ0JBQXZFO0FBQ0g7QUFDSjtBQUNKOzs7Ozs7QUFHTDRYLE9BQU8xQyxHQUFQLEdBQWEwQyxPQUFPMUMsR0FBUCxJQUFjLElBQUlBLEdBQUosRUFBM0IsQyIsImZpbGUiOiJnbGN1YmljLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuL1wiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDUpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGFlYThjNWVhYTkzODNkZTdlM2Q1IiwiXHJcbi8qKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiBzdGVwIDE6IGxldCBhID0gbmV3IGdsM0F1ZGlvKGJnbUdhaW5WYWx1ZSwgc291bmRHYWluVmFsdWUpIDwtIGZsb2F0KDAuMCB0byAxLjApXHJcbiAqIHN0ZXAgMjogYS5sb2FkKHVybCwgaW5kZXgsIGxvb3AsIGJhY2tncm91bmQpIDwtIHN0cmluZywgaW50LCBib29sZWFuLCBib29sZWFuXHJcbiAqIHN0ZXAgMzogYS5zcmNbaW5kZXhdLmxvYWRlZCB0aGVuIGEuc3JjW2luZGV4XS5wbGF5KClcclxuICovXHJcblxyXG4vKipcclxuICogZ2wzQXVkaW9cclxuICogQGNsYXNzIGdsM0F1ZGlvXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNBdWRpbyB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJnbUdhaW5WYWx1ZSAtIEJHTSDjga7lho3nlJ/pn7Pph49cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzb3VuZEdhaW5WYWx1ZSAtIOWKueaenOmfs+OBruWGjeeUn+mfs+mHj1xyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3RvcihiZ21HYWluVmFsdWUsIHNvdW5kR2FpblZhbHVlKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqrjg7zjg4fjgqPjgqrjgrPjg7Pjg4bjgq3jgrnjg4hcclxuICAgICAgICAgKiBAdHlwZSB7QXVkaW9Db250ZXh0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY3R4ID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg4DjgqTjg4rjg5/jg4Pjgq/jgrPjg7Pjg5fjg6zjg4PjgrXjg7zjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7RHluYW1pY3NDb21wcmVzc29yTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbXAgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEJHTSDnlKjjga7jgrLjgqTjg7Pjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7R2Fpbk5vZGV9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5iZ21HYWluID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDlirnmnpzpn7PnlKjjga7jgrLjgqTjg7Pjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7R2Fpbk5vZGV9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5zb3VuZEdhaW4gPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCquODvOODh+OCo+OCquOCveODvOOCueOCkuODqeODg+ODl+OBl+OBn+OCr+ODqeOCueOBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48QXVkaW9TcmM+fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuc3JjID0gbnVsbDtcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdHlwZW9mIEF1ZGlvQ29udGV4dCAhPSAndW5kZWZpbmVkJyB8fFxyXG4gICAgICAgICAgICB0eXBlb2Ygd2Via2l0QXVkaW9Db250ZXh0ICE9ICd1bmRlZmluZWQnXHJcbiAgICAgICAgKXtcclxuICAgICAgICAgICAgaWYodHlwZW9mIEF1ZGlvQ29udGV4dCAhPSAndW5kZWZpbmVkJyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eCA9IG5ldyBBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN0eCA9IG5ldyB3ZWJraXRBdWRpb0NvbnRleHQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNvbXAgPSB0aGlzLmN0eC5jcmVhdGVEeW5hbWljc0NvbXByZXNzb3IoKTtcclxuICAgICAgICAgICAgdGhpcy5jb21wLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmJnbUdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2Fpbi5jb25uZWN0KHRoaXMuY29tcCk7XHJcbiAgICAgICAgICAgIHRoaXMuYmdtR2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKGJnbUdhaW5WYWx1ZSwgMCk7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRHYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xyXG4gICAgICAgICAgICB0aGlzLnNvdW5kR2Fpbi5jb25uZWN0KHRoaXMuY29tcCk7XHJcbiAgICAgICAgICAgIHRoaXMuc291bmRHYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUoc291bmRHYWluVmFsdWUsIDApO1xyXG4gICAgICAgICAgICB0aGlzLnNyYyA9IFtdO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ25vdCBmb3VuZCBBdWRpb0NvbnRleHQnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5XjgqHjgqTjg6vjgpLjg63jg7zjg4njgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIC0g44Kq44O844OH44Kj44Kq44OV44Kh44Kk44Or44Gu44OR44K5XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggLSDlhoXpg6jjg5fjg63jg5Hjg4bjgqPjga7phY3liJfjgavmoLzntI3jgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbG9vcCAtIOODq+ODvOODl+WGjeeUn+OCkuioreWumuOBmeOCi+OBi+OBqeOBhuOBi1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBiYWNrZ3JvdW5kIC0gQkdNIOOBqOOBl+OBpuioreWumuOBmeOCi+OBi+OBqeOBhuOBi1xyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgLSDoqq3jgb/ovrzjgb/jgajliJ3mnJ/ljJbjgYzlrozkuobjgZfjgZ/jgYLjgajlkbzjgbDjgozjgovjgrPjg7zjg6vjg5Djg4Pjgq9cclxuICAgICAqL1xyXG4gICAgbG9hZChwYXRoLCBpbmRleCwgbG9vcCwgYmFja2dyb3VuZCwgY2FsbGJhY2spe1xyXG4gICAgICAgIGxldCBjdHggPSB0aGlzLmN0eDtcclxuICAgICAgICBsZXQgZ2FpbiA9IGJhY2tncm91bmQgPyB0aGlzLmJnbUdhaW4gOiB0aGlzLnNvdW5kR2FpbjtcclxuICAgICAgICBsZXQgc3JjID0gdGhpcy5zcmM7XHJcbiAgICAgICAgc3JjW2luZGV4XSA9IG51bGw7XHJcbiAgICAgICAgbGV0IHhtbCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgIHhtbC5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcclxuICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XHJcbiAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICB4bWwucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuICAgICAgICB4bWwub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjdHguZGVjb2RlQXVkaW9EYXRhKHhtbC5yZXNwb25zZSwgKGJ1ZikgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3JjW2luZGV4XSA9IG5ldyBBdWRpb1NyYyhjdHgsIGdhaW4sIGJ1ZiwgbG9vcCwgYmFja2dyb3VuZCk7XHJcbiAgICAgICAgICAgICAgICBzcmNbaW5kZXhdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBhdWRpbyBudW1iZXI6ICVjJyArIGluZGV4ICsgJyVjLCBhdWRpbyBsb2FkZWQ6ICVjJyArIHBhdGgsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IGJsdWUnLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH0sIChlKSA9PiB7Y29uc29sZS5sb2coZSk7fSk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4bWwuc2VuZCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ot44O844OJ44Gu5a6M5LqG44KS44OB44Kn44OD44Kv44GZ44KLXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDjg63jg7zjg4njgYzlrozkuobjgZfjgabjgYTjgovjgYvjganjgYbjgYtcclxuICAgICAqL1xyXG4gICAgbG9hZENvbXBsZXRlKCl7XHJcbiAgICAgICAgbGV0IGksIGY7XHJcbiAgICAgICAgZiA9IHRydWU7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgdGhpcy5zcmMubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBmID0gZiAmJiAodGhpcy5zcmNbaV0gIT0gbnVsbCkgJiYgdGhpcy5zcmNbaV0ubG9hZGVkO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZjtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOOCquODvOODh+OCo+OCquOChOOCveODvOOCueODleOCoeOCpOODq+OCkueuoeeQhuOBmeOCi+OBn+OCgeOBruOCr+ODqeOCuVxyXG4gKiBAY2xhc3MgQXVkaW9TcmNcclxuICovXHJcbmNsYXNzIEF1ZGlvU3JjIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge0F1ZGlvQ29udGV4dH0gY3R4IC0g5a++6LGh44Go44Gq44KL44Kq44O844OH44Kj44Kq44Kz44Oz44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge0dhaW5Ob2RlfSBnYWluIC0g5a++6LGh44Go44Gq44KL44Ky44Kk44Oz44OO44O844OJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyfSBhdWRpb0J1ZmZlciAtIOODkOOCpOODiuODquOBruOCquODvOODh+OCo+OCquOCveODvOOCuVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBib29sIC0g44Or44O844OX5YaN55Sf44KS6Kit5a6a44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJhY2tncm91bmQgLSBCR00g44Go44GX44Gm6Kit5a6a44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGN0eCwgZ2FpbiwgYXVkaW9CdWZmZXIsIGxvb3AsIGJhY2tncm91bmQpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOWvvuixoeOBqOOBquOCi+OCquODvOODh+OCo+OCquOCs+ODs+ODhuOCreOCueODiFxyXG4gICAgICAgICAqIEB0eXBlIHtBdWRpb0NvbnRleHR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jdHggPSBjdHg7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5a++6LGh44Go44Gq44KL44Ky44Kk44Oz44OO44O844OJXHJcbiAgICAgICAgICogQHR5cGUge0dhaW5Ob2RlfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZ2FpbiA9IGdhaW47XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44K944O844K544OV44Kh44Kk44Or44Gu44OQ44Kk44OK44Oq44OH44O844K/XHJcbiAgICAgICAgICogQHR5cGUge0FycmF5QnVmZmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYXVkaW9CdWZmZXIgPSBhdWRpb0J1ZmZlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqrjg7zjg4fjgqPjgqrjg5Djg4Pjg5XjgqHjgr3jg7zjgrnjg47jg7zjg4njgpLmoLzntI3jgZnjgovphY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPEF1ZGlvQnVmZmVyU291cmNlTm9kZT59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2UgPSBbXTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjgq/jg4bjgqPjg5bjgarjg5Djg4Pjg5XjgqHjgr3jg7zjgrnjga7jgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuYWN0aXZlQnVmZmVyU291cmNlID0gMDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6vjg7zjg5fjgZnjgovjgYvjganjgYbjgYvjga7jg5Xjg6njgrBcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxvb3AgPSBsb29wO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODreODvOODiea4iOOBv+OBi+OBqeOBhuOBi+OCkuekuuOBmeODleODqeOCsFxyXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMubG9hZGVkID0gZmFsc2U7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogRkZUIOOCteOCpOOCulxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5mZnRMb29wID0gMTY7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44GT44Gu44OV44Op44Kw44GM56uL44Gj44Gm44GE44KL5aC05ZCI5YaN55Sf5Lit44Gu44OH44O844K/44KS5LiA5bqm5Y+W5b6X44GZ44KLXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy51cGRhdGUgPSBmYWxzZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBCR00g44GL44Gp44GG44GL44KS56S644GZ44OV44Op44KwXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrnjgq/jg6rjg5fjg4jjg5fjg63jgrvjg4PjgrXjg7zjg47jg7zjg4lcclxuICAgICAgICAgKiBAdHlwZSB7U2NyaXB0UHJvY2Vzc29yTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLm5vZGUgPSB0aGlzLmN0eC5jcmVhdGVTY3JpcHRQcm9jZXNzb3IoMjA0OCwgMSwgMSk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ki44OK44Op44Kk44K244OO44O844OJXHJcbiAgICAgICAgICogQHR5cGUge0FuYWx5c2VyTm9kZX1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmFuYWx5c2VyID0gdGhpcy5jdHguY3JlYXRlQW5hbHlzZXIoKTtcclxuICAgICAgICB0aGlzLmFuYWx5c2VyLnNtb290aGluZ1RpbWVDb25zdGFudCA9IDAuODtcclxuICAgICAgICB0aGlzLmFuYWx5c2VyLmZmdFNpemUgPSB0aGlzLmZmdExvb3AgKiAyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODh+ODvOOCv+OCkuWPluW+l+OBmeOCi+mam+OBq+WIqeeUqOOBmeOCi+Wei+S7mOOBjemFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtVaW50OEFycmF5fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMub25EYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5hbmFseXNlci5mcmVxdWVuY3lCaW5Db3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqrjg7zjg4fjgqPjgqrjgpLlho3nlJ/jgZnjgotcclxuICAgICAqL1xyXG4gICAgcGxheSgpe1xyXG4gICAgICAgIGxldCBpLCBqLCBrO1xyXG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcclxuICAgICAgICBpID0gdGhpcy5idWZmZXJTb3VyY2UubGVuZ3RoO1xyXG4gICAgICAgIGsgPSAtMTtcclxuICAgICAgICBpZihpID4gMCl7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8IGk7IGorKyl7XHJcbiAgICAgICAgICAgICAgICBpZighdGhpcy5idWZmZXJTb3VyY2Vbal0ucGxheW5vdyl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vbal0gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2pdID0gdGhpcy5jdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgayA9IGo7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYoayA8IDApe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2VbdGhpcy5idWZmZXJTb3VyY2UubGVuZ3RoXSA9IHRoaXMuY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xyXG4gICAgICAgICAgICAgICAgayA9IHRoaXMuYnVmZmVyU291cmNlLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5idWZmZXJTb3VyY2VbMF0gPSB0aGlzLmN0eC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcclxuICAgICAgICAgICAgayA9IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYWN0aXZlQnVmZmVyU291cmNlID0gaztcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5idWZmZXIgPSB0aGlzLmF1ZGlvQnVmZmVyO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmxvb3AgPSB0aGlzLmxvb3A7XHJcbiAgICAgICAgdGhpcy5idWZmZXJTb3VyY2Vba10ucGxheWJhY2tSYXRlLnZhbHVlID0gMS4wO1xyXG4gICAgICAgIGlmKCF0aGlzLmxvb3Ape1xyXG4gICAgICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5vbmVuZGVkID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdG9wKDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5bm93ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuYmFja2dyb3VuZCl7XHJcbiAgICAgICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmNvbm5lY3QodGhpcy5hbmFseXNlcik7XHJcbiAgICAgICAgICAgIHRoaXMuYW5hbHlzZXIuY29ubmVjdCh0aGlzLm5vZGUpO1xyXG4gICAgICAgICAgICB0aGlzLm5vZGUuY29ubmVjdCh0aGlzLmN0eC5kZXN0aW5hdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMubm9kZS5vbmF1ZGlvcHJvY2VzcyA9IChldmUpID0+IHtvbnByb2Nlc3NFdmVudChldmUpO307XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuYnVmZmVyU291cmNlW2tdLmNvbm5lY3QodGhpcy5nYWluKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5zdGFydCgwKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVtrXS5wbGF5bm93ID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gb25wcm9jZXNzRXZlbnQoZXZlKXtcclxuICAgICAgICAgICAgaWYoc2VsZi51cGRhdGUpe1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGUgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHNlbGYuYW5hbHlzZXIuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoc2VsZi5vbkRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kq44O844OH44Kj44Kq44Gu5YaN55Sf44KS5q2i44KB44KLXHJcbiAgICAgKi9cclxuICAgIHN0b3AoKXtcclxuICAgICAgICB0aGlzLmJ1ZmZlclNvdXJjZVt0aGlzLmFjdGl2ZUJ1ZmZlclNvdXJjZV0uc3RvcCgwKTtcclxuICAgICAgICB0aGlzLnBsYXlub3cgPSBmYWxzZTtcclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzQXVkaW8uanMiLCJcclxuLyoqXHJcbiAqIEBleGFtcGxlXHJcbiAqIGxldCB3cmFwcGVyID0gbmV3IGdsMy5HdWkuV3JhcHBlcigpO1xyXG4gKiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHdyYXBwZXIuZ2V0RWxlbWVudCgpKTtcclxuICpcclxuICogbGV0IHNsaWRlciA9IG5ldyBnbDMuR3VpLlNsaWRlcigndGVzdCcsIDUwLCAwLCAxMDAsIDEpO1xyXG4gKiBzbGlkZXIuYWRkKCdpbnB1dCcsIChldmUsIHNlbGYpID0+IHtjb25zb2xlLmxvZyhzZWxmLmdldFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChzbGlkZXIuZ2V0RWxlbWVudCgpKTtcclxuICpcclxuICogbGV0IGNoZWNrID0gbmV3IGdsMy5HdWkuQ2hlY2tib3goJ2hvZ2UnLCBmYWxzZSk7XHJcbiAqIGNoZWNrLmFkZCgnY2hhbmdlJywgKGV2ZSwgc2VsZikgPT4ge2NvbnNvbGUubG9nKHNlbGYuZ2V0VmFsdWUoKSk7fSk7XHJcbiAqIHdyYXBwZXIuYXBwZW5kKGNoZWNrLmdldEVsZW1lbnQoKSk7XHJcbiAqXHJcbiAqIGxldCByYWRpbyA9IG5ldyBnbDMuR3VpLlJhZGlvKCdob2dlJywgbnVsbCwgZmFsc2UpO1xyXG4gKiByYWRpby5hZGQoJ2NoYW5nZScsIChldmUsIHNlbGYpID0+IHtjb25zb2xlLmxvZyhzZWxmLmdldFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChyYWRpby5nZXRFbGVtZW50KCkpO1xyXG4gKlxyXG4gKiBsZXQgc2VsZWN0ID0gbmV3IGdsMy5HdWkuU2VsZWN0KCdmdWdhJywgWydmb28nLCAnYmFhJ10sIDApO1xyXG4gKiBzZWxlY3QuYWRkKCdjaGFuZ2UnLCAoZXZlLCBzZWxmKSA9PiB7Y29uc29sZS5sb2coc2VsZi5nZXRWYWx1ZSgpKTt9KTtcclxuICogd3JhcHBlci5hcHBlbmQoc2VsZWN0LmdldEVsZW1lbnQoKSk7XHJcbiAqXHJcbiAqIGxldCBzcGluID0gbmV3IGdsMy5HdWkuU3BpbignaG9nZScsIDAuMCwgLTEuMCwgMS4wLCAwLjEpO1xyXG4gKiBzcGluLmFkZCgnaW5wdXQnLCAoZXZlLCBzZWxmKSA9PiB7Y29uc29sZS5sb2coc2VsZi5nZXRWYWx1ZSgpKTt9KTtcclxuICogd3JhcHBlci5hcHBlbmQoc3Bpbi5nZXRFbGVtZW50KCkpO1xyXG4gKlxyXG4gKiBsZXQgY29sb3IgPSBuZXcgZ2wzLkd1aS5Db2xvcignZnVnYScsICcjZmYwMDAwJyk7XHJcbiAqIGNvbG9yLmFkZCgnY2hhbmdlJywgKGV2ZSwgc2VsZikgPT4ge2NvbnNvbGUubG9nKHNlbGYuZ2V0VmFsdWUoKSwgc2VsZi5nZXRGbG9hdFZhbHVlKCkpO30pO1xyXG4gKiB3cmFwcGVyLmFwcGVuZChjb2xvci5nZXRFbGVtZW50KCkpO1xyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBnbDNHdWlcclxuICogQGNsYXNzIGdsM0d1aVxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzR3VpIHtcclxuICAgIHN0YXRpYyBnZXQgV0lEVEgoKXtyZXR1cm4gNDAwO31cclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJV3JhcHBlclxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlXcmFwcGVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuV3JhcHBlciA9IEdVSVdyYXBwZXI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJRWxlbWVudFxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuRWxlbWVudCA9IEdVSUVsZW1lbnQ7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJU2xpZGVyXHJcbiAgICAgICAgICogQHR5cGUge0dVSVNsaWRlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlNsaWRlciA9IEdVSVNsaWRlcjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUlDaGVja2JveFxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlDaGVja2JveH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLkNoZWNrYm94ID0gR1VJQ2hlY2tib3g7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJUmFkaW9cclxuICAgICAgICAgKiBAdHlwZSB7R1VJUmFkaW99XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5SYWRpbyA9IEdVSVJhZGlvO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdVSVNlbGVjdFxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlTZWxlY3R9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5TZWxlY3QgPSBHVUlTZWxlY3Q7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJU3BpblxyXG4gICAgICAgICAqIEB0eXBlIHtHVUlTcGlufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuU3BpbiA9IEdVSVNwaW47XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJQ29sb3JcclxuICAgICAgICAgKiBAdHlwZSB7R1VJQ29sb3J9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5Db2xvciA9IEdVSUNvbG9yO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogR1VJV3JhcHBlclxyXG4gKiBAY2xhc3MgR1VJV3JhcHBlclxyXG4gKi9cclxuY2xhc3MgR1VJV3JhcHBlciB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIEdVSSDlhajkvZPjgpLljIXjgoDjg6njg4Pjg5Hjg7wgRE9NXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9ICcwcHgnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke2dsM0d1aS5XSURUSH1weGA7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudHJhbnNpdGlvbiA9ICdyaWdodCAwLjhzIGN1YmljLWJlemllcigwLCAwLCAwLCAxLjApJztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBHVUkg44OR44O844OE44KS5YyF44KA44Op44OD44OR44O8IERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYmEoNjQsIDY0LCA2NCwgMC41KSc7XHJcbiAgICAgICAgdGhpcy53cmFwcGVyLnN0eWxlLmhlaWdodCA9ICcxMDAlJztcclxuICAgICAgICB0aGlzLndyYXBwZXIuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogR1VJIOaKmOOCiuOBn+OBn+OBv+ODiOOCsOODq1xyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRvZ2dsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLmNsYXNzTmFtZSA9ICd2aXNpYmxlJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS50ZXh0Q29udGVudCA9ICfilrYnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmZvbnRTaXplID0gJzE4cHgnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmxpbmVIZWlnaHQgPSAnMzJweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUuY29sb3IgPSAncmdiYSgyNDAsIDI0MCwgMjQwLCAwLjUpJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiYSgzMiwgMzIsIDMyLCAwLjUpJztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudG9wID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUucmlnaHQgPSBgJHtnbDNHdWkuV0lEVEh9cHhgO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLndpZHRoID0gJzMycHgnO1xyXG4gICAgICAgIHRoaXMudG9nZ2xlLnN0eWxlLmhlaWdodCA9ICczMnB4JztcclxuICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS5jdXJzb3IgPSAncG9pbnRlcic7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgwZGVnKSc7XHJcbiAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudHJhbnNpdGlvbiA9ICd0cmFuc2Zvcm0gMC41cyBjdWJpYy1iZXppZXIoMCwgMCwgMCwgMS4wKSc7XHJcblxyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLnRvZ2dsZSk7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMud3JhcHBlcik7XHJcblxyXG4gICAgICAgIHRoaXMudG9nZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZS5jbGFzc0xpc3QudG9nZ2xlKCd2aXNpYmxlJyk7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudG9nZ2xlLmNsYXNzTGlzdC5jb250YWlucygndmlzaWJsZScpKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5yaWdodCA9ICcwcHgnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b2dnbGUuc3R5bGUudHJhbnNmb3JtID0gJ3JvdGF0ZSgwZGVnKSc7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnJpZ2h0ID0gYC0ke2dsM0d1aS5XSURUSH1weGA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvZ2dsZS5zdHlsZS50cmFuc2Zvcm0gPSAncm90YXRlKC0xODBkZWcpJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg6zjg6Hjg7Pjg4jjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICBnZXRFbGVtZW50KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog5a2Q6KaB57Sg44KS44Ki44Oa44Oz44OJ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0g44Ki44Oa44Oz44OJ44GZ44KL6KaB57SgXHJcbiAgICAgKi9cclxuICAgIGFwcGVuZChlbGVtZW50KXtcclxuICAgICAgICB0aGlzLndyYXBwZXIuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlFbGVtZW50XHJcbiAqIEBjbGFzcyBHVUlFbGVtZW50XHJcbiAqL1xyXG5jbGFzcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJyl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Ko44Os44Oh44Oz44OI44Op44OD44OR44O8IERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuZm9udFNpemUgPSAnc21hbGwnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50ZXh0QWxpZ24gPSAnY2VudGVyJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHtnbDNHdWkuV0lEVEh9cHhgO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnMzBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxpbmVIZWlnaHQgPSAnMzBweCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnZmxleCc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmZsZXhEaXJlY3Rpb24gPSAncm93JztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuanVzdGlmeUNvbnRlbnQgPSAnZmxleC1zdGFydCc7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Op44OZ44Or55So44Ko44Os44Oh44Oz44OIIERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MU3BhbkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICB0aGlzLmxhYmVsLnRleHRDb250ZW50ID0gdGV4dDtcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmNvbG9yID0gJyMyMjInO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUudGV4dFNoYWRvdyA9ICcwcHggMHB4IDVweCB3aGl0ZSc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5kaXNwbGF5ID0gJ2lubGluZS1ibG9jayc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5tYXJnaW4gPSAnYXV0byA1cHgnO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUud2lkdGggPSAnMTIwcHgnO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog5YCk6KGo56S655SoIERPTVxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MU3BhbkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2JhKDAsIDAsIDAsIDAuMjUpJztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLmNvbG9yID0gJ3doaXRlc21va2UnO1xyXG4gICAgICAgIHRoaXMudmFsdWUuc3R5bGUuZm9udFNpemUgPSAneC1zbWFsbCc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS50ZXh0U2hhZG93ID0gJzBweCAwcHggNXB4IGJsYWNrJztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLmRpc3BsYXkgPSAnaW5saW5lLWJsb2NrJztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLm1hcmdpbiA9ICdhdXRvIDVweCc7XHJcbiAgICAgICAgdGhpcy52YWx1ZS5zdHlsZS53aWR0aCA9ICc4MHB4JztcclxuICAgICAgICB0aGlzLnZhbHVlLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMudmFsdWUpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODqyBET01cclxuICAgICAgICAgKiBAdHlwZSB7SFRNTEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6njg5njg6vjgavoqK3lrprjgZnjgovjg4bjgq3jgrnjg4hcclxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kk44OZ44Oz44OI44Oq44K544OKXHJcbiAgICAgICAgICogQHR5cGUge29iamVjdH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmxpc3RlbmVycyA9IHt9O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqTjg5njg7Pjg4jjg6rjgrnjg4rjgpLnmbvpjLLjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0g44Kk44OZ44Oz44OI44K/44Kk44OXXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIC0g55m76Yyy44GZ44KL6Zai5pWwXHJcbiAgICAgKi9cclxuICAgIGFkZCh0eXBlLCBmdW5jKXtcclxuICAgICAgICBpZih0aGlzLmNvbnRyb2wgPT0gbnVsbCB8fCB0eXBlID09IG51bGwgfHwgZnVuYyA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGlmKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0eXBlKSAhPT0gJ1tvYmplY3QgU3RyaW5nXScpe3JldHVybjt9XHJcbiAgICAgICAgaWYoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmMpICE9PSAnW29iamVjdCBGdW5jdGlvbl0nKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMubGlzdGVuZXJzW3R5cGVdID0gZnVuYztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kk44OZ44Oz44OI44KS55m654Gr44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdHlwZSAtIOeZuueBq+OBmeOCi+OCpOODmeODs+ODiOOCv+OCpOODl1xyXG4gICAgICogQHBhcmFtIHtFdmVudH0gZXZlIC0gRXZlbnQg44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGVtaXQodHlwZSwgZXZlKXtcclxuICAgICAgICBpZih0aGlzLmNvbnRyb2wgPT0gbnVsbCB8fCAhdGhpcy5saXN0ZW5lcnMuaGFzT3duUHJvcGVydHkodHlwZSkpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNbdHlwZV0oZXZlLCB0aGlzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kk44OZ44Oz44OI44Oq44K544OK44KS55m76Yyy6Kej6Zmk44GZ44KLXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZSgpe1xyXG4gICAgICAgIGlmKHRoaXMuY29udHJvbCA9PSBudWxsIHx8ICF0aGlzLmxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eSh0eXBlKSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmxpc3RlbmVyc1t0eXBlXSA9IG51bGw7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMubGlzdGVuZXJzW3R5cGVdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg6njg5njg6vjg4bjgq3jgrnjg4jjgajjgrPjg7Pjg4jjg63jg7zjg6vjga7lgKTjgpLmm7TmlrDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bWl4ZWR9IHZhbHVlIC0g6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIHNldFZhbHVlKHZhbHVlKXtcclxuICAgICAgICB0aGlzLnZhbHVlLnRleHRDb250ZW50ID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnZhbHVlID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+WApOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7bWl4ZWR9IOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+WApFxyXG4gICAgICovXHJcbiAgICBnZXRWYWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wudmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiOOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7SFRNTEVsZW1lbnR9XHJcbiAgICAgKi9cclxuICAgIGdldENvbnRyb2woKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjg6njg5njg6vjgavoqK3lrprjgZXjgozjgabjgYTjgovjg4bjgq3jgrnjg4jjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge3N0cmluZ30g44Op44OZ44Or44Gr6Kit5a6a44GV44KM44Gm44GE44KL5YCkXHJcbiAgICAgKi9cclxuICAgIGdldFRleHQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqjjg6zjg6Hjg7Pjg4jjgpLov5TjgZlcclxuICAgICAqIEByZXR1cm4ge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICovXHJcbiAgICBnZXRFbGVtZW50KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSVNsaWRlclxyXG4gKiBAY2xhc3MgR1VJU2xpZGVyXHJcbiAqL1xyXG5jbGFzcyBHVUlTbGlkZXIgZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ZhbHVlPTBdIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21pbj0wXSAtIOOCueODqeOCpOODgOODvOOBruacgOWwj+WApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFttYXg9MTAwXSAtIOOCueODqeOCpOODgOODvOOBruacgOWkp+WApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtzdGVwPTFdIC0g44K544Op44Kk44OA44O844Gu44K544OG44OD44OX5pWwXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKHRleHQgPSAnJywgdmFsdWUgPSAwLCBtaW4gPSAwLCBtYXggPSAxMDAsIHN0ZXAgPSAxKXtcclxuICAgICAgICBzdXBlcih0ZXh0KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTElucHV0RWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNvbnRyb2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAncmFuZ2UnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtaW4nLCBtaW4pO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21heCcsIG1heCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHN0ZXApO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wudmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBldmVudFxyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdpbnB1dCcsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCueODqeOCpOODgOODvOOBruacgOWwj+WApOOCkuOCu+ODg+ODiOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIOacgOWwj+WApOOBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBzZXRNaW4obWluKXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtaW4nLCBtaW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjg6njgqTjg4Djg7zjga7mnIDlpKflgKTjgpLjgrvjg4Pjg4jjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSDmnIDlpKflgKTjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgc2V0TWF4KG1heCl7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWF4JywgbWF4KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44K544Op44Kk44OA44O844Gu44K544OG44OD44OX5pWw44KS44K744OD44OI44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlcCAtIOOCueODhuODg+ODl+aVsOOBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBzZXRTdGVwKHN0ZXApe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCBzdGVwKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSUNoZWNrYm94XHJcbiAqIEBjbGFzcyBHVUlDaGVja2JveFxyXG4gKi9cclxuY2xhc3MgR1VJQ2hlY2tib3ggZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjaGVja2VkPWZhbHNlXSAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIGNoZWNrZWQgPSBmYWxzZSl7XHJcbiAgICAgICAgc3VwZXIodGV4dCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxJbnB1dEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmNoZWNrZWQgPSBjaGVja2VkO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wuY2hlY2tlZCk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIChldmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCBldmUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC5jaGVja2VkKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBq+WApOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBjaGVja2VkIC0g44Kz44Oz44OI44Ot44O844Or44Gr6Kit5a6a44GZ44KL5YCkXHJcbiAgICAgKi9cclxuICAgIHNldFZhbHVlKGNoZWNrZWQpe1xyXG4gICAgICAgIHRoaXMudmFsdWUudGV4dENvbnRlbnQgPSBjaGVja2VkO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5jaGVja2VkID0gY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gu5YCk44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDjgrPjg7Pjg4jjg63jg7zjg6vjga7lgKRcclxuICAgICAqL1xyXG4gICAgZ2V0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sLmNoZWNrZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlSYWRpb1xyXG4gKiBAY2xhc3MgR1VJUmFkaW9cclxuICovXHJcbmNsYXNzIEdVSVJhZGlvIGV4dGVuZHMgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFtuYW1lPSdnbDNyYWRpbyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL5ZCN5YmNXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IFtjaGVja2VkPWZhbHNlXSAtIOOCs+ODs+ODiOODreODvOODq+OBq+ioreWumuOBmeOCi+WApFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIG5hbWUgPSAnZ2wzcmFkaW8nLCBjaGVja2VkID0gZmFsc2Upe1xyXG4gICAgICAgIHN1cGVyKHRleHQpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgndHlwZScsICdyYWRpbycpO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCBuYW1lKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuY2hlY2tlZCA9IGNoZWNrZWQ7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLm1hcmdpbiA9ICdhdXRvJztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUudmVydGljYWxBbGlnbiA9ICdtaWRkbGUnO1xyXG4gICAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRyb2wpO1xyXG5cclxuICAgICAgICAvLyBzZXRcclxuICAgICAgICB0aGlzLnNldFZhbHVlKHRoaXMuY29udHJvbC5jaGVja2VkKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRcclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLmNoZWNrZWQpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gr5YCk44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrZWQgLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgc2V0VmFsdWUoY2hlY2tlZCl7XHJcbiAgICAgICAgdGhpcy52YWx1ZS50ZXh0Q29udGVudCA9ICctLS0nO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5jaGVja2VkID0gY2hlY2tlZDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kz44Oz44OI44Ot44O844Or44Gu5YCk44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDjgrPjg7Pjg4jjg63jg7zjg6vjga7lgKRcclxuICAgICAqL1xyXG4gICAgZ2V0VmFsdWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jb250cm9sLmNoZWNrZWQ7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBHVUlTZWxlY3RcclxuICogQGNsYXNzIEdVSVNlbGVjdFxyXG4gKi9cclxuY2xhc3MgR1VJU2VsZWN0IGV4dGVuZHMgR1VJRWxlbWVudCB7XHJcbiAgICAvKipcclxuICAgICAqIEBjb25zdHJ1Y3RvclxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IFt0ZXh0PScnXSAtIOOCqOODrOODoeODs+ODiOOBq+ioreWumuOBmeOCi+ODhuOCreOCueODiFxyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gW2xpc3Q9W11dIC0g44Oq44K544OI44Gr55m76Yyy44GZ44KL44Ki44Kk44OG44Og44KS5oyH5a6a44GZ44KL5paH5a2X5YiX44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3NlbGVjdGVkSW5kZXg9MF0gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgafpgbjmip7jgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnLCBsaXN0ID0gW10sIHNlbGVjdGVkSW5kZXggPSAwKXtcclxuICAgICAgICBzdXBlcih0ZXh0KTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgrPjg7Pjg4jjg63jg7zjg6vjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTFNlbGVjdEVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XHJcbiAgICAgICAgbGlzdC5tYXAoKHYpID0+IHtcclxuICAgICAgICAgICAgbGV0IG9wdCA9IG5ldyBPcHRpb24odiwgdik7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbC5hZGQob3B0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLndpZHRoID0gJzEzMHB4JztcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUubWFyZ2luID0gJ2F1dG8nO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS52ZXJ0aWNhbEFsaWduID0gJ21pZGRsZSc7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY29udHJvbCk7XHJcblxyXG4gICAgICAgIC8vIHNldFxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuXHJcbiAgICAgICAgLy8gZXZlbnRcclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGV2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2NoYW5nZScsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBp+mBuOaKnuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOCkuaMh+WumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IC0g5oyH5a6a44GZ44KL44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIHNldFNlbGVjdGVkSW5kZXgoaW5kZXgpe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCs+ODs+ODiOODreODvOODq+OBjOePvuWcqOmBuOaKnuOBl+OBpuOBhOOCi+OCpOODs+ODh+ODg+OCr+OCueOCkui/lOOBmVxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDnj77lnKjpgbjmip7jgZfjgabjgYTjgovjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgZ2V0U2VsZWN0ZWRJbmRleCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRyb2wuc2VsZWN0ZWRJbmRleDtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSVNwaW5cclxuICogQGNsYXNzIEdVSVNwaW5cclxuICovXHJcbmNsYXNzIEdVSVNwaW4gZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3ZhbHVlPTAuMF0gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbbWluPS0xLjBdIC0g44K544OU44Oz44GZ44KL6Zqb44Gu5pyA5bCP5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW21heD0xLjBdIC0g44K544OU44Oz44GZ44KL6Zqb44Gu5pyA5aSn5YCkXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3N0ZXA9MC4xXSAtIOOCueODlOODs+OBmeOCi+OCueODhuODg+ODl+aVsFxyXG4gICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcih0ZXh0ID0gJycsIHZhbHVlID0gMC4wLCBtaW4gPSAtMS4wLCBtYXggPSAxLjAsIHN0ZXAgPSAwLjEpe1xyXG4gICAgICAgIHN1cGVyKHRleHQpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MSW5wdXRFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udHJvbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgndHlwZScsICdudW1iZXInKTtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtaW4nLCBtaW4pO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ21heCcsIG1heCk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnc3RlcCcsIHN0ZXApO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5tYXJnaW4gPSAnYXV0byc7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnbWlkZGxlJztcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250cm9sKTtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLmNvbnRyb2wudmFsdWUpO1xyXG5cclxuICAgICAgICAvLyBldmVudFxyXG4gICAgICAgIHRoaXMuY29udHJvbC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsIChldmUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdpbnB1dCcsIGV2ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUodGhpcy5jb250cm9sLnZhbHVlKTtcclxuICAgICAgICB9LCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCueODlOODs+OBruacgOWwj+WApOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbiAtIOioreWumuOBmeOCi+acgOWwj+WApFxyXG4gICAgICovXHJcbiAgICBzZXRNaW4obWluKXtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuc2V0QXR0cmlidXRlKCdtaW4nLCBtaW4pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrnjg5Tjg7Pjga7mnIDlpKflgKTjgpLoqK3lrprjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXggLSDoqK3lrprjgZnjgovmnIDlpKflgKRcclxuICAgICAqL1xyXG4gICAgc2V0TWF4KG1heCl7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnNldEF0dHJpYnV0ZSgnbWF4JywgbWF4KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44K544OU44Oz44Gu44K544OG44OD44OX5pWw44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3RlcCAtIOioreWumuOBmeOCi+OCueODhuODg+ODl+aVsFxyXG4gICAgICovXHJcbiAgICBzZXRTdGVwKHN0ZXApe1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCBzdGVwKTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIEdVSUNvbG9yXHJcbiAqIEBjbGFzcyBHVUlDb2xvclxyXG4gKi9cclxuY2xhc3MgR1VJQ29sb3IgZXh0ZW5kcyBHVUlFbGVtZW50IHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3RleHQ9JyddIC0g44Ko44Os44Oh44Oz44OI44Gr6Kit5a6a44GZ44KL44OG44Kt44K544OIXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3ZhbHVlPScjMDAwMDAwJ10gLSDjgrPjg7Pjg4jjg63jg7zjg6vjgavoqK3lrprjgZnjgovlgKRcclxuICAgICAqL1xyXG4gICAgY29uc3RydWN0b3IodGV4dCA9ICcnLCB2YWx1ZSA9ICcjMDAwMDAwJyl7XHJcbiAgICAgICAgc3VwZXIodGV4dCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kz44Oz44OI44Ot44O844Or44KS5YyF44KA44Kz44Oz44OG44OK44Ko44Os44Oh44Oz44OIXHJcbiAgICAgICAgICogQHR5cGUge0hUTUxEaXZFbGVtZW50fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUubGluZUhlaWdodCA9ICcwJztcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5tYXJnaW4gPSAnMnB4IGF1dG8nO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gJzEwMHB4JztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDkvZnnmb3lhbzpgbjmip7jgqvjg6njg7zooajnpLrjgqjjg6zjg6Hjg7Pjg4hcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTERpdkVsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIHRoaXMubGFiZWwuc3R5bGUubWFyZ2luID0gJzBweCc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS53aWR0aCA9ICdjYWxjKDEwMCUgLSAycHgpJztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmhlaWdodCA9ICcyNHB4JztcclxuICAgICAgICB0aGlzLmxhYmVsLnN0eWxlLmJvcmRlciA9ICcxcHggc29saWQgd2hpdGVzbW9rZSc7XHJcbiAgICAgICAgdGhpcy5sYWJlbC5zdHlsZS5ib3hTaGFkb3cgPSAnMHB4IDBweCAwcHggMXB4ICMyMjInO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+OCqOODrOODoeODs+ODiOOBruW9ueWJsuOCkuaLheOBhiBjYW52YXNcclxuICAgICAgICAgKiBAdHlwZSB7SFRNTENhbnZhc0VsZW1lbnR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb250cm9sID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLnN0eWxlLm1hcmdpbiA9ICcwcHgnO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgIHRoaXMuY29udHJvbC53aWR0aCA9IDEwMDtcclxuICAgICAgICB0aGlzLmNvbnRyb2wuaGVpZ2h0ID0gMTAwO1xyXG5cclxuICAgICAgICAvLyBhcHBlbmRcclxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5jb250YWluZXIpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY29udHJvbCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCs+ODs+ODiOODreODvOODq+eUqCBjYW52YXMg44GuIDJkIOOCs+ODs+ODhuOCreOCueODiFxyXG4gICAgICAgICAqIEB0eXBlIHtDYW52YXNSZW5kZXJpbmdDb250ZXh0MkR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNvbnRyb2wuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBsZXQgZ3JhZCA9IHRoaXMuY3R4LmNyZWF0ZUxpbmVhckdyYWRpZW50KDAsIDAsIHRoaXMuY29udHJvbC53aWR0aCwgMCk7XHJcbiAgICAgICAgbGV0IGFyciA9IFsnI2ZmMDAwMCcsICcjZmZmZjAwJywgJyMwMGZmMDAnLCAnIzAwZmZmZicsICcjMDAwMGZmJywgJyNmZjAwZmYnLCAnI2ZmMDAwMCddO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDAsIGogPSBhcnIubGVuZ3RoOyBpIDwgajsgKytpKXtcclxuICAgICAgICAgICAgZ3JhZC5hZGRDb2xvclN0b3AoaSAvIChqIC0gMSksIGFycltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGdyYWQ7XHJcbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoMCwgMCwgdGhpcy5jb250cm9sLndpZHRoLCB0aGlzLmNvbnRyb2wuaGVpZ2h0KTtcclxuICAgICAgICBncmFkID0gdGhpcy5jdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgMCwgdGhpcy5jb250cm9sLmhlaWdodCk7XHJcbiAgICAgICAgYXJyID0gWydyZ2JhKDI1NSwgMjU1LCAyNTUsIDEuMCknLCAncmdiYSgyNTUsIDI1NSwgMjU1LCAwLjApJywgJ3JnYmEoMCwgMCwgMCwgMC4wKScsICdyZ2JhKDAsIDAsIDAsIDEuMCknXTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwLCBqID0gYXJyLmxlbmd0aDsgaSA8IGo7ICsraSl7XHJcbiAgICAgICAgICAgIGdyYWQuYWRkQ29sb3JTdG9wKGkgLyAoaiAtIDEpLCBhcnJbaV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBncmFkO1xyXG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KDAsIDAsIHRoaXMuY29udHJvbC53aWR0aCwgdGhpcy5jb250cm9sLmhlaWdodCk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiHqui6q+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+iJsuOCkuihqOOBmeaWh+Wtl+WIl+OBruWApFxyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5jb2xvclZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog44Kv44Oq44OD44Kv5pmC44Gr44Gu44G/IGNvbG9yVmFsdWUg44KS5pu05paw44GZ44KL44Gf44KB44Gu5LiA5pmC44Kt44Oj44OD44K344Ol5aSJ5pWwXHJcbiAgICAgICAgICogQHR5cGUge3N0cmluZ31cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnRlbXBDb2xvclZhbHVlID0gbnVsbDtcclxuXHJcbiAgICAgICAgLy8gc2V0XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XHJcblxyXG4gICAgICAgIC8vIGV2ZW50XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XHJcbiAgICAgICAgICAgIHRoaXMudGVtcENvbG9yVmFsdWUgPSB0aGlzLmNvbG9yVmFsdWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udHJvbC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgICAgICAgICBpZih0aGlzLnRlbXBDb2xvclZhbHVlICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSh0aGlzLnRlbXBDb2xvclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGVtcENvbG9yVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb250cm9sLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIChldmUpID0+IHtcclxuICAgICAgICAgICAgbGV0IGltYWdlRGF0YSA9IHRoaXMuY3R4LmdldEltYWdlRGF0YShldmUub2Zmc2V0WCwgZXZlLm9mZnNldFksIDEsIDEpO1xyXG4gICAgICAgICAgICBsZXQgY29sb3IgPSB0aGlzLmdldENvbG9yOGJpdFN0cmluZyhpbWFnZURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoY29sb3IpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbnRyb2wuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBpbWFnZURhdGEgPSB0aGlzLmN0eC5nZXRJbWFnZURhdGEoZXZlLm9mZnNldFgsIGV2ZS5vZmZzZXRZLCAxLCAxKTtcclxuICAgICAgICAgICAgZXZlLmN1cnJlbnRUYXJnZXQudmFsdWUgPSB0aGlzLmdldENvbG9yOGJpdFN0cmluZyhpbWFnZURhdGEuZGF0YSk7XHJcbiAgICAgICAgICAgIHRoaXMudGVtcENvbG9yVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRyb2wuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgICAgICAgICAgdGhpcy5lbWl0KCdjaGFuZ2UnLCBldmUpO1xyXG4gICAgICAgIH0sIGZhbHNlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6Ieq6Lqr44Gu44OX44Ot44OR44OG44Kj44Gr6Imy44KS6Kit5a6a44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdmFsdWUgLSBDU1Mg6Imy6KGo54++44Gu44GG44GhIDE2IOmAsuaVsOihqOiomOOBruOCguOBrlxyXG4gICAgICovXHJcbiAgICBzZXRWYWx1ZSh2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy52YWx1ZS50ZXh0Q29udGVudCA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29sb3JWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3JWYWx1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6Ieq6Lqr44Gr6Kit5a6a44GV44KM44Gm44GE44KL6Imy44KS6KGo44GZ5paH5a2X5YiX44KS6L+U44GZXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IDE2IOmAsuaVsOihqOiomOOBruiJsuOCkuihqOOBmeaWh+Wtl+WIl1xyXG4gICAgICovXHJcbiAgICBnZXRWYWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbG9yVmFsdWU7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOiHqui6q+OBq+ioreWumuOBleOCjOOBpuOBhOOCi+iJsuOCkuihqOOBmeaWh+Wtl+WIl+OCkiAwLjAg44GL44KJIDEuMCDjga7lgKTjgavlpInmj5vjgZfphY3liJfjgafov5TjgZlcclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSDmta7li5XlsI/mlbDjgafooajnj77jgZfjgZ/oibLjga7lgKTjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgZ2V0RmxvYXRWYWx1ZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmdldENvbG9yRmxvYXRBcnJheSh0aGlzLmNvbG9yVmFsdWUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjYW52YXMuaW1hZ2VEYXRhIOOBi+OCieWPluW+l+OBmeOCi+aVsOWApOOBrumFjeWIl+OCkuWFg+OBqyAxNiDpgLLmlbDooajoqJjmloflrZfliJfjgpLnlJ/miJDjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g5pyA5L2O44Gn44KCIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk5pWw5YCk44Gu6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IDE2IOmAsuaVsOihqOiomOOBruiJsuOBruWApOOBruaWh+Wtl+WIl1xyXG4gICAgICovXHJcbiAgICBnZXRDb2xvcjhiaXRTdHJpbmcoY29sb3Ipe1xyXG4gICAgICAgIGxldCByID0gdGhpcy56ZXJvUGFkZGluZyhjb2xvclswXS50b1N0cmluZygxNiksIDIpO1xyXG4gICAgICAgIGxldCBnID0gdGhpcy56ZXJvUGFkZGluZyhjb2xvclsxXS50b1N0cmluZygxNiksIDIpO1xyXG4gICAgICAgIGxldCBiID0gdGhpcy56ZXJvUGFkZGluZyhjb2xvclsyXS50b1N0cmluZygxNiksIDIpO1xyXG4gICAgICAgIHJldHVybiAnIycgKyByICsgZyArIGI7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDE2IOmAsuaVsOihqOiomOOBruiJsuihqOePvuaWh+Wtl+WIl+OCkuWFg+OBqyAwLjAg44GL44KJIDEuMCDjga7lgKTjgavlpInmj5vjgZfjgZ/phY3liJfjgpLnlJ/miJDjgZfov5TjgZlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2xvciAtIDE2IOmAsuaVsOihqOiomOOBruiJsuOBruWApOOBruaWh+Wtl+WIl1xyXG4gICAgICogQHJldHVybiB7QXJyYXkuPG51bWJlcj59IFJHQiDjga4gMyDjgaTjga7lgKTjgpIgMC4wIOOBi+OCiSAxLjAg44Gr5aSJ5o+b44GX44Gf5YCk44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIGdldENvbG9yRmxvYXRBcnJheShjb2xvcil7XHJcbiAgICAgICAgaWYoY29sb3IgPT0gbnVsbCB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoY29sb3IpICE9PSAnW29iamVjdCBTdHJpbmddJyl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGlmKGNvbG9yLnNlYXJjaCgvXiMrW1xcZHxhLWZ8QS1GXSskLykgPT09IC0xKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IHMgPSBjb2xvci5yZXBsYWNlKCcjJywgJycpO1xyXG4gICAgICAgIGlmKHMubGVuZ3RoICE9PSAzICYmIHMubGVuZ3RoICE9PSA2KXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IHQgPSBzLmxlbmd0aCAvIDM7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAgcGFyc2VJbnQoY29sb3Iuc3Vic3RyKDEsIHQpLCAxNikgLyAyNTUsXHJcbiAgICAgICAgICAgIHBhcnNlSW50KGNvbG9yLnN1YnN0cigxICsgdCwgdCksIDE2KSAvIDI1NSxcclxuICAgICAgICAgICAgcGFyc2VJbnQoY29sb3Iuc3Vic3RyKDEgKyB0ICogMiwgdCksIDE2KSAvIDI1NVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOaVsOWApOOCkuaMh+WumuOBleOCjOOBn+ahgeaVsOOBq+aVtOW9ouOBl+OBn+aWh+Wtl+WIl+OCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIOaVtOW9ouOBl+OBn+OBhOaVsOWApFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0g5pW05b2i44GZ44KL5qGB5pWwXHJcbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9IDE2IOmAsuaVsOihqOiomOOBruiJsuOBruWApOOBruaWh+Wtl+WIl1xyXG4gICAgICovXHJcbiAgICB6ZXJvUGFkZGluZyhudW1iZXIsIGNvdW50KXtcclxuICAgICAgICBsZXQgYSA9IG5ldyBBcnJheShjb3VudCkuam9pbignMCcpO1xyXG4gICAgICAgIHJldHVybiAoYSArIG51bWJlcikuc2xpY2UoLWNvdW50KTtcclxuICAgIH1cclxufVxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzR3VpLmpzIiwiXHJcbi8qKlxyXG4gKiBnbDNNYXRoXHJcbiAqIEBjbGFzcyBnbDNNYXRoXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNNYXRoIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogTWF0NFxyXG4gICAgICAgICAqIEB0eXBlIHtNYXQ0fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuTWF0NCA9IE1hdDQ7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVmVjM1xyXG4gICAgICAgICAqIEB0eXBlIHtWZWMzfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVmVjMyA9IFZlYzM7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogVmVjMlxyXG4gICAgICAgICAqIEB0eXBlIHtWZWMyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVmVjMiA9IFZlYzI7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogUXRuXHJcbiAgICAgICAgICogQHR5cGUge1F0bn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlF0biAgPSBRdG47XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYXQ0XHJcbiAqIEBjbGFzcyBNYXQ0XHJcbiAqL1xyXG5jbGFzcyBNYXQ0IHtcclxuICAgIC8qKlxyXG4gICAgICogNHg0IOOBruato+aWueihjOWIl+OCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSDooYzliJfmoLzntI3nlKjjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyZWF0ZSgpe1xyXG4gICAgICAgIHJldHVybiBuZXcgRmxvYXQzMkFycmF5KDE2KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6KGM5YiX44KS5Y2Y5L2N5YyW44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IGRlc3QgLSDljZjkvY3ljJbjgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOWNmOS9jeWMluOBl+OBn+ihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaWRlbnRpdHkoZGVzdCl7XHJcbiAgICAgICAgZGVzdFswXSAgPSAxOyBkZXN0WzFdICA9IDA7IGRlc3RbMl0gID0gMDsgZGVzdFszXSAgPSAwO1xyXG4gICAgICAgIGRlc3RbNF0gID0gMDsgZGVzdFs1XSAgPSAxOyBkZXN0WzZdICA9IDA7IGRlc3RbN10gID0gMDtcclxuICAgICAgICBkZXN0WzhdICA9IDA7IGRlc3RbOV0gID0gMDsgZGVzdFsxMF0gPSAxOyBkZXN0WzExXSA9IDA7XHJcbiAgICAgICAgZGVzdFsxMl0gPSAwOyBkZXN0WzEzXSA9IDA7IGRlc3RbMTRdID0gMDsgZGVzdFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgpLkuZfnrpfjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0MCAtIOS5l+eul+OBleOCjOOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQxIC0g5LmX566X44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOS5l+eul+e1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g5LmX566X57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBtdWx0aXBseShtYXQwLCBtYXQxLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgbGV0IGEgPSBtYXQwWzBdLCAgYiA9IG1hdDBbMV0sICBjID0gbWF0MFsyXSwgIGQgPSBtYXQwWzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0MFs0XSwgIGYgPSBtYXQwWzVdLCAgZyA9IG1hdDBbNl0sICBoID0gbWF0MFs3XSxcclxuICAgICAgICAgICAgaSA9IG1hdDBbOF0sICBqID0gbWF0MFs5XSwgIGsgPSBtYXQwWzEwXSwgbCA9IG1hdDBbMTFdLFxyXG4gICAgICAgICAgICBtID0gbWF0MFsxMl0sIG4gPSBtYXQwWzEzXSwgbyA9IG1hdDBbMTRdLCBwID0gbWF0MFsxNV0sXHJcbiAgICAgICAgICAgIEEgPSBtYXQxWzBdLCAgQiA9IG1hdDFbMV0sICBDID0gbWF0MVsyXSwgIEQgPSBtYXQxWzNdLFxyXG4gICAgICAgICAgICBFID0gbWF0MVs0XSwgIEYgPSBtYXQxWzVdLCAgRyA9IG1hdDFbNl0sICBIID0gbWF0MVs3XSxcclxuICAgICAgICAgICAgSSA9IG1hdDFbOF0sICBKID0gbWF0MVs5XSwgIEsgPSBtYXQxWzEwXSwgTCA9IG1hdDFbMTFdLFxyXG4gICAgICAgICAgICBNID0gbWF0MVsxMl0sIE4gPSBtYXQxWzEzXSwgTyA9IG1hdDFbMTRdLCBQID0gbWF0MVsxNV07XHJcbiAgICAgICAgb3V0WzBdICA9IEEgKiBhICsgQiAqIGUgKyBDICogaSArIEQgKiBtO1xyXG4gICAgICAgIG91dFsxXSAgPSBBICogYiArIEIgKiBmICsgQyAqIGogKyBEICogbjtcclxuICAgICAgICBvdXRbMl0gID0gQSAqIGMgKyBCICogZyArIEMgKiBrICsgRCAqIG87XHJcbiAgICAgICAgb3V0WzNdICA9IEEgKiBkICsgQiAqIGggKyBDICogbCArIEQgKiBwO1xyXG4gICAgICAgIG91dFs0XSAgPSBFICogYSArIEYgKiBlICsgRyAqIGkgKyBIICogbTtcclxuICAgICAgICBvdXRbNV0gID0gRSAqIGIgKyBGICogZiArIEcgKiBqICsgSCAqIG47XHJcbiAgICAgICAgb3V0WzZdICA9IEUgKiBjICsgRiAqIGcgKyBHICogayArIEggKiBvO1xyXG4gICAgICAgIG91dFs3XSAgPSBFICogZCArIEYgKiBoICsgRyAqIGwgKyBIICogcDtcclxuICAgICAgICBvdXRbOF0gID0gSSAqIGEgKyBKICogZSArIEsgKiBpICsgTCAqIG07XHJcbiAgICAgICAgb3V0WzldICA9IEkgKiBiICsgSiAqIGYgKyBLICogaiArIEwgKiBuO1xyXG4gICAgICAgIG91dFsxMF0gPSBJICogYyArIEogKiBnICsgSyAqIGsgKyBMICogbztcclxuICAgICAgICBvdXRbMTFdID0gSSAqIGQgKyBKICogaCArIEsgKiBsICsgTCAqIHA7XHJcbiAgICAgICAgb3V0WzEyXSA9IE0gKiBhICsgTiAqIGUgKyBPICogaSArIFAgKiBtO1xyXG4gICAgICAgIG91dFsxM10gPSBNICogYiArIE4gKiBmICsgTyAqIGogKyBQICogbjtcclxuICAgICAgICBvdXRbMTRdID0gTSAqIGMgKyBOICogZyArIE8gKiBrICsgUCAqIG87XHJcbiAgICAgICAgb3V0WzE1XSA9IE0gKiBkICsgTiAqIGggKyBPICogbCArIFAgKiBwO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOihjOWIl+OBq+aLoeWkp+e4ruWwj+OCkumBqeeUqOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSDpgannlKjjgpLlj5fjgZHjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdmVjIC0gWFlaIOOBruWQhOi7uOOBq+WvvuOBl+OBpuaLoee4ruOCkumBqeeUqOOBmeOCi+WApOOBruihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2NhbGUobWF0LCB2ZWMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBvdXRbMF0gID0gbWF0WzBdICAqIHZlY1swXTtcclxuICAgICAgICBvdXRbMV0gID0gbWF0WzFdICAqIHZlY1swXTtcclxuICAgICAgICBvdXRbMl0gID0gbWF0WzJdICAqIHZlY1swXTtcclxuICAgICAgICBvdXRbM10gID0gbWF0WzNdICAqIHZlY1swXTtcclxuICAgICAgICBvdXRbNF0gID0gbWF0WzRdICAqIHZlY1sxXTtcclxuICAgICAgICBvdXRbNV0gID0gbWF0WzVdICAqIHZlY1sxXTtcclxuICAgICAgICBvdXRbNl0gID0gbWF0WzZdICAqIHZlY1sxXTtcclxuICAgICAgICBvdXRbN10gID0gbWF0WzddICAqIHZlY1sxXTtcclxuICAgICAgICBvdXRbOF0gID0gbWF0WzhdICAqIHZlY1syXTtcclxuICAgICAgICBvdXRbOV0gID0gbWF0WzldICAqIHZlY1syXTtcclxuICAgICAgICBvdXRbMTBdID0gbWF0WzEwXSAqIHZlY1syXTtcclxuICAgICAgICBvdXRbMTFdID0gbWF0WzExXSAqIHZlY1syXTtcclxuICAgICAgICBvdXRbMTJdID0gbWF0WzEyXTtcclxuICAgICAgICBvdXRbMTNdID0gbWF0WzEzXTtcclxuICAgICAgICBvdXRbMTRdID0gbWF0WzE0XTtcclxuICAgICAgICBvdXRbMTVdID0gbWF0WzE1XTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgavlubPooYznp7vli5XjgpLpgannlKjjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0g6YGp55So44KS5Y+X44GR44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHZlYyAtIFhZWiDjga7lkITou7jjgavlr77jgZfjgablubPooYznp7vli5XjgpLpgannlKjjgZnjgovlgKTjga7ooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRyYW5zbGF0ZShtYXQsIHZlYywgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIG91dFswXSA9IG1hdFswXTsgb3V0WzFdID0gbWF0WzFdOyBvdXRbMl0gID0gbWF0WzJdOyAgb3V0WzNdICA9IG1hdFszXTtcclxuICAgICAgICBvdXRbNF0gPSBtYXRbNF07IG91dFs1XSA9IG1hdFs1XTsgb3V0WzZdICA9IG1hdFs2XTsgIG91dFs3XSAgPSBtYXRbN107XHJcbiAgICAgICAgb3V0WzhdID0gbWF0WzhdOyBvdXRbOV0gPSBtYXRbOV07IG91dFsxMF0gPSBtYXRbMTBdOyBvdXRbMTFdID0gbWF0WzExXTtcclxuICAgICAgICBvdXRbMTJdID0gbWF0WzBdICogdmVjWzBdICsgbWF0WzRdICogdmVjWzFdICsgbWF0WzhdICAqIHZlY1syXSArIG1hdFsxMl07XHJcbiAgICAgICAgb3V0WzEzXSA9IG1hdFsxXSAqIHZlY1swXSArIG1hdFs1XSAqIHZlY1sxXSArIG1hdFs5XSAgKiB2ZWNbMl0gKyBtYXRbMTNdO1xyXG4gICAgICAgIG91dFsxNF0gPSBtYXRbMl0gKiB2ZWNbMF0gKyBtYXRbNl0gKiB2ZWNbMV0gKyBtYXRbMTBdICogdmVjWzJdICsgbWF0WzE0XTtcclxuICAgICAgICBvdXRbMTVdID0gbWF0WzNdICogdmVjWzBdICsgbWF0WzddICogdmVjWzFdICsgbWF0WzExXSAqIHZlY1syXSArIG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6KGM5YiX44Gr5Zue6Lui44KS6YGp55So44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIOmBqeeUqOOCkuWPl+OBkeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0g5Zue6Lui6YeP44KS6KGo44GZ5YCk77yI44Op44K444Ki44Oz77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IGF4aXMgLSDlm57ou6Ljga7ou7hcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHJvdGF0ZShtYXQsIGFuZ2xlLCBheGlzLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCl9XHJcbiAgICAgICAgbGV0IHNxID0gTWF0aC5zcXJ0KGF4aXNbMF0gKiBheGlzWzBdICsgYXhpc1sxXSAqIGF4aXNbMV0gKyBheGlzWzJdICogYXhpc1syXSk7XHJcbiAgICAgICAgaWYoIXNxKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IGEgPSBheGlzWzBdLCBiID0gYXhpc1sxXSwgYyA9IGF4aXNbMl07XHJcbiAgICAgICAgaWYoc3EgIT0gMSl7c3EgPSAxIC8gc3E7IGEgKj0gc3E7IGIgKj0gc3E7IGMgKj0gc3E7fVxyXG4gICAgICAgIGxldCBkID0gTWF0aC5zaW4oYW5nbGUpLCBlID0gTWF0aC5jb3MoYW5nbGUpLCBmID0gMSAtIGUsXHJcbiAgICAgICAgICAgIGcgPSBtYXRbMF0sICBoID0gbWF0WzFdLCBpID0gbWF0WzJdLCAgaiA9IG1hdFszXSxcclxuICAgICAgICAgICAgayA9IG1hdFs0XSwgIGwgPSBtYXRbNV0sIG0gPSBtYXRbNl0sICBuID0gbWF0WzddLFxyXG4gICAgICAgICAgICBvID0gbWF0WzhdLCAgcCA9IG1hdFs5XSwgcSA9IG1hdFsxMF0sIHIgPSBtYXRbMTFdLFxyXG4gICAgICAgICAgICBzID0gYSAqIGEgKiBmICsgZSxcclxuICAgICAgICAgICAgdCA9IGIgKiBhICogZiArIGMgKiBkLFxyXG4gICAgICAgICAgICB1ID0gYyAqIGEgKiBmIC0gYiAqIGQsXHJcbiAgICAgICAgICAgIHYgPSBhICogYiAqIGYgLSBjICogZCxcclxuICAgICAgICAgICAgdyA9IGIgKiBiICogZiArIGUsXHJcbiAgICAgICAgICAgIHggPSBjICogYiAqIGYgKyBhICogZCxcclxuICAgICAgICAgICAgeSA9IGEgKiBjICogZiArIGIgKiBkLFxyXG4gICAgICAgICAgICB6ID0gYiAqIGMgKiBmIC0gYSAqIGQsXHJcbiAgICAgICAgICAgIEEgPSBjICogYyAqIGYgKyBlO1xyXG4gICAgICAgIGlmKGFuZ2xlKXtcclxuICAgICAgICAgICAgaWYobWF0ICE9IG91dCl7XHJcbiAgICAgICAgICAgICAgICBvdXRbMTJdID0gbWF0WzEyXTsgb3V0WzEzXSA9IG1hdFsxM107XHJcbiAgICAgICAgICAgICAgICBvdXRbMTRdID0gbWF0WzE0XTsgb3V0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBvdXQgPSBtYXQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG91dFswXSAgPSBnICogcyArIGsgKiB0ICsgbyAqIHU7XHJcbiAgICAgICAgb3V0WzFdICA9IGggKiBzICsgbCAqIHQgKyBwICogdTtcclxuICAgICAgICBvdXRbMl0gID0gaSAqIHMgKyBtICogdCArIHEgKiB1O1xyXG4gICAgICAgIG91dFszXSAgPSBqICogcyArIG4gKiB0ICsgciAqIHU7XHJcbiAgICAgICAgb3V0WzRdICA9IGcgKiB2ICsgayAqIHcgKyBvICogeDtcclxuICAgICAgICBvdXRbNV0gID0gaCAqIHYgKyBsICogdyArIHAgKiB4O1xyXG4gICAgICAgIG91dFs2XSAgPSBpICogdiArIG0gKiB3ICsgcSAqIHg7XHJcbiAgICAgICAgb3V0WzddICA9IGogKiB2ICsgbiAqIHcgKyByICogeDtcclxuICAgICAgICBvdXRbOF0gID0gZyAqIHkgKyBrICogeiArIG8gKiBBO1xyXG4gICAgICAgIG91dFs5XSAgPSBoICogeSArIGwgKiB6ICsgcCAqIEE7XHJcbiAgICAgICAgb3V0WzEwXSA9IGkgKiB5ICsgbSAqIHogKyBxICogQTtcclxuICAgICAgICBvdXRbMTFdID0gaiAqIHkgKyBuICogeiArIHIgKiBBO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODk+ODpeODvOW6p+aomeWkieaPm+ihjOWIl+OCkueUn+aIkOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSBleWUgLSDoppbngrnkvY3nva5cclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gY2VudGVyIC0g5rOo6KaW54K5XHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHVwIC0g5LiK5pa55ZCR44KS56S644GZ44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsb29rQXQoZXllLCBjZW50ZXIsIHVwLCBkZXN0KXtcclxuICAgICAgICBsZXQgZXllWCAgICA9IGV5ZVswXSwgICAgZXllWSAgICA9IGV5ZVsxXSwgICAgZXllWiAgICA9IGV5ZVsyXSxcclxuICAgICAgICAgICAgY2VudGVyWCA9IGNlbnRlclswXSwgY2VudGVyWSA9IGNlbnRlclsxXSwgY2VudGVyWiA9IGNlbnRlclsyXSxcclxuICAgICAgICAgICAgdXBYICAgICA9IHVwWzBdLCAgICAgdXBZICAgICA9IHVwWzFdLCAgICAgdXBaICAgICA9IHVwWzJdO1xyXG4gICAgICAgIGlmKGV5ZVggPT0gY2VudGVyWCAmJiBleWVZID09IGNlbnRlclkgJiYgZXllWiA9PSBjZW50ZXJaKXtyZXR1cm4gTWF0NC5pZGVudGl0eShkZXN0KTt9XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIGxldCB4MCwgeDEsIHgyLCB5MCwgeTEsIHkyLCB6MCwgejEsIHoyLCBsO1xyXG4gICAgICAgIHowID0gZXllWCAtIGNlbnRlclswXTsgejEgPSBleWVZIC0gY2VudGVyWzFdOyB6MiA9IGV5ZVogLSBjZW50ZXJbMl07XHJcbiAgICAgICAgbCA9IDEgLyBNYXRoLnNxcnQoejAgKiB6MCArIHoxICogejEgKyB6MiAqIHoyKTtcclxuICAgICAgICB6MCAqPSBsOyB6MSAqPSBsOyB6MiAqPSBsO1xyXG4gICAgICAgIHgwID0gdXBZICogejIgLSB1cFogKiB6MTtcclxuICAgICAgICB4MSA9IHVwWiAqIHowIC0gdXBYICogejI7XHJcbiAgICAgICAgeDIgPSB1cFggKiB6MSAtIHVwWSAqIHowO1xyXG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeDAgKiB4MCArIHgxICogeDEgKyB4MiAqIHgyKTtcclxuICAgICAgICBpZighbCl7XHJcbiAgICAgICAgICAgIHgwID0gMDsgeDEgPSAwOyB4MiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbCA9IDEgLyBsO1xyXG4gICAgICAgICAgICB4MCAqPSBsOyB4MSAqPSBsOyB4MiAqPSBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICB5MCA9IHoxICogeDIgLSB6MiAqIHgxOyB5MSA9IHoyICogeDAgLSB6MCAqIHgyOyB5MiA9IHowICogeDEgLSB6MSAqIHgwO1xyXG4gICAgICAgIGwgPSBNYXRoLnNxcnQoeTAgKiB5MCArIHkxICogeTEgKyB5MiAqIHkyKTtcclxuICAgICAgICBpZighbCl7XHJcbiAgICAgICAgICAgIHkwID0gMDsgeTEgPSAwOyB5MiA9IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgbCA9IDEgLyBsO1xyXG4gICAgICAgICAgICB5MCAqPSBsOyB5MSAqPSBsOyB5MiAqPSBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvdXRbMF0gPSB4MDsgb3V0WzFdID0geTA7IG91dFsyXSAgPSB6MDsgb3V0WzNdICA9IDA7XHJcbiAgICAgICAgb3V0WzRdID0geDE7IG91dFs1XSA9IHkxOyBvdXRbNl0gID0gejE7IG91dFs3XSAgPSAwO1xyXG4gICAgICAgIG91dFs4XSA9IHgyOyBvdXRbOV0gPSB5Mjsgb3V0WzEwXSA9IHoyOyBvdXRbMTFdID0gMDtcclxuICAgICAgICBvdXRbMTJdID0gLSh4MCAqIGV5ZVggKyB4MSAqIGV5ZVkgKyB4MiAqIGV5ZVopO1xyXG4gICAgICAgIG91dFsxM10gPSAtKHkwICogZXllWCArIHkxICogZXllWSArIHkyICogZXllWik7XHJcbiAgICAgICAgb3V0WzE0XSA9IC0oejAgKiBleWVYICsgejEgKiBleWVZICsgejIgKiBleWVaKTtcclxuICAgICAgICBvdXRbMTVdID0gMTtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDpgI/oppbmipXlvbHlpInmj5vooYzliJfjgpLnlJ/miJDjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IC0g6KaW6YeO6KeS77yI5bqm5pWw5rOV77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXNwZWN0IC0g44Ki44K544Oa44Kv44OI5q+U77yI5bmFIC8g6auY44GV77yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbmVhciAtIOODi+OCouOCr+ODquODg+ODl+mdouOBvuOBp+OBrui3nembolxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZhciAtIOODleOCoeODvOOCr+ODquODg+ODl+mdouOBvuOBp+OBrui3nembolxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgcGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBsZXQgdCA9IG5lYXIgKiBNYXRoLnRhbihmb3Z5ICogTWF0aC5QSSAvIDM2MCk7XHJcbiAgICAgICAgbGV0IHIgPSB0ICogYXNwZWN0O1xyXG4gICAgICAgIGxldCBhID0gciAqIDIsIGIgPSB0ICogMiwgYyA9IGZhciAtIG5lYXI7XHJcbiAgICAgICAgb3V0WzBdICA9IG5lYXIgKiAyIC8gYTtcclxuICAgICAgICBvdXRbMV0gID0gMDtcclxuICAgICAgICBvdXRbMl0gID0gMDtcclxuICAgICAgICBvdXRbM10gID0gMDtcclxuICAgICAgICBvdXRbNF0gID0gMDtcclxuICAgICAgICBvdXRbNV0gID0gbmVhciAqIDIgLyBiO1xyXG4gICAgICAgIG91dFs2XSAgPSAwO1xyXG4gICAgICAgIG91dFs3XSAgPSAwO1xyXG4gICAgICAgIG91dFs4XSAgPSAwO1xyXG4gICAgICAgIG91dFs5XSAgPSAwO1xyXG4gICAgICAgIG91dFsxMF0gPSAtKGZhciArIG5lYXIpIC8gYztcclxuICAgICAgICBvdXRbMTFdID0gLTE7XHJcbiAgICAgICAgb3V0WzEyXSA9IDA7XHJcbiAgICAgICAgb3V0WzEzXSA9IDA7XHJcbiAgICAgICAgb3V0WzE0XSA9IC0oZmFyICogbmVhciAqIDIpIC8gYztcclxuICAgICAgICBvdXRbMTVdID0gMDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDmraPlsITlvbHmipXlvbHlpInmj5vooYzliJfjgpLnlJ/miJDjgZnjgovvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsZWZ0IC0g5bem56uvXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmlnaHQgLSDlj7Pnq69cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3AgLSDkuIrnq69cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3R0b20gLSDkuIvnq69cclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBuZWFyIC0g44OL44Ki44Kv44Oq44OD44OX6Z2i44G+44Gn44Gu6Led6ZuiXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZmFyIC0g44OV44Kh44O844Kv44Oq44OD44OX6Z2i44G+44Gn44Gu6Led6ZuiXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IFtkZXN0XSAtIOe1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0g57WQ5p6c44Gu6KGM5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBvcnRobyhsZWZ0LCByaWdodCwgdG9wLCBib3R0b20sIG5lYXIsIGZhciwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBNYXQ0LmNyZWF0ZSgpfVxyXG4gICAgICAgIGxldCBoID0gKHJpZ2h0IC0gbGVmdCk7XHJcbiAgICAgICAgbGV0IHYgPSAodG9wIC0gYm90dG9tKTtcclxuICAgICAgICBsZXQgZCA9IChmYXIgLSBuZWFyKTtcclxuICAgICAgICBvdXRbMF0gID0gMiAvIGg7XHJcbiAgICAgICAgb3V0WzFdICA9IDA7XHJcbiAgICAgICAgb3V0WzJdICA9IDA7XHJcbiAgICAgICAgb3V0WzNdICA9IDA7XHJcbiAgICAgICAgb3V0WzRdICA9IDA7XHJcbiAgICAgICAgb3V0WzVdICA9IDIgLyB2O1xyXG4gICAgICAgIG91dFs2XSAgPSAwO1xyXG4gICAgICAgIG91dFs3XSAgPSAwO1xyXG4gICAgICAgIG91dFs4XSAgPSAwO1xyXG4gICAgICAgIG91dFs5XSAgPSAwO1xyXG4gICAgICAgIG91dFsxMF0gPSAtMiAvIGQ7XHJcbiAgICAgICAgb3V0WzExXSA9IDA7XHJcbiAgICAgICAgb3V0WzEyXSA9IC0obGVmdCArIHJpZ2h0KSAvIGg7XHJcbiAgICAgICAgb3V0WzEzXSA9IC0odG9wICsgYm90dG9tKSAvIHY7XHJcbiAgICAgICAgb3V0WzE0XSA9IC0oZmFyICsgbmVhcikgLyBkO1xyXG4gICAgICAgIG91dFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOi7oue9ruihjOWIl+OCkueUn+aIkOOBmeOCi++8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBtYXQgLSDpgannlKjjgZnjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRyYW5zcG9zZShtYXQsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBvdXRbMF0gID0gbWF0WzBdOyAgb3V0WzFdICA9IG1hdFs0XTtcclxuICAgICAgICBvdXRbMl0gID0gbWF0WzhdOyAgb3V0WzNdICA9IG1hdFsxMl07XHJcbiAgICAgICAgb3V0WzRdICA9IG1hdFsxXTsgIG91dFs1XSAgPSBtYXRbNV07XHJcbiAgICAgICAgb3V0WzZdICA9IG1hdFs5XTsgIG91dFs3XSAgPSBtYXRbMTNdO1xyXG4gICAgICAgIG91dFs4XSAgPSBtYXRbMl07ICBvdXRbOV0gID0gbWF0WzZdO1xyXG4gICAgICAgIG91dFsxMF0gPSBtYXRbMTBdOyBvdXRbMTFdID0gbWF0WzE0XTtcclxuICAgICAgICBvdXRbMTJdID0gbWF0WzNdOyAgb3V0WzEzXSA9IG1hdFs3XTtcclxuICAgICAgICBvdXRbMTRdID0gbWF0WzExXTsgb3V0WzE1XSA9IG1hdFsxNV07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6YCG6KGM5YiX44KS55Sf5oiQ44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IG1hdCAtIOmBqeeUqOOBmeOCi+ihjOWIl1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48TWF0ND59IOe1kOaenOOBruihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgaW52ZXJzZShtYXQsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gTWF0NC5jcmVhdGUoKX1cclxuICAgICAgICBsZXQgYSA9IG1hdFswXSwgIGIgPSBtYXRbMV0sICBjID0gbWF0WzJdLCAgZCA9IG1hdFszXSxcclxuICAgICAgICAgICAgZSA9IG1hdFs0XSwgIGYgPSBtYXRbNV0sICBnID0gbWF0WzZdLCAgaCA9IG1hdFs3XSxcclxuICAgICAgICAgICAgaSA9IG1hdFs4XSwgIGogPSBtYXRbOV0sICBrID0gbWF0WzEwXSwgbCA9IG1hdFsxMV0sXHJcbiAgICAgICAgICAgIG0gPSBtYXRbMTJdLCBuID0gbWF0WzEzXSwgbyA9IG1hdFsxNF0sIHAgPSBtYXRbMTVdLFxyXG4gICAgICAgICAgICBxID0gYSAqIGYgLSBiICogZSwgciA9IGEgKiBnIC0gYyAqIGUsXHJcbiAgICAgICAgICAgIHMgPSBhICogaCAtIGQgKiBlLCB0ID0gYiAqIGcgLSBjICogZixcclxuICAgICAgICAgICAgdSA9IGIgKiBoIC0gZCAqIGYsIHYgPSBjICogaCAtIGQgKiBnLFxyXG4gICAgICAgICAgICB3ID0gaSAqIG4gLSBqICogbSwgeCA9IGkgKiBvIC0gayAqIG0sXHJcbiAgICAgICAgICAgIHkgPSBpICogcCAtIGwgKiBtLCB6ID0gaiAqIG8gLSBrICogbixcclxuICAgICAgICAgICAgQSA9IGogKiBwIC0gbCAqIG4sIEIgPSBrICogcCAtIGwgKiBvLFxyXG4gICAgICAgICAgICBpdmQgPSAxIC8gKHEgKiBCIC0gciAqIEEgKyBzICogeiArIHQgKiB5IC0gdSAqIHggKyB2ICogdyk7XHJcbiAgICAgICAgb3V0WzBdICA9ICggZiAqIEIgLSBnICogQSArIGggKiB6KSAqIGl2ZDtcclxuICAgICAgICBvdXRbMV0gID0gKC1iICogQiArIGMgKiBBIC0gZCAqIHopICogaXZkO1xyXG4gICAgICAgIG91dFsyXSAgPSAoIG4gKiB2IC0gbyAqIHUgKyBwICogdCkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzNdICA9ICgtaiAqIHYgKyBrICogdSAtIGwgKiB0KSAqIGl2ZDtcclxuICAgICAgICBvdXRbNF0gID0gKC1lICogQiArIGcgKiB5IC0gaCAqIHgpICogaXZkO1xyXG4gICAgICAgIG91dFs1XSAgPSAoIGEgKiBCIC0gYyAqIHkgKyBkICogeCkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzZdICA9ICgtbSAqIHYgKyBvICogcyAtIHAgKiByKSAqIGl2ZDtcclxuICAgICAgICBvdXRbN10gID0gKCBpICogdiAtIGsgKiBzICsgbCAqIHIpICogaXZkO1xyXG4gICAgICAgIG91dFs4XSAgPSAoIGUgKiBBIC0gZiAqIHkgKyBoICogdykgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzldICA9ICgtYSAqIEEgKyBiICogeSAtIGQgKiB3KSAqIGl2ZDtcclxuICAgICAgICBvdXRbMTBdID0gKCBtICogdSAtIG4gKiBzICsgcCAqIHEpICogaXZkO1xyXG4gICAgICAgIG91dFsxMV0gPSAoLWkgKiB1ICsgaiAqIHMgLSBsICogcSkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzEyXSA9ICgtZSAqIHogKyBmICogeCAtIGcgKiB3KSAqIGl2ZDtcclxuICAgICAgICBvdXRbMTNdID0gKCBhICogeiAtIGIgKiB4ICsgYyAqIHcpICogaXZkO1xyXG4gICAgICAgIG91dFsxNF0gPSAoLW0gKiB0ICsgbiAqIHIgLSBvICogcSkgKiBpdmQ7XHJcbiAgICAgICAgb3V0WzE1XSA9ICggaSAqIHQgLSBqICogciArIGsgKiBxKSAqIGl2ZDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDooYzliJfjgavjg5njgq/jg4jjg6vjgpLkuZfnrpfjgZnjgovvvIjjg5njgq/jg4jjg6vjgavooYzliJfjgpLpgannlKjjgZnjgovvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0g6YGp55So44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSB2ZWMgLSDkuZfnrpfjgZnjgovjg5njgq/jg4jjg6vvvIg0IOOBpOOBruimgee0oOOCkuaMgeOBpOmFjeWIl++8iVxyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5fSDntZDmnpzjga7jg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRvVmVjSVYobWF0LCB2ZWMpe1xyXG4gICAgICAgIGxldCBhID0gbWF0WzBdLCAgYiA9IG1hdFsxXSwgIGMgPSBtYXRbMl0sICBkID0gbWF0WzNdLFxyXG4gICAgICAgICAgICBlID0gbWF0WzRdLCAgZiA9IG1hdFs1XSwgIGcgPSBtYXRbNl0sICBoID0gbWF0WzddLFxyXG4gICAgICAgICAgICBpID0gbWF0WzhdLCAgaiA9IG1hdFs5XSwgIGsgPSBtYXRbMTBdLCBsID0gbWF0WzExXSxcclxuICAgICAgICAgICAgbSA9IG1hdFsxMl0sIG4gPSBtYXRbMTNdLCBvID0gbWF0WzE0XSwgcCA9IG1hdFsxNV07XHJcbiAgICAgICAgbGV0IHggPSB2ZWNbMF0sIHkgPSB2ZWNbMV0sIHogPSB2ZWNbMl0sIHcgPSB2ZWNbM107XHJcbiAgICAgICAgbGV0IG91dCA9IFtdO1xyXG4gICAgICAgIG91dFswXSA9IHggKiBhICsgeSAqIGUgKyB6ICogaSArIHcgKiBtO1xyXG4gICAgICAgIG91dFsxXSA9IHggKiBiICsgeSAqIGYgKyB6ICogaiArIHcgKiBuO1xyXG4gICAgICAgIG91dFsyXSA9IHggKiBjICsgeSAqIGcgKyB6ICogayArIHcgKiBvO1xyXG4gICAgICAgIG91dFszXSA9IHggKiBkICsgeSAqIGggKyB6ICogbCArIHcgKiBwO1xyXG4gICAgICAgIHZlYyA9IG91dDtcclxuICAgICAgICByZXR1cm4gb3V0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqvjg6Hjg6njga7jg5fjg63jg5Hjg4bjgqPjgavnm7jlvZPjgZnjgovmg4XloLHjgpLlj5fjgZHlj5bjgorooYzliJfjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gcG9zaXRpb24gLSDjgqvjg6Hjg6njga7luqfmqJlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gY2VudGVyUG9pbnQgLSDjgqvjg6Hjg6njga7ms6joppbngrlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdXBEaXJlY3Rpb24gLSDjgqvjg6Hjg6njga7kuIrmlrnlkJFcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmb3Z5IC0g6KaW6YeO6KeSXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYXNwZWN0IC0g44Ki44K544Oa44Kv44OI5q+UXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbmVhciAtIOODi+OCouOCr+ODquODg+ODl+mdolxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZhciAtIOODleOCoeODvOOCr+ODquODg+ODl+mdolxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSB2bWF0IC0g44OT44Ol44O85bqn5qiZ5aSJ5o+b6KGM5YiX44Gu57WQ5p6c44KS5qC857SN44GZ44KL6KGM5YiXXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48TWF0ND59IHBtYXQgLSDpgI/oppbmipXlvbHluqfmqJnlpInmj5vooYzliJfjga7ntZDmnpzjgpLmoLzntI3jgZnjgovooYzliJdcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gZGVzdCAtIOODk+ODpeODvCB4IOmAj+imluaKleW9seWkieaPm+ihjOWIl+OBrue1kOaenOOCkuagvOe0jeOBmeOCi+ihjOWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdnBGcm9tQ2FtZXJhUHJvcGVydHkocG9zaXRpb24sIGNlbnRlclBvaW50LCB1cERpcmVjdGlvbiwgZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHZtYXQsIHBtYXQsIGRlc3Qpe1xyXG4gICAgICAgIE1hdDQubG9va0F0KHBvc2l0aW9uLCBjZW50ZXJQb2ludCwgdXBEaXJlY3Rpb24sIHZtYXQpO1xyXG4gICAgICAgIE1hdDQucGVyc3BlY3RpdmUoZm92eSwgYXNwZWN0LCBuZWFyLCBmYXIsIHBtYXQpO1xyXG4gICAgICAgIE1hdDQubXVsdGlwbHkocG1hdCwgdm1hdCwgZGVzdCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIE1WUCDooYzliJfjgavnm7jlvZPjgZnjgovooYzliJfjgpLlj5fjgZHlj5bjgorjg5njgq/jg4jjg6vjgpLlpInmj5vjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxNYXQ0Pn0gbWF0IC0gTVZQIOihjOWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gdmVjIC0gTVZQIOihjOWIl+OBqOS5l+eul+OBmeOCi+ODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0g44OT44Ol44O844Od44O844OI44Gu5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g44OT44Ol44O844Od44O844OI44Gu6auY44GVXHJcbiAgICAgKiBAcmV0dXJuIHtBcnJheS48bnVtYmVyPn0g57WQ5p6c44Gu44OZ44Kv44OI44Or77yIMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6vvvIlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNjcmVlblBvc2l0aW9uRnJvbU12cChtYXQsIHZlYywgd2lkdGgsIGhlaWdodCl7XHJcbiAgICAgICAgbGV0IGhhbGZXaWR0aCA9IHdpZHRoICogMC41O1xyXG4gICAgICAgIGxldCBoYWxmSGVpZ2h0ID0gaGVpZ2h0ICogMC41O1xyXG4gICAgICAgIGxldCB2ID0gTWF0NC50b1ZlY0lWKG1hdCwgW3ZlY1swXSwgdmVjWzFdLCB2ZWNbMl0sIDEuMF0pO1xyXG4gICAgICAgIGlmKHZbM10gPD0gMC4wKXtyZXR1cm4gW05hTiwgTmFOXTt9XHJcbiAgICAgICAgdlswXSAvPSB2WzNdOyB2WzFdIC89IHZbM107IHZbMl0gLz0gdlszXTtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICBoYWxmV2lkdGggKyB2WzBdICogaGFsZldpZHRoLFxyXG4gICAgICAgICAgICBoYWxmSGVpZ2h0IC0gdlsxXSAqIGhhbGZIZWlnaHRcclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICogVmVjM1xyXG4gKiBAY2xhc3MgVmVjM1xyXG4gKi9cclxuY2xhc3MgVmVjMyB7XHJcbiAgICAvKipcclxuICAgICAqIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44Or44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXl9IOODmeOCr+ODiOODq+agvOe0jeeUqOOBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3JlYXRlKCl7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoMyk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODmeOCr+ODiOODq+OBrumVt+OBle+8iOWkp+OBjeOBle+8ieOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2IC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44OZ44Kv44OI44Or44Gu6ZW344GV77yI5aSn44GN44GV77yJXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsZW4odil7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh2WzBdICogdlswXSArIHZbMV0gKiB2WzFdICsgdlsyXSAqIHZbMl0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruW6p+aome+8iOWni+eCueODu+e1gueCue+8ieOCkue1kOOBtuODmeOCr+ODiOODq+OCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MCAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk5aeL54K55bqn5qiZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYxIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTntYLngrnluqfmqJlcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMz59IOimlueCueOBqOe1gueCueOCkue1kOOBtuODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGlzdGFuY2UodjAsIHYxKXtcclxuICAgICAgICBsZXQgbiA9IFZlYzMuY3JlYXRlKCk7XHJcbiAgICAgICAgblswXSA9IHYxWzBdIC0gdjBbMF07XHJcbiAgICAgICAgblsxXSA9IHYxWzFdIC0gdjBbMV07XHJcbiAgICAgICAgblsyXSA9IHYxWzJdIC0gdjBbMl07XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODmeOCr+ODiOODq+OCkuato+imj+WMluOBl+OBn+e1kOaenOOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2IC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMz59IOato+imj+WMluOBl+OBn+ODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKHYpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgbCA9IFZlYzMubGVuKHYpO1xyXG4gICAgICAgIGlmKGwgPiAwKXtcclxuICAgICAgICAgICAgbGV0IGUgPSAxLjAgLyBsO1xyXG4gICAgICAgICAgICBuWzBdID0gdlswXSAqIGU7XHJcbiAgICAgICAgICAgIG5bMV0gPSB2WzFdICogZTtcclxuICAgICAgICAgICAgblsyXSA9IHZbMl0gKiBlO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBuWzBdID0gMC4wO1xyXG4gICAgICAgICAgICBuWzFdID0gMC4wO1xyXG4gICAgICAgICAgICBuWzJdID0gMC4wO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbjtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7jg5njgq/jg4jjg6vjga7lhoXnqY3jga7ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjAgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MSAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtudW1iZXJ9IOWGheepjeOBrue1kOaenFxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZG90KHYwLCB2MSl7XHJcbiAgICAgICAgcmV0dXJuIHYwWzBdICogdjFbMF0gKyB2MFsxXSAqIHYxWzFdICsgdjBbMl0gKiB2MVsyXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7jg5njgq/jg4jjg6vjga7lpJbnqY3jga7ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjAgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MSAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSDlpJbnqY3jga7ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyb3NzKHYwLCB2MSl7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMzLmNyZWF0ZSgpO1xyXG4gICAgICAgIG5bMF0gPSB2MFsxXSAqIHYxWzJdIC0gdjBbMl0gKiB2MVsxXTtcclxuICAgICAgICBuWzFdID0gdjBbMl0gKiB2MVswXSAtIHYwWzBdICogdjFbMl07XHJcbiAgICAgICAgblsyXSA9IHYwWzBdICogdjFbMV0gLSB2MFsxXSAqIHYxWzBdO1xyXG4gICAgICAgIHJldHVybiBuO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAzIOOBpOOBruODmeOCr+ODiOODq+OBi+OCiemdouazlee3muOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzM+fSB2MCAtIDMg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMz59IHYxIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMzPn0gdjIgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxWZWMzPn0g6Z2i5rOV57ea44OZ44Kv44OI44OrXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBmYWNlTm9ybWFsKHYwLCB2MSwgdjIpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMy5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgdmVjMSA9IFt2MVswXSAtIHYwWzBdLCB2MVsxXSAtIHYwWzFdLCB2MVsyXSAtIHYwWzJdXTtcclxuICAgICAgICBsZXQgdmVjMiA9IFt2MlswXSAtIHYwWzBdLCB2MlsxXSAtIHYwWzFdLCB2MlsyXSAtIHYwWzJdXTtcclxuICAgICAgICBuWzBdID0gdmVjMVsxXSAqIHZlYzJbMl0gLSB2ZWMxWzJdICogdmVjMlsxXTtcclxuICAgICAgICBuWzFdID0gdmVjMVsyXSAqIHZlYzJbMF0gLSB2ZWMxWzBdICogdmVjMlsyXTtcclxuICAgICAgICBuWzJdID0gdmVjMVswXSAqIHZlYzJbMV0gLSB2ZWMxWzFdICogdmVjMlswXTtcclxuICAgICAgICByZXR1cm4gVmVjMy5ub3JtYWxpemUobik7XHJcbiAgICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBWZWMyXHJcbiAqIEBjbGFzcyBWZWMyXHJcbiAqL1xyXG5jbGFzcyBWZWMyIHtcclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6vjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0g44OZ44Kv44OI44Or5qC857SN55So44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSgyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44OZ44Kv44OI44Or44Gu6ZW344GV77yI5aSn44GN44GV77yJ44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDjg5njgq/jg4jjg6vjga7plbfjgZXvvIjlpKfjgY3jgZXvvIlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxlbih2KXtcclxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHZbMF0gKiB2WzBdICsgdlsxXSAqIHZbMV0pO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiAyIOOBpOOBruW6p+aome+8iOWni+eCueODu+e1gueCue+8ieOCkue1kOOBtuODmeOCr+ODiOODq+OCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2MCAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk5aeL54K55bqn5qiZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYxIC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTntYLngrnluqfmqJlcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMj59IOimlueCueOBqOe1gueCueOCkue1kOOBtuODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZGlzdGFuY2UodjAsIHYxKXtcclxuICAgICAgICBsZXQgbiA9IFZlYzIuY3JlYXRlKCk7XHJcbiAgICAgICAgblswXSA9IHYxWzBdIC0gdjBbMF07XHJcbiAgICAgICAgblsxXSA9IHYxWzFdIC0gdjBbMV07XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOODmeOCr+ODiOODq+OCkuato+imj+WMluOBl+OBn+e1kOaenOOCkui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2IC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48VmVjMj59IOato+imj+WMluOBl+OBn+ODmeOCr+ODiOODq1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKHYpe1xyXG4gICAgICAgIGxldCBuID0gVmVjMi5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgbCA9IFZlYzIubGVuKHYpO1xyXG4gICAgICAgIGlmKGwgPiAwKXtcclxuICAgICAgICAgICAgbGV0IGUgPSAxLjAgLyBsO1xyXG4gICAgICAgICAgICBuWzBdID0gdlswXSAqIGU7XHJcbiAgICAgICAgICAgIG5bMV0gPSB2WzFdICogZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG47XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu44OZ44Kv44OI44Or44Gu5YaF56mN44Gu57WQ5p6c44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48VmVjMj59IHYwIC0gMiDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdjEgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDlhoXnqY3jga7ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRvdCh2MCwgdjEpe1xyXG4gICAgICAgIHJldHVybiB2MFswXSAqIHYxWzBdICsgdjBbMV0gKiB2MVsxXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogMiDjgaTjga7jg5njgq/jg4jjg6vjga7lpJbnqY3jga7ntZDmnpzjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxWZWMyPn0gdjAgLSAyIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSB2MSAtIDIg44Gk44Gu6KaB57Sg44KS5oyB44Gk44OZ44Kv44OI44OrXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFZlYzI+fSDlpJbnqY3jga7ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNyb3NzKHYwLCB2MSl7XHJcbiAgICAgICAgbGV0IG4gPSBWZWMyLmNyZWF0ZSgpO1xyXG4gICAgICAgIHJldHVybiB2MFswXSAqIHYxWzFdIC0gdjBbMV0gKiB2MVswXTtcclxuICAgIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFF0blxyXG4gKiBAY2xhc3MgUXRuXHJcbiAqL1xyXG5jbGFzcyBRdG4ge1xyXG4gICAgLyoqXHJcbiAgICAgKiA0IOOBpOOBruimgee0oOOBi+OCieOBquOCi+OCr+OCqeODvOOCv+ODi+OCquODs+OBruODh+ODvOOCv+ani+mAoOOCkueUn+aIkOOBmeOCi++8iOiZmumDqCB4LCB5LCB6LCDlrp/pg6ggdyDjga7poIbluo/jgaflrprnvqnvvIlcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheX0g44Kv44Kp44O844K/44OL44Kq44Oz44OH44O844K/5qC857SN55So44Gu6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjcmVhdGUoKXtcclxuICAgICAgICByZXR1cm4gbmV3IEZsb2F0MzJBcnJheSg0KTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44Kv44Kp44O844K/44OL44Kq44Oz44KS5Yid5pyf5YyW44GZ44KL77yI5Y+C54Wn44Gr5rOo5oSP77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gZGVzdCAtIOWIneacn+WMluOBmeOCi+OCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHJldHVybiB7RmxvYXQzMkFycmF5LjxRdG4+fSDntZDmnpzjga7jgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGlkZW50aXR5KGRlc3Qpe1xyXG4gICAgICAgIGRlc3RbMF0gPSAwOyBkZXN0WzFdID0gMDsgZGVzdFsyXSA9IDA7IGRlc3RbM10gPSAxO1xyXG4gICAgICAgIHJldHVybiBkZXN0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiDlhbHlvbnlm5vlhYPmlbDjgpLnlJ/miJDjgZfjgabov5TjgZnvvIjlj4Lnhafjgavms6jmhI/jg7vmiLvjgorlgKTjgajjgZfjgabjgoLntZDmnpzjgpLov5TjgZnvvIlcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4gLSDlhYPjgajjgarjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48UXRuPn0g57WQ5p6c44Gu44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpbnZlcnNlKHF0biwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBRdG4uY3JlYXRlKCk7fVxyXG4gICAgICAgIG91dFswXSA9IC1xdG5bMF07XHJcbiAgICAgICAgb3V0WzFdID0gLXF0blsxXTtcclxuICAgICAgICBvdXRbMl0gPSAtcXRuWzJdO1xyXG4gICAgICAgIG91dFszXSA9ICBxdG5bM107XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog6Jma6YOo44KS5q2j6KaP5YyW44GX44Gm6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuIC0g5YWD44Go44Gq44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbm9ybWFsaXplKGRlc3Qpe1xyXG4gICAgICAgIGxldCB4ID0gZGVzdFswXSwgeSA9IGRlc3RbMV0sIHogPSBkZXN0WzJdO1xyXG4gICAgICAgIGxldCBsID0gTWF0aC5zcXJ0KHggKiB4ICsgeSAqIHkgKyB6ICogeik7XHJcbiAgICAgICAgaWYobCA9PT0gMCl7XHJcbiAgICAgICAgICAgIGRlc3RbMF0gPSAwO1xyXG4gICAgICAgICAgICBkZXN0WzFdID0gMDtcclxuICAgICAgICAgICAgZGVzdFsyXSA9IDA7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGwgPSAxIC8gbDtcclxuICAgICAgICAgICAgZGVzdFswXSA9IHggKiBsO1xyXG4gICAgICAgICAgICBkZXN0WzFdID0geSAqIGw7XHJcbiAgICAgICAgICAgIGRlc3RbMl0gPSB6ICogbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRlc3Q7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCr+OCqeODvOOCv+ODi+OCquODs+OCkuS5l+eul+OBl+OBn+e1kOaenOOCkui/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0bjAgLSDkuZfnrpfjgZXjgozjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBxdG4xIC0g5LmX566X44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgbXVsdGlwbHkocXRuMCwgcXRuMSwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBRdG4uY3JlYXRlKCk7fVxyXG4gICAgICAgIGxldCBheCA9IHF0bjBbMF0sIGF5ID0gcXRuMFsxXSwgYXogPSBxdG4wWzJdLCBhdyA9IHF0bjBbM107XHJcbiAgICAgICAgbGV0IGJ4ID0gcXRuMVswXSwgYnkgPSBxdG4xWzFdLCBieiA9IHF0bjFbMl0sIGJ3ID0gcXRuMVszXTtcclxuICAgICAgICBvdXRbMF0gPSBheCAqIGJ3ICsgYXcgKiBieCArIGF5ICogYnogLSBheiAqIGJ5O1xyXG4gICAgICAgIG91dFsxXSA9IGF5ICogYncgKyBhdyAqIGJ5ICsgYXogKiBieCAtIGF4ICogYno7XHJcbiAgICAgICAgb3V0WzJdID0gYXogKiBidyArIGF3ICogYnogKyBheCAqIGJ5IC0gYXkgKiBieDtcclxuICAgICAgICBvdXRbM10gPSBhdyAqIGJ3IC0gYXggKiBieCAtIGF5ICogYnkgLSBheiAqIGJ6O1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIOOCr+OCqeODvOOCv+ODi+OCquODs+OBq+Wbnui7ouOCkumBqeeUqOOBl+i/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFuZ2xlIC0g5Zue6Lui44GZ44KL6YeP77yI44Op44K444Ki44Oz77yJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBheGlzIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTou7jjg5njgq/jg4jjg6tcclxuICAgICAqIEBwYXJhbSB7RmxvYXQzMkFycmF5LjxRdG4+fSBbZGVzdF0gLSDntZDmnpzjgpLmoLzntI3jgZnjgovjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEByZXR1cm4ge0Zsb2F0MzJBcnJheS48UXRuPn0g57WQ5p6c44Gu44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyByb3RhdGUoYW5nbGUsIGF4aXMsIGRlc3Qpe1xyXG4gICAgICAgIGxldCBvdXQgPSBkZXN0O1xyXG4gICAgICAgIGlmKGRlc3QgPT0gbnVsbCl7b3V0ID0gUXRuLmNyZWF0ZSgpO31cclxuICAgICAgICBsZXQgYSA9IGF4aXNbMF0sIGIgPSBheGlzWzFdLCBjID0gYXhpc1syXTtcclxuICAgICAgICBsZXQgc3EgPSBNYXRoLnNxcnQoYXhpc1swXSAqIGF4aXNbMF0gKyBheGlzWzFdICogYXhpc1sxXSArIGF4aXNbMl0gKiBheGlzWzJdKTtcclxuICAgICAgICBpZihzcSAhPT0gMCl7XHJcbiAgICAgICAgICAgIGxldCBsID0gMSAvIHNxO1xyXG4gICAgICAgICAgICBhICo9IGw7XHJcbiAgICAgICAgICAgIGIgKj0gbDtcclxuICAgICAgICAgICAgYyAqPSBsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgcyA9IE1hdGguc2luKGFuZ2xlICogMC41KTtcclxuICAgICAgICBvdXRbMF0gPSBhICogcztcclxuICAgICAgICBvdXRbMV0gPSBiICogcztcclxuICAgICAgICBvdXRbMl0gPSBjICogcztcclxuICAgICAgICBvdXRbM10gPSBNYXRoLmNvcyhhbmdsZSAqIDAuNSk7XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICog44OZ44Kv44OI44Or44Gr44Kv44Kp44O844K/44OL44Kq44Oz44KS6YGp55So44GX6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSB2ZWMgLSAzIOOBpOOBruimgee0oOOCkuaMgeOBpOODmeOCr+ODiOODq1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0biAtIOOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gW2Rlc3RdIC0gMyDjgaTjga7opoHntKDjgpLmjIHjgaTjg5njgq/jg4jjg6tcclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSDntZDmnpzjga7jg5njgq/jg4jjg6tcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRvVmVjSUlJKHZlYywgcXRuLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IFswLjAsIDAuMCwgMC4wXTt9XHJcbiAgICAgICAgbGV0IHFwID0gUXRuLmNyZWF0ZSgpO1xyXG4gICAgICAgIGxldCBxcSA9IFF0bi5jcmVhdGUoKTtcclxuICAgICAgICBsZXQgcXIgPSBRdG4uY3JlYXRlKCk7XHJcbiAgICAgICAgUXRuLmludmVyc2UocXRuLCBxcik7XHJcbiAgICAgICAgcXBbMF0gPSB2ZWNbMF07XHJcbiAgICAgICAgcXBbMV0gPSB2ZWNbMV07XHJcbiAgICAgICAgcXBbMl0gPSB2ZWNbMl07XHJcbiAgICAgICAgUXRuLm11bHRpcGx5KHFyLCBxcCwgcXEpO1xyXG4gICAgICAgIFF0bi5tdWx0aXBseShxcSwgcXRuLCBxcik7XHJcbiAgICAgICAgb3V0WzBdID0gcXJbMF07XHJcbiAgICAgICAgb3V0WzFdID0gcXJbMV07XHJcbiAgICAgICAgb3V0WzJdID0gcXJbMl07XHJcbiAgICAgICAgcmV0dXJuIG91dDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogNHg0IOihjOWIl+OBq+OCr+OCqeODvOOCv+ODi+OCquODs+OCkumBqeeUqOOBl+i/lOOBme+8iOWPgueFp+OBq+azqOaEj+ODu+aIu+OCiuWApOOBqOOBl+OBpuOCgue1kOaenOOCkui/lOOBme+8iVxyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0biAtIOOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSBbZGVzdF0gLSA0eDQg6KGM5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPE1hdDQ+fSDntZDmnpzjga7ooYzliJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHRvTWF0SVYocXRuLCBkZXN0KXtcclxuICAgICAgICBsZXQgb3V0ID0gZGVzdDtcclxuICAgICAgICBpZihkZXN0ID09IG51bGwpe291dCA9IE1hdDQuY3JlYXRlKCk7fVxyXG4gICAgICAgIGxldCB4ID0gcXRuWzBdLCB5ID0gcXRuWzFdLCB6ID0gcXRuWzJdLCB3ID0gcXRuWzNdO1xyXG4gICAgICAgIGxldCB4MiA9IHggKyB4LCB5MiA9IHkgKyB5LCB6MiA9IHogKyB6O1xyXG4gICAgICAgIGxldCB4eCA9IHggKiB4MiwgeHkgPSB4ICogeTIsIHh6ID0geCAqIHoyO1xyXG4gICAgICAgIGxldCB5eSA9IHkgKiB5MiwgeXogPSB5ICogejIsIHp6ID0geiAqIHoyO1xyXG4gICAgICAgIGxldCB3eCA9IHcgKiB4Miwgd3kgPSB3ICogeTIsIHd6ID0gdyAqIHoyO1xyXG4gICAgICAgIG91dFswXSAgPSAxIC0gKHl5ICsgenopO1xyXG4gICAgICAgIG91dFsxXSAgPSB4eSAtIHd6O1xyXG4gICAgICAgIG91dFsyXSAgPSB4eiArIHd5O1xyXG4gICAgICAgIG91dFszXSAgPSAwO1xyXG4gICAgICAgIG91dFs0XSAgPSB4eSArIHd6O1xyXG4gICAgICAgIG91dFs1XSAgPSAxIC0gKHh4ICsgenopO1xyXG4gICAgICAgIG91dFs2XSAgPSB5eiAtIHd4O1xyXG4gICAgICAgIG91dFs3XSAgPSAwO1xyXG4gICAgICAgIG91dFs4XSAgPSB4eiAtIHd5O1xyXG4gICAgICAgIG91dFs5XSAgPSB5eiArIHd4O1xyXG4gICAgICAgIG91dFsxMF0gPSAxIC0gKHh4ICsgeXkpO1xyXG4gICAgICAgIG91dFsxMV0gPSAwO1xyXG4gICAgICAgIG91dFsxMl0gPSAwO1xyXG4gICAgICAgIG91dFsxM10gPSAwO1xyXG4gICAgICAgIG91dFsxNF0gPSAwO1xyXG4gICAgICAgIG91dFsxNV0gPSAxO1xyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIDIg44Gk44Gu44Kv44Kp44O844K/44OL44Kq44Oz44Gu55CD6Z2i57ea5b2i6KOc6ZaT44KS6KGM44Gj44Gf57WQ5p6c44KS6L+U44GZ77yI5Y+C54Wn44Gr5rOo5oSP44O75oi744KK5YCk44Go44GX44Gm44KC57WQ5p6c44KS6L+U44GZ77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gcXRuMCAtIOOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICogQHBhcmFtIHtGbG9hdDMyQXJyYXkuPFF0bj59IHF0bjEgLSDjgq/jgqnjg7zjgr/jg4vjgqrjg7NcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIC0g6KOc6ZaT5L+C5pWw77yIMC4wIOOBi+OCiSAxLjAg44Gn5oyH5a6a77yJXHJcbiAgICAgKiBAcGFyYW0ge0Zsb2F0MzJBcnJheS48UXRuPn0gW2Rlc3RdIC0g57WQ5p6c44KS5qC857SN44GZ44KL44Kv44Kp44O844K/44OL44Kq44OzXHJcbiAgICAgKiBAcmV0dXJuIHtGbG9hdDMyQXJyYXkuPFF0bj59IOe1kOaenOOBruOCr+OCqeODvOOCv+ODi+OCquODs1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgc2xlcnAocXRuMCwgcXRuMSwgdGltZSwgZGVzdCl7XHJcbiAgICAgICAgbGV0IG91dCA9IGRlc3Q7XHJcbiAgICAgICAgaWYoZGVzdCA9PSBudWxsKXtvdXQgPSBRdG4uY3JlYXRlKCk7fVxyXG4gICAgICAgIGxldCBodCA9IHF0bjBbMF0gKiBxdG4xWzBdICsgcXRuMFsxXSAqIHF0bjFbMV0gKyBxdG4wWzJdICogcXRuMVsyXSArIHF0bjBbM10gKiBxdG4xWzNdO1xyXG4gICAgICAgIGxldCBocyA9IDEuMCAtIGh0ICogaHQ7XHJcbiAgICAgICAgaWYoaHMgPD0gMC4wKXtcclxuICAgICAgICAgICAgb3V0WzBdID0gcXRuMFswXTtcclxuICAgICAgICAgICAgb3V0WzFdID0gcXRuMFsxXTtcclxuICAgICAgICAgICAgb3V0WzJdID0gcXRuMFsyXTtcclxuICAgICAgICAgICAgb3V0WzNdID0gcXRuMFszXTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgaHMgPSBNYXRoLnNxcnQoaHMpO1xyXG4gICAgICAgICAgICBpZihNYXRoLmFicyhocykgPCAwLjAwMDEpe1xyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gKHF0bjBbMF0gKiAwLjUgKyBxdG4xWzBdICogMC41KTtcclxuICAgICAgICAgICAgICAgIG91dFsxXSA9IChxdG4wWzFdICogMC41ICsgcXRuMVsxXSAqIDAuNSk7XHJcbiAgICAgICAgICAgICAgICBvdXRbMl0gPSAocXRuMFsyXSAqIDAuNSArIHF0bjFbMl0gKiAwLjUpO1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gKHF0bjBbM10gKiAwLjUgKyBxdG4xWzNdICogMC41KTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBsZXQgcGggPSBNYXRoLmFjb3MoaHQpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHB0ID0gcGggKiB0aW1lO1xyXG4gICAgICAgICAgICAgICAgbGV0IHQwID0gTWF0aC5zaW4ocGggLSBwdCkgLyBocztcclxuICAgICAgICAgICAgICAgIGxldCB0MSA9IE1hdGguc2luKHB0KSAvIGhzO1xyXG4gICAgICAgICAgICAgICAgb3V0WzBdID0gcXRuMFswXSAqIHQwICsgcXRuMVswXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgb3V0WzFdID0gcXRuMFsxXSAqIHQwICsgcXRuMVsxXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgb3V0WzJdID0gcXRuMFsyXSAqIHQwICsgcXRuMVsyXSAqIHQxO1xyXG4gICAgICAgICAgICAgICAgb3V0WzNdID0gcXRuMFszXSAqIHQwICsgcXRuMVszXSAqIHQxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBvdXQ7XHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vZ2wzTWF0aC5qcyIsIlxyXG4vKipcclxuICogZ2wzTWVzaFxyXG4gKiBAY2xhc3NcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIGdsM01lc2gge1xyXG4gICAgLyoqXHJcbiAgICAgKiDmnb/jg53jg6rjgrTjg7Pjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOadv+ODneODquOCtOODs+OBruS4gOi+uuOBruW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOadv+ODneODquOCtOODs+OBruS4gOi+uuOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgcGxhbmVEYXRhID0gZ2wzLk1lc2gucGxhbmUoMi4wLCAyLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHBsYW5lKHdpZHRoLCBoZWlnaHQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgdywgaDtcclxuICAgICAgICB3ID0gd2lkdGggLyAyO1xyXG4gICAgICAgIGggPSBoZWlnaHQgLyAyO1xyXG4gICAgICAgIGlmKGNvbG9yKXtcclxuICAgICAgICAgICAgdGMgPSBjb2xvcjtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgdGMgPSBbMS4wLCAxLjAsIDEuMCwgMS4wXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHBvcyA9IFtcclxuICAgICAgICAgICAgLXcsICBoLCAgMC4wLFxyXG4gICAgICAgICAgICAgdywgIGgsICAwLjAsXHJcbiAgICAgICAgICAgIC13LCAtaCwgIDAuMCxcclxuICAgICAgICAgICAgIHcsIC1oLCAgMC4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgbm9yID0gW1xyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgY29sID0gW1xyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgbGV0IHN0ICA9IFtcclxuICAgICAgICAgICAgMC4wLCAwLjAsXHJcbiAgICAgICAgICAgIDEuMCwgMC4wLFxyXG4gICAgICAgICAgICAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMS4wLCAxLjBcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBpZHggPSBbXHJcbiAgICAgICAgICAgIDAsIDEsIDIsXHJcbiAgICAgICAgICAgIDIsIDEsIDNcclxuICAgICAgICBdO1xyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOWGhu+8iFhZIOW5s+mdouWxlemWi++8ieOBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwbGl0IC0g5YaG44Gu5YaG5ZGo44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkIC0g5YaG44Gu5Y2K5b6EXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3mlxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSDpoILngrnjgqvjg6njg7xcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHRleENvb3JkIC0g44OG44Kv44K544OB44Oj5bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBpbmRleCAtIOmggueCueOCpOODs+ODh+ODg+OCr+OCue+8iGdsLlRSSUFOR0xFU++8iVxyXG4gICAgICogQGV4YW1wbGVcclxuICAgICAqIGxldCBjaXJjbGVEYXRhID0gZ2wzLk1lc2guY2lyY2xlKDY0LCAxLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGNpcmNsZShzcGxpdCwgcmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGogPSAwO1xyXG4gICAgICAgIGxldCBwb3MgPSBbXSwgbm9yID0gW10sXHJcbiAgICAgICAgICAgIGNvbCA9IFtdLCBzdCAgPSBbXSwgaWR4ID0gW107XHJcbiAgICAgICAgcG9zLnB1c2goMC4wLCAwLjAsIDAuMCk7XHJcbiAgICAgICAgbm9yLnB1c2goMC4wLCAwLjAsIDEuMCk7XHJcbiAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgIHN0LnB1c2goMC41LCAwLjUpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHNwbGl0OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyLjAgLyBzcGxpdCAqIGk7XHJcbiAgICAgICAgICAgIGxldCByeCA9IE1hdGguY29zKHIpO1xyXG4gICAgICAgICAgICBsZXQgcnkgPSBNYXRoLnNpbihyKTtcclxuICAgICAgICAgICAgcG9zLnB1c2gocnggKiByYWQsIHJ5ICogcmFkLCAwLjApO1xyXG4gICAgICAgICAgICBub3IucHVzaCgwLjAsIDAuMCwgMS4wKTtcclxuICAgICAgICAgICAgY29sLnB1c2goY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10pO1xyXG4gICAgICAgICAgICBzdC5wdXNoKChyeCArIDEuMCkgKiAwLjUsIDEuMCAtIChyeSArIDEuMCkgKiAwLjUpO1xyXG4gICAgICAgICAgICBpZihpID09PSBzcGxpdCAtIDEpe1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2goMCwgaiArIDEsIDEpO1xyXG4gICAgICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKDAsIGogKyAxLCBqICsgMik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKytqO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgq3jg6Xjg7zjg5bjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzaWRlIC0g5q2j56uL5pa55L2T44Gu5LiA6L6644Gu6ZW344GVXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIFJHQkEg44KSIDAuMCDjgYvjgokgMS4wIOOBruevhOWbsuOBp+aMh+WumuOBl+OBn+mFjeWIl1xyXG4gICAgICogQHJldHVybiB7b2JqZWN0fVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gcG9zaXRpb24gLSDpoILngrnluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IG5vcm1hbCAtIOmggueCueazlee3miDigLvjgq3jg6Xjg7zjg5bjga7kuK3lv4PjgYvjgonlkITpoILngrnjgavlkJHjgYvjgaPjgabkvLjjgbPjgovjg5njgq/jg4jjg6vjgarjga7jgafms6jmhI9cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgY3ViZURhdGEgPSBnbDMuTWVzaC5jdWJlKDIuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY3ViZShzaWRlLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGhzID0gc2lkZSAqIDAuNTtcclxuICAgICAgICBsZXQgcG9zID0gW1xyXG4gICAgICAgICAgICAtaHMsIC1ocywgIGhzLCAgaHMsIC1ocywgIGhzLCAgaHMsICBocywgIGhzLCAtaHMsICBocywgIGhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAtaHMsICBocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsIC1ocywgLWhzLFxyXG4gICAgICAgICAgICAtaHMsICBocywgLWhzLCAtaHMsICBocywgIGhzLCAgaHMsICBocywgIGhzLCAgaHMsICBocywgLWhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgLWhzLCAgaHMsIC1ocywgIGhzLCAtaHMsIC1ocywgIGhzLFxyXG4gICAgICAgICAgICAgaHMsIC1ocywgLWhzLCAgaHMsICBocywgLWhzLCAgaHMsICBocywgIGhzLCAgaHMsIC1ocywgIGhzLFxyXG4gICAgICAgICAgICAtaHMsIC1ocywgLWhzLCAtaHMsIC1ocywgIGhzLCAtaHMsICBocywgIGhzLCAtaHMsICBocywgLWhzXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgdiA9IDEuMCAvIE1hdGguc3FydCgzLjApO1xyXG4gICAgICAgIGxldCBub3IgPSBbXHJcbiAgICAgICAgICAgIC12LCAtdiwgIHYsICB2LCAtdiwgIHYsICB2LCAgdiwgIHYsIC12LCAgdiwgIHYsXHJcbiAgICAgICAgICAgIC12LCAtdiwgLXYsIC12LCAgdiwgLXYsICB2LCAgdiwgLXYsICB2LCAtdiwgLXYsXHJcbiAgICAgICAgICAgIC12LCAgdiwgLXYsIC12LCAgdiwgIHYsICB2LCAgdiwgIHYsICB2LCAgdiwgLXYsXHJcbiAgICAgICAgICAgIC12LCAtdiwgLXYsICB2LCAtdiwgLXYsICB2LCAtdiwgIHYsIC12LCAtdiwgIHYsXHJcbiAgICAgICAgICAgICB2LCAtdiwgLXYsICB2LCAgdiwgLXYsICB2LCAgdiwgIHYsICB2LCAtdiwgIHYsXHJcbiAgICAgICAgICAgIC12LCAtdiwgLXYsIC12LCAtdiwgIHYsIC12LCAgdiwgIHYsIC12LCAgdiwgLXZcclxuICAgICAgICBdO1xyXG4gICAgICAgIGxldCBjb2wgPSBbXTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgcG9zLmxlbmd0aCAvIDM7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHN0ID0gW1xyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wLFxyXG4gICAgICAgICAgICAwLjAsIDAuMCwgMS4wLCAwLjAsIDEuMCwgMS4wLCAwLjAsIDEuMCxcclxuICAgICAgICAgICAgMC4wLCAwLjAsIDEuMCwgMC4wLCAxLjAsIDEuMCwgMC4wLCAxLjAsXHJcbiAgICAgICAgICAgIDAuMCwgMC4wLCAxLjAsIDAuMCwgMS4wLCAxLjAsIDAuMCwgMS4wXHJcbiAgICAgICAgXTtcclxuICAgICAgICBsZXQgaWR4ID0gW1xyXG4gICAgICAgICAgICAgMCwgIDEsICAyLCAgMCwgIDIsICAzLFxyXG4gICAgICAgICAgICAgNCwgIDUsICA2LCAgNCwgIDYsICA3LFxyXG4gICAgICAgICAgICAgOCwgIDksIDEwLCAgOCwgMTAsIDExLFxyXG4gICAgICAgICAgICAxMiwgMTMsIDE0LCAxMiwgMTQsIDE1LFxyXG4gICAgICAgICAgICAxNiwgMTcsIDE4LCAxNiwgMTgsIDE5LFxyXG4gICAgICAgICAgICAyMCwgMjEsIDIyLCAyMCwgMjIsIDIzXHJcbiAgICAgICAgXTtcclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDkuInop5LpjJDjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGxpdCAtIOW6lemdouWGhuOBruWGhuWRqOOBruWIhuWJsuaVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZCAtIOW6lemdouWGhuOBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOS4ieinkumMkOOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgY29uZURhdGEgPSBnbDMuTWVzaC5jb25lKDY0LCAxLjAsIDIuMCwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgY29uZShzcGxpdCwgcmFkLCBoZWlnaHQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgaiA9IDA7XHJcbiAgICAgICAgbGV0IGggPSBoZWlnaHQgLyAyLjA7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBwb3MucHVzaCgwLjAsIC1oLCAwLjApO1xyXG4gICAgICAgIG5vci5wdXNoKDAuMCwgLTEuMCwgMC4wKTtcclxuICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgc3QucHVzaCgwLjUsIDAuNSk7XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDw9IHNwbGl0OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgKiAyLjAgLyBzcGxpdCAqIGk7XHJcbiAgICAgICAgICAgIGxldCByeCA9IE1hdGguY29zKHIpO1xyXG4gICAgICAgICAgICBsZXQgcnogPSBNYXRoLnNpbihyKTtcclxuICAgICAgICAgICAgcG9zLnB1c2goXHJcbiAgICAgICAgICAgICAgICByeCAqIHJhZCwgLWgsIHJ6ICogcmFkLFxyXG4gICAgICAgICAgICAgICAgcnggKiByYWQsIC1oLCByeiAqIHJhZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBub3IucHVzaChcclxuICAgICAgICAgICAgICAgIDAuMCwgLTEuMCwgMC4wLFxyXG4gICAgICAgICAgICAgICAgcngsIDAuMCwgcnpcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29sLnB1c2goXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIHN0LnB1c2goXHJcbiAgICAgICAgICAgICAgICAocnggKyAxLjApICogMC41LCAxLjAgLSAocnogKyAxLjApICogMC41LFxyXG4gICAgICAgICAgICAgICAgKHJ4ICsgMS4wKSAqIDAuNSwgMS4wIC0gKHJ6ICsgMS4wKSAqIDAuNVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZihpICE9PSBzcGxpdCl7XHJcbiAgICAgICAgICAgICAgICBpZHgucHVzaCgwLCBqICsgMSwgaiArIDMpO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2goaiArIDQsIGogKyAyLCBzcGxpdCAqIDIgKyAzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBqICs9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBvcy5wdXNoKDAuMCwgaCwgMC4wKTtcclxuICAgICAgICBub3IucHVzaCgwLjAsIDEuMCwgMC4wKTtcclxuICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgc3QucHVzaCgwLjUsIDAuNSk7XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog5YaG5p+x44Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BsaXQgLSDlhobmn7Hjga7lhoblkajjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3BSYWQgLSDlhobmn7Hjga7lpKnpnaLjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBib3R0b21SYWQgLSDlhobmn7Hjga7lupXpnaLjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDlhobmn7Hjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IGN5bGluZGVyRGF0YSA9IGdsMy5NZXNoLmN5bGluZGVyKDY0LCAwLjUsIDEuMCwgMi4wLCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBjeWxpbmRlcihzcGxpdCwgdG9wUmFkLCBib3R0b21SYWQsIGhlaWdodCwgY29sb3Ipe1xyXG4gICAgICAgIGxldCBpLCBqID0gMjtcclxuICAgICAgICBsZXQgaCA9IGhlaWdodCAvIDIuMDtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIHBvcy5wdXNoKDAuMCwgaCwgMC4wLCAwLjAsIC1oLCAwLjAsKTtcclxuICAgICAgICBub3IucHVzaCgwLjAsIDEuMCwgMC4wLCAwLjAsIC0xLjAsIDAuMCk7XHJcbiAgICAgICAgY29sLnB1c2goXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgc3QucHVzaCgwLjUsIDAuNSwgMC41LCAwLjUpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSBzcGxpdDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHIgPSBNYXRoLlBJICogMi4wIC8gc3BsaXQgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnggPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJ6ID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIHBvcy5wdXNoKFxyXG4gICAgICAgICAgICAgICAgcnggKiB0b3BSYWQsICBoLCByeiAqIHRvcFJhZCxcclxuICAgICAgICAgICAgICAgIHJ4ICogdG9wUmFkLCAgaCwgcnogKiB0b3BSYWQsXHJcbiAgICAgICAgICAgICAgICByeCAqIGJvdHRvbVJhZCwgLWgsIHJ6ICogYm90dG9tUmFkLFxyXG4gICAgICAgICAgICAgICAgcnggKiBib3R0b21SYWQsIC1oLCByeiAqIGJvdHRvbVJhZFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBub3IucHVzaChcclxuICAgICAgICAgICAgICAgIDAuMCwgMS4wLCAwLjAsXHJcbiAgICAgICAgICAgICAgICByeCwgMC4wLCByeixcclxuICAgICAgICAgICAgICAgIDAuMCwgLTEuMCwgMC4wLFxyXG4gICAgICAgICAgICAgICAgcngsIDAuMCwgcnpcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgY29sLnB1c2goXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBzdC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgKHJ4ICsgMS4wKSAqIDAuNSwgMS4wIC0gKHJ6ICsgMS4wKSAqIDAuNSxcclxuICAgICAgICAgICAgICAgIDEuMCAtIGkgLyBzcGxpdCwgMC4wLFxyXG4gICAgICAgICAgICAgICAgKHJ4ICsgMS4wKSAqIDAuNSwgMS4wIC0gKHJ6ICsgMS4wKSAqIDAuNSxcclxuICAgICAgICAgICAgICAgIDEuMCAtIGkgLyBzcGxpdCwgMS4wXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmKGkgIT09IHNwbGl0KXtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKFxyXG4gICAgICAgICAgICAgICAgICAgIDAsIGogKyA0LCBqLFxyXG4gICAgICAgICAgICAgICAgICAgIDEsIGogKyAyLCBqICsgNixcclxuICAgICAgICAgICAgICAgICAgICBqICsgNSwgaiArIDcsIGogKyAxLFxyXG4gICAgICAgICAgICAgICAgICAgIGogKyAxLCBqICsgNywgaiArIDNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaiArPSA0O1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge3Bvc2l0aW9uOiBwb3MsIG5vcm1hbDogbm9yLCBjb2xvcjogY29sLCB0ZXhDb29yZDogc3QsIGluZGV4OiBpZHh9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnkIPkvZPjga7poILngrnmg4XloLHjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByb3cgLSDnkIPjga7nuKbmlrnlkJHvvIjnt6/luqbmlrnlkJHvvInjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2x1bW4gLSDnkIPjga7mqKrmlrnlkJHvvIjntYzluqbmlrnlkJHvvInjga7liIblibLmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWQgLSDnkIPjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IHNwaGVyZURhdGEgPSBnbDMuTWVzaC5zcGhlcmUoNjQsIDY0LCAxLjAsIFsxLjAsIDEuMCwgMS4wLCAxLjBdKTtcclxuICAgICAqL1xyXG4gICAgc3RhdGljIHNwaGVyZShyb3csIGNvbHVtbiwgcmFkLCBjb2xvcil7XHJcbiAgICAgICAgbGV0IGksIGo7XHJcbiAgICAgICAgbGV0IHBvcyA9IFtdLCBub3IgPSBbXSxcclxuICAgICAgICAgICAgY29sID0gW10sIHN0ICA9IFtdLCBpZHggPSBbXTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPD0gcm93OyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgciA9IE1hdGguUEkgLyByb3cgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnkgPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJyID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8PSBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHggPSByciAqIHJhZCAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCB0eSA9IHJ5ICogcmFkO1xyXG4gICAgICAgICAgICAgICAgbGV0IHR6ID0gcnIgKiByYWQgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgcG9zLnB1c2godHgsIHR5LCB0eik7XHJcbiAgICAgICAgICAgICAgICBub3IucHVzaChyeCwgcnksIHJ6KTtcclxuICAgICAgICAgICAgICAgIGNvbC5wdXNoKGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdKTtcclxuICAgICAgICAgICAgICAgIHN0LnB1c2goMSAtIDEgLyBjb2x1bW4gKiBqLCAxIC8gcm93ICogaSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgcm93OyBpKyspe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IChjb2x1bW4gKyAxKSAqIGkgKyBqO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociwgciArIDEsIHIgKyBjb2x1bW4gKyAyKTtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKHIsIHIgKyBjb2x1bW4gKyAyLCByICsgY29sdW1uICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OI44O844Op44K544Gu6aCC54K55oOF5aCx44KS55Sf5oiQ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcm93IC0g6Lyq44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sdW1uIC0g44OR44Kk44OX5pat6Z2i44Gu5YiG5Ymy5pWwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXJhZCAtIOODkeOCpOODl+aWremdouOBruWNiuW+hFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG9yYWQgLSDjg5HjgqTjg5flhajkvZPjga7ljYrlvoRcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0gUkdCQSDjgpIgMC4wIOOBi+OCiSAxLjAg44Gu56+E5Zuy44Gn5oyH5a6a44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBwb3NpdGlvbiAtIOmggueCueW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gbm9ybWFsIC0g6aCC54K55rOV57eaXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOmggueCueOCq+ODqeODvFxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gdGV4Q29vcmQgLSDjg4bjgq/jgrnjg4Hjg6PluqfmqJlcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGluZGV4IC0g6aCC54K544Kk44Oz44OH44OD44Kv44K577yIZ2wuVFJJQU5HTEVT77yJXHJcbiAgICAgKiBAZXhhbXBsZVxyXG4gICAgICogbGV0IHRvcnVzRGF0YSA9IGdsMy5NZXNoLnRvcnVzKDY0LCA2NCwgMC4yNSwgMC43NSwgWzEuMCwgMS4wLCAxLjAsIDEuMF0pO1xyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdG9ydXMocm93LCBjb2x1bW4sIGlyYWQsIG9yYWQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgajtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8PSByb3c7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCByID0gTWF0aC5QSSAqIDIgLyByb3cgKiBpO1xyXG4gICAgICAgICAgICBsZXQgcnIgPSBNYXRoLmNvcyhyKTtcclxuICAgICAgICAgICAgbGV0IHJ5ID0gTWF0aC5zaW4ocik7XHJcbiAgICAgICAgICAgIGZvcihqID0gMDsgaiA8PSBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHIgPSBNYXRoLlBJICogMiAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHggPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLmNvcyh0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHkgPSByeSAqIGlyYWQ7XHJcbiAgICAgICAgICAgICAgICBsZXQgdHogPSAocnIgKiBpcmFkICsgb3JhZCkgKiBNYXRoLnNpbih0cik7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnggPSByciAqIE1hdGguY29zKHRyKTtcclxuICAgICAgICAgICAgICAgIGxldCByeiA9IHJyICogTWF0aC5zaW4odHIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHJzID0gMSAvIGNvbHVtbiAqIGo7XHJcbiAgICAgICAgICAgICAgICBsZXQgcnQgPSAxIC8gcm93ICogaSArIDAuNTtcclxuICAgICAgICAgICAgICAgIGlmKHJ0ID4gMS4wKXtydCAtPSAxLjA7fVxyXG4gICAgICAgICAgICAgICAgcnQgPSAxLjAgLSBydDtcclxuICAgICAgICAgICAgICAgIHBvcy5wdXNoKHR4LCB0eSwgdHopO1xyXG4gICAgICAgICAgICAgICAgbm9yLnB1c2gocngsIHJ5LCByeik7XHJcbiAgICAgICAgICAgICAgICBjb2wucHVzaChjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgICAgICAgICBzdC5wdXNoKHJzLCBydCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKGkgPSAwOyBpIDwgcm93OyBpKyspe1xyXG4gICAgICAgICAgICBmb3IoaiA9IDA7IGogPCBjb2x1bW47IGorKyl7XHJcbiAgICAgICAgICAgICAgICBsZXQgciA9IChjb2x1bW4gKyAxKSAqIGkgKyBqO1xyXG4gICAgICAgICAgICAgICAgaWR4LnB1c2gociwgciArIGNvbHVtbiArIDEsIHIgKyAxKTtcclxuICAgICAgICAgICAgICAgIGlkeC5wdXNoKHIgKyBjb2x1bW4gKyAxLCByICsgY29sdW1uICsgMiwgciArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7cG9zaXRpb246IHBvcywgbm9ybWFsOiBub3IsIGNvbG9yOiBjb2wsIHRleENvb3JkOiBzdCwgaW5kZXg6IGlkeH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOato+S6jOWNgemdouS9k+OBrumggueCueaDheWgseOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZCAtIOOCteOCpOOCuu+8iOm7hOmHkeavlOOBq+WvvuOBmeOCi+avlOeOh++8iVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gY29sb3IgLSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgafmjIflrprjgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge29iamVjdH1cclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IHBvc2l0aW9uIC0g6aCC54K55bqn5qiZXHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSBub3JtYWwgLSDpoILngrnms5Xnt5pcclxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXkuPG51bWJlcj59IGNvbG9yIC0g6aCC54K544Kr44Op44O8XHJcbiAgICAgKiBAcHJvcGVydHkge0FycmF5LjxudW1iZXI+fSB0ZXhDb29yZCAtIOODhuOCr+OCueODgeODo+W6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtBcnJheS48bnVtYmVyPn0gaW5kZXggLSDpoILngrnjgqTjg7Pjg4fjg4Pjgq/jgrnvvIhnbC5UUklBTkdMRVPvvIlcclxuICAgICAqIEBleGFtcGxlXHJcbiAgICAgKiBsZXQgaWNvc2FEYXRhID0gZ2wzLk1lc2guaWNvc2FoZWRyb24oMS4wLCBbMS4wLCAxLjAsIDEuMCwgMS4wXSk7XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBpY29zYWhlZHJvbihyYWQsIGNvbG9yKXtcclxuICAgICAgICBsZXQgaSwgajtcclxuICAgICAgICBsZXQgcG9zID0gW10sIG5vciA9IFtdLFxyXG4gICAgICAgICAgICBjb2wgPSBbXSwgc3QgID0gW10sIGlkeCA9IFtdO1xyXG4gICAgICAgIGxldCBjID0gKDEuMCArIE1hdGguc3FydCg1LjApKSAvIDIuMDtcclxuICAgICAgICBsZXQgdCA9IGMgKiByYWQ7XHJcbiAgICAgICAgbGV0IGwgPSBNYXRoLnNxcnQoMS4wICsgYyAqIGMpO1xyXG4gICAgICAgIGxldCByID0gWzEuMCAvIGwsIGMgLyBsXTtcclxuICAgICAgICBwb3MgPSBbXHJcbiAgICAgICAgICAgIC1yYWQsICAgIHQsICAwLjAsICByYWQsICAgIHQsICAwLjAsIC1yYWQsICAgLXQsICAwLjAsICByYWQsICAgLXQsICAwLjAsXHJcbiAgICAgICAgICAgICAwLjAsIC1yYWQsICAgIHQsICAwLjAsICByYWQsICAgIHQsICAwLjAsIC1yYWQsICAgLXQsICAwLjAsICByYWQsICAgLXQsXHJcbiAgICAgICAgICAgICAgIHQsICAwLjAsIC1yYWQsICAgIHQsICAwLjAsICByYWQsICAgLXQsICAwLjAsIC1yYWQsICAgLXQsICAwLjAsICByYWRcclxuICAgICAgICBdO1xyXG4gICAgICAgIG5vciA9IFtcclxuICAgICAgICAgICAgLXJbMF0sICByWzFdLCAgIDAuMCwgIHJbMF0sICByWzFdLCAgIDAuMCwgLXJbMF0sIC1yWzFdLCAgIDAuMCwgIHJbMF0sIC1yWzFdLCAgIDAuMCxcclxuICAgICAgICAgICAgICAwLjAsIC1yWzBdLCAgclsxXSwgICAwLjAsICByWzBdLCAgclsxXSwgICAwLjAsIC1yWzBdLCAtclsxXSwgICAwLjAsICByWzBdLCAtclsxXSxcclxuICAgICAgICAgICAgIHJbMV0sICAgMC4wLCAtclswXSwgIHJbMV0sICAgMC4wLCAgclswXSwgLXJbMV0sICAgMC4wLCAtclswXSwgLXJbMV0sICAgMC4wLCAgclswXVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgY29sID0gW1xyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLFxyXG4gICAgICAgICAgICBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSwgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sXHJcbiAgICAgICAgICAgIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdLCBjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSxcclxuICAgICAgICAgICAgY29sb3JbMF0sIGNvbG9yWzFdLCBjb2xvclsyXSwgY29sb3JbM10sIGNvbG9yWzBdLCBjb2xvclsxXSwgY29sb3JbMl0sIGNvbG9yWzNdXHJcbiAgICAgICAgXTtcclxuICAgICAgICBmb3IobGV0IGkgPSAwLCBqID0gbm9yLmxlbmd0aDsgaSA8IGo7IGkgKz0gMyl7XHJcbiAgICAgICAgICAgIGxldCB1ID0gKE1hdGguYXRhbjIobm9yW2kgKyAyXSwgLW5vcltpXSkgKyBNYXRoLlBJKSAvIChNYXRoLlBJICogMi4wKTtcclxuICAgICAgICAgICAgbGV0IHYgPSAxLjAgLSAobm9yW2kgKyAxXSArIDEuMCkgLyAyLjA7XHJcbiAgICAgICAgICAgIHN0LnB1c2godSwgdik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlkeCA9IFtcclxuICAgICAgICAgICAgIDAsIDExLCAgNSwgIDAsICA1LCAgMSwgIDAsICAxLCAgNywgIDAsICA3LCAxMCwgIDAsIDEwLCAxMSxcclxuICAgICAgICAgICAgIDEsICA1LCAgOSwgIDUsIDExLCAgNCwgMTEsIDEwLCAgMiwgMTAsICA3LCAgNiwgIDcsICAxLCAgOCxcclxuICAgICAgICAgICAgIDMsICA5LCAgNCwgIDMsICA0LCAgMiwgIDMsICAyLCAgNiwgIDMsICA2LCAgOCwgIDMsICA4LCAgOSxcclxuICAgICAgICAgICAgIDQsICA5LCAgNSwgIDIsICA0LCAxMSwgIDYsICAyLCAxMCwgIDgsICA2LCAgNywgIDksICA4LCAgMVxyXG4gICAgICAgIF07XHJcbiAgICAgICAgcmV0dXJuIHtwb3NpdGlvbjogcG9zLCBub3JtYWw6IG5vciwgY29sb3I6IGNvbCwgdGV4Q29vcmQ6IHN0LCBpbmRleDogaWR4fVxyXG4gICAgfVxyXG59XHJcblxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9nbDNNZXNoLmpzIiwiXHJcbi8qKlxyXG4gKiBnbDNVdGlsXHJcbiAqIEBjbGFzcyBnbDNVdGlsXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBnbDNVdGlsIHtcclxuICAgIC8qKlxyXG4gICAgICogSFNWIOOCq+ODqeODvOOCkueUn+aIkOOBl+OBpumFjeWIl+OBp+i/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGggLSDoibLnm7hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzIC0g5b2p5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdiAtIOaYjuW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGEgLSDjgqLjg6vjg5XjgqFcclxuICAgICAqIEByZXR1cm4ge0FycmF5LjxudW1iZXI+fSBSR0JBIOOCkiAwLjAg44GL44KJIDEuMCDjga7nr4Tlm7LjgavmraPopo/ljJbjgZfjgZ/oibLjga7phY3liJdcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGhzdmEoaCwgcywgdiwgYSl7XHJcbiAgICAgICAgaWYocyA+IDEgfHwgdiA+IDEgfHwgYSA+IDEpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IHRoID0gaCAlIDM2MDtcclxuICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IodGggLyA2MCk7XHJcbiAgICAgICAgbGV0IGYgPSB0aCAvIDYwIC0gaTtcclxuICAgICAgICBsZXQgbSA9IHYgKiAoMSAtIHMpO1xyXG4gICAgICAgIGxldCBuID0gdiAqICgxIC0gcyAqIGYpO1xyXG4gICAgICAgIGxldCBrID0gdiAqICgxIC0gcyAqICgxIC0gZikpO1xyXG4gICAgICAgIGxldCBjb2xvciA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgIGlmKCFzID4gMCAmJiAhcyA8IDApe1xyXG4gICAgICAgICAgICBjb2xvci5wdXNoKHYsIHYsIHYsIGEpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCByID0gbmV3IEFycmF5KHYsIG4sIG0sIG0sIGssIHYpO1xyXG4gICAgICAgICAgICBsZXQgZyA9IG5ldyBBcnJheShrLCB2LCB2LCBuLCBtLCBtKTtcclxuICAgICAgICAgICAgbGV0IGIgPSBuZXcgQXJyYXkobSwgbSwgaywgdiwgdiwgbik7XHJcbiAgICAgICAgICAgIGNvbG9yLnB1c2gocltpXSwgZ1tpXSwgYltpXSwgYSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb2xvcjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCpOODvOOCuOODs+OCsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHQgLSAwLjAg44GL44KJIDEuMCDjga7lgKRcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44Kk44O844K444Oz44Kw44GX44Gf57WQ5p6cXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBlYXNlTGluZXIodCl7XHJcbiAgICAgICAgcmV0dXJuIHQgPCAwLjUgPyA0ICogdCAqIHQgKiB0IDogKHQgLSAxKSAqICgyICogdCAtIDIpICogKDIgKiB0IC0gMikgKyAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kk44O844K444Oz44KwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCAtIDAuMCDjgYvjgokgMS4wIOOBruWApFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDjgqTjg7zjgrjjg7PjgrDjgZfjgZ/ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGVhc2VPdXRDdWJpYyh0KXtcclxuICAgICAgICByZXR1cm4gKHQgPSB0IC8gMSAtIDEpICogdCAqIHQgKyAxO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Kk44O844K444Oz44KwXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdCAtIDAuMCDjgYvjgokgMS4wIOOBruWApFxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDjgqTjg7zjgrjjg7PjgrDjgZfjgZ/ntZDmnpxcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGVhc2VRdWludGljKHQpe1xyXG4gICAgICAgIGxldCB0cyA9ICh0ID0gdCAvIDEpICogdDtcclxuICAgICAgICBsZXQgdGMgPSB0cyAqIHQ7XHJcbiAgICAgICAgcmV0dXJuICh0YyAqIHRzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOW6puaVsOazleOBruinkuW6puOBi+OCieW8p+W6puazleOBruWApOOBuOWkieaPm+OBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlZyAtIOW6puaVsOazleOBruinkuW6plxyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDlvKfluqbms5Xjga7lgKRcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGRlZ1RvUmFkKGRlZyl7XHJcbiAgICAgICAgcmV0dXJuIChkZWcgJSAzNjApICogTWF0aC5QSSAvIDE4MDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi1pOmBk+WNiuW+hO+8iGtt77yJXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IEVBUlRIX1JBRElVUygpe3JldHVybiA2Mzc4LjEzNzt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDotaTpgZPlhoblkajvvIhrbe+8iVxyXG4gICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAqL1xyXG4gICAgc3RhdGljIGdldCBFQVJUSF9DSVJDVU0oKXtyZXR1cm4gZ2wzVXRpbC5FQVJUSF9SQURJVVMgKiBNYXRoLlBJICogMi4wO31cclxuXHJcbiAgICAvKipcclxuICAgICAqIOi1pOmBk+WGhuWRqOOBruWNiuWIhu+8iGtt77yJXHJcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgZ2V0IEVBUlRIX0hBTEZfQ0lSQ1VNKCl7cmV0dXJuIGdsM1V0aWwuRUFSVEhfUkFESVVTICogTWF0aC5QSTt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgovmnIDlpKfnt6/luqZcclxuICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQgRUFSVEhfTUFYX0xBVCgpe3JldHVybiA4NS4wNTExMjg3ODt9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDntYzluqbjgpLlhYPjgavjg6Hjg6vjgqvjg4jjg6vluqfmqJnjgpLov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqZcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KLIFhcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxvblRvTWVyKGxvbil7XHJcbiAgICAgICAgcmV0dXJuIGdsM1V0aWwuRUFSVEhfUkFESVVTICogZ2wzVXRpbC5kZWdUb1JhZChsb24pO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57ev5bqm44KS5YWD44Gr44Oh44Or44Kr44OI44Or5bqn5qiZ44KS6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGF0IC0g57ev5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW2ZsYXR0ZW49MF0gLSDmiYHlubPnjodcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g44Oh44Or44Kr44OI44Or5bqn5qiZ57O744Gr44GK44GR44KLIFlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxhdFRvTWVyKGxhdCwgZmxhdHRlbiA9IDApe1xyXG4gICAgICAgIGxldCBmbGF0dGVuaW5nID0gZmxhdHRlbjtcclxuICAgICAgICBpZihpc05hTihwYXJzZUZsb2F0KGZsYXR0ZW4pKSl7XHJcbiAgICAgICAgICAgIGZsYXR0ZW5pbmcgPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgY2xhbXAgPSAwLjAwMDE7XHJcbiAgICAgICAgaWYobGF0ID49IDkwIC0gY2xhbXApe1xyXG4gICAgICAgICAgICBsYXQgPSA5MCAtIGNsYW1wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihsYXQgPD0gLTkwICsgY2xhbXApe1xyXG4gICAgICAgICAgICBsYXQgPSAtOTAgKyBjbGFtcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHRlbXAgPSAoMSAtIGZsYXR0ZW5pbmcpO1xyXG4gICAgICAgIGxldCBlcyA9IDEuMCAtICh0ZW1wICogdGVtcCk7XHJcbiAgICAgICAgbGV0IGVjY2VudCA9IE1hdGguc3FydChlcyk7XHJcbiAgICAgICAgbGV0IHBoaSA9IGdsM1V0aWwuZGVnVG9SYWQobGF0KTtcclxuICAgICAgICBsZXQgc2lucGhpID0gTWF0aC5zaW4ocGhpKTtcclxuICAgICAgICBsZXQgY29uID0gZWNjZW50ICogc2lucGhpO1xyXG4gICAgICAgIGxldCBjb20gPSAwLjUgKiBlY2NlbnQ7XHJcbiAgICAgICAgY29uID0gTWF0aC5wb3coKDEuMCAtIGNvbikgLyAoMS4wICsgY29uKSwgY29tKTtcclxuICAgICAgICBsZXQgdHMgPSBNYXRoLnRhbigwLjUgKiAoTWF0aC5QSSAqIDAuNSAtIHBoaSkpIC8gY29uO1xyXG4gICAgICAgIHJldHVybiBnbDNVdGlsLkVBUlRIX1JBRElVUyAqIE1hdGgubG9nKHRzKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe3r+W6pue1jOW6puOCkuODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+WkieaPm+OBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvbiAtIOe1jOW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtmbGF0dGVuPTBdIC0g5omB5bmz546HXHJcbiAgICAgKiBAcmV0dXJuIHtvYmp9XHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0geCAtIOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCiyBYIOW6p+aomVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHkgLSDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgosgWSDluqfmqJlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxvbkxhdFRvTWVyKGxvbiwgbGF0LCBmbGF0dGVuID0gMCl7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgeDogZ2wzVXRpbC5sb25Ub01lcihsb24pLFxyXG4gICAgICAgICAgICB5OiBnbDNVdGlsLmxhdFRvTWVyKGxhdCwgZmxhdHRlbmluZylcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Oh44Or44Kr44OI44Or5bqn5qiZ44KS57ev5bqm57WM5bqm44Gr5aSJ5o+b44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCAtIOODoeODq+OCq+ODiOODq+W6p+aomeezu+OBq+OBiuOBkeOCiyBYIOW6p+aomVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgLSDjg6Hjg6vjgqvjg4jjg6vluqfmqJnns7vjgavjgYrjgZHjgosgWSDluqfmqJlcclxuICAgICAqIEByZXR1cm4ge29ian1cclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsb24gLSDntYzluqZcclxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBsYXQgLSDnt6/luqZcclxuICAgICAqL1xyXG4gICAgc3RhdGljIG1lclRvTG9uTGF0KHgsIHkpe1xyXG4gICAgICAgIGxldCBsb24gPSAoeCAvIGdsM1V0aWwuRUFSVEhfSEFMRl9DSVJDVU0pICogMTgwO1xyXG4gICAgICAgIGxldCBsYXQgPSAoeSAvIGdsM1V0aWwuRUFSVEhfSEFMRl9DSVJDVU0pICogMTgwO1xyXG4gICAgICAgIGxhdCA9IDE4MCAvIE1hdGguUEkgKiAoMiAqIE1hdGguYXRhbihNYXRoLmV4cChsYXQgKiBNYXRoLlBJIC8gMTgwKSkgLSBNYXRoLlBJIC8gMik7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbG9uOiBsb24sXHJcbiAgICAgICAgICAgIGxhdDogbGF0XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOe1jOW6puOBi+OCieOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCueOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvbiAtIOe1jOW6plxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpvb20gLSDjgrrjg7zjg6Djg6zjg5njg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g57WM5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsb25Ub1RpbGUobG9uLCB6b29tKXtcclxuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcigobG9uIC8gMTgwICsgMSkgKiBNYXRoLnBvdygyLCB6b29tKSAvIDIpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog57ev5bqm44GL44KJ44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K544KS5rGC44KB44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGF0IC0g57ev5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gem9vbSAtIOOCuuODvOODoOODrOODmeODq1xyXG4gICAgICogQHJldHVybiB7bnVtYmVyfSDnt6/luqbmlrnlkJHjga7jgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrlcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGxhdFRvVGlsZShsYXQsIHpvb20pe1xyXG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKCgtTWF0aC5sb2coTWF0aC50YW4oKDQ1ICsgbGF0IC8gMikgKiBNYXRoLlBJIC8gMTgwKSkgKyBNYXRoLlBJKSAqIE1hdGgucG93KDIsIHpvb20pIC8gKDIgKiBNYXRoLlBJKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnt6/luqbntYzluqbjgpLjgr/jgqTjg6vjgqTjg7Pjg4fjg4Pjgq/jgrnjgavlpInmj5vjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsb24gLSDntYzluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBsYXQgLSDnt6/luqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB6b29tIC0g44K644O844Og44Os44OZ44OrXHJcbiAgICAgKiBAcmV0dXJuIHtvYmp9XHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbG9uIC0g57WM5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gbGF0IC0g57ev5bqm5pa55ZCR44Gu44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBsb25MYXRUb1RpbGUobG9uLCBsYXQsIHpvb20pe1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGxvbjogZ2wzVXRpbC5sb25Ub1RpbGUobG9uLCB6b29tKSxcclxuICAgICAgICAgICAgbGF0OiBnbDNVdGlsLmxhdFRvVGlsZShsYXQsIHpvb20pXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCueOBi+OCiee1jOW6puOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxvbiAtIOe1jOW6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpvb20gLSDjgrrjg7zjg6Djg6zjg5njg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g57WM5bqmXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0aWxlVG9Mb24obG9uLCB6b29tKXtcclxuICAgICAgICByZXR1cm4gKGxvbiAvIE1hdGgucG93KDIsIHpvb20pKSAqIDM2MCAtIDE4MDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCueOBi+OCiee3r+W6puOCkuaxguOCgeOBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGxhdCAtIOe3r+W6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHpvb20gLSDjgrrjg7zjg6Djg6zjg5njg6tcclxuICAgICAqIEByZXR1cm4ge251bWJlcn0g57ev5bqmXHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyB0aWxlVG9MYXQobGF0LCB6b29tKXtcclxuICAgICAgICBsZXQgeSA9IChsYXQgLyBNYXRoLnBvdygyLCB6b29tKSkgKiAyICogTWF0aC5QSSAtIE1hdGguUEk7XHJcbiAgICAgICAgcmV0dXJuIDIgKiBNYXRoLmF0YW4oTWF0aC5wb3coTWF0aC5FLCAteSkpICogMTgwIC8gTWF0aC5QSSAtIDkwO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K/44Kk44Or44Kk44Oz44OH44OD44Kv44K544GL44KJ57ev5bqm57WM5bqm44KS5rGC44KB44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbG9uIC0g57WM5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbGF0IC0g57ev5bqmXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gem9vbSAtIOOCuuODvOODoOODrOODmeODq1xyXG4gICAgICogQHJldHVybiB7b2JqfVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxvbiAtIOe1jOW6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGxhdCAtIOe3r+W6puaWueWQkeOBruOCv+OCpOODq+OCpOODs+ODh+ODg+OCr+OCuVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgdGlsZVRvTG9uTGF0KGxvbiwgbGF0LCB6b29tKXtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBsb246IGdsM1V0aWwudGlsZVRvTG9uKGxvbiwgem9vbSksXHJcbiAgICAgICAgICAgIGxhdDogZ2wzVXRpbC50aWxlVG9MYXQobGF0LCB6b29tKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn1cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM1V0aWwuanMiLCJcclxuaW1wb3J0IGF1ZGlvIGZyb20gJy4vZ2wzQXVkaW8uanMnO1xyXG5pbXBvcnQgbWF0aCAgZnJvbSAnLi9nbDNNYXRoLmpzJztcclxuaW1wb3J0IG1lc2ggIGZyb20gJy4vZ2wzTWVzaC5qcyc7XHJcbmltcG9ydCB1dGlsICBmcm9tICcuL2dsM1V0aWwuanMnO1xyXG5pbXBvcnQgZ3VpICAgZnJvbSAnLi9nbDNHdWkuanMnO1xyXG5cclxuLyoqXHJcbiAqIGdsY3ViaWNcclxuICogQGNsYXNzIGdsM1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgZ2wzIHtcclxuICAgIC8qKlxyXG4gICAgICogQGNvbnN0cnVjdG9yXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdmVyc2lvblxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5WRVJTSU9OID0gJzAuMi4zJztcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwaSAqIDJcclxuICAgICAgICAgKiBAY29uc3RcclxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuUEkyID0gNi4yODMxODUzMDcxNzk1ODY0NzY5MjUyODY3NjY1NTkwMDU3NjtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBwaVxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5QSSA9IDMuMTQxNTkyNjUzNTg5NzkzMjM4NDYyNjQzMzgzMjc5NTAyODg7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGkgLyAyXHJcbiAgICAgICAgICogQGNvbnN0XHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlBJSCA9IDEuNTcwNzk2MzI2Nzk0ODk2NjE5MjMxMzIxNjkxNjM5NzUxNDQ7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogcGkgLyA0XHJcbiAgICAgICAgICogQGNvbnN0XHJcbiAgICAgICAgICogQHR5cGUge251bWJlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLlBJSDIgPSAwLjc4NTM5ODE2MzM5NzQ0ODMwOTYxNTY2MDg0NTgxOTg3NTcyO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsLk1BWF9DT01CSU5FRF9URVhUVVJFX0lNQUdFX1VOSVRTIOOCkuWIqeeUqOOBl+OBpuW+l+OCieOCjOOCi+ODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiOOBruacgOWkp+WIqeeUqOWPr+iDveaVsFxyXG4gICAgICAgICAqIEBjb25zdFxyXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5URVhUVVJFX1VOSVRfQ09VTlQgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbGN1YmljIOOBjOato+OBl+OBj+WIneacn+WMluOBleOCjOOBn+OBqeOBhuOBi+OBruODleODqeOCsFxyXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucmVhZHkgPSBmYWxzZTtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbGN1YmljIOOBqOe0kOS7mOOBhOOBpuOBhOOCiyBjYW52YXMgZWxlbWVudFxyXG4gICAgICAgICAqIEB0eXBlIHtIVE1MQ2FudmFzRWxlbWVudH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmNhbnZhcyA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2xjdWJpYyDjgajntJDku5jjgYTjgabjgYTjgosgY2FudmFzIOOBi+OCieWPluW+l+OBl+OBnyBXZWJHTCBSZW5kZXJpbmcgQ29udGV4dFxyXG4gICAgICAgICAqIEB0eXBlIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nbCA9IG51bGw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogV2ViR0wyUmVuZGVyaW5nQ29udGV4dCDjgajjgZfjgabliJ3mnJ/ljJbjgZfjgZ/jgYvjganjgYbjgYvjgpLooajjgZnnnJ/lgb3lgKRcclxuICAgICAgICAgKiBAdHlwZSB7Ym9vbH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmlzV2ViR0wyID0gZmFsc2U7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogY3ViaWMg44Go44GX44Gm44Gu44Ot44Kw5Ye65Yqb44KS44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2x9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pc0NvbnNvbGVPdXRwdXQgPSB0cnVlO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gj44Gm44GE44KL44OG44Kv44K544OB44Oj5qC857SN55So44Gu6YWN5YiXXHJcbiAgICAgICAgICogQHR5cGUge0FycmF5LjxXZWJHTFRleHR1cmU+fVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdlYkdMIOOBruaLoeW8teapn+iDveOCkuagvOe0jeOBmeOCi+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5leHQgPSBudWxsO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbDNBdWRpbyDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAdHlwZSB7Z2wzQXVkaW99XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5BdWRpbyA9IGF1ZGlvO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGdsM01lc2gg44Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5XHJcbiAgICAgICAgICogQHR5cGUge2dsM01lc2h9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5NZXNoID0gbWVzaDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBnbDNVdGlsIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtnbDNVdGlsfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuVXRpbCA9IHV0aWw7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2wzR3VpIOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICAgICAqIEB0eXBlIHtnbDNHdWl9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5HdWkgPSBuZXcgZ3VpKCk7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogZ2wzTWF0aCDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAgICAgKiBAdHlwZSB7Z2wzTWF0aH1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLk1hdGggPSBuZXcgbWF0aCgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2xjdWJpYyDjgpLliJ3mnJ/ljJbjgZnjgotcclxuICAgICAqIEBwYXJhbSB7SFRNTENhbnZhc0VsZW1lbnR8c3RyaW5nfSBjYW52YXMgLSBjYW52YXMgZWxlbWVudCDjgYsgY2FudmFzIOOBq+S7mOS4juOBleOCjOOBpuOBhOOCiyBJRCDmloflrZfliJdcclxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBpbml0T3B0aW9ucyAtIGNhbnZhcy5nZXRDb250ZXh0IOOBp+esrOS6jOW8leaVsOOBq+a4oeOBmeWIneacn+WMluaZguOCquODl+OCt+ODp+ODs1xyXG4gICAgICogQHBhcmFtIHtPYmplY3R9IGN1YmljT3B0aW9uc1xyXG4gICAgICogQHByb3BlcnR5IHtib29sfSB3ZWJnbDJNb2RlIC0gd2ViZ2wyIOOCkuacieWKueWMluOBmeOCi+WgtOWQiCB0cnVlXHJcbiAgICAgKiBAcHJvcGVydHkge2Jvb2x9IGNvbnNvbGVNZXNzYWdlIC0gY29uc29sZSDjgasgY3ViaWMg44Gu44Ot44Kw44KS5Ye65Yqb44GZ44KL44GL44Gp44GG44GLXHJcbiAgICAgKiBAcmV0dXJuIHtib29sZWFufSDliJ3mnJ/ljJbjgYzmraPjgZfjgY/ooYzjgo/jgozjgZ/jgYvjganjgYbjgYvjgpLooajjgZnnnJ/lgb3lgKRcclxuICAgICAqL1xyXG4gICAgaW5pdChjYW52YXMsIGluaXRPcHRpb25zLCBjdWJpY09wdGlvbnMpe1xyXG4gICAgICAgIGxldCBvcHQgPSBpbml0T3B0aW9ucyB8fCB7fTtcclxuICAgICAgICB0aGlzLnJlYWR5ID0gZmFsc2U7XHJcbiAgICAgICAgaWYoY2FudmFzID09IG51bGwpe3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgaWYoY2FudmFzIGluc3RhbmNlb2YgSFRNTENhbnZhc0VsZW1lbnQpe1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IGNhbnZhcztcclxuICAgICAgICB9ZWxzZSBpZihPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoY2FudmFzKSA9PT0gJ1tvYmplY3QgU3RyaW5nXScpe1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNhbnZhcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRoaXMuY2FudmFzID09IG51bGwpe3JldHVybiBmYWxzZTt9XHJcbiAgICAgICAgaWYoY3ViaWNPcHRpb25zICE9IG51bGwpe1xyXG4gICAgICAgICAgICBpZihjdWJpY09wdGlvbnMuaGFzT3duUHJvcGVydHkoJ3dlYmdsMk1vZGUnKSA9PT0gdHJ1ZSAmJiBjdWJpY09wdGlvbnMud2ViZ2wyTW9kZSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wyJywgb3B0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNXZWJHTDIgPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKGN1YmljT3B0aW9ucy5oYXNPd25Qcm9wZXJ0eSgnY29uc29sZU1lc3NhZ2UnKSA9PT0gdHJ1ZSAmJiBjdWJpY09wdGlvbnMuY29uc29sZU1lc3NhZ2UgIT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pc0NvbnNvbGVPdXRwdXQgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmdsID09IG51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLmdsID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnLCBvcHQpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCdleHBlcmltZW50YWwtd2ViZ2wnLCBvcHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmdsICE9IG51bGwpe1xyXG4gICAgICAgICAgICB0aGlzLnJlYWR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5URVhUVVJFX1VOSVRfQ09VTlQgPSB0aGlzLmdsLmdldFBhcmFtZXRlcih0aGlzLmdsLk1BWF9DT01CSU5FRF9URVhUVVJFX0lNQUdFX1VOSVRTKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlcyA9IG5ldyBBcnJheSh0aGlzLlRFWFRVUkVfVU5JVF9DT1VOVCk7XHJcbiAgICAgICAgICAgIHRoaXMuZXh0ID0ge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudEluZGV4VWludDogdGhpcy5nbC5nZXRFeHRlbnNpb24oJ09FU19lbGVtZW50X2luZGV4X3VpbnQnKSxcclxuICAgICAgICAgICAgICAgIHRleHR1cmVGbG9hdDogdGhpcy5nbC5nZXRFeHRlbnNpb24oJ09FU190ZXh0dXJlX2Zsb2F0JyksXHJcbiAgICAgICAgICAgICAgICB0ZXh0dXJlSGFsZkZsb2F0OiB0aGlzLmdsLmdldEV4dGVuc2lvbignT0VTX3RleHR1cmVfaGFsZl9mbG9hdCcpLFxyXG4gICAgICAgICAgICAgICAgZHJhd0J1ZmZlcnM6IHRoaXMuZ2wuZ2V0RXh0ZW5zaW9uKCdXRUJHTF9kcmF3X2J1ZmZlcnMnKVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyBnbGN1YmljLmpzICVj4peGJWMgOiB2ZXJzaW9uICVjJyArIHRoaXMuVkVSU0lPTiwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogY3JpbXNvbicsICcnLCAnY29sb3I6IHJveWFsYmx1ZScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnJlYWR5O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KS44Kv44Oq44Ki44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBjb2xvciAtIOOCr+ODquOCouOBmeOCi+iJsu+8iDAuMCB+IDEuMO+8iVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtkZXB0aF0gLSDjgq/jg6rjgqLjgZnjgovmt7HluqZcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbc3RlbmNpbF0gLSDjgq/jg6rjgqLjgZnjgovjgrnjg4bjg7Pjgrfjg6vlgKRcclxuICAgICAqL1xyXG4gICAgc2NlbmVDbGVhcihjb2xvciwgZGVwdGgsIHN0ZW5jaWwpe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgbGV0IGZsZyA9IGdsLkNPTE9SX0JVRkZFUl9CSVQ7XHJcbiAgICAgICAgZ2wuY2xlYXJDb2xvcihjb2xvclswXSwgY29sb3JbMV0sIGNvbG9yWzJdLCBjb2xvclszXSk7XHJcbiAgICAgICAgaWYoZGVwdGggIT0gbnVsbCl7XHJcbiAgICAgICAgICAgIGdsLmNsZWFyRGVwdGgoZGVwdGgpO1xyXG4gICAgICAgICAgICBmbGcgPSBmbGcgfCBnbC5ERVBUSF9CVUZGRVJfQklUO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihzdGVuY2lsICE9IG51bGwpe1xyXG4gICAgICAgICAgICBnbC5jbGVhclN0ZW5jaWwoc3RlbmNpbCk7XHJcbiAgICAgICAgICAgIGZsZyA9IGZsZyB8IGdsLlNURU5DSUxfQlVGRkVSX0JJVDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuY2xlYXIoZmxnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODk+ODpeODvOODneODvOODiOOCkuioreWumuOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFt4XSAtIHjvvIjlt6bnq6/ljp/ngrnvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbeV0gLSB577yI5LiL56uv5Y6f54K577yJXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3dpZHRoXSAtIOaoquOBruW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtoZWlnaHRdIC0g57im44Gu6auY44GVXHJcbiAgICAgKi9cclxuICAgIHNjZW5lVmlldyh4LCB5LCB3aWR0aCwgaGVpZ2h0KXtcclxuICAgICAgICBsZXQgWCA9IHggfHwgMDtcclxuICAgICAgICBsZXQgWSA9IHkgfHwgMDtcclxuICAgICAgICBsZXQgdyA9IHdpZHRoICB8fCB3aW5kb3cuaW5uZXJXaWR0aDtcclxuICAgICAgICBsZXQgaCA9IGhlaWdodCB8fCB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgdGhpcy5nbC52aWV3cG9ydChYLCBZLCB3LCBoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdsLmRyYXdBcnJheXMg44KS44Kz44O844Or44GZ44KL44Op44OD44OR44O8XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJpbWl0aXZlIC0g44OX44Oq44Of44OG44Kj44OW44K/44Kk44OXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmVydGV4Q291bnQgLSDmj4/nlLvjgZnjgovpoILngrnjga7lgIvmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb2Zmc2V0PTBdIC0g5o+P55S744GZ44KL6aCC54K544Gu6ZaL5aeL44Kq44OV44K744OD44OIXHJcbiAgICAgKi9cclxuICAgIGRyYXdBcnJheXMocHJpbWl0aXZlLCB2ZXJ0ZXhDb3VudCwgb2Zmc2V0ID0gMCl7XHJcbiAgICAgICAgdGhpcy5nbC5kcmF3QXJyYXlzKHByaW1pdGl2ZSwgb2Zmc2V0LCB2ZXJ0ZXhDb3VudCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnbC5kcmF3RWxlbWVudHMg44KS44Kz44O844Or44GZ44KL44Op44OD44OR44O8XHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcHJpbWl0aXZlIC0g44OX44Oq44Of44OG44Kj44OW44K/44Kk44OXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXhMZW5ndGggLSDmj4/nlLvjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgIvmlbBcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbb2Zmc2V0PTBdIC0g5o+P55S744GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu6ZaL5aeL44Kq44OV44K744OD44OIXHJcbiAgICAgKi9cclxuICAgIGRyYXdFbGVtZW50cyhwcmltaXRpdmUsIGluZGV4TGVuZ3RoLCBvZmZzZXQgPSAwKXtcclxuICAgICAgICB0aGlzLmdsLmRyYXdFbGVtZW50cyhwcmltaXRpdmUsIGluZGV4TGVuZ3RoLCB0aGlzLmdsLlVOU0lHTkVEX1NIT1JULCBvZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2wuZHJhd0VsZW1lbnRzIOOCkuOCs+ODvOODq+OBmeOCi+ODqeODg+ODkeODvO+8iGdsLlVOU0lHTkVEX0lOVO+8iSDigLvopoHmi6HlvLXmqZ/og73vvIhXZWJHTCAxLjDvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwcmltaXRpdmUgLSDjg5fjg6rjg5/jg4bjgqPjg5bjgr/jgqTjg5dcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleExlbmd0aCAtIOaPj+eUu+OBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBruWAi+aVsFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IFtvZmZzZXQ9MF0gLSDmj4/nlLvjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7plovlp4vjgqrjg5Xjgrvjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgZHJhd0VsZW1lbnRzSW50KHByaW1pdGl2ZSwgaW5kZXhMZW5ndGgsIG9mZnNldCA9IDApe1xyXG4gICAgICAgIHRoaXMuZ2wuZHJhd0VsZW1lbnRzKHByaW1pdGl2ZSwgaW5kZXhMZW5ndGgsIHRoaXMuZ2wuVU5TSUdORURfSU5ULCBvZmZzZXQpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVkJP77yIVmVydGV4IEJ1ZmZlciBPYmplY3TvvInjgpLnlJ/miJDjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGRhdGEgLSDpoILngrnmg4XloLHjgpLmoLzntI3jgZfjgZ/phY3liJdcclxuICAgICAqIEByZXR1cm4ge1dlYkdMQnVmZmVyfSDnlJ/miJDjgZfjgZ/poILngrnjg5Djg4Pjg5XjgqFcclxuICAgICAqL1xyXG4gICAgY3JlYXRlVmJvKGRhdGEpe1xyXG4gICAgICAgIGlmKGRhdGEgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgdmJvID0gdGhpcy5nbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIHZibyk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGRhdGEpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiB2Ym87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJQk/vvIhJbmRleCBCdWZmZXIgT2JqZWN077yJ44KS55Sf5oiQ44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBkYXRhIC0g44Kk44Oz44OH44OD44Kv44K55oOF5aCx44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTEJ1ZmZlcn0g55Sf5oiQ44GX44Gf44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44KhXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUlibyhkYXRhKXtcclxuICAgICAgICBpZihkYXRhID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGlibyA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGlibyk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBJbnQxNkFycmF5KGRhdGEpLCB0aGlzLmdsLlNUQVRJQ19EUkFXKTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRCdWZmZXIodGhpcy5nbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgcmV0dXJuIGlibztcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIElCT++8iEluZGV4IEJ1ZmZlciBPYmplY3TvvInjgpLnlJ/miJDjgZfjgabov5TjgZnvvIhnbC5VTlNJR05FRF9JTlTvvIkg4oC76KaB5ouh5by15qmf6IO977yIV2ViR0wgMS4w77yJXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBkYXRhIC0g44Kk44Oz44OH44OD44Kv44K55oOF5aCx44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTEJ1ZmZlcn0g55Sf5oiQ44GX44Gf44Kk44Oz44OH44OD44Kv44K544OQ44OD44OV44KhXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUlib0ludChkYXRhKXtcclxuICAgICAgICBpZihkYXRhID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGlibyA9IHRoaXMuZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGlibyk7XHJcbiAgICAgICAgdGhpcy5nbC5idWZmZXJEYXRhKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBVaW50MzJBcnJheShkYXRhKSwgdGhpcy5nbC5TVEFUSUNfRFJBVyk7XHJcbiAgICAgICAgdGhpcy5nbC5iaW5kQnVmZmVyKHRoaXMuZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHJldHVybiBpYm87XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5XjgqHjgqTjg6vjgpLlhYPjgavjg4bjgq/jgrnjg4Hjg6PjgpLnlJ/miJDjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzb3VyY2UgLSDjg5XjgqHjgqTjg6vjg5HjgrlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuSDigLvpnZ7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0g55S75YOP44Gu44Ot44O844OJ44GM5a6M5LqG44GX44OG44Kv44K544OB44Oj44KS55Sf5oiQ44GX44Gf5b6M44Gr5ZG844Gw44KM44KL44Kz44O844Or44OQ44OD44KvXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVRleHR1cmVGcm9tRmlsZShzb3VyY2UsIG51bWJlciwgY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKHNvdXJjZSA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICAgICAgbGV0IHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIG51bWJlcik7XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIHRleCk7XHJcbiAgICAgICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgaW1nKTtcclxuICAgICAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IHRleDtcclxuICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZmlsZSBsb2FkZWQ6ICVjJyArIHNvdXJjZSwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfMkQsIG51bGwpO1xyXG4gICAgICAgICAgICBpZihjYWxsYmFjayAhPSBudWxsKXtjYWxsYmFjayhudW1iZXIpO31cclxuICAgICAgICB9O1xyXG4gICAgICAgIGltZy5zcmMgPSBzb3VyY2U7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgqrjg5bjgrjjgqfjgq/jg4jjgpLlhYPjgavjg4bjgq/jgrnjg4Hjg6PjgpLnlJ/miJDjgZfjgabov5TjgZlcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3QgLSDjg63jg7zjg4nmuIjjgb/jga4gSW1hZ2Ug44Kq44OW44K444Kn44Kv44OI44KEIENhbnZhcyDjgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuSDigLvpnZ7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqL1xyXG4gICAgY3JlYXRlVGV4dHVyZUZyb21PYmplY3Qob2JqZWN0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKG9iamVjdCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgbGV0IHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIG51bWJlcik7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgdGV4KTtcclxuICAgICAgICBnbC50ZXhJbWFnZTJEKGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIG9iamVjdCk7XHJcbiAgICAgICAgZ2wuZ2VuZXJhdGVNaXBtYXAoZ2wuVEVYVFVSRV8yRCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSB0ZXg7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFXzJEO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgb2JqZWN0IGF0dGFjaGVkJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDnlLvlg4/jgpLlhYPjgavjgq3jg6Xjg7zjg5bjg57jg4Pjg5fjg4bjgq/jgrnjg4Hjg6PjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHNvdXJjZSAtIOODleOCoeOCpOODq+ODkeOCueOCkuagvOe0jeOBl+OBn+mFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gdGFyZ2V0IC0g44Kt44Ol44O844OW44Oe44OD44OX44OG44Kv44K544OB44Oj44Gr6Kit5a6a44GZ44KL44K/44O844Ky44OD44OI44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbnVtYmVyIC0gZ2xjdWJpYyDjgYzlhoXpg6jnmoTjgavmjIHjgaTphY3liJfjga7jgqTjg7Pjg4fjg4Pjgq/jgrkg4oC76Z2e44OG44Kv44K544OB44Oj44Om44OL44OD44OIXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIOeUu+WDj+OBruODreODvOODieOBjOWujOS6huOBl+ODhuOCr+OCueODgeODo+OCkueUn+aIkOOBl+OBn+W+jOOBq+WRvOOBsOOCjOOCi+OCs+ODvOODq+ODkOODg+OCr1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVUZXh0dXJlQ3ViZUZyb21GaWxlKHNvdXJjZSwgdGFyZ2V0LCBudW1iZXIsIGNhbGxiYWNrKXtcclxuICAgICAgICBpZihzb3VyY2UgPT0gbnVsbCB8fCB0YXJnZXQgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBsZXQgY0ltZyA9IFtdO1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBjSW1nW2ldID0ge2ltYWdlOiBuZXcgSW1hZ2UoKSwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgICAgIGNJbWdbaV0uaW1hZ2Uub25sb2FkID0gKChpbmRleCkgPT4ge3JldHVybiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjSW1nW2luZGV4XS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYoY0ltZy5sZW5ndGggPT09IDYpe1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBmID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICBjSW1nLm1hcCgodikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gZiAmJiB2LmxvYWRlZDtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICBpZihmID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRleCA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIG51bWJlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIHRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBzb3VyY2UubGVuZ3RoOyBqKyspe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4SW1hZ2UyRCh0YXJnZXRbal0sIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIGNJbWdbal0uaW1hZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmdlbmVyYXRlTWlwbWFwKGdsLlRFWFRVUkVfQ1VCRV9NQVApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9ULCBnbC5DTEFNUF9UT19FREdFKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSB0ZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV9DVUJFX01BUDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZpbGUgbG9hZGVkOiAlYycgKyBzb3VyY2VbMF0gKyAnLi4uJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnLCAnY29sb3I6IGdvbGRlbnJvZCcpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihjYWxsYmFjayAhPSBudWxsKXtjYWxsYmFjayhudW1iZXIpO31cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH07fSkoaSk7XHJcbiAgICAgICAgICAgIGNJbWdbaV0uaW1hZ2Uuc3JjID0gc291cmNlW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdsY3ViaWMg44GM5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K544Go44OG44Kv44K544OB44Oj44Om44OL44OD44OI44KS5oyH5a6a44GX44Gm44OG44Kv44K544OB44Oj44KS44OQ44Kk44Oz44OJ44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdW5pdCAtIOODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5XHJcbiAgICAgKi9cclxuICAgIGJpbmRUZXh0dXJlKHVuaXQsIG51bWJlcil7XHJcbiAgICAgICAgaWYodGhpcy50ZXh0dXJlc1tudW1iZXJdID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5nbC5hY3RpdmVUZXh0dXJlKHRoaXMuZ2wuVEVYVFVSRTAgKyB1bml0KTtcclxuICAgICAgICB0aGlzLmdsLmJpbmRUZXh0dXJlKHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlLCB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnbGN1YmljIOOBjOaMgeOBpOmFjeWIl+WGheOBruODhuOCr+OCueODgeODo+eUqOeUu+WDj+OBjOWFqOOBpuODreODvOODiea4iOOBv+OBi+OBqeOBhuOBi+eiuuiqjeOBmeOCi1xyXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0g44Ot44O844OJ44GM5a6M5LqG44GX44Gm44GE44KL44GL44Gp44GG44GL44Gu44OV44Op44KwXHJcbiAgICAgKi9cclxuICAgIGlzVGV4dHVyZUxvYWRlZCgpe1xyXG4gICAgICAgIGxldCBpLCBqLCBmLCBnO1xyXG4gICAgICAgIGYgPSB0cnVlOyBnID0gZmFsc2U7XHJcbiAgICAgICAgZm9yKGkgPSAwLCBqID0gdGhpcy50ZXh0dXJlcy5sZW5ndGg7IGkgPCBqOyBpKyspe1xyXG4gICAgICAgICAgICBpZih0aGlzLnRleHR1cmVzW2ldICE9IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmID0gZiAmJiB0aGlzLnRleHR1cmVzW2ldLmxvYWRlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZihnKXtyZXR1cm4gZjt9ZWxzZXtyZXR1cm4gZmFsc2U7fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Kr44Op44O844OQ44OD44OV44Kh44Gr44OG44Kv44K544OB44Oj44KS6Kit5a6a44GX44Gm44Kq44OW44K444Kn44Kv44OI44Go44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7mqKrluYVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuSDigLvpnZ7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0g55Sf5oiQ44GX44Gf5ZCE56iu44Kq44OW44K444Kn44Kv44OI44Gv44Op44OD44OX44GX44Gm6L+U5Y2044GZ44KLXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMRnJhbWVidWZmZXJ9IGZyYW1lYnVmZmVyIC0g44OV44Os44O844Og44OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMUmVuZGVyYnVmZmVyfSBkZXB0aFJlbmRlckJ1ZmZlciAtIOa3seW6puODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODrOODs+ODgOODvOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFRleHR1cmV9IHRleHR1cmUgLSDjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg4bjgq/jgrnjg4Hjg6NcclxuICAgICAqL1xyXG4gICAgY3JlYXRlRnJhbWVidWZmZXIod2lkdGgsIGhlaWdodCwgbnVtYmVyKXtcclxuICAgICAgICBpZih3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGxldCBmcmFtZUJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZUJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGRlcHRoUmVuZGVyQnVmZmVyID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIGRlcHRoUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIGRlcHRoUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBsZXQgZlRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIG51bWJlcik7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgZlRleHR1cmUpO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCBmVGV4dHVyZSwgMCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSBmVGV4dHVyZTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfMkQ7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmcmFtZWJ1ZmZlciBjcmVhdGVkJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtmcmFtZWJ1ZmZlcjogZnJhbWVCdWZmZXIsIGRlcHRoUmVuZGVyYnVmZmVyOiBkZXB0aFJlbmRlckJ1ZmZlciwgdGV4dHVyZTogZlRleHR1cmV9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Os44O844Og44OQ44OD44OV44Kh44KS55Sf5oiQ44GX44Kr44Op44O844OQ44OD44OV44Kh44Gr44OG44Kv44K544OB44Oj44KS6Kit5a6a44CB44K544OG44Oz44K344Or5pyJ5Yq544Gn44Kq44OW44K444Kn44Kv44OI44Go44GX44Gm6L+U44GZXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7mqKrluYVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqHjga7pq5jjgZVcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuSDigLvpnZ7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0g55Sf5oiQ44GX44Gf5ZCE56iu44Kq44OW44K444Kn44Kv44OI44Gv44Op44OD44OX44GX44Gm6L+U5Y2044GZ44KLXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMRnJhbWVidWZmZXJ9IGZyYW1lYnVmZmVyIC0g44OV44Os44O844Og44OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMUmVuZGVyYnVmZmVyfSBkZXB0aFN0ZW5jaWxSZW5kZXJidWZmZXIgLSDmt7Hluqbjg5Djg4Pjg5XjgqHlhbzjgrnjg4bjg7Pjgrfjg6vjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg6zjg7Pjg4Djg7zjg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xUZXh0dXJlfSB0ZXh0dXJlIC0g44Kr44Op44O844OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44OG44Kv44K544OB44OjXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZUZyYW1lYnVmZmVyU3RlbmNpbCh3aWR0aCwgaGVpZ2h0LCBudW1iZXIpe1xyXG4gICAgICAgIGlmKHdpZHRoID09IG51bGwgfHwgaGVpZ2h0ID09IG51bGwgfHwgbnVtYmVyID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgbGV0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0gPSB7dGV4dHVyZTogbnVsbCwgdHlwZTogbnVsbCwgbG9hZGVkOiBmYWxzZX07XHJcbiAgICAgICAgbGV0IGZyYW1lQnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIGZyYW1lQnVmZmVyKTtcclxuICAgICAgICBsZXQgZGVwdGhTdGVuY2lsUmVuZGVyQnVmZmVyID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIGRlcHRoU3RlbmNpbFJlbmRlckJ1ZmZlcik7XHJcbiAgICAgICAgZ2wucmVuZGVyYnVmZmVyU3RvcmFnZShnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX1NURU5DSUwsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9TVEVOQ0lMX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZGVwdGhTdGVuY2lsUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBsZXQgZlRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIG51bWJlcik7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgZlRleHR1cmUpO1xyXG4gICAgICAgIGdsLnRleEltYWdlMkQoZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUik7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCBmVGV4dHVyZSwgMCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgbnVsbCk7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnRleHR1cmUgPSBmVGV4dHVyZTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udHlwZSA9IGdsLlRFWFRVUkVfMkQ7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLmxvYWRlZCA9IHRydWU7XHJcbiAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJWPil4YlYyB0ZXh0dXJlIG51bWJlcjogJWMnICsgbnVtYmVyICsgJyVjLCBmcmFtZWJ1ZmZlciBjcmVhdGVkIChlbmFibGUgc3RlbmNpbCknLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhTdGVuY2lsUmVuZGVyYnVmZmVyOiBkZXB0aFN0ZW5jaWxSZW5kZXJCdWZmZXIsIHRleHR1cmU6IGZUZXh0dXJlfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleODrOODvOODoOODkOODg+ODleOCoeOCkueUn+aIkOOBl+OCq+ODqeODvOODkOODg+ODleOCoeOBq+a1ruWLleWwj+aVsOeCueODhuOCr+OCueODgeODo+OCkuioreWumuOBl+OBpuOCquODluOCuOOCp+OCr+ODiOOBqOOBl+OBpui/lOOBmSDigLvopoHmi6HlvLXmqZ/og73vvIhXZWJHTCAxLjDvvIlcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBruaoquW5hVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCAtIOODleODrOODvOODoOODkOODg+ODleOCoeOBrumrmOOBlVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG51bWJlciAtIGdsY3ViaWMg44GM5YaF6YOo55qE44Gr5oyB44Gk6YWN5YiX44Gu44Kk44Oz44OH44OD44Kv44K5IOKAu+mdnuODhuOCr+OCueODgeODo+ODpuODi+ODg+ODiFxyXG4gICAgICogQHJldHVybiB7b2JqZWN0fSDnlJ/miJDjgZfjgZ/lkITnqK7jgqrjg5bjgrjjgqfjgq/jg4jjga/jg6njg4Pjg5fjgZfjgabov5TljbTjgZnjgotcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xGcmFtZWJ1ZmZlcn0gZnJhbWVidWZmZXIgLSDjg5Xjg6zjg7zjg6Djg5Djg4Pjg5XjgqFcclxuICAgICAqIEBwcm9wZXJ0eSB7V2ViR0xSZW5kZXJidWZmZXJ9IGRlcHRoUmVuZGVyQnVmZmVyIC0g5rex5bqm44OQ44OD44OV44Kh44Go44GX44Gm6Kit5a6a44GX44Gf44Os44Oz44OA44O844OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMVGV4dHVyZX0gdGV4dHVyZSAtIOOCq+ODqeODvOODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODhuOCr+OCueODgeODo1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVGcmFtZWJ1ZmZlckZsb2F0KHdpZHRoLCBoZWlnaHQsIG51bWJlcil7XHJcbiAgICAgICAgaWYod2lkdGggPT0gbnVsbCB8fCBoZWlnaHQgPT0gbnVsbCB8fCBudW1iZXIgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICBpZih0aGlzLmV4dCA9PSBudWxsIHx8ICh0aGlzLmV4dC50ZXh0dXJlRmxvYXQgPT0gbnVsbCAmJiB0aGlzLmV4dC50ZXh0dXJlSGFsZkZsb2F0ID09IG51bGwpKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Zsb2F0IHRleHR1cmUgbm90IHN1cHBvcnQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgZ2wgPSB0aGlzLmdsO1xyXG4gICAgICAgIGxldCBmbGcgPSAodGhpcy5leHQudGV4dHVyZUZsb2F0ICE9IG51bGwpID8gZ2wuRkxPQVQgOiB0aGlzLmV4dC50ZXh0dXJlSGFsZkZsb2F0LkhBTEZfRkxPQVRfT0VTO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXSA9IHt0ZXh0dXJlOiBudWxsLCB0eXBlOiBudWxsLCBsb2FkZWQ6IGZhbHNlfTtcclxuICAgICAgICBsZXQgZnJhbWVCdWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xyXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlcihnbC5GUkFNRUJVRkZFUiwgZnJhbWVCdWZmZXIpO1xyXG4gICAgICAgIGxldCBmVGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcclxuICAgICAgICBnbC5hY3RpdmVUZXh0dXJlKGdsLlRFWFRVUkUwICsgbnVtYmVyKTtcclxuICAgICAgICBnbC5iaW5kVGV4dHVyZShnbC5URVhUVVJFXzJELCBmVGV4dHVyZSk7XHJcbiAgICAgICAgZ2wudGV4SW1hZ2UyRChnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCB3aWR0aCwgaGVpZ2h0LCAwLCBnbC5SR0JBLCBmbGcsIG51bGwpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5ORUFSRVNUKTtcclxuICAgICAgICBnbC50ZXhQYXJhbWV0ZXJpKGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTkVBUkVTVCk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfUywgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wudGV4UGFyYW1ldGVyaShnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSk7XHJcbiAgICAgICAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCBmVGV4dHVyZSwgMCk7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV8yRCwgbnVsbCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBudWxsKTtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0udGV4dHVyZSA9IGZUZXh0dXJlO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50eXBlID0gZ2wuVEVYVFVSRV8yRDtcclxuICAgICAgICB0aGlzLnRleHR1cmVzW251bWJlcl0ubG9hZGVkID0gdHJ1ZTtcclxuICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHRleHR1cmUgbnVtYmVyOiAlYycgKyBudW1iZXIgKyAnJWMsIGZyYW1lYnVmZmVyIGNyZWF0ZWQgKGVuYWJsZSBmbG9hdCknLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBibHVlJywgJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4ge2ZyYW1lYnVmZmVyOiBmcmFtZUJ1ZmZlciwgZGVwdGhSZW5kZXJidWZmZXI6IG51bGwsIHRleHR1cmU6IGZUZXh0dXJlfTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleODrOODvOODoOODkOODg+ODleOCoeOCkueUn+aIkOOBl+OCq+ODqeODvOODkOODg+ODleOCoeOBq+OCreODpeODvOODluODhuOCr+OCueODgeODo+OCkuioreWumuOBl+OBpuOCquODluOCuOOCp+OCr+ODiOOBqOOBl+OBpui/lOOBmVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHdpZHRoIC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu5qiq5bmFXHJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaGVpZ2h0IC0g44OV44Os44O844Og44OQ44OD44OV44Kh44Gu6auY44GVXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSB0YXJnZXQgLSDjgq3jg6Xjg7zjg5bjg57jg4Pjg5fjg4bjgq/jgrnjg4Hjg6PjgavoqK3lrprjgZnjgovjgr/jg7zjgrLjg4Pjg4jjga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBudW1iZXIgLSBnbGN1YmljIOOBjOWGhemDqOeahOOBq+aMgeOBpOmFjeWIl+OBruOCpOODs+ODh+ODg+OCr+OCuSDigLvpnZ7jg4bjgq/jgrnjg4Hjg6Pjg6bjg4vjg4Pjg4hcclxuICAgICAqIEByZXR1cm4ge29iamVjdH0g55Sf5oiQ44GX44Gf5ZCE56iu44Kq44OW44K444Kn44Kv44OI44Gv44Op44OD44OX44GX44Gm6L+U5Y2044GZ44KLXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMRnJhbWVidWZmZXJ9IGZyYW1lYnVmZmVyIC0g44OV44Os44O844Og44OQ44OD44OV44KhXHJcbiAgICAgKiBAcHJvcGVydHkge1dlYkdMUmVuZGVyYnVmZmVyfSBkZXB0aFJlbmRlckJ1ZmZlciAtIOa3seW6puODkOODg+ODleOCoeOBqOOBl+OBpuioreWumuOBl+OBn+ODrOODs+ODgOODvOODkOODg+ODleOCoVxyXG4gICAgICogQHByb3BlcnR5IHtXZWJHTFRleHR1cmV9IHRleHR1cmUgLSDjgqvjg6njg7zjg5Djg4Pjg5XjgqHjgajjgZfjgaboqK3lrprjgZfjgZ/jg4bjgq/jgrnjg4Hjg6NcclxuICAgICAqL1xyXG4gICAgY3JlYXRlRnJhbWVidWZmZXJDdWJlKHdpZHRoLCBoZWlnaHQsIHRhcmdldCwgbnVtYmVyKXtcclxuICAgICAgICBpZih3aWR0aCA9PSBudWxsIHx8IGhlaWdodCA9PSBudWxsIHx8IHRhcmdldCA9PSBudWxsIHx8IG51bWJlciA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdID0ge3RleHR1cmU6IG51bGwsIHR5cGU6IG51bGwsIGxvYWRlZDogZmFsc2V9O1xyXG4gICAgICAgIGxldCBmcmFtZUJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBmcmFtZUJ1ZmZlcik7XHJcbiAgICAgICAgbGV0IGRlcHRoUmVuZGVyQnVmZmVyID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XHJcbiAgICAgICAgZ2wuYmluZFJlbmRlcmJ1ZmZlcihnbC5SRU5ERVJCVUZGRVIsIGRlcHRoUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBnbC5yZW5kZXJidWZmZXJTdG9yYWdlKGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIHdpZHRoLCBoZWlnaHQpO1xyXG4gICAgICAgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIGRlcHRoUmVuZGVyQnVmZmVyKTtcclxuICAgICAgICBsZXQgZlRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XHJcbiAgICAgICAgZ2wuYWN0aXZlVGV4dHVyZShnbC5URVhUVVJFMCArIG51bWJlcik7XHJcbiAgICAgICAgZ2wuYmluZFRleHR1cmUoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZlRleHR1cmUpO1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0YXJnZXQubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICBnbC50ZXhJbWFnZTJEKHRhcmdldFtpXSwgMCwgZ2wuUkdCQSwgd2lkdGgsIGhlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLnRleFBhcmFtZXRlcmkoZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UpO1xyXG4gICAgICAgIGdsLmJpbmRUZXh0dXJlKGdsLlRFWFRVUkVfQ1VCRV9NQVAsIG51bGwpO1xyXG4gICAgICAgIGdsLmJpbmRSZW5kZXJidWZmZXIoZ2wuUkVOREVSQlVGRkVSLCBudWxsKTtcclxuICAgICAgICBnbC5iaW5kRnJhbWVidWZmZXIoZ2wuRlJBTUVCVUZGRVIsIG51bGwpO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS50ZXh0dXJlID0gZlRleHR1cmU7XHJcbiAgICAgICAgdGhpcy50ZXh0dXJlc1tudW1iZXJdLnR5cGUgPSBnbC5URVhUVVJFX0NVQkVfTUFQO1xyXG4gICAgICAgIHRoaXMudGV4dHVyZXNbbnVtYmVyXS5sb2FkZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmKHRoaXMuaXNDb25zb2xlT3V0cHV0ID09PSB0cnVlKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgdGV4dHVyZSBudW1iZXI6ICVjJyArIG51bWJlciArICclYywgZnJhbWVidWZmZXIgY3ViZSBjcmVhdGVkJywgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogYmx1ZScsICcnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHtmcmFtZWJ1ZmZlcjogZnJhbWVCdWZmZXIsIGRlcHRoUmVuZGVyYnVmZmVyOiBkZXB0aFJlbmRlckJ1ZmZlciwgdGV4dHVyZTogZlRleHR1cmV9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSFRNTCDlhoXjgavlrZjlnKjjgZnjgosgSUQg5paH5a2X5YiX44GL44KJIHNjcmlwdCDjgr/jgrDjgpLlj4LnhafjgZfjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2c0lkIC0g6aCC54K544K344Kn44O844OA44Gu44K944O844K544GM6KiY6L+w44GV44KM44GfIHNjcmlwdCDjgr/jgrDjga4gSUQg5paH5a2X5YiXXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZnNJZCAtIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCveODvOOCueOBjOiomOi/sOOBleOCjOOBnyBzY3JpcHQg44K/44Kw44GuIElEIOaWh+Wtl+WIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gYXR0TG9jYXRpb24gLSBhdHRyaWJ1dGUg5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBhdHRTdHJpZGUgLSBhdHRyaWJ1dGUg5aSJ5pWw44Gu44K544OI44Op44Kk44OJ44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlMb2NhdGlvbiAtIHVuaWZvcm0g5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlUeXBlIC0gdW5pZm9ybSDlpInmlbDmm7TmlrDjg6Hjgr3jg4Pjg4njga7lkI3liY3jgpLnpLrjgZnmloflrZfliJcg4oC75L6L77yaJ21hdHJpeDRmdidcclxuICAgICAqIEByZXR1cm4ge1Byb2dyYW1NYW5hZ2VyfSDjg5fjg63jgrDjg6njg6Djg57jg43jg7zjgrjjg6Pjg7zjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUHJvZ3JhbUZyb21JZCh2c0lkLCBmc0lkLCBhdHRMb2NhdGlvbiwgYXR0U3RyaWRlLCB1bmlMb2NhdGlvbiwgdW5pVHlwZSl7XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgbGV0IG1uZyA9IG5ldyBQcm9ncmFtTWFuYWdlcih0aGlzLmdsLCB0aGlzLmlzV2ViR0wyKTtcclxuICAgICAgICBtbmcudnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbUlkKHZzSWQpO1xyXG4gICAgICAgIG1uZy5mcyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tSWQoZnNJZCk7XHJcbiAgICAgICAgbW5nLnByZyA9IG1uZy5jcmVhdGVQcm9ncmFtKG1uZy52cywgbW5nLmZzKTtcclxuICAgICAgICBpZihtbmcucHJnID09IG51bGwpe3JldHVybiBtbmc7fVxyXG4gICAgICAgIG1uZy5hdHRMID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgbW5nLmF0dFMgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdHRMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIG1uZy5hdHRMW2ldID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbihtbmcucHJnLCBhdHRMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgICAgIG1uZy5hdHRTW2ldID0gYXR0U3RyaWRlW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtbmcudW5pTCA9IG5ldyBBcnJheSh1bmlMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLnVuaUxbaV0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihtbmcucHJnLCB1bmlMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlUID0gdW5pVHlwZTtcclxuICAgICAgICBtbmcubG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pO1xyXG4gICAgICAgIHJldHVybiBtbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrnjgrPjg7zjg4nmloflrZfliJfjgYvjgonjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2cyAtIOmggueCueOCt+OCp+ODvOODgOOBruOCveODvOOCuVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZzIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44K944O844K5XHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSBhdHRMb2NhdGlvbiAtIGF0dHJpYnV0ZSDlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPG51bWJlcj59IGF0dFN0cmlkZSAtIGF0dHJpYnV0ZSDlpInmlbDjga7jgrnjg4jjg6njgqTjg4njga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHVuaUxvY2F0aW9uIC0gdW5pZm9ybSDlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHVuaVR5cGUgLSB1bmlmb3JtIOWkieaVsOabtOaWsOODoeOCveODg+ODieOBruWQjeWJjeOCkuekuuOBmeaWh+Wtl+WIlyDigLvkvovvvJonbWF0cml4NGZ2J1xyXG4gICAgICogQHJldHVybiB7UHJvZ3JhbU1hbmFnZXJ9IOODl+ODreOCsOODqeODoOODnuODjeODvOOCuOODo+ODvOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuVxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbVNvdXJjZSh2cywgZnMsIGF0dExvY2F0aW9uLCBhdHRTdHJpZGUsIHVuaUxvY2F0aW9uLCB1bmlUeXBlKXtcclxuICAgICAgICBpZih0aGlzLmdsID09IG51bGwpe3JldHVybiBudWxsO31cclxuICAgICAgICBsZXQgaTtcclxuICAgICAgICBsZXQgbW5nID0gbmV3IFByb2dyYW1NYW5hZ2VyKHRoaXMuZ2wsIHRoaXMuaXNXZWJHTDIpO1xyXG4gICAgICAgIG1uZy52cyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKHZzLCB0aGlzLmdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgIG1uZy5mcyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKGZzLCB0aGlzLmdsLkZSQUdNRU5UX1NIQURFUik7XHJcbiAgICAgICAgbW5nLnByZyA9IG1uZy5jcmVhdGVQcm9ncmFtKG1uZy52cywgbW5nLmZzKTtcclxuICAgICAgICBpZihtbmcucHJnID09IG51bGwpe3JldHVybiBtbmc7fVxyXG4gICAgICAgIG1uZy5hdHRMID0gbmV3IEFycmF5KGF0dExvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgbW5nLmF0dFMgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdHRMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIG1uZy5hdHRMW2ldID0gdGhpcy5nbC5nZXRBdHRyaWJMb2NhdGlvbihtbmcucHJnLCBhdHRMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgICAgIG1uZy5hdHRTW2ldID0gYXR0U3RyaWRlW2ldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBtbmcudW5pTCA9IG5ldyBBcnJheSh1bmlMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgIGZvcihpID0gMDsgaSA8IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgbW5nLnVuaUxbaV0gPSB0aGlzLmdsLmdldFVuaWZvcm1Mb2NhdGlvbihtbmcucHJnLCB1bmlMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG1uZy51bmlUID0gdW5pVHlwZTtcclxuICAgICAgICBtbmcubG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pO1xyXG4gICAgICAgIHJldHVybiBtbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5XjgqHjgqTjg6vjgYvjgonjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrnjgrPjg7zjg4njgpLlj5blvpfjgZfjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2c1BhdGggLSDpoILngrnjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrnjgYzoqJjov7DjgZXjgozjgZ/jg5XjgqHjgqTjg6vjga7jg5HjgrlcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmc1BhdGggLSDjg5Xjg6njgrDjg6Hjg7Pjg4jjgrfjgqfjg7zjg4Djga7jgr3jg7zjgrnjgYzoqJjov7DjgZXjgozjgZ/jg5XjgqHjgqTjg6vjga7jg5HjgrlcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IGF0dExvY2F0aW9uIC0gYXR0cmlidXRlIOWkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48bnVtYmVyPn0gYXR0U3RyaWRlIC0gYXR0cmlidXRlIOWkieaVsOOBruOCueODiOODqeOCpOODieOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdW5pTG9jYXRpb24gLSB1bmlmb3JtIOWkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdW5pVHlwZSAtIHVuaWZvcm0g5aSJ5pWw5pu05paw44Oh44K944OD44OJ44Gu5ZCN5YmN44KS56S644GZ5paH5a2X5YiXIOKAu+S+i++8midtYXRyaXg0ZnYnXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayAtIOOCveODvOOCueOCs+ODvOODieOBruODreODvOODieOBjOWujOS6huOBl+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBl+OBn+W+jOOBq+WRvOOBsOOCjOOCi+OCs+ODvOODq+ODkOODg+OCr1xyXG4gICAgICogQHJldHVybiB7UHJvZ3JhbU1hbmFnZXJ9IOODl+ODreOCsOODqeODoOODnuODjeODvOOCuOODo+ODvOOCr+ODqeOCueOBruOCpOODs+OCueOCv+ODs+OCuSDigLvjg63jg7zjg4nliY3jgavjgqTjg7Pjgrnjgr/jg7Pjgrnjga/miLvjgorlgKTjgajjgZfjgabov5TljbTjgZXjgozjgotcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUHJvZ3JhbUZyb21GaWxlKHZzUGF0aCwgZnNQYXRoLCBhdHRMb2NhdGlvbiwgYXR0U3RyaWRlLCB1bmlMb2NhdGlvbiwgdW5pVHlwZSwgY2FsbGJhY2spe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wgPT0gbnVsbCl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBtbmcgPSBuZXcgUHJvZ3JhbU1hbmFnZXIodGhpcy5nbCwgdGhpcy5pc1dlYkdMMik7XHJcbiAgICAgICAgbGV0IHNyYyA9IHtcclxuICAgICAgICAgICAgdnM6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFVybDogdnNQYXRoLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBudWxsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGZzOiB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRVcmw6IGZzUGF0aCxcclxuICAgICAgICAgICAgICAgIHNvdXJjZTogbnVsbFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICB4aHIodGhpcy5nbCwgc3JjLnZzKTtcclxuICAgICAgICB4aHIodGhpcy5nbCwgc3JjLmZzKTtcclxuICAgICAgICBmdW5jdGlvbiB4aHIoZ2wsIHRhcmdldCl7XHJcbiAgICAgICAgICAgIGxldCB4bWwgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeG1sLm9wZW4oJ0dFVCcsIHRhcmdldC50YXJnZXRVcmwsIHRydWUpO1xyXG4gICAgICAgICAgICB4bWwuc2V0UmVxdWVzdEhlYWRlcignUHJhZ21hJywgJ25vLWNhY2hlJyk7XHJcbiAgICAgICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdDYWNoZS1Db250cm9sJywgJ25vLWNhY2hlJyk7XHJcbiAgICAgICAgICAgIHhtbC5vbmxvYWQgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5pc0NvbnNvbGVPdXRwdXQgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCclY+KXhiVjIHNoYWRlciBmaWxlIGxvYWRlZDogJWMnICsgdGFyZ2V0LnRhcmdldFVybCwgJ2NvbG9yOiBjcmltc29uJywgJycsICdjb2xvcjogZ29sZGVucm9kJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0YXJnZXQuc291cmNlID0geG1sLnJlc3BvbnNlVGV4dDtcclxuICAgICAgICAgICAgICAgIGxvYWRDaGVjayhnbCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhtbC5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGxvYWRDaGVjayhnbCl7XHJcbiAgICAgICAgICAgIGlmKHNyYy52cy5zb3VyY2UgPT0gbnVsbCB8fCBzcmMuZnMuc291cmNlID09IG51bGwpe3JldHVybjt9XHJcbiAgICAgICAgICAgIGxldCBpO1xyXG4gICAgICAgICAgICBtbmcudnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZShzcmMudnMuc291cmNlLCBnbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgbW5nLmZzID0gbW5nLmNyZWF0ZVNoYWRlckZyb21Tb3VyY2Uoc3JjLmZzLnNvdXJjZSwgZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICAgICAgbW5nLnByZyA9IG1uZy5jcmVhdGVQcm9ncmFtKG1uZy52cywgbW5nLmZzKTtcclxuICAgICAgICAgICAgaWYobW5nLnByZyA9PSBudWxsKXtyZXR1cm4gbW5nO31cclxuICAgICAgICAgICAgbW5nLmF0dEwgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICAgICAgbW5nLmF0dFMgPSBuZXcgQXJyYXkoYXR0TG9jYXRpb24ubGVuZ3RoKTtcclxuICAgICAgICAgICAgZm9yKGkgPSAwOyBpIDwgYXR0TG9jYXRpb24ubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAgICAgbW5nLmF0dExbaV0gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihtbmcucHJnLCBhdHRMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgICAgICAgICBtbmcuYXR0U1tpXSA9IGF0dFN0cmlkZVtpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtbmcudW5pTCA9IG5ldyBBcnJheSh1bmlMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCB1bmlMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBtbmcudW5pTFtpXSA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihtbmcucHJnLCB1bmlMb2NhdGlvbltpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbW5nLnVuaVQgPSB1bmlUeXBlO1xyXG4gICAgICAgICAgICBtbmcubG9jYXRpb25DaGVjayhhdHRMb2NhdGlvbiwgdW5pTG9jYXRpb24pO1xyXG4gICAgICAgICAgICBjYWxsYmFjayhtbmcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbW5nO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OV44Kh44Kk44Or44GL44KJ44K344Kn44O844OA44Gu44K944O844K544Kz44O844OJ44KS5Y+W5b6X44GX44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GZ44KL77yIdHJhbnNmb3JtIGZlZWRiYWNrIOWvvuW/nOeJiO+8iVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHZzUGF0aCAtIOmggueCueOCt+OCp+ODvOODgOOBruOCveODvOOCueOBjOiomOi/sOOBleOCjOOBn+ODleOCoeOCpOODq+OBruODkeOCuVxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZzUGF0aCAtIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCveODvOOCueOBjOiomOi/sOOBleOCjOOBn+ODleOCoeOCpOODq+OBruODkeOCuVxyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gYXR0TG9jYXRpb24gLSBhdHRyaWJ1dGUg5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBhdHRTdHJpZGUgLSBhdHRyaWJ1dGUg5aSJ5pWw44Gu44K544OI44Op44Kk44OJ44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlMb2NhdGlvbiAtIHVuaWZvcm0g5aSJ5pWw5ZCN44Gu6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxzdHJpbmc+fSB1bmlUeXBlIC0gdW5pZm9ybSDlpInmlbDmm7TmlrDjg6Hjgr3jg4Pjg4njga7lkI3liY3jgpLnpLrjgZnmloflrZfliJcg4oC75L6L77yaJ21hdHJpeDRmdidcclxuICAgICAqIEBwYXJhbSB7QXJyYXkuPHN0cmluZz59IHZhcnlpbmcgLSDlh7rlipvlpInmlbDlkI3jga7phY3liJdcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIC0g44K944O844K544Kz44O844OJ44Gu44Ot44O844OJ44GM5a6M5LqG44GX44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KS55Sf5oiQ44GX44Gf5b6M44Gr5ZG844Gw44KM44KL44Kz44O844Or44OQ44OD44KvXHJcbiAgICAgKiBAcmV0dXJuIHtQcm9ncmFtTWFuYWdlcn0g44OX44Ot44Kw44Op44Og44Oe44ON44O844K444Oj44O844Kv44Op44K544Gu44Kk44Oz44K544K/44Oz44K5IOKAu+ODreODvOODieWJjeOBq+OCpOODs+OCueOCv+ODs+OCueOBr+aIu+OCiuWApOOBqOOBl+OBpui/lOWNtOOBleOCjOOCi1xyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtRnJvbUZpbGVURih2c1BhdGgsIGZzUGF0aCwgYXR0TG9jYXRpb24sIGF0dFN0cmlkZSwgdW5pTG9jYXRpb24sIHVuaVR5cGUsIHZhcnlpbmdzLCBjYWxsYmFjayl7XHJcbiAgICAgICAgaWYodGhpcy5nbCA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IG1uZyA9IG5ldyBQcm9ncmFtTWFuYWdlcih0aGlzLmdsLCB0aGlzLmlzV2ViR0wyKTtcclxuICAgICAgICBsZXQgc3JjID0ge1xyXG4gICAgICAgICAgICB2czoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0VXJsOiB2c1BhdGgsXHJcbiAgICAgICAgICAgICAgICBzb3VyY2U6IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZnM6IHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFVybDogZnNQYXRoLFxyXG4gICAgICAgICAgICAgICAgc291cmNlOiBudWxsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHhocih0aGlzLmdsLCBzcmMudnMpO1xyXG4gICAgICAgIHhocih0aGlzLmdsLCBzcmMuZnMpO1xyXG4gICAgICAgIGZ1bmN0aW9uIHhocihnbCwgdGFyZ2V0KXtcclxuICAgICAgICAgICAgbGV0IHhtbCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4bWwub3BlbignR0VUJywgdGFyZ2V0LnRhcmdldFVybCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHhtbC5zZXRSZXF1ZXN0SGVhZGVyKCdQcmFnbWEnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICAgICAgeG1sLnNldFJlcXVlc3RIZWFkZXIoJ0NhY2hlLUNvbnRyb2wnLCAnbm8tY2FjaGUnKTtcclxuICAgICAgICAgICAgeG1sLm9ubG9hZCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmlzQ29uc29sZU91dHB1dCA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyVj4peGJWMgc2hhZGVyIGZpbGUgbG9hZGVkOiAlYycgKyB0YXJnZXQudGFyZ2V0VXJsLCAnY29sb3I6IGNyaW1zb24nLCAnJywgJ2NvbG9yOiBnb2xkZW5yb2QnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRhcmdldC5zb3VyY2UgPSB4bWwucmVzcG9uc2VUZXh0O1xyXG4gICAgICAgICAgICAgICAgbG9hZENoZWNrKGdsKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeG1sLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gbG9hZENoZWNrKGdsKXtcclxuICAgICAgICAgICAgaWYoc3JjLnZzLnNvdXJjZSA9PSBudWxsIHx8IHNyYy5mcy5zb3VyY2UgPT0gbnVsbCl7cmV0dXJuO31cclxuICAgICAgICAgICAgbGV0IGk7XHJcbiAgICAgICAgICAgIG1uZy52cyA9IG1uZy5jcmVhdGVTaGFkZXJGcm9tU291cmNlKHNyYy52cy5zb3VyY2UsIGdsLlZFUlRFWF9TSEFERVIpO1xyXG4gICAgICAgICAgICBtbmcuZnMgPSBtbmcuY3JlYXRlU2hhZGVyRnJvbVNvdXJjZShzcmMuZnMuc291cmNlLCBnbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICBtbmcucHJnID0gbW5nLmNyZWF0ZVByb2dyYW1URihtbmcudnMsIG1uZy5mcywgdmFyeWluZ3MpO1xyXG4gICAgICAgICAgICBpZihtbmcucHJnID09IG51bGwpe3JldHVybiBtbmc7fVxyXG4gICAgICAgICAgICBtbmcuYXR0TCA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICBtbmcuYXR0UyA9IG5ldyBBcnJheShhdHRMb2NhdGlvbi5sZW5ndGgpO1xyXG4gICAgICAgICAgICBmb3IoaSA9IDA7IGkgPCBhdHRMb2NhdGlvbi5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgICAgICBtbmcuYXR0TFtpXSA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKG1uZy5wcmcsIGF0dExvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgICAgIG1uZy5hdHRTW2ldID0gYXR0U3RyaWRlW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1uZy51bmlMID0gbmV3IEFycmF5KHVuaUxvY2F0aW9uLmxlbmd0aCk7XHJcbiAgICAgICAgICAgIGZvcihpID0gMDsgaSA8IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgICAgIG1uZy51bmlMW2ldID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKG1uZy5wcmcsIHVuaUxvY2F0aW9uW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtbmcudW5pVCA9IHVuaVR5cGU7XHJcbiAgICAgICAgICAgIG1uZy5sb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbik7XHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG1uZyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBtbmc7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5Djg4Pjg5XjgqHjgqrjg5bjgrjjgqfjgq/jg4jjgpLliYrpmaTjgZnjgotcclxuICAgICAqIEBwYXJhbSB7V2ViR0xCdWZmZXJ9IGJ1ZmZlciAtIOWJiumZpOOBmeOCi+ODkOODg+ODleOCoeOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBkZWxldGVCdWZmZXIoYnVmZmVyKXtcclxuICAgICAgICBpZih0aGlzLmdsLmlzQnVmZmVyKGJ1ZmZlcikgIT09IHRydWUpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVCdWZmZXIoYnVmZmVyKTtcclxuICAgICAgICBidWZmZXIgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44OG44Kv44K544OB44Oj44Kq44OW44K444Kn44Kv44OI44KS5YmK6Zmk44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMVGV4dHVyZX0gdGV4dHVyZSAtIOWJiumZpOOBmeOCi+ODhuOCr+OCueODgeODo+OCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBkZWxldGVUZXh0dXJlKHRleHR1cmUpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuaXNUZXh0dXJlKHRleHR1cmUpICE9PSB0cnVlKXtyZXR1cm47fVxyXG4gICAgICAgIHRoaXMuZ2wuZGVsZXRlVGV4dHVyZSh0ZXh0dXJlKTtcclxuICAgICAgICB0ZXh0dXJlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOODleODrOODvOODoOODkOODg+ODleOCoeOChOODrOODs+ODgOODvOODkOODg+ODleOCoeOCkuWJiumZpOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iaiAtIOODleODrOODvOODoOODkOODg+ODleOCoeeUn+aIkOODoeOCveODg+ODieOBjOi/lOOBmeOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBkZWxldGVGcmFtZWJ1ZmZlcihvYmope1xyXG4gICAgICAgIGlmKG9iaiA9PSBudWxsKXtyZXR1cm47fVxyXG4gICAgICAgIGZvcihsZXQgdiBpbiBvYmope1xyXG4gICAgICAgICAgICBpZihvYmpbdl0gaW5zdGFuY2VvZiBXZWJHTEZyYW1lYnVmZmVyICYmIHRoaXMuZ2wuaXNGcmFtZWJ1ZmZlcihvYmpbdl0pID09PSB0cnVlKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2wuZGVsZXRlRnJhbWVidWZmZXIob2JqW3ZdKTtcclxuICAgICAgICAgICAgICAgIG9ialt2XSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihvYmpbdl0gaW5zdGFuY2VvZiBXZWJHTFJlbmRlcmJ1ZmZlciAmJiB0aGlzLmdsLmlzUmVuZGVyYnVmZmVyKG9ialt2XSkgPT09IHRydWUpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nbC5kZWxldGVSZW5kZXJidWZmZXIob2JqW3ZdKTtcclxuICAgICAgICAgICAgICAgIG9ialt2XSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZihvYmpbdl0gaW5zdGFuY2VvZiBXZWJHTFRleHR1cmUgJiYgdGhpcy5nbC5pc1RleHR1cmUob2JqW3ZdKSA9PT0gdHJ1ZSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdsLmRlbGV0ZVRleHR1cmUob2JqW3ZdKTtcclxuICAgICAgICAgICAgICAgIG9ialt2XSA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb2JqID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkuWJiumZpOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gc2hhZGVyIC0g44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVNoYWRlcihzaGFkZXIpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2wuaXNTaGFkZXIoc2hhZGVyKSAhPT0gdHJ1ZSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIHNoYWRlciA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLliYrpmaTjgZnjgotcclxuICAgICAqIEBwYXJhbSB7V2ViR0xQcm9ncmFtfSBwcm9ncmFtIC0g44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGRlbGV0ZVByb2dyYW0ocHJvZ3JhbSl7XHJcbiAgICAgICAgaWYodGhpcy5nbC5pc1Byb2dyYW0ocHJvZ3JhbSkgIT09IHRydWUpe3JldHVybjt9XHJcbiAgICAgICAgdGhpcy5nbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgIHByb2dyYW0gPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUHJvZ3JhbU1hbmFnZXIg44Kv44Op44K544KS5YaF6YOo44OX44Ot44OR44OG44Kj44GU44Go5YmK6Zmk44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge1Byb2dyYW1NYW5hZ2VyfSBwcmcgLSBQcm9ncmFtTWFuYWdlciDjgq/jg6njgrnjga7jgqTjg7Pjgrnjgr/jg7PjgrlcclxuICAgICAqL1xyXG4gICAgZGVsZXRlUHJvZ3JhbU1hbmFnZXIocHJnKXtcclxuICAgICAgICBpZihwcmcgPT0gbnVsbCB8fCAhKHByZyBpbnN0YW5jZW9mIFByb2dyYW1NYW5hZ2VyKSl7cmV0dXJuO31cclxuICAgICAgICB0aGlzLmRlbGV0ZVNoYWRlcihwcmcudnMpO1xyXG4gICAgICAgIHRoaXMuZGVsZXRlU2hhZGVyKHByZy5mcyk7XHJcbiAgICAgICAgdGhpcy5kZWxldGVQcm9ncmFtKHByZy5wcmcpO1xyXG4gICAgICAgIHByZy5hdHRMID0gbnVsbDtcclxuICAgICAgICBwcmcuYXR0UyA9IG51bGw7XHJcbiAgICAgICAgcHJnLnVuaUwgPSBudWxsO1xyXG4gICAgICAgIHByZy51bmlUID0gbnVsbDtcclxuICAgICAgICBwcmcgPSBudWxsO1xyXG4gICAgfVxyXG59XHJcblxyXG4vKipcclxuICog44OX44Ot44Kw44Op44Og44Kq44OW44K444Kn44Kv44OI44KE44K344Kn44O844OA44KS566h55CG44GZ44KL44Oe44ON44O844K444OjXHJcbiAqIEBjbGFzcyBQcm9ncmFtTWFuYWdlclxyXG4gKi9cclxuY2xhc3MgUHJvZ3JhbU1hbmFnZXIge1xyXG4gICAgLyoqXHJcbiAgICAgKiBAY29uc3RydWN0b3JcclxuICAgICAqIEBwYXJhbSB7V2ViR0xSZW5kZXJpbmdDb250ZXh0fSBnbCAtIOiHqui6q+OBjOWxnuOBmeOCiyBXZWJHTCBSZW5kZXJpbmcgQ29udGV4dFxyXG4gICAgICogQHBhcmFtIHtib29sfSBbd2ViZ2wyTW9kZT1mYWxzZV0gLSB3ZWJnbDIg44KS5pyJ5Yq55YyW44GX44Gf44GL44Gp44GG44GLXHJcbiAgICAgKi9cclxuICAgIGNvbnN0cnVjdG9yKGdsLCB3ZWJnbDJNb2RlID0gZmFsc2Upe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOiHqui6q+OBjOWxnuOBmeOCiyBXZWJHTCBSZW5kZXJpbmcgQ29udGV4dFxyXG4gICAgICAgICAqIEB0eXBlIHtXZWJHTFJlbmRlcmluZ0NvbnRleHR9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQg44Go44GX44Gm5Yid5pyf5YyW44GX44Gf44GL44Gp44GG44GL44KS6KGo44GZ55yf5YG95YCkXHJcbiAgICAgICAgICogQHR5cGUge2Jvb2x9XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5pc1dlYkdMMiA9IHdlYmdsMk1vZGU7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICog6aCC54K544K344Kn44O844OA44Gu44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgICAgICogQHR5cGUge1dlYkdMU2hhZGVyfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMudnMgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICAgICAqIEB0eXBlIHtXZWJHTFNoYWRlcn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLmZzID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAgICAgKiBAdHlwZSB7V2ViR0xQcm9ncmFtfVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMucHJnID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjg4jjg6rjg5Pjg6Xjg7zjg4jjg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hdHRMID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjgqLjg4jjg6rjg5Pjg6Xjg7zjg4jlpInmlbDjga7jgrnjg4jjg6njgqTjg4njga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPG51bWJlcj59XHJcbiAgICAgICAgICovXHJcbiAgICAgICAgdGhpcy5hdHRTID0gbnVsbDtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiDjg6bjg4vjg5Xjgqnjg7zjg6Djg63jgrHjg7zjgrfjg6fjg7Pjga7phY3liJdcclxuICAgICAgICAgKiBAdHlwZSB7QXJyYXkuPFdlYkdMVW5pZm9ybUxvY2F0aW9uPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVuaUwgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOODpuODi+ODleOCqeODvOODoOWkieaVsOOBruOCv+OCpOODl+OBrumFjeWIl1xyXG4gICAgICAgICAqIEB0eXBlIHtBcnJheS48c3RyaW5nPn1cclxuICAgICAgICAgKi9cclxuICAgICAgICB0aGlzLnVuaVQgPSBudWxsO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOOCqOODqeODvOmWoumAo+aDheWgseOCkuagvOe0jeOBmeOCi1xyXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHZzIC0g6aCC54K544K344Kn44O844OA44Gu44Kz44Oz44OR44Kk44Or44Ko44Op44O8XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IGZzIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44Kz44Oz44OR44Kk44Or44Ko44Op44O8XHJcbiAgICAgICAgICogQHByb3BlcnR5IHtzdHJpbmd9IHByZyAtIOODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOBruODquODs+OCr+OCqOODqeODvFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHRoaXMuZXJyb3IgPSB7dnM6IG51bGwsIGZzOiBudWxsLCBwcmc6IG51bGx9O1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2NyaXB0IOOCv+OCsOOBriBJRCDjgpLlhYPjgavjgr3jg7zjgrnjgrPjg7zjg4njgpLlj5blvpfjgZfjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCAtIHNjcmlwdCDjgr/jgrDjgavku5jliqDjgZXjgozjgZ8gSUQg5paH5a2X5YiXXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTFNoYWRlcn0g55Sf5oiQ44GX44Gf44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKi9cclxuICAgIGNyZWF0ZVNoYWRlckZyb21JZChpZCl7XHJcbiAgICAgICAgbGV0IHNoYWRlcjtcclxuICAgICAgICBsZXQgc2NyaXB0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcclxuICAgICAgICBpZighc2NyaXB0RWxlbWVudCl7cmV0dXJuO31cclxuICAgICAgICBzd2l0Y2goc2NyaXB0RWxlbWVudC50eXBlKXtcclxuICAgICAgICAgICAgY2FzZSAneC1zaGFkZXIveC12ZXJ0ZXgnOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd4LXNoYWRlci94LWZyYWdtZW50JzpcclxuICAgICAgICAgICAgICAgIHNoYWRlciA9IHRoaXMuZ2wuY3JlYXRlU2hhZGVyKHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBkZWZhdWx0IDpcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHNvdXJjZSA9IHNjcmlwdEVsZW1lbnQudGV4dDtcclxuICAgICAgICBpZih0aGlzLmlzV2ViR0wyICE9PSB0cnVlKXtcclxuICAgICAgICAgICAgaWYoc291cmNlLnNlYXJjaCgvXiN2ZXJzaW9uIDMwMCBlcy8pID4gLTEpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgY2FuIG5vdCB1c2UgZ2xzbCBlcyAzLjAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGxldCBlcnIgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcclxuICAgICAgICAgICAgaWYoc2NyaXB0RWxlbWVudC50eXBlID09PSAneC1zaGFkZXIveC12ZXJ0ZXgnKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IudnMgPSBlcnI7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci5mcyA9IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjb21waWxlIGZhaWxlZCBvZiBzaGFkZXI6ICcgKyBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODieOCkuaWh+Wtl+WIl+OBp+W8leaVsOOBi+OCieWPluW+l+OBl+OCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHNvdXJjZSAtIOOCt+OCp+ODvOODgOOBruOCveODvOOCueOCs+ODvOODiVxyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHR5cGUgLSBnbC5WRVJURVhfU0hBREVSIG9yIGdsLkZSQUdNRU5UX1NIQURFUlxyXG4gICAgICogQHJldHVybiB7V2ViR0xTaGFkZXJ9IOeUn+aIkOOBl+OBn+OCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVTaGFkZXJGcm9tU291cmNlKHNvdXJjZSwgdHlwZSl7XHJcbiAgICAgICAgbGV0IHNoYWRlcjtcclxuICAgICAgICBzd2l0Y2godHlwZSl7XHJcbiAgICAgICAgICAgIGNhc2UgdGhpcy5nbC5WRVJURVhfU0hBREVSOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5WRVJURVhfU0hBREVSKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIHRoaXMuZ2wuRlJBR01FTlRfU0hBREVSOlxyXG4gICAgICAgICAgICAgICAgc2hhZGVyID0gdGhpcy5nbC5jcmVhdGVTaGFkZXIodGhpcy5nbC5GUkFHTUVOVF9TSEFERVIpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGRlZmF1bHQgOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0aGlzLmlzV2ViR0wyICE9PSB0cnVlKXtcclxuICAgICAgICAgICAgaWYoc291cmNlLnNlYXJjaCgvXiN2ZXJzaW9uIDMwMCBlcy8pID4gLTEpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgY2FuIG5vdCB1c2UgZ2xzbCBlcyAzLjAnKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgdGhpcy5nbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCB0aGlzLmdsLkNPTVBJTEVfU1RBVFVTKSl7XHJcbiAgICAgICAgICAgIHJldHVybiBzaGFkZXI7XHJcbiAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgIGxldCBlcnIgPSB0aGlzLmdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKTtcclxuICAgICAgICAgICAgaWYodHlwZSA9PT0gdGhpcy5nbC5WRVJURVhfU0hBREVSKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IudnMgPSBlcnI7XHJcbiAgICAgICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvci5mcyA9IGVycjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBjb21waWxlIGZhaWxlZCBvZiBzaGFkZXI6ICcgKyBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiOOCkuW8leaVsOOBi+OCieWPluW+l+OBl+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkueUn+aIkOOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtXZWJHTFNoYWRlcn0gdnMgLSDpoILngrnjgrfjgqfjg7zjg4Djga7jgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IGZzIC0g44OV44Op44Kw44Oh44Oz44OI44K344Kn44O844OA44Gu44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcmV0dXJuIHtXZWJHTFByb2dyYW19IOeUn+aIkOOBl+OBn+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICovXHJcbiAgICBjcmVhdGVQcm9ncmFtKHZzLCBmcyl7XHJcbiAgICAgICAgaWYodnMgPT0gbnVsbCB8fCBmcyA9PSBudWxsKXtyZXR1cm4gbnVsbDt9XHJcbiAgICAgICAgbGV0IHByb2dyYW0gPSB0aGlzLmdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgICAgICB0aGlzLmdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2cyk7XHJcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnMpO1xyXG4gICAgICAgIHRoaXMuZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgaWYodGhpcy5nbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIHRoaXMuZ2wuTElOS19TVEFUVVMpKXtcclxuICAgICAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gcHJvZ3JhbTtcclxuICAgICAgICB9ZWxzZXtcclxuICAgICAgICAgICAgbGV0IGVyciA9IHRoaXMuZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IucHJnID0gZXJyO1xyXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBsaW5rIHByb2dyYW0gZmFpbGVkOiAnICsgZXJyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiDjgrfjgqfjg7zjg4Djgqrjg5bjgrjjgqfjgq/jg4jjgpLlvJXmlbDjgYvjgonlj5blvpfjgZfjg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4jjgpLnlJ/miJDjgZnjgotcclxuICAgICAqIEBwYXJhbSB7V2ViR0xTaGFkZXJ9IHZzIC0g6aCC54K544K344Kn44O844OA44Gu44K344Kn44O844OA44Kq44OW44K444Kn44Kv44OIXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMU2hhZGVyfSBmcyAtIOODleODqeOCsOODoeODs+ODiOOCt+OCp+ODvOODgOOBruOCt+OCp+ODvOODgOOCquODluOCuOOCp+OCr+ODiFxyXG4gICAgICogQHBhcmFtIHtBcnJheS48c3RyaW5nPn0gdmFyeWluZyAtIOWHuuWKm+WkieaVsOWQjeOBrumFjeWIl1xyXG4gICAgICogQHJldHVybiB7V2ViR0xQcm9ncmFtfSDnlJ/miJDjgZfjgZ/jg5fjg63jgrDjg6njg6Djgqrjg5bjgrjjgqfjgq/jg4hcclxuICAgICAqL1xyXG4gICAgY3JlYXRlUHJvZ3JhbVRGKHZzLCBmcywgdmFyeWluZ3Mpe1xyXG4gICAgICAgIGlmKHZzID09IG51bGwgfHwgZnMgPT0gbnVsbCl7cmV0dXJuIG51bGw7fVxyXG4gICAgICAgIGxldCBwcm9ncmFtID0gdGhpcy5nbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICAgICAgdGhpcy5nbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdnMpO1xyXG4gICAgICAgIHRoaXMuZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZzKTtcclxuICAgICAgICB0aGlzLmdsLnRyYW5zZm9ybUZlZWRiYWNrVmFyeWluZ3MocHJvZ3JhbSwgdmFyeWluZ3MsIHRoaXMuZ2wuU0VQQVJBVEVfQVRUUklCUyk7XHJcbiAgICAgICAgdGhpcy5nbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgICAgICBpZih0aGlzLmdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgdGhpcy5nbC5MSU5LX1NUQVRVUykpe1xyXG4gICAgICAgICAgICB0aGlzLmdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9ncmFtO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgICBsZXQgZXJyID0gdGhpcy5nbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKTtcclxuICAgICAgICAgICAgdGhpcy5lcnJvci5wcmcgPSBlcnI7XHJcbiAgICAgICAgICAgIGNvbnNvbGUud2Fybign4peGIGxpbmsgcHJvZ3JhbSBmYWlsZWQ6ICcgKyBlcnIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIOiHqui6q+OBruWGhemDqOODl+ODreODkeODhuOCo+OBqOOBl+OBpuWtmOWcqOOBmeOCi+ODl+ODreOCsOODqeODoOOCquODluOCuOOCp+OCr+ODiOOCkuioreWumuOBmeOCi1xyXG4gICAgICovXHJcbiAgICB1c2VQcm9ncmFtKCl7XHJcbiAgICAgICAgdGhpcy5nbC51c2VQcm9ncmFtKHRoaXMucHJnKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIFZCTyDjgaggSUJPIOOCkuODkOOCpOODs+ODieOBl+OBpuacieWKueWMluOBmeOCi1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48V2ViR0xCdWZmZXI+fSB2Ym8gLSBWQk8g44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKiBAcGFyYW0ge1dlYkdMQnVmZmVyfSBbaWJvXSAtIElCT1xyXG4gICAgICovXHJcbiAgICBzZXRBdHRyaWJ1dGUodmJvLCBpYm8pe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZm9yKGxldCBpIGluIHZibyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuYXR0TFtpXSA+PSAwKXtcclxuICAgICAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCB2Ym9baV0pO1xyXG4gICAgICAgICAgICAgICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkodGhpcy5hdHRMW2ldKTtcclxuICAgICAgICAgICAgICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIodGhpcy5hdHRMW2ldLCB0aGlzLmF0dFNbaV0sIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYoaWJvICE9IG51bGwpe2dsLmJpbmRCdWZmZXIoZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGlibyk7fVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44K344Kn44O844OA44Gr44Om44OL44OV44Kp44O844Og5aSJ5pWw44Gr6Kit5a6a44GZ44KL5YCk44KS44OX44OD44K344Ol44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxtaXhlZD59IG1peGVkIC0g44Om44OL44OV44Kp44O844Og5aSJ5pWw44Gr6Kit5a6a44GZ44KL5YCk44KS5qC857SN44GX44Gf6YWN5YiXXHJcbiAgICAgKi9cclxuICAgIHB1c2hTaGFkZXIobWl4ZWQpe1xyXG4gICAgICAgIGxldCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgZm9yKGxldCBpID0gMCwgaiA9IHRoaXMudW5pVC5sZW5ndGg7IGkgPCBqOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgdW5pID0gJ3VuaWZvcm0nICsgdGhpcy51bmlUW2ldLnJlcGxhY2UoL21hdHJpeC9pLCAnTWF0cml4Jyk7XHJcbiAgICAgICAgICAgIGlmKGdsW3VuaV0gIT0gbnVsbCl7XHJcbiAgICAgICAgICAgICAgICBpZih1bmkuc2VhcmNoKC9NYXRyaXgvKSAhPT0gLTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIGdsW3VuaV0odGhpcy51bmlMW2ldLCBmYWxzZSwgbWl4ZWRbaV0pO1xyXG4gICAgICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICAgICAgZ2xbdW5pXSh0aGlzLnVuaUxbaV0sIG1peGVkW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBub3Qgc3VwcG9ydCB1bmlmb3JtIHR5cGU6ICcgKyB0aGlzLnVuaVRbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICog44Ki44OI44Oq44OT44Ol44O844OI44Ot44Kx44O844K344On44Oz44Go44Om44OL44OV44Kp44O844Og44Ot44Kx44O844K344On44Oz44GM5q2j44GX44GP5Y+W5b6X44Gn44GN44Gf44GL44OB44Kn44OD44Kv44GZ44KLXHJcbiAgICAgKiBAcGFyYW0ge0FycmF5LjxudW1iZXI+fSBhdHRMb2NhdGlvbiAtIOWPluW+l+OBl+OBn+OCouODiOODquODk+ODpeODvOODiOODreOCseODvOOCt+ODp+ODs+OBrumFjeWIl1xyXG4gICAgICogQHBhcmFtIHtBcnJheS48V2ViR0xVbmlmb3JtTG9jYXRpb24+fSB1bmlMb2NhdGlvbiAtIOWPluW+l+OBl+OBn+ODpuODi+ODleOCqeODvOODoOODreOCseODvOOCt+ODp+ODs+OBrumFjeWIl1xyXG4gICAgICovXHJcbiAgICBsb2NhdGlvbkNoZWNrKGF0dExvY2F0aW9uLCB1bmlMb2NhdGlvbil7XHJcbiAgICAgICAgbGV0IGksIGw7XHJcbiAgICAgICAgZm9yKGkgPSAwLCBsID0gYXR0TG9jYXRpb24ubGVuZ3RoOyBpIDwgbDsgaSsrKXtcclxuICAgICAgICAgICAgaWYodGhpcy5hdHRMW2ldID09IG51bGwgfHwgdGhpcy5hdHRMW2ldIDwgMCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLndhcm4oJ+KXhiBpbnZhbGlkIGF0dHJpYnV0ZSBsb2NhdGlvbjogJWNcIicgKyBhdHRMb2NhdGlvbltpXSArICdcIicsICdjb2xvcjogY3JpbXNvbicpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcihpID0gMCwgbCA9IHVuaUxvY2F0aW9uLmxlbmd0aDsgaSA8IGw7IGkrKyl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMudW5pTFtpXSA9PSBudWxsIHx8IHRoaXMudW5pTFtpXSA8IDApe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCfil4YgaW52YWxpZCB1bmlmb3JtIGxvY2F0aW9uOiAlY1wiJyArIHVuaUxvY2F0aW9uW2ldICsgJ1wiJywgJ2NvbG9yOiBjcmltc29uJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuXHJcbndpbmRvdy5nbDMgPSB3aW5kb3cuZ2wzIHx8IG5ldyBnbDMoKTtcclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2dsM0NvcmUuanMiXSwic291cmNlUm9vdCI6IiJ9