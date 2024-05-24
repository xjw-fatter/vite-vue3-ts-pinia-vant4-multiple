// platform: Android , Ios
// vsrsion: 2.0.0
// JsBridge

(function (win, doc) {
  var DEVICE_IS_IOS = /iP(ad|hone|od)/.test(win.navigator.userAgent);
  var uniqueId = 1;
  var initEvent = new win.Event('yourBridgeNameJsBridgeReady');

  function isFunction(func) {
    return typeof func === 'function';
  }
  function isObject(obj) {
    return obj !== null && Object.prototype.toString.call(obj) === '[object Object]';
  }
  function isArray(arr) {
    return arr && Object.prototype.toString.call(arr) === '[object Array]';
  }
  function isString(str) {
    return typeof str === 'string';
  }
  function createIframeCall(url) {
    setTimeout(function () {
      var iframe = doc.createElement('iframe');
      iframe.style.width = '1px';
      iframe.style.height = '1px';
      iframe.style.display = 'none';
      iframe.src = url;
      doc.body.appendChild(iframe);
      setTimeout(function () {
        doc.body.removeChild(iframe);
      }, 100);
    }, 0);
  }

  /**
   * JsBridge
   */
  function YourBridgeNameJsBridge() {
    this.handlers = [];
  }

  /**
   * exec_async 执行native 暴露的方法
   * @param {*} actioName string
   * @param {*} params  json string {} -> "{}"
   * @param {*} callback
   */
  function exec_async(actioName, params, callback) {
    var callbackfuncName = '_jsBridgeCb_' + uniqueId++ + new Date().getTime();
    if (callback) {
      win[callbackfuncName] = callback;
    }
    params = JSON.stringify(params);
    if (DEVICE_IS_IOS) {
      if (!window.webkit.messageHandlers[actioName]) {
        alert(actioName + '方法不存在');
        return;
      }
      window.webkit.messageHandlers[actioName].postMessage([params, callbackfuncName]);
    } else {
      window.nativeJs && window.nativeJs.execute && window.nativeJs.execute(actioName, params, callbackfuncName);
    }
  }

  /**
   * invoke
   * actioName string 动作名字
   * params  Object 参数，json对象格式 {}
   * callback 回调函数
   */
  YourBridgeNameJsBridge.prototype.invoke = function (actioName, params, callback) {
    if (!actioName || !isString(actioName)) {
      console.log('actioName 格式不合法');
      return;
    }
    if (!isObject(params)) {
      console.log('params 格式不合法');
      return;
    }
    if (callback && !isFunction(callback)) {
      console.log('callback 格式不合法');
      return;
    }
    exec_async(actioName, params, callback);
  };
  /**
   * callByNative
   * native 执行js 回调方法
   * options  Object
   * options 结构
   * callerId: 回调函数id
   * error: 0 -> 正常， -1 -> 异常
   * data: 返回数据 json Object
   * {
   *  callerId: calllbackid,
   *  error: 0 || -1
   *  data: {
   *          msg: "",
   *          result: {} || [] || ""
   *    }
   * }
   */
  YourBridgeNameJsBridge.prototype.callByNative = function (options) {
    var callerId = options.callerId;
    if (!callerId) {
      alert('回调方法不能为空');
      return;
    }
    if (!win[callerId]) {
      alert('不存在该回调方法');
      return;
    }
    win[callerId](options.error, options.data);
    if (options.needStore) {
      //保存web方法
      this.handlers.indexOf(callerId) < 0 && this.handlers.push(callerId);
      return;
    }
    delete win[callerId]; // 删除掉回调方法
  };

  /**
   * clearHandles  清除挂载在window对象上的全部方法
   */
  YourBridgeNameJsBridge.prototype.clearHandlers = function () {
    this.handlers.forEach(function (callerId) {
      win[callerId] && delete win[callerId];
    });
    this.handlers = [];
  };

  if (!window.yourBridgeNameJsBridge) {
    window.yourBridgeNameJsBridge = new YourBridgeNameJsBridge();
  }
  doc.dispatchEvent(initEvent); // 初始化，表明jsBridge  已经加载完毕
})(window, document);
