// 今日诗词 V2 NPM-SDK 1.0.0
// 今日诗词API 是一个可以免费调用的诗词接口：https://www.jinrishici.com
const keyName = 'jinrishici-token';

interface ILoadResult {
  status: string;
  data: {
    content: string;
  };
  token: string;
}

type ILoadCallback = (result: ILoadResult) => void;
type ILoadErrHandler = (err: any) => void;

function load(callback: ILoadCallback, errHandler: ILoadErrHandler) {
  if (window.localStorage && window.localStorage.getItem(keyName)) {
    return commonLoad(callback, errHandler, window.localStorage.getItem(keyName) as string);
  } else {
    return corsLoad(callback, errHandler);
  }
}

function corsLoad(callback: ILoadCallback, errHandler: ILoadErrHandler) {
  const newCallBack = (result: ILoadResult) => {
    window.localStorage.setItem(keyName, result.token);
    callback(result);
  };
  return sendRequest(newCallBack, errHandler, 'https://v2.jinrishici.com/one.json?client=npm-sdk/1.0');
}

function commonLoad(callback: ILoadCallback, errHandler: ILoadErrHandler, token: string) {
  return sendRequest(callback, errHandler, 'https://v2.jinrishici.com/one.json?client=npm-sdk/1.0&X-User-Token=' + encodeURIComponent(token));
}

function sendRequest(callback: ILoadCallback, errHandler: ILoadErrHandler, apiUrl: string) {
  const xhr = new XMLHttpRequest();

  xhr.open('get', apiUrl);
  xhr.withCredentials = false;
  xhr.send();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      const data = JSON.parse(xhr.responseText);

      if (data.status === 'success') {
        callback(data);
      } else {
        if (errHandler) {
          errHandler(data);
        } else {
          console.error('今日诗词API加载失败，错误原因：' + data.errMessage);
        }
      }
    }
  };
}

export default { load };