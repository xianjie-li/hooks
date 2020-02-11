'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var reactUse = require('react-use');
var react = require('react');
var utils = require('@lxjx/utils');
var reactRouterDom = require('react-router-dom');
var qs = _interopDefault(require('query-string'));

var useBreakPointBase = reactUse.createBreakpoint({
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600
});

var useBreakPoint = function useBreakPoint() {
  var bp = useBreakPointBase();
  return {
    xs: bp === 'xs',
    sm: bp === 'sm',
    md: bp === 'md',
    lg: bp === 'lg',
    xl: bp === 'xl',
    xxl: bp === 'xxl'
  };
};

var eventStore = {};
/**
 * 触发一个自定义事件
 * eventKey: 事件名
 * payload: 参数
 * */

function customEventEmit(eventKey, payload) {
  var events = eventStore[eventKey];
  if (!events || !Array.isArray(events)) return;
  if (events.length === 0) return;
  events.forEach(function (event) {
    event.handle(payload);
  });
}
/**
 * 绑定一个自定义事件，可以在任意组件任意位置触发它, 每个事件可以多次绑定不同的处理函数
 * eventKey? - 事件名
 * handle? - 事件处理程序
 * inputs? - 依赖数组，默认会在每一次更新时替换handle，当handle中不依赖或部分依赖其他状态时，可通过此项指定(!不要通过inputs传入未memo的引用对象!)
 * */

function useCustomEvent(eventKey, handle, inputs) {
  var flag = react.useRef(Math.random()); // 防止重复添加

  var key = eventKey;
  react.useEffect(function () {
    if (key && handle) {
      if (!Array.isArray(eventStore[key])) {
        eventStore[key] = [];
      }

      var existInd = eventStore[key].findIndex(function (item) {
        return item.flag === flag.current;
      });
      var nowEvent = {
        handle: handle,
        flag: flag.current
      }; // 事件存在时覆盖原有事件

      if (existInd !== -1) {
        eventStore[key][existInd] = nowEvent;
      } else {
        eventStore[key].push(nowEvent);
      }
    } // 移除事件


    return function () {
      var events = eventStore[key];
      if (!key || !handle || !events) return;
      if (events.length === 0) return; // eslint-disable-next-line react-hooks/exhaustive-deps

      var index = events.findIndex(function (item) {
        return item.flag === flag.current;
      });
      eventStore[key].splice(index, 1);
    }; // eslint-disable-next-line
  }, inputs || [handle, key]);
  return customEventEmit;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }

  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/** 返回类似类组件的this的实例属性 */

function useSelf() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var self = react.useRef(init);
  return self.current;
}

function useIsInitMount() {
  var count = react.useRef(0);
  var isInit = count.current === 0;
  react.useEffect(function () {
    count.current++;
  }, []);
  return isInit;
}

var BASE_KEY = 'USE_SESSION_STATE_CACHE';

function setSessionState(key, beCache) {
  if (beCache || beCache === 0) {
    window.sessionStorage.setItem("".concat(BASE_KEY, "_").concat(key.toUpperCase()), JSON.stringify(beCache));
  }
}

function getSessionState(key) {
  var cache = window.sessionStorage.getItem("".concat(BASE_KEY, "_").concat(key.toUpperCase()));
  return cache === null ? cache : JSON.parse(cache);
}

