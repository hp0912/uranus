import url from 'url';

export function formatDate(timestamp: number) {
  const date = new Date(timestamp);

  const YY = date.getFullYear().toString() + '-';
  const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1).toString() : date.getMonth() + 1).toString() + '-';
  const DD = (date.getDate() < 10 ? '0' + (date.getDate().toString()) : date.getDate().toString());

  const hh = (date.getHours() < 10 ? '0' + date.getHours().toString() : date.getHours().toString()) + ':';
  const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes().toString() : date.getMinutes().toString()) + ':';
  const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds().toString() : date.getSeconds().toString());

  return YY + MM + DD + " " + hh + mm + ss;
}

export function getTokenFromQueryString(): string | undefined {
  const queryJSON = url.parse(window.location.search, true, false);
  const query = queryJSON.query;
  if (typeof query.token === 'string') {
    return query.token;
  }
}

export interface IBrowserDetect {
  webkit: boolean;
  playbook: boolean;
  silk: boolean;
  chrome: boolean;
  firefox: boolean;
  ie: boolean;
  safari: boolean;
  webview?: boolean;
  wechat: boolean;
  baidu: boolean;
  qq: boolean;
  uc: boolean;
  sogou: boolean;
  xiaomi: boolean;
  liebao: boolean;
  mercury: boolean;
  standalone: boolean;
  version: string | null;
}

export interface IOSDetect {
  android: boolean;
  iphone: boolean;
  ios: boolean;
  ipad: boolean;
  ipod: boolean;
  wp: boolean;
  webos: boolean;
  touchpad: boolean;
  blackberry: boolean;
  bb10: boolean;
  rimtabletos: boolean;
  kindle: boolean;
  tablet: boolean;
  phone: boolean;
  version: string | null;
}

export function browserDetect(ua: string): { browser: IBrowserDetect, os: IOSDetect } {
  const os: IOSDetect = {
    android: false,
    iphone: false,
    ios: false,
    ipad: false,
    ipod: false,
    wp: false,
    webos: false,
    touchpad: false,
    blackberry: false,
    bb10: false,
    rimtabletos: false,
    kindle: false,
    tablet: false,
    phone: false,
    version: null,
  };
  const browser: IBrowserDetect = {
    webkit: false,
    playbook: false,
    silk: false,
    chrome: false,
    firefox: false,
    ie: false,
    safari: false,
    webview: false,
    wechat: false,
    baidu: false,
    qq: false,
    uc: false,
    sogou: false,
    xiaomi: false,
    liebao: false,
    mercury: false,
    standalone: false,
    version: null,
  };

  const webkit = ua.match(/Web[kK]it[/]{0,1}([\d.]+)/);
  const android = ua.match(/(Android);?[\s/]+([\d.]+)?/);
  const osx = !!ua.match(/\(Macintosh; Intel /);
  const ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
  const webos = ua.match(/(webOS|hpwOS)[\s/]([\d.]+)/);
  const wp = ua.match(/Windows Phone ([\d.]+)/);
  const touchpad = webos && ua.match(/TouchPad/);
  const kindle = ua.match(/Kindle\/([\d.]+)/);
  const silk = ua.match(/Silk\/([\d._]+)/);
  const blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/);
  const bb10 = ua.match(/(BB10).*Version\/([\d.]+)/);
  const rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/);
  const playbook = ua.match(/PlayBook/);
  const chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/);
  const firefox = ua.match(/Firefox\/([\d.]+)/);
  const ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^?]+).*rv:([0-9.].)/);

  const webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/);
  const safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

  const wechat = ua.match(/MicroMessenger\/([\d.]+)/);
  const baidu = ua.match(/baiduboxapp\/[^/]+\/([\d.]+)_/)
    || ua.match(/baiduboxapp\/([\d.]+)/)
    || ua.match(/BaiduHD\/([\d.]+)/)
    || ua.match(/FlyFlow\/([\d.]+)/)
    || ua.match(/baidubrowser\/([\d.]+)/);
  const qq = ua.match(/MQQBrowser\/([\d.]+)/) || ua.match(/QQ\/([\d.]+)/);
  const uc = ua.match(/UCBrowser\/([\d.]+)/);
  const sogou = ua.match(/SogouMobileBrowser\/([\d.]+)/);
  const xiaomi = android && ua.match(/MiuiBrowser\/([\d.]+)/);
  const liebao = ua.match(/LBKIT/);
  const mercury = ua.match(/Mercury\/([\d.]+)/);

  browser.webkit = !!webkit;
  if (webkit) {
    browser.version = webkit[1];
  }
  if (android) {
    os.android = true;
    os.version = android[2];
  }
  if (iphone && !ipod) {
    os.ios = os.iphone = true;
    os.version = iphone[2].replace(/_/g, '.');
  }
  if (ipad) {
    os.ios = os.ipad = true;
    os.version = ipad[2].replace(/_/g, '.');
  }
  if (ipod) {
    os.ios = os.ipod = true;
    os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
  }
  if (wp) {
    os.wp = true;
    os.version = wp[1];
  }
  if (webos) {
    os.webos = true;
    os.version = webos[2];
  }
  if (touchpad) {
    os.touchpad = true;
  }
  if (blackberry) {
    os.blackberry = true;
    os.version = blackberry[2];
  }
  if (bb10) {
    os.bb10 = true;
    os.version = bb10[2];
  }
  if (rimtabletos) {
    os.rimtabletos = true;
    os.version = rimtabletos[2];
  }
  if (playbook) {
    browser.playbook = true;
  }
  if (kindle) {
    os.kindle = true;
    os.version = kindle[1];
  }
  if (silk) {
    browser.silk = true;
    browser.version = silk[1];
  }
  if (!silk && os.android && ua.match(/Kindle Fire/)) {
    browser.silk = true;
  }
  if (chrome) {
    browser.chrome = true;
    browser.version = chrome[1];
  }
  if (firefox) {
    browser.firefox = true;
    browser.version = firefox[1];
  }
  if (ie) {
    browser.ie = true;
    browser.version = ie[1];
  }
  if (safari && (osx || os.ios)) {
    browser.safari = true;
    if (osx) {
      browser.version = safari[1];
    }
  }
  if (webview) {
    browser.webview = true;
  }
  if (wechat) {
    browser.wechat = true;
    browser.version = wechat[1];
  }
  if (baidu) {
    delete browser.webview;
    browser.baidu = true;
    browser.version = baidu[1];
  }
  if (qq) {
    browser.qq = true;
    browser.version = qq[1];
  }
  if (uc) {
    delete browser.webview;
    browser.uc = true;
    browser.version = uc[1];
  }
  if (sogou) {
    delete browser.webview;
    browser.sogou = true;
    browser.version = sogou[1];
  }
  if (xiaomi) {
    browser.xiaomi = true;
    browser.version = xiaomi[1];
  }
  if (liebao) {
    browser.liebao = true;
    browser.version = '0';
  }
  if (mercury) {
    browser.mercury = true;
    browser.version = mercury[1];
  }
  if ((navigator as any).standalone) {
    browser.standalone = true;
  }

  os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
  os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 || (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));

  return {
    browser,
    os,
  };
}
