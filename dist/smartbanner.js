/*!
 * smartbanner.js v1.13.0 <https://github.com/ain/devneocity.js>
 * Copyright © 2019 Ain Tohvri, contributors. Licensed under GPL-3.0.
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*!
 * universal-ga v1.2.0
 * https://github.com/daxko/universal-ga 
 *
 * Copyright (c) 2017 Daxko
 * MIT License
 */

(function(global) {
  'use strict';

  function warn(s) {
    console.warn('[analytics]', s);
  }

  function _set() {
    var args = []
      , length = arguments.length
      , i = 0;

    for(; i < length; i++) {
      args.push(arguments[i]);
    }

    while(typeof args[args.length - 1] === 'undefined') {
      args.pop();
    }

    /* jshint validthis: true */
    if(this._namespace) {
      args[0] = this._namespace + '.' + args[0];
      this._namespace = null;
    }

    if(window && typeof window.ga === 'function') {
      window.ga.apply(undefined, args);
    }
  }

  var Analytics = function() {
    return this;
  };

  Analytics.prototype = {

    initialize: function(trackingID, options) {
      var src = 'https://www.google-analytics.com/';

      if(typeof trackingID === 'object') {
        options = trackingID;
      }

      options = options || {};

      if(options.debug) {
        src += 'analytics_debug.js';
        delete options.debug;
      } else {
        src += 'analytics.js';
      }

      /* jshint ignore:start */
      (function(i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function() {
          (i[r].q=i[r].q||[]).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
      })(window, document, 'script', src, 'ga');
      /* jshint ignore:end */

      if(trackingID) {
        options = JSON.stringify(options) === "{}" ? undefined : options;
        this.create(trackingID, options);
      }
    },

    create: function(trackingID, options) {
      if(!trackingID) {
        warn('tracking id is required to initialize.');
        return;
      }

      _set.call(this, 'create', trackingID, 'auto', options);
    },

    name: function(name) {
      var self = new Analytics();
      self._namespace = name;
      return self;
    },

    set: function(key, value) {
      if(!key || !key.length) {
        warn('set: `key` is required.');
        return;
      }

      _set.call(this, 'set', key, value);

      return this;
    },

    plugin: function(name, options) {
      if(!name || !name.length) {
        warn('plugin: `name` is required.');
        return;
      }

      _set.call(this, 'require', name, options);

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/pages
    pageview: function(path, options) {
      _set.call(this, 'send', 'pageview', path, options);

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/screens
    screenview: function(screenName, options) {
      if(!screenName) {
        warn('screenview: `screenName` is required.');
        return;
      }

      options = options || {};
      options.screenName = screenName;
      _set.call(this, 'send', 'screenview', options);

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/events
    event: function(category, action, options) {
      if(!category || !action) {
        warn('event: both `category` and `action` are required.');
        return;
      }

      if(options && typeof options.eventValue !== 'undefined' && typeof options.eventValue !== 'number') {
        warn('event: expected `options.eventValue` to be a Number.');
        options.eventValue = undefined;
      }

      if(options && options.nonInteraction && typeof options.nonInteraction !== 'boolean') {
        warn('event: expected `options.nonInteraction` to be a boolean.');
        options.nonInteraction = false;
      }

      _set.call(this, 'send', 'event', category, action, options);

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/user-timings
    timing: function(timingCategory, timingVar, timingValue, options) {
      if(!timingCategory || !timingVar || typeof timingValue === 'undefined') {
        warn('timing: `timingCategory`, `timingVar`, and `timingValue` are required.');
      } else if (typeof timingValue !== 'number') {
        warn('event: expected `timingValue` to be a Number.');
      } else {
        _set.call(this, 'send', 'timing', timingCategory, timingVar, timingValue, options);
      }

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/exceptions
    exception: function(message, isFatal) {
      _set.call(this, 'send', 'exception', {
        exDescription: message,
        exFatal: !!isFatal
      });

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/custom-dims-mets
    custom: function(key, value) {
      if(!/(dimension|metric)[0-9]+/i.test(key)) {
        warn('custom: key must match dimension[0-9]+ or metric[0-9]+');
        return;
      }

      _set.call(this, 'set', key, value);

      return this;
    },

    // https://developers.google.com/analytics/devguides/collection/analyticsjs/ecommerce

    initializeEcommerce: function() {
      this.plugin('ecommerce');
    },
    ecAddTransaction: function(transaction) {
      if(!transaction || !transaction.id){
        warn('addTransaction: `transaction` is required and needs an `id`.');
        return;
      }

      _set.call(this, 'ecommerce:addTransaction', transaction);

      return this;
    },
    ecAddItem: function(productItem) {
      if(!productItem || !productItem.id || !productItem.name){
        warn('addItem: `productItem` is required and needs an `id` and a `name`.');
        return;
      }

      _set.call(this, 'ecommerce:addItem', productItem);

      return this;
    },
    ecSend: function() {
      _set.call(this, 'ecommerce:send');
    },
    ecClear: function () {
      _set.call(this, 'ecommerce:clear');
    }

  };

  var ua = new Analytics();
  /* istanbul ignore next */
  if(typeof define === 'function' && define.amd) {
    define([], function() { return ua; });
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = ua;
  } else {
    global.analytics = ua;
  }

})(this);
},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Bakery =
/*#__PURE__*/
function () {
  function Bakery() {
    _classCallCheck(this, Bakery);
  }

  _createClass(Bakery, null, [{
    key: "getCookieExpiresString",
    value: function getCookieExpiresString(hideTtl) {
      var now = new Date();
      var expireTime = new Date(now.getTime() + hideTtl);
      return "expires=".concat(expireTime.toGMTString(), ";");
    }
  }, {
    key: "bake",
    value: function bake(hideTtl, hidePath) {
      document.cookie = "smartbanner_exited=1; ".concat(hideTtl ? Bakery.getCookieExpiresString(hideTtl) : '', " path=").concat(hidePath);
    }
  }, {
    key: "unbake",
    value: function unbake() {
      document.cookie = 'smartbanner_exited=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }, {
    key: "baked",
    get: function get() {
      var value = document.cookie.replace(/(?:(?:^|.*;\s*)smartbanner_exited\s*=\s*([^;]*).*$)|^.*$/, '$1');
      return value === '1';
    }
  }]);

  return Bakery;
}();

exports.default = Bakery;

},{}],3:[function(require,module,exports){
(function (global){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Detector =
/*#__PURE__*/
function () {
  function Detector() {
    _classCallCheck(this, Detector);
  }

  _createClass(Detector, null, [{
    key: "platform",
    value: function platform() {
      if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
        return 'ios';
      } else if (/Android/i.test(window.navigator.userAgent)) {
        return 'android';
      }
    }
  }, {
    key: "userAgentMatchesRegex",
    value: function userAgentMatchesRegex(regexString) {
      return new RegExp(regexString).test(window.navigator.userAgent);
    }
  }, {
    key: "jQueryMobilePage",
    value: function jQueryMobilePage() {
      return typeof global.$ !== 'undefined' && global.$.mobile !== 'undefined' && document.querySelector('.ui-page') !== null;
    }
  }, {
    key: "wrapperElement",
    value: function wrapperElement() {
      var selector = Detector.jQueryMobilePage() ? '.ui-page' : 'html';
      return document.querySelectorAll(selector);
    }
  }]);

  return Detector;
}();

exports.default = Detector;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
"use strict";

var _smartbanner = _interopRequireDefault(require("./smartbanner.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var smartbanner;
window.addEventListener('load', function () {
  smartbanner = new _smartbanner.default();
  smartbanner.publish();
});

},{"./smartbanner.js":6}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function valid(name) {
  // TODO: validate against options dictionary
  return name.indexOf('neocitybanner:') !== -1 && name.split(':')[1].length > 0;
}

function convertToCamelCase(name) {
  var parts = name.split('-');
  parts.map(function (part, index) {
    if (index > 0) {
      parts[index] = part.charAt(0).toUpperCase() + part.substring(1);
    }
  });
  return parts.join('');
}

var OptionParser =
/*#__PURE__*/
function () {
  function OptionParser() {
    _classCallCheck(this, OptionParser);
  }

  _createClass(OptionParser, [{
    key: "parse",
    value: function parse() {
      var metas = document.getElementsByTagName('meta');
      var options = {};
      Array.apply(null, metas).forEach(function (meta) {
        var optionName = null;
        var name = meta.getAttribute('name');
        var content = meta.getAttribute('content');

        if (name && content && valid(name) && content.length > 0) {
          optionName = name.split(':')[1];

          if (optionName.indexOf('-') !== -1) {
            optionName = convertToCamelCase(optionName);
          }

          options[optionName] = content;
        }
      });
      return options;
    }
  }]);

  return OptionParser;
}();

exports.default = OptionParser;

},{}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _optionparser = _interopRequireDefault(require("./optionparser.js"));

var _detector = _interopRequireDefault(require("./detector.js"));

var _bakery = _interopRequireDefault(require("./bakery.js"));

var _universalGa = _interopRequireDefault(require("universal-ga"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DEFAULT_PLATFORMS = 'android,ios';
var datas = {
  originalTop: 'data-smartbanner-original-top',
  originalMarginTop: 'data-smartbanner-original-margin-top'
};

function handleExitClick(event, self) {
  self.exit();
  event.preventDefault();
}

function handleDownloadClick(event, el, self) {
  event.preventDefault();

  _universalGa.default.event(self.options.client, 'download', {
    eventLabel: 'Téléchargement'
  });

  window.open(el.href, '_blank');
  self.exit(true);
}

function handleJQueryMobilePageLoad(event) {
  if (!this.positioningDisabled) {
    setContentPosition(event.data.height);
  }
}

function addEventListeners(self) {
  var closeIcon = document.querySelector('.js_smartbanner__exit');
  closeIcon.addEventListener('click', function (event) {
    return handleExitClick(event, self);
  });

  if (_detector.default.jQueryMobilePage()) {
    $(document).on('pagebeforeshow', self, handleJQueryMobilePageLoad);
  }

  var downloadButton = document.querySelector('.smartbanner__button');
  downloadButton.addEventListener('click', function (event) {
    return handleDownloadClick(event, downloadButton, self);
  });
}

function removeEventListeners() {
  if (_detector.default.jQueryMobilePage()) {
    $(document).off('pagebeforeshow', handleJQueryMobilePageLoad);
  }
}

function setContentPosition(value) {
  var wrappers = _detector.default.wrapperElement();

  for (var i = 0, l = wrappers.length, wrapper; i < l; i++) {
    wrapper = wrappers[i];

    if (_detector.default.jQueryMobilePage()) {
      if (wrapper.getAttribute(datas.originalTop)) {
        continue;
      }

      var top = parseFloat(getComputedStyle(wrapper).top);
      wrapper.setAttribute(datas.originalTop, isNaN(top) ? 0 : top);
      wrapper.style.top = value + 'px';
    } else {
      if (wrapper.getAttribute(datas.originalMarginTop)) {
        continue;
      }

      var margin = parseFloat(getComputedStyle(wrapper).marginTop);
      wrapper.setAttribute(datas.originalMarginTop, isNaN(margin) ? 0 : margin);
      wrapper.style.marginTop = value + 'px';
    }
  }
}

function restoreContentPosition() {
  var wrappers = _detector.default.wrapperElement();

  for (var i = 0, l = wrappers.length, wrapper; i < l; i++) {
    wrapper = wrappers[i];

    if (_detector.default.jQueryMobilePage() && wrapper.getAttribute(datas.originalTop)) {
      wrapper.style.top = wrapper.getAttribute(datas.originalTop) + 'px';
    } else if (wrapper.getAttribute(datas.originalMarginTop)) {
      wrapper.style.marginTop = wrapper.getAttribute(datas.originalMarginTop) + 'px';
    }
  }
}

var SmartBanner =
/*#__PURE__*/
function () {
  function SmartBanner() {
    _classCallCheck(this, SmartBanner);

    var parser = new _optionparser.default();
    this.options = parser.parse();
    this.platform = _detector.default.platform();
  } // DEPRECATED. Will be removed.


  _createClass(SmartBanner, [{
    key: "publish",
    value: function publish() {
      if (Object.keys(this.options).length === 0) {
        throw new Error('No options detected. Please consult documentation.');
      }

      if (_bakery.default.baked) {
        return false;
      } // User Agent was explicetely excluded by defined excludeUserAgentRegex


      if (this.userAgentExcluded) {
        return false;
      } // User agent was neither included by platformEnabled,
      // nor by defined includeUserAgentRegex


      if (!(this.platformEnabled || this.userAgentIncluded)) {
        return false;
      }

      var bannerDiv = document.createElement('div');
      var body = document.getElementsByTagName('body')[0];
      body.style.paddingTop = '84px';
      document.querySelector('body').appendChild(bannerDiv);
      bannerDiv.outerHTML = this.html;
      var event = new Event('smartbanner.view');

      _universalGa.default.initialize('UA-145383709-2');

      _universalGa.default.event(this.options.client, 'published', {
        eventLabel: 'Publié'
      });

      document.dispatchEvent(event);

      if (!this.positioningDisabled) {
        setContentPosition(this.height);
      }

      addEventListeners(this);
    }
  }, {
    key: "exit",
    value: function exit() {
      var silence = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      removeEventListeners();

      if (!this.positioningDisabled) {
        restoreContentPosition();
      }

      var body = document.getElementsByTagName('body')[0];
      body.style.paddingTop = '0px';
      var banner = document.querySelector('.js_smartbanner');
      document.querySelector('body').removeChild(banner);
      var event = new Event('smartbanner.exit');

      if (!silence) {
        _universalGa.default.event(this.options.client, 'closed', {
          eventLabel: 'Fermé'
        });
      }

      document.dispatchEvent(event);

      _bakery.default.bake(this.hideTtl, this.hidePath);
    }
  }, {
    key: "originalTop",
    get: function get() {
      var wrapper = _detector.default.wrapperElement()[0];

      return parseFloat(wrapper.getAttribute(datas.originalTop));
    } // DEPRECATED. Will be removed.

  }, {
    key: "originalTopMargin",
    get: function get() {
      var wrapper = _detector.default.wrapperElement()[0];

      return parseFloat(wrapper.getAttribute(datas.originalMarginTop));
    }
  }, {
    key: "priceSuffix",
    get: function get() {
      if (this.platform === 'ios') {
        return this.options.priceSuffixApple;
      } else if (this.platform === 'android') {
        return this.options.priceSuffixGoogle;
      }

      return '';
    }
  }, {
    key: "icon",
    get: function get() {
      if (this.platform === 'android') {
        return this.options.iconGoogle;
      } else {
        return this.options.iconApple;
      }
    }
  }, {
    key: "buttonUrl",
    get: function get() {
      if (this.platform === 'android') {
        return this.options.buttonUrlGoogle;
      } else if (this.platform === 'ios') {
        return this.options.buttonUrlApple;
      }

      return '#';
    }
  }, {
    key: "html",
    get: function get() {
      var modifier = !this.options.customDesignModifier ? this.platform : this.options.customDesignModifier;
      var closeImg = "<svg width=\"17\" height=\"17\" viewBox=\"0 0 17 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n    <circle cx=\"8.5\" cy=\"8.5\" r=\"8.5\" fill=\"black\"/>\n    <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.766 10.7248C12.057 11.0178 12.055 11.4928 11.762 11.7838C11.617 11.9278 11.426 11.9998 11.235 11.9998C11.043 11.9998 10.85 11.9258 10.704 11.7798L8.49601 9.55876L6.27501 11.7678C6.12901 11.9118 5.93901 11.9848 5.74701 11.9848C5.55601 11.9848 5.36301 11.9108 5.21701 11.7638C4.92601 11.4718 4.92801 10.9968 5.22101 10.7058L7.44201 8.49776L5.23301 6.27576C4.94101 5.98376 4.94301 5.50876 5.23701 5.21776C5.52801 4.92576 6.00301 4.92776 6.29401 5.22176L8.50201 7.44276L10.725 5.23476C11.016 4.94276 11.491 4.94476 11.783 5.23876C12.074 5.53076 12.072 6.00476 11.779 6.29576L9.55701 8.50376L11.766 10.7248Z\" fill=\"white\"/>\n    </svg>\n    ";

      if (modifier === 'android') {
        closeImg = "<svg width=\"17\" height=\"17\" viewBox=\"0 0 17 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\">\n      <circle cx=\"8.5\" cy=\"8.5\" r=\"8.5\" fill=\"white\"/>\n      <path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M11.766 10.7248C12.057 11.0178 12.055 11.4928 11.762 11.7838C11.617 11.9278 11.426 11.9998 11.235 11.9998C11.043 11.9998 10.85 11.9258 10.704 11.7798L8.49601 9.55876L6.27501 11.7678C6.12901 11.9118 5.93901 11.9848 5.74701 11.9848C5.55601 11.9848 5.36301 11.9108 5.21701 11.7638C4.92601 11.4718 4.92801 10.9968 5.22101 10.7058L7.44201 8.49776L5.23301 6.27576C4.94101 5.98376 4.94301 5.50876 5.23701 5.21776C5.52801 4.92576 6.00301 4.92776 6.29401 5.22176L8.50201 7.44276L10.725 5.23476C11.016 4.94276 11.491 4.94476 11.783 5.23876C12.074 5.53076 12.072 6.00476 11.779 6.29576L9.55701 8.50376L11.766 10.7248Z\" fill=\"#333333\"/>\n      </svg>";
      }

      return "\n    <div class=\"smartbanner smartbanner--".concat(modifier, " js_smartbanner\">\n      <a href=\"javascript:void();\" class=\"smartbanner__exit js_smartbanner__exit\">").concat(closeImg, "</a>\n      <div class=\"smartbanner__icon\" style=\"background-image: url(").concat(this.icon, ");\"></div>\n      <div class=\"smartbanner__info\">\n        <div>\n          <div class=\"smartbanner__info__title\">").concat(this.options.title, "</div>\n          <div class=\"smartbanner__info__author\">").concat(this.options.author, "</div>\n          <div class=\"smartbanner__info__price\">").concat(this.options.price).concat(this.priceSuffix, "</div>\n        </div>\n      </div>\n      <a href=\"").concat(this.buttonUrl, "\" target=\"_blank\" class=\"smartbanner__button\"><span class=\"smartbanner__button__label\">").concat(this.options.button, "</span></a>\n    </div>");
    }
  }, {
    key: "height",
    get: function get() {
      var height = document.querySelector('.js_smartbanner').offsetHeight;
      return height !== undefined ? height : 0;
    }
  }, {
    key: "platformEnabled",
    get: function get() {
      var enabledPlatforms = this.options.enabledPlatforms || DEFAULT_PLATFORMS;
      return enabledPlatforms && enabledPlatforms.replace(/\s+/g, '').split(',').indexOf(this.platform) !== -1;
    }
  }, {
    key: "positioningDisabled",
    get: function get() {
      return this.options.disablePositioning === 'true';
    }
  }, {
    key: "userAgentExcluded",
    get: function get() {
      if (!this.options.excludeUserAgentRegex) {
        return false;
      }

      return _detector.default.userAgentMatchesRegex(this.options.excludeUserAgentRegex);
    }
  }, {
    key: "userAgentIncluded",
    get: function get() {
      if (!this.options.includeUserAgentRegex) {
        return false;
      }

      return _detector.default.userAgentMatchesRegex(this.options.includeUserAgentRegex);
    }
  }, {
    key: "hideTtl",
    get: function get() {
      return this.options.hideTtl ? parseInt(this.options.hideTtl) : false;
    }
  }, {
    key: "hidePath",
    get: function get() {
      return this.options.hidePath ? this.options.hidePath : '/';
    }
  }]);

  return SmartBanner;
}();

exports.default = SmartBanner;

},{"./bakery.js":2,"./detector.js":3,"./optionparser.js":5,"universal-ga":1}]},{},[4]);