function useSessionState(key, initialState, option) {
  var _ref = option || {},
      _ref$disable = _ref.disable,
      disable = _ref$disable === void 0 ? false : _ref$disable;

  var _useState = react.useState(function () {
    if (!disable) {
      var cache = getSessionState(key);

      if (cache !== null) {
        // null以外的值都视为缓存
        console.log(key, cache);
        return cache;
      }
    }

    if (initialState instanceof Function) {
      return initialState();
    }

    return initialState;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  var _setState = react.useCallback(function (patch) {
    if (patch instanceof Function) {
      setState(function (prev) {
        var patchRes = patch(prev);
        !disable && setSessionState(key, patchRes);
        return patchRes;
      });
    } else {
      !disable && setSessionState(key, patch);
      setState(patch);
    } // eslint-disable-next-line

  }, [setState]);

  return [state, _setState];
}

/* 与react-use的useSetState一样, 但是额外返回了一个setOverState用于覆盖状态 */

var useSessionSetState = function useSessionSetState(key) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 ? arguments[2] : undefined;

  var _useSessionState = useSessionState(key, initialState, options),
      _useSessionState2 = _slicedToArray(_useSessionState, 2),
      state = _useSessionState2[0],
      set = _useSessionState2[1];

  var setState = react.useCallback(function (patch) {
    set(function (prevState) {
      return _objectSpread2({}, prevState, {}, patch instanceof Function ? patch(prevState) : patch);
    });
  }, [set]);
  return [state, setState, set];
};

var placeHolderFn = function placeHolderFn() {
  return undefined;
};

var useFetch = function useFetch(method) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _options$pass = options.pass,
      pass = _options$pass === void 0 ? true : _options$pass,
      _options$inputs = options.inputs,
      inputs = _options$inputs === void 0 ? [] : _options$inputs,
      _options$isPost = options.isPost,
      isPost = _options$isPost === void 0 ? false : _options$isPost,
      initData = options.initData,
      initPayload = options.initPayload,
      initExtraData = options.initExtraData,
      search = options.search,
      _options$timeout = options.timeout,
      timeout = _options$timeout === void 0 ? 8000 : _options$timeout,
      pollingInterval = options.pollingInterval,
      cacheKey = options.cacheKey,
      _options$onSuccess = options.onSuccess,
      onSuccess = _options$onSuccess === void 0 ? placeHolderFn : _options$onSuccess,
      _options$onError = options.onError,
      onError = _options$onError === void 0 ? placeHolderFn : _options$onError,
      _options$onComplete = options.onComplete,
      onComplete = _options$onComplete === void 0 ? placeHolderFn : _options$onComplete,
      _options$onTimeout = options.onTimeout,
      onTimeout = _options$onTimeout === void 0 ? placeHolderFn : _options$onTimeout;
  var isCache = !!cacheKey && !isPost; // 包含用于缓存的key并且非isPost时，缓存才会生效

  var _initData = initData instanceof Function ? initData() : initData;
  /* pass规则：为函数时取返回值，函数内部报错时取false，否则直接取pass的值 */


  var isPass = pass;

  if (utils.isFunction(pass)) {
    try {
      isPass = pass();
    } catch (err) {
      isPass = false;
    }
  }

  var self = useSelf({
    isUpdate: false,
    isManual: false,
    lastFetch: Date.now()
  });
  var isInit = useIsInitMount();

  var _useState = react.useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      force = _useState2[0],
      forceUpdate = _useState2[1];

  var _useSessionSetState = useSessionSetState("".concat(cacheKey, "_FETCH_PAYLOAD"), initPayload, {
    disable: !isCache
  }),
      _useSessionSetState2 = _slicedToArray(_useSessionSetState, 3),
      payload = _useSessionSetState2[0],
      setPayload = _useSessionSetState2[1],
      setOverPayload = _useSessionSetState2[2];

  var _useSessionSetState3 = useSessionSetState("".concat(cacheKey, "_FETCH_EXTRA"), initExtraData, {
    disable: !isCache
  }),
      _useSessionSetState4 = _slicedToArray(_useSessionSetState3, 2),
      extraData = _useSessionSetState4[0],
      setExtraData = _useSessionSetState4[1];
  /* 常用关联值存一个state减少更新 */


  var _useSessionSetState5 = useSessionSetState("".concat(cacheKey, "_FETCH_STATES"), {
    data: _initData,
    loading: false,
    error: undefined,
    timeout: false
  }, {
    disable: !isCache
  }),
      _useSessionSetState6 = _slicedToArray(_useSessionSetState5, 2),
      state = _useSessionSetState6[0],
      setState = _useSessionSetState6[1];
  /* 轮询处理 */


  react.useEffect(function intervalHandle() {
    var timer;

    if (pollingInterval && pollingInterval > 500) {
      timer = window.setInterval(function () {
        var now = Date.now();
        var last = self.lastFetch;
        var reFetch = now - last >= pollingInterval;
        reFetch && _update();
      }, pollingInterval);
    }

    return function () {
      timer && clearInterval(timer);
    }; // eslint-disable-next-line
  }, [pollingInterval]);
  /* 将inputs改变标记为isUpdate */

  react.useEffect(function flagUpdate() {
    if (!isInit) {
      self.isUpdate = true;
    } // eslint-disable-next-line react-hooks/exhaustive-deps

  }, _toConsumableArray(inputs));
  react.useEffect(function fetchHandle() {
    var _isUpdate = self.isUpdate;
    var _isManual = self.isManual;
    self.isUpdate = false;
    self.isManual = false; // 处理post请求

    if (isPost && !_isManual) {
      setState(_objectSpread2({}, getResetState('data', _initData)));
      return;
    }

    var ignore = false;
    var timer;

    function fetcher() {
      return _fetcher.apply(this, arguments);
    }

    function _fetcher() {
      _fetcher = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                setState(_objectSpread2({}, getResetState('loading', true)));
                self.lastFetch = Date.now();
                timer = setTimeout(function () {
                  ignore = true;
                  onTimeout();
                  setState(_objectSpread2({}, getResetState('timeout', true)));
                }, timeout);
                _context.prev = 3;
                _context.next = 6;
                return method(search !== undefined ? search : payload);

              case 6:
                response = _context.sent;

                if (!ignore) {
                  _context.next = 9;
                  break;
                }

                return _context.abrupt("return");

              case 9:
                setState(_objectSpread2({}, getResetState('data', response)));
                onSuccess(response, _isUpdate);
                _context.next = 19;
                break;

              case 13:
                _context.prev = 13;
                _context.t0 = _context["catch"](3);

                if (!ignore) {
                  _context.next = 17;
                  break;
                }

                return _context.abrupt("return");

              case 17:
                setState(_objectSpread2({}, getResetState('error', _context.t0)));
                onError(_context.t0);

              case 19:
                _context.prev = 19;
                !ignore && onComplete();
                clearTimeout(timer);
                return _context.finish(19);

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 13, 19, 23]]);
      }));
      return _fetcher.apply(this, arguments);
    }

    if (isPass) {
      fetcher().then();
    }

    return function () {
      ignore = true;
      timer && clearTimeout(timer);
    }; // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload, search, isPass, force].concat(_toConsumableArray(inputs)));
  /* 返回一个将互斥的状态还原的对象，并通过键值设置某个值 */

  function getResetState(key, value) {
    return _defineProperty({
      loading: false,
      error: undefined,
      timeout: false
    }, key, value);
  }

  var memoSetState = react.useCallback(_setState, [setState]);

  function _setState(patch) {
    setState(function (_ref2) {
      var data = _ref2.data;

      var _patch = utils.isFunction(patch) ? patch(data) : patch;

      return {
        data: _objectSpread2({}, data, {}, _patch)
      };
    });
  }

  var update = react.useCallback(_update, [isPass]);

  function _update() {
    if (!isPass) return;
    self.isUpdate = true;
    forceUpdate(function (p) {
      return ++p;
    });
  }

  var send = react.useCallback(_send, [update]);

  function _send(_payload) {
    if (!isPass || !isPost) return;
    self.isManual = true;
    _payload ? setOverPayload(_payload) : update();
  }

  return _objectSpread2({}, state, {
    payload: payload,
    setPayload: setPayload,
    setOverPayload: setOverPayload,
    update: update,
    send: send,
    search: search,
    setData: memoSetState,
    extraData: extraData,
    setExtraData: setExtraData
  });
};

