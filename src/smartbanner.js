import OptionParser from './optionparser.js';
import Detector from './detector.js';
import Bakery from './bakery.js';
import analytics from 'universal-ga';

const DEFAULT_PLATFORMS = 'android,ios';

let datas = {
  originalTop: 'data-smartbanner-original-top',
  originalMarginTop: 'data-smartbanner-original-margin-top'
};

function handleExitClick(event, self) {
  self.exit();
  event.preventDefault();
}

function handleDownloadClick(event, el, self) {
  event.preventDefault();
  analytics.event(self.options.client, 'download', { eventLabel: 'Téléchargement' });
  window.open(el.href, '_blank');
  self.exit(true);
}

function handleJQueryMobilePageLoad(event) {
  if (!this.positioningDisabled) {
    setContentPosition(event.data.height);
  }
}


function addEventListeners(self) {
  let closeIcon = document.querySelector('.js_smartbanner__exit');
  closeIcon.addEventListener('click', (event) => handleExitClick(event, self));
  if (Detector.jQueryMobilePage()) {
    $(document).on('pagebeforeshow', self, handleJQueryMobilePageLoad);
  }
  let downloadButton = document.querySelector('.smartbanner__button');
  downloadButton.addEventListener('click', (event) => handleDownloadClick(event, downloadButton, self));
}

function removeEventListeners() {
  if (Detector.jQueryMobilePage()) {
    $(document).off('pagebeforeshow', handleJQueryMobilePageLoad);
  }
}

function setContentPosition(value) {
  let wrappers = Detector.wrapperElement();
  for (let i = 0, l = wrappers.length, wrapper; i < l; i++) {
    wrapper = wrappers[i];
    if (Detector.jQueryMobilePage()) {
      if (wrapper.getAttribute(datas.originalTop)) {
        continue;
      }
      let top = parseFloat(getComputedStyle(wrapper).top);
      wrapper.setAttribute(datas.originalTop, isNaN(top) ? 0 : top);
      wrapper.style.top = value + 'px';
    } else {
      if (wrapper.getAttribute(datas.originalMarginTop)) {
        continue;
      }
      let margin = parseFloat(getComputedStyle(wrapper).marginTop);
      wrapper.setAttribute(datas.originalMarginTop, isNaN(margin) ? 0 : margin);
      wrapper.style.marginTop = value + 'px';
    }
  }
}

function restoreContentPosition() {
  let wrappers = Detector.wrapperElement();
  for (let i = 0, l = wrappers.length, wrapper; i < l; i++) {
    wrapper = wrappers[i];
    if (Detector.jQueryMobilePage() && wrapper.getAttribute(datas.originalTop)) {
      wrapper.style.top = wrapper.getAttribute(datas.originalTop) + 'px';
    } else if (wrapper.getAttribute(datas.originalMarginTop)) {
      wrapper.style.marginTop = wrapper.getAttribute(datas.originalMarginTop) + 'px';
    }
  }
}

export default class SmartBanner {

  constructor() {
    let parser = new OptionParser();
    this.options = parser.parse();
    this.platform = Detector.platform();
  }

  // DEPRECATED. Will be removed.
  get originalTop() {
    let wrapper = Detector.wrapperElement()[0];
    return parseFloat(wrapper.getAttribute(datas.originalTop));
  }

  // DEPRECATED. Will be removed.
  get originalTopMargin() {
    let wrapper = Detector.wrapperElement()[0];
    return parseFloat(wrapper.getAttribute(datas.originalMarginTop));
  }

  get priceSuffix() {
    if (this.platform === 'ios') {
      return this.options.priceSuffixApple;
    } else if (this.platform === 'android') {
      return this.options.priceSuffixGoogle;
    }
    return '';
  }

  get icon() {
    if (this.platform === 'android') {
      return this.options.iconGoogle;
    } else {
      return this.options.iconApple;
    }
  }

  get buttonUrl() {
    if (this.platform === 'android') {
      return this.options.buttonUrlGoogle;
    } else if (this.platform === 'ios') {
      return this.options.buttonUrlApple;
    }
    return '#';
  }

