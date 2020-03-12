import { createBreakpoint, useUpdateEffect, useLockBodyScroll as useLockBodyScroll$1, useUpdate } from 'react-use';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _toConsumableArray from '@babel/runtime/helpers/esm/toConsumableArray';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import { isFunction, isNumber, isDom, createRandString, isArray } from '@lxjx/utils';
import { useHistory, useLocation } from 'react-router-dom';
import qs from 'query-string';
import _clamp from 'lodash/clamp';
import { useSpring } from 'react-spring';
import _isEqualWith from 'lodash/isEqualWith';

var useBreakPointBase = createBreakpoint({
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
  var flag = useRef(Math.random()); // 防止重复添加

  var key = eventKey;
  useEffect(function () {
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

/** 返回类似类组件的this的实例属性 */

function useSelf() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var self = useRef(init);
  return self.current;
}

function useIsInitMount() {
  var count = useRef(0);
  var isInit = count.current === 0;
  useEffect(function () {
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

  var _useState = useState(function () {
    if (!disable) {
      var cache = getSessionState(key);

      if (cache !== null) {
        // null以外的值都视为缓存
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

  var _setState = useCallback(function (patch) {
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

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/* 与react-use的useSetState一样, 但是额外返回了一个setOverState用于覆盖状态 */

var useSessionSetState = function useSessionSetState(key) {
  var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 ? arguments[2] : undefined;

  var _useSessionState = useSessionState(key, initialState, options),
      _useSessionState2 = _slicedToArray(_useSessionState, 2),
      state = _useSessionState2[0],
      set = _useSessionState2[1];

  var setState = useCallback(function (patch) {
    set(function (prevState) {
      return _objectSpread({}, prevState, {}, patch instanceof Function ? patch(prevState) : patch);
    });
  }, [set]);
  return [state, setState, set];
};

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/* 与react-use的useSetState一样, 但是额外返回了一个setOverState用于覆盖状态 */

var useSetState = function useSetState() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _useState = useState(initialState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      set = _useState2[1];

  var setState = useCallback(function (patch) {
    set(function (prevState) {
      return _objectSpread$1({}, prevState, {}, patch instanceof Function ? patch(prevState) : patch);
    });
  }, [set]);
  return [state, setState, set];
};

var placeHolderFn = function placeHolderFn() {
  return undefined;
};
function getGlobal() {
  return typeof window !== 'undefined' ? window : global;
}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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

  if (isFunction(pass)) {
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

  var _useState = useState(0),
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

  var _useSessionState = useSessionState("".concat(cacheKey, "_FETCH_DATA"), _initData, {
    disable: !isCache
  }),
      _useSessionState2 = _slicedToArray(_useSessionState, 2),
      data = _useSessionState2[0],
      setData = _useSessionState2[1];
  /* 常用关联值存一个state减少更新 */


  var _useSetState = useSetState({
    loading: !isPost && isFunction(method),
    error: undefined,
    timeout: false
  }),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      state = _useSetState2[0],
      setState = _useSetState2[1];
  /* 轮询处理 */


  useEffect(function intervalHandle() {
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

  useEffect(function flagUpdate() {
    if (!isInit) {
      self.isUpdate = true;
    } // eslint-disable-next-line

  }, _toConsumableArray(inputs));
  useEffect(function fetchHandle() {
    var _isUpdate = self.isUpdate;
    var _isManual = self.isManual;
    self.isUpdate = false;
    self.isManual = false; // 处理post请求

    if (!isPass || isPost && !_isManual || !isFunction(method)) {
      if (state.loading) {
        setState({
          loading: false
        });
      }

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
      _regeneratorRuntime.mark(function _callee() {
        var response;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!state.loading) {
                  setState(_objectSpread$2({}, getResetState('loading', true)));
                }

                self.lastFetch = Date.now();
                timer = setTimeout(function () {
                  ignore = true;
                  onTimeout();
                  setState(_objectSpread$2({}, getResetState('timeout', true)));
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
                setData(response);
                setState(_objectSpread$2({}, getResetState('loading', false)));
                onSuccess(response, _isUpdate);
                _context.next = 20;
                break;

              case 14:
                _context.prev = 14;
                _context.t0 = _context["catch"](3);

                if (!ignore) {
                  _context.next = 18;
                  break;
                }

                return _context.abrupt("return");

              case 18:
                setState(_objectSpread$2({}, getResetState('error', _context.t0)));
                onError(_context.t0);

              case 20:
                _context.prev = 20;
                !ignore && onComplete();
                clearTimeout(timer);
                return _context.finish(20);

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 14, 20, 24]]);
      }));
      return _fetcher.apply(this, arguments);
    }

    fetcher().then();
    return function () {
      ignore = true;
      timer && clearTimeout(timer);
    }; // eslint-disable-next-line
  }, [payload, search, isPass, force].concat(_toConsumableArray(inputs)));
  /* 返回一个将互斥的状态还原的对象，并通过键值覆盖设置某个值 */

  function getResetState(key, value) {
    return _defineProperty({
      loading: false,
      error: undefined,
      timeout: false
    }, key, value);
  }

  var update = useCallback(_update, [isPass]);

  function _update() {
    if (!isPass) return;
    self.isUpdate = true;
    forceUpdate(function (p) {
      return ++p;
    });
  }

  var send = useCallback(_send, [update]);

  function _send(_payload) {
    if (!isPass || !isPost) return;
    self.isManual = true;
    _payload ? setOverPayload(_payload) : update();
  }

  return _objectSpread$2({}, state, {
    data: data,
    payload: payload,
    setPayload: setPayload,
    setOverPayload: setOverPayload,
    update: update,
    send: send,
    search: search,
    setData: setData,
    extraData: extraData,
    setExtraData: setExtraData
  });
};

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
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

  var _props = _objectSpread$3({}, props);

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

  var stateRef = useRef(); // 设置表单状态

  var _useState = useState(function () {
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


  useUpdateEffect(function () {
    if (VALUE in props) {
      // 如果两次值显式相等则跳过
      value !== stateRef.current && setState(stateRef.current = value);
    }
  }, [value]);
  /* 处理修改表单值 */

  var setFormState = function setFormState(patch, extra) {
    /* 是受控组件则将新值通过onChange回传即可，非受控组件设置本地状态并通过onChange通知 */
    var hasValue = VALUE in props;

    if (isFunction(patch)) {
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
  useEffect(function () {
    // 是否包含滚动条
    var hasScroll = hasScrollBar(document.documentElement); // 是否需要进行处理 包含滚动条 + locked为true + 非初始化

    var doHandle = hasScroll && locked;

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
  }, [locked]);
  return useLockBodyScroll$1(locked, elementRef);
};

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * 用于便捷的获取或设置react-router v5的query string
 * @interface <Query> - any | 查询对象的接口格式
 * @param defaultSearch - 默认查询
 * @return result
 * @return result.search - 原始查询字符串
 * @return result.queryObject - 根据search解析得到的对象
 * @return result.set - 将包含一个或多个查询值的对象覆盖到当前url查询上
 * @return result.coverSet - 同set，区别是会重置掉所有search并设置为传入的查询对象
 * */

function useQuery(defaultSearch) {
  var _useHistory = useHistory(),
      replace = _useHistory.replace;

  var _useLocation = useLocation(),
      search = _useLocation.search,
      pathname = _useLocation.pathname,
      hash = _useLocation.hash;

  var _default = useMemo(function () {
    if (defaultSearch) {
      if (typeof defaultSearch === 'string') {
        return qs.parse(defaultSearch);
      }

      return defaultSearch;
    }

    return {}; // eslint-disable-next-line
  }, []);

  var queryObject = useMemo(function () {
    return _objectSpread$4({}, _default, {}, qs.parse(search));
  }, [_default, search]);

  var _search = qs.stringify(queryObject);

  function navWidthNewSearch(newQO) {
    replace("".concat(pathname, "?").concat(qs.stringify(newQO)).concat(hash));
  }

  var set = useCallback(function (queryItem) {
    var newQueryObject = _objectSpread$4({}, queryObject, {}, queryItem);

    navWidthNewSearch(newQueryObject); // eslint-disable-next-line
  }, [search]);
  var coverSet = useCallback(function (queryItem) {
    navWidthNewSearch(_objectSpread$4({}, _default, {}, queryItem)); // eslint-disable-next-line
  }, [search]);
  return {
    search: _search ? "?".concat(_search) : '',
    queryObject: queryObject,
    set: set,
    coverSet: coverSet
  };
}

/**
 * 可以把它理解为类组件setState API风格的useSelf，但它包含以下特点
 * 1. 在setState之后，可以立即通过`state.xx`获取新的值
 * 2. 在一些被memo的回调中，即使没有设置更新数组，依然可以通过state获取到最新的值
 * 3. 总之，它使用useSelf这样的可以在函数组件内任何地方使用的实例属性，又能在setState后触发组件的更新
 * */

function useSyncState() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _useState = useState(0),
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

function useThrottle() {
  var wait = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;

  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref$leading = _ref.leading,
      leading = _ref$leading === void 0 ? true : _ref$leading,
      _ref$trailing = _ref.trailing,
      trailing = _ref$trailing === void 0 ? true : _ref$trailing;

  var self = useRef({
    lastCall: 0,
    lastMethod: undefined
  });
  var caller = useCallback(function caller(method) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var ct = self.current;
    ct.lastMethod = method;
    var now = Date.now();
    var diff = now - ct.lastCall;

    if (ct.timer) {
      getGlobal().clearTimeout(ct.timer);
    }

    if (trailing) {
      ct.timer = getGlobal().setTimeout(function () {
        caller.apply(void 0, [method].concat(args));
        ct.lastCall = 0; // 标记下次调用为leading调用

        getGlobal().clearTimeout(ct.timer);
      }, wait);
    }

    if (diff > wait) {
      if (leading || ct.lastCall !== 0) {
        var _ct$lastMethod;

        (_ct$lastMethod = ct.lastMethod) === null || _ct$lastMethod === void 0 ? void 0 : _ct$lastMethod.call.apply(_ct$lastMethod, [ct].concat(args));
      }

      ct.lastCall = now;
    } // eslint-disable-next-line

  }, [wait]);
  return caller;
}

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$5(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$5(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function useScroll() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      el = _ref.el,
      onScroll = _ref.onScroll,
      _ref$throttleTime = _ref.throttleTime,
      throttleTime = _ref$throttleTime === void 0 ? 100 : _ref$throttleTime,
      _ref$offset = _ref.offset,
      offset = _ref$offset === void 0 ? 0 : _ref$offset,
      offsetX = _ref.offsetX,
      offsetY = _ref.offsetY;

  var defaultEl = useMemo(function () {
    return el || document.documentElement;
  }, [el]);
  var ref = useRef(null); // @ts-ignore 坑2： 8.x版本的[,,stop]stop无效, 不能监听滚动后停止定位动画

  var _useSpring = useSpring(function () {
    return {
      y: 0,
      x: 0,
      config: {
        clamp: true
      },
      reset: true
    };
  }),
      _useSpring2 = _slicedToArray(_useSpring, 2),
      setY = _useSpring2[1];

  var caller = useThrottle(throttleTime);
  useEffect(function () {
    var meta = get();

    function scrollHandle() {
      onScroll && caller(onScroll, meta);
    }
    /* 坑: 页面级滚动scroll事件绑在documentElement和body上无效, 只能绑在window上 */


    var scrollEl = meta.el instanceof HTMLHtmlElement ? window : meta.el;
    scrollEl.addEventListener('scroll', scrollHandle);
    return function () {
      scrollEl.removeEventListener('scroll', scrollHandle);
    }; // eslint-disable-next-line
  }, [onScroll]);
  /** 从默认值、参数中取到滚动元素 */

  function getEl() {
    return ref.current || defaultEl;
  }

  function animateTo(sEl, next, now) {
    setY(_objectSpread$5({}, next, {
      from: now,
      // @ts-ignore 类型错误？
      onFrame: function onFrame(props) {
        sEl.scrollTop = props.y;
        sEl.scrollLeft = props.x;
      }
    }));
  }
  /** 根据传入的x、y值设置滚动位置 */


  function set(_ref2) {
    var x = _ref2.x,
        y = _ref2.y,
        raise = _ref2.raise,
        immediate = _ref2.immediate;
    var scroller = getEl();

    var _get = get(),
        xMax = _get.xMax,
        yMax = _get.yMax,
        oldX = _get.x,
        oldY = _get.y;

    var nextPos = {};
    var nowPos = {
      x: oldX,
      y: oldY
    };

    if (isNumber(x)) {
      var nextX = x;

      if (raise) {
        nextX = _clamp(oldX + x, 0, xMax);
      }

      if (nextX !== oldX) {
        nextPos.x = nextX;
      }
    }

    if (isNumber(y)) {
      var nextY = y;

      if (raise) {
        nextY = _clamp(oldY + y, 0, yMax);
      }

      if (nextY !== oldY) {
        nextPos.y = nextY;
      }
    }

    if ('x' in nextPos || 'y' in nextPos) {
      if (immediate) {
        isNumber(nextPos.x) && (scroller.scrollLeft = nextPos.x);
        isNumber(nextPos.y) && (scroller.scrollTop = nextPos.y);
      } else {
        animateTo(scroller, nextPos, nowPos);
      }
    }
  }

  function scrollToElement(arg) {
    var sEl = getEl();
    var targetEl;

    if (!sEl.getBoundingClientRect) {
      console.warn('The browser does not support `getBoundingClientRect` API');
      return;
    }

    if (typeof arg === 'string') {
      targetEl = getEl().querySelector(arg);
    } else {
      targetEl = arg;
    }

    if (!isDom(targetEl)) return;

    var _targetEl$getBounding = targetEl.getBoundingClientRect(),
        cTop = _targetEl$getBounding.top,
        cLeft = _targetEl$getBounding.left;

    var _sEl$getBoundingClien = sEl.getBoundingClientRect(),
        fTop = _sEl$getBoundingClien.top,
        fLeft = _sEl$getBoundingClien.left;
    /**
     * 使用offsetTop等属性只能获取到元素相对于第一个非常规定位父元素的距离，所以需要单独计算
     * 计算规则: eg. 子元素距离顶部比父元素多100px，滚动条位置应该减少100px让两者等值
     * */


    var xOffset = offsetX || offset;
    var yOffset = offsetY || offset;
    set({
      x: cLeft - fLeft + xOffset,
      y: cTop - fTop + yOffset,
      raise: !(sEl instanceof HTMLHtmlElement)
    });
  }
  /** 获取各种有用的滚动信息 */


  function get() {
    var sEl = getEl();
    var x = sEl.scrollLeft;
    var y = sEl.scrollTop;
    var height = sEl.clientHeight;
    var width = sEl.clientWidth;
    var scrollHeight = sEl.scrollHeight;
    var scrollWidth = sEl.scrollWidth;
    var xMax = scrollWidth - width;
    var yMax = scrollHeight - height;
    return {
      el: sEl,
      x: x,
      y: y,
      xMax: xMax,
      yMax: yMax,
      height: height,
      width: width,
      scrollHeight: scrollHeight,
      scrollWidth: scrollWidth,
      touchBottom: yMax - y <= 0,
      touchLeft: x === 0,
      touchRight: xMax - x <= 0,
      touchTop: y === 0
    };
  }

  return {
    set: set,
    get: get,
    scrollToElement: scrollToElement,
    ref: ref
  };
}

var sameMap = {};
/**
 * 用于对同类组件进行管理，获取其他已渲染的同类组件的共享数据以及当前处在启用实例中的位置
 * 一般用例为:
 * - 获取Modal等组件的实例关系，根据组件渲染顺序设置zIndex，隐藏多余的mask等
 * - 对于Drawer等组件，根据渲染顺序调整显示的层级
 * @param key - 用于表示同类组件
 * @param dep - 只有在dep的值为true时，该实例才算启用并被钩子接受, 通常为Modal等组件的toggle参数
 * @param meta - 用于共享的组件源数据，可以在同组件的其他实例中获取到
 * @return zIndex[0] - 该组件实例处于所有示例中的第几位，未启用的组件返回-1
 * @return zIndex[1] - 所有启用状态的组件<Item>组成的数组，正序
 * @return zIndex[2] - 该组件实例的唯一标识
 * */

function useSame(key, dep, meta) {
  var _sameMap$key;

  var id = useMemo(function () {
    return createRandString(2);
  }, []);

  var _useState = useState(depChangeHandel),
      _useState2 = _slicedToArray(_useState, 2),
      cIndex = _useState2[0],
      setCIndex = _useState2[1];
  /* 在某个组件更新了sameMap后，需要通知其他相应的以最新状态更新组件 */


  var update = useUpdate();
  var eventKey = "".concat(key, "_custom_event");
  var emitUpdate = useCustomEvent(eventKey, function (_id) {
    // 触发更新的实例和未激活的不更新
    if (_id === id) return;
    update();
  }, []);
  setCurrentMeta(meta);
  /* 获取当前实例在实例组中的索引或添加当前实例到实例组中，未启用组件索引返回-1 */

  function depChangeHandel() {
    var _getCurrent = getCurrent(),
        _getCurrent2 = _slicedToArray(_getCurrent, 2),
        current = _getCurrent2[0],
        index = _getCurrent2[1]; // 执行后续操作前，先移除已有实例


    if (index !== -1) {
      current.splice(index, 1);
    } // 当依赖值为true时才添加实例到组中


    if (dep) {
      sameMap[key].push({
        id: id,
        meta: {}
      });
    } // 从更新后的实例组中获取当前索引


    var _getCurrent3 = getCurrent(),
        _getCurrent4 = _slicedToArray(_getCurrent3, 2),
        newIndex = _getCurrent4[1];

    return newIndex;
  }
  /* dep改变时。更新索引信息 */


  useUpdateEffect(function () {
    setCIndex(depChangeHandel());
  }, [dep]);
  /* cIndex变更时，通知其他钩子进行更新 */

  useUpdateEffect(function () {
    emitUpdate(eventKey, id);
  }, [cIndex]);
  /**
   * 获取当前组件在sameMap中的实例组和该组件在实例中的索引并确保sameMap[key]存在
   * @return meta[0] - 该组件实例组成的数组
   * @return meta[1] - 当前组件在实例中的位置
   * */

  function getCurrent() {
    // 无实例存在时赋初始值
    if (!isArray(sameMap[key])) {
      sameMap[key] = [];
    } // 取所在索引


    var index = sameMap[key].findIndex(function (item) {
      return item.id === id;
    });
    return [sameMap[key], index];
  }
  /* 设置当前实例的meta状态 */


  function setCurrentMeta(_meta) {
    if (typeof _meta === 'undefined') return;

    var _getCurrent5 = getCurrent(),
        _getCurrent6 = _slicedToArray(_getCurrent5, 2),
        current = _getCurrent6[0],
        index = _getCurrent6[1];

    if (index !== -1) {
      current[index].meta = _meta;
    }
  }
  /* 在sameMap[key]长度改变时更新 */


  useEffect(function () {
    var _getCurrent7 = getCurrent(),
        _getCurrent8 = _slicedToArray(_getCurrent7, 2),
        newIndex = _getCurrent8[1];

    if (newIndex !== cIndex) {
      setCIndex(newIndex);
    } // eslint-disable-next-line

  }, [(_sameMap$key = sameMap[key]) === null || _sameMap$key === void 0 ? void 0 : _sameMap$key.length]);
  return [cIndex, sameMap[key], id];
}

/**
 *  实现类似getDerivedStateFromProps的效果，接收prop并将其同步为内部状态，
 *  当prop改变, 对prop和内部state执行_.isEqual,对比结果为false时，会更新内部值 (基础类型使用 === 进行对比，性能更高，当必须使用引用类型时，尽量保持结构简单，减少对比次数)
 *  @param prop - 需要派生为state的prop
 *  @param customizer - 可以通过此函数自定义对比方式, 如果相等返回 true，否则返回 false, 返回undefined时使用默认对比方式
 * */

function useDerivedStateFromProps(prop, customizer) {
  var _useState = useState(prop),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  useUpdateEffect(function () {
    var isEqual = _isEqualWith(prop, state, customizer);

    if (!isEqual) {
      setState(prop);
    }
  }, [prop]);
  return [state, setState];
}

export { customEventEmit, formStateMap, getSessionState, setSessionState, useBreakPoint, useCustomEvent, useDerivedStateFromProps, useFetch, useFormState, useIsInitMount, useLockBodyScroll, useQuery, useSame, useScroll, useSelf, useSessionSetState, useSessionState, useSetState, useSyncState, useThrottle };