var VALUE = 'value';
var DEFAULT_VALUE = 'defaultValue';
var TRIGGER = 'onChange';
/**
 * 当useFormState传入props的key与预设的不一致时，通过此函数进行映射
 * @param props - 透传给useFormState
 * @param maps - 将props中的指定key映射为value、defaultValue、onChange
 *
 * 只有当props包含map中指定的参数时，代理才会生效
 * */

function formStateMap(props, _ref) {
  var value = _ref.value,
      defaultValue = _ref.defaultValue,
      trigger = _ref.trigger;

  var _props = _objectSpread2({}, props);

  if (value && value in props) {
    _props[VALUE] = props[value];
  }

  if (defaultValue && defaultValue in props) {
    _props[DEFAULT_VALUE] = props[defaultValue];
  }

  if (trigger && trigger in props) {
    _props[TRIGGER] = props[trigger];
  }

  return _props;
}
/**
 * 快捷的实现统一接口的受控、非受控组件
 * @param props - 透传消费组件的props，该组件需要实现FormLike接口或通过formStateMap定制key
 * @param defaultValue - 默认值，会被value与defaultValue覆盖
 * @interface <T> - value的类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * @returns [state, setFormState] - 表单状态与更新表单状态的方法，接口与useState相似
 * */

function useFormState(props, defaultValue) {
  var value = props.value,
      onChange = props.onChange,
      propDefaultValue = props.defaultValue; // 用于在一些特定的位置能立即获取到state

  var stateRef = react.useRef(); // 设置表单状态

  var _useState = react.useState(function () {
    // 初始状态获取说明: value > defaultValue > useFormState中配置的defaultValue
    var val = defaultValue;

    if (VALUE in props) {
      val = value;
    }

    if (DEFAULT_VALUE in props) {
      val = propDefaultValue;
    }

    return stateRef.current = val;
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];
  /* 为受控组件同步状态 */


  reactUse.useUpdateEffect(function () {
    if (VALUE in props) {
      // 如果两次值显式相等则跳过
      value !== stateRef.current && setState(stateRef.current = value);
    }
  }, [value]);
  /* 处理修改表单值 */

  var setFormState = function setFormState(patch, extra) {
    /* 是受控组件则将新值通过onChange回传即可，非受控组件设置本地状态并通过onChange通知 */
    var hasValue = VALUE in props;

    if (utils.isFunction(patch)) {
      if (!hasValue) {
        setState(function (prev) {
          var patchResult = patch(prev);
          onChange && onChange(patchResult, extra);
          return patchResult;
        });
      } else {
        var patchResult = patch(stateRef.current);
        onChange && onChange(patchResult, extra);
      }
    } else {
      onChange && onChange(patch, extra);

      if (!hasValue) {
        setState(patch);
      }
    }
  };

  return [state, setFormState];
}

/* 获取滚动条宽度 */

function getScrollBarWidth() {
  // Create the measurement node
  var scrollDiv = document.createElement('div');
  scrollDiv.style.overflow = 'scroll';
  document.body.appendChild(scrollDiv); // Get the scrollbar width

  var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth; // Delete the DIV

  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
}
/* 是否包含滚动条 */


function hasScrollBar(el) {
  var docScrollH = el.scrollHeight;
  var docH = el.offsetHeight;
  return docScrollH > docH;
}

var scrollBarWidth = getScrollBarWidth();
var lockCount = 0; // 当前锁定的数量

var firstWidth = ''; // 保留第一个锁定是的style用于还原

/** 基于react-use的useLockBodyScroll，隐藏时会对滚动条所占位置进行修正，防止页面抖动 */

var useLockBodyScroll = function useLockBodyScroll(locked, elementRef) {
  var firstMount = reactUse.useFirstMountState();
  react.useEffect(function () {
    // 是否包含滚动条
    var hasScroll = hasScrollBar(document.documentElement); // 是否需要进行处理 包含滚动条 + locked为true + 非初始化

    var doHandle = hasScroll && locked && !firstMount;

    if (doHandle) {
      if (lockCount === 0) {
        var bodyStyleWidth = document.body.style.width;

        if (!firstWidth) {
          firstWidth = bodyStyleWidth;
        }

        document.body.style.width = "calc(".concat(bodyStyleWidth || '100%', " - ").concat(scrollBarWidth, "px)");
      }

      lockCount++;
    }

    return function () {
      if (doHandle) {
        lockCount--;

        if (lockCount === 0) {
          document.body.style.width = firstWidth;
          firstWidth = '';
        }
      }
    };
  }, [firstMount, locked]);
  return reactUse.useLockBodyScroll(locked, elementRef);
};

/**
 * 用于便捷的获取或设置react-router v5的query string
 * @interface <Query> - any | 查询对象的接口格式
 * @return result
 * @return result.search - 原始查询字符串
 * @return result.queryObject - 根据search解析得到的对象
 * @return result.set - 将包含一个或多个查询值的对象覆盖到当前url查询上
 * @return result.coverSet - 同set，区别是会重置掉所有search并设置为传入的查询对象
 * */

function useQuery() {
  var _useHistory = reactRouterDom.useHistory(),
      replace = _useHistory.replace;

  var _useLocation = reactRouterDom.useLocation(),
      search = _useLocation.search,
      pathname = _useLocation.pathname,
      hash = _useLocation.hash;

  var queryObject = qs.parse(search);

  function navWidthNewSearch(newQO) {
    replace("".concat(pathname, "?").concat(qs.stringify(newQO)).concat(hash));
  }

  var set = react.useCallback(function (queryItem) {
    var newQueryObject = _objectSpread2({}, queryObject, {}, queryItem);

    navWidthNewSearch(newQueryObject); // eslint-disable-next-line
  }, [search]);
  var coverSet = react.useCallback(function (queryItem) {
    navWidthNewSearch(queryItem); // eslint-disable-next-line
  }, [search]);
  return {
    search: search,
    queryObject: queryObject,
    set: set,
    coverSet: coverSet
  };
}

/* 与react-use的useSetState一样, 但是额外返回了一个setOverState用于覆盖状态 */

var useSetState = function useSetState() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _useState = react.useState(initialState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      set = _useState2[1];

  var setState = react.useCallback(function (patch) {
    set(function (prevState) {
      return _objectSpread2({}, prevState, {}, patch instanceof Function ? patch(prevState) : patch);
    });
  }, [set]);
  return [state, setState, set];
};

/**
 * 可以把它理解为类组件setState API风格的useSelf，但它包含以下特点
 * 1. 在setState之后，可以立即通过`state.xx`获取新的值
 * 2. 在一些被memo的回调中，即使没有设置更新数组，依然可以通过state获取到最新的值
 * 3. 总之，它使用useSelf这样的可以在函数组件内任何地方使用的实例属性，又能在setState后触发组件的更新
 * */

function useSyncState() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _useState = react.useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      update = _useState2[1];

  var self = useSelf(init);

  function setSelf(patch) {
    if (typeof patch === 'function') {
      setHandle(patch(self));
    } else {
      setHandle(patch);
    }
  }

  function setHandle(patch) {
    // 编译设置新值
    for (var _i = 0, _Object$entries = Object.entries(patch); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
          key = _Object$entries$_i[0],
          value = _Object$entries$_i[1];

      self[key] = value;
    } // 触发更新


    update(function (prev) {
      return prev + 1;
    });
  }

  return [self, setSelf];
}

exports.customEventEmit = customEventEmit;
exports.formStateMap = formStateMap;
exports.getSessionState = getSessionState;
exports.setSessionState = setSessionState;
exports.useBreakPoint = useBreakPoint;
exports.useCustomEvent = useCustomEvent;
exports.useFetch = useFetch;
exports.useFormState = useFormState;
exports.useIsInitMount = useIsInitMount;
exports.useLockBodyScroll = useLockBodyScroll;
exports.useQuery = useQuery;
exports.useSelf = useSelf;
exports.useSessionSetState = useSessionSetState;
exports.useSessionState = useSessionState;
exports.useSetState = useSetState;
exports.useSyncState = useSyncState;