  get html() {
    let modifier = !this.options.customDesignModifier ? this.platform : this.options.customDesignModifier;
    let closeImg = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8.5" cy="8.5" r="8.5" fill="black"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.766 10.7248C12.057 11.0178 12.055 11.4928 11.762 11.7838C11.617 11.9278 11.426 11.9998 11.235 11.9998C11.043 11.9998 10.85 11.9258 10.704 11.7798L8.49601 9.55876L6.27501 11.7678C6.12901 11.9118 5.93901 11.9848 5.74701 11.9848C5.55601 11.9848 5.36301 11.9108 5.21701 11.7638C4.92601 11.4718 4.92801 10.9968 5.22101 10.7058L7.44201 8.49776L5.23301 6.27576C4.94101 5.98376 4.94301 5.50876 5.23701 5.21776C5.52801 4.92576 6.00301 4.92776 6.29401 5.22176L8.50201 7.44276L10.725 5.23476C11.016 4.94276 11.491 4.94476 11.783 5.23876C12.074 5.53076 12.072 6.00476 11.779 6.29576L9.55701 8.50376L11.766 10.7248Z" fill="white"/>
    </svg>
    `;
    if (modifier === 'android') {
      closeImg = `<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.5" cy="8.5" r="8.5" fill="white"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.766 10.7248C12.057 11.0178 12.055 11.4928 11.762 11.7838C11.617 11.9278 11.426 11.9998 11.235 11.9998C11.043 11.9998 10.85 11.9258 10.704 11.7798L8.49601 9.55876L6.27501 11.7678C6.12901 11.9118 5.93901 11.9848 5.74701 11.9848C5.55601 11.9848 5.36301 11.9108 5.21701 11.7638C4.92601 11.4718 4.92801 10.9968 5.22101 10.7058L7.44201 8.49776L5.23301 6.27576C4.94101 5.98376 4.94301 5.50876 5.23701 5.21776C5.52801 4.92576 6.00301 4.92776 6.29401 5.22176L8.50201 7.44276L10.725 5.23476C11.016 4.94276 11.491 4.94476 11.783 5.23876C12.074 5.53076 12.072 6.00476 11.779 6.29576L9.55701 8.50376L11.766 10.7248Z" fill="#333333"/>
      </svg>`;
    }
    return `
    <div class="smartbanner smartbanner--${modifier} js_smartbanner">
      <a href="javascript:void();" class="smartbanner__exit js_smartbanner__exit">${closeImg}</a>
      <div class="smartbanner__icon" style="background-image: url(${this.icon});"></div>
      <div class="smartbanner__info">
        <div>
          <div class="smartbanner__info__title">${this.options.title}</div>
          <div class="smartbanner__info__author">${this.options.author}</div>
          <div class="smartbanner__info__price">${this.options.price}${this.priceSuffix}</div>
        </div>
        <a href="${this.buttonUrl}" target="_blank" class="smartbanner__button"><span class="smartbanner__button__label">${this.options.button}</span></a>
      </div>
    </div>`;
  }

  get height() {
    let height = document.querySelector('.js_smartbanner').offsetHeight;
    return height !== undefined ? height : 0;
  }

  get platformEnabled() {
    let enabledPlatforms = this.options.enabledPlatforms || DEFAULT_PLATFORMS;
    return enabledPlatforms && enabledPlatforms.replace(/\s+/g, '').split(',').indexOf(this.platform) !== -1;
  }

  get positioningDisabled() {
    return this.options.disablePositioning === 'true';
  }

  get userAgentExcluded() {
    if (!this.options.excludeUserAgentRegex) {
      return false;
    }
    return Detector.userAgentMatchesRegex(this.options.excludeUserAgentRegex);
  }

  get userAgentIncluded() {
    if (!this.options.includeUserAgentRegex) {
      return false;
    }
    return Detector.userAgentMatchesRegex(this.options.includeUserAgentRegex);
  }

  get hideTtl() {
    return this.options.hideTtl ? parseInt(this.options.hideTtl) : false;
  }

  get hidePath() {
    return this.options.hidePath ? this.options.hidePath : '/';
  }

  publish() {
    if (Object.keys(this.options).length === 0) {
      throw new Error('No options detected. Please consult documentation.');
    }

    if (Bakery.baked) {
      return false;
    }

    // User Agent was explicetely excluded by defined excludeUserAgentRegex
    if (this.userAgentExcluded) {
      return false;
    }

    // User agent was neither included by platformEnabled,
    // nor by defined includeUserAgentRegex
    if (!(this.platformEnabled || this.userAgentIncluded)) {
      return false;
    }

    let bannerDiv = document.createElement('div');
    let body = document.getElementsByTagName('body')[0];
    body.style.paddingTop = '84px';
    document.querySelector('body').appendChild(bannerDiv);
    bannerDiv.outerHTML = this.html;
    let event = new Event('smartbanner.view');
    analytics.initialize('UA-145383709-2');
    analytics.event(this.options.client, 'published', { eventLabel: 'Publié' });
    document.dispatchEvent(event);
    if (!this.positioningDisabled) {
      setContentPosition(this.height);
    }
    addEventListeners(this);
  }

  exit(silence = false) {
    removeEventListeners();
    if (!this.positioningDisabled) {
      restoreContentPosition();
    }
    const body = document.getElementsByTagName('body')[0];
    body.style.paddingTop = '0px';
    let banner = document.querySelector('.js_smartbanner');
    document.querySelector('body').removeChild(banner);
    let event = new Event('smartbanner.exit');
    if (!silence) {
      analytics.event(this.options.client, 'closed', { eventLabel: 'Fermé' });
    }
    document.dispatchEvent(event);
    Bakery.bake(this.hideTtl, this.hidePath);
  }
}
