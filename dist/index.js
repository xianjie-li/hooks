'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var utils = require('@lxjx/utils');
var reactUse = require('react-use');

/** 返回类似类组件的this的实例属性 */

function useSelf() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var self = react.useRef(init);
  return self.current;
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

/* 与react-use的useSetState一样, 但是额外返回了一个setOverState用于覆盖状态 */

var useSetState = function useSetState() {
  var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var _useState = react.useState(initialState),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      set = _useState2[1];

  var setState = react.useCallback(function (patch) {
    set(function (prevState) {
      return Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch);
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
      count = _useState2[0],
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

function useIsInitMount() {
  var count = react.useRef(0);
  var isInit = count.current === 0;
  react.useEffect(function () {
    count.current++;
  }, []);
  return isInit;
}

var placeHolderFn = function placeHolderFn() {
  return undefined;
};

var useFetch = function useFetch(method) {
  var initPayload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _options$pass = options.pass,
      pass = _options$pass === void 0 ? true : _options$pass,
      _options$inputs = options.inputs,
      inputs = _options$inputs === void 0 ? [] : _options$inputs,
      _options$initFetch = options.initFetch,
      initFetch = _options$initFetch === void 0 ? true : _options$initFetch,
      _options$extraData = options.extraData,
      extraData = _options$extraData === void 0 ? {} : _options$extraData,
      _options$timeout = options.timeout,
      timeout = _options$timeout === void 0 ? 8000 : _options$timeout,
      _options$onSuccess = options.onSuccess,
      onSuccess = _options$onSuccess === void 0 ? placeHolderFn : _options$onSuccess,
      _options$onError = options.onError,
      onError = _options$onError === void 0 ? placeHolderFn : _options$onError,
      _options$onComplete = options.onComplete,
      onComplete = _options$onComplete === void 0 ? placeHolderFn : _options$onComplete,
      _options$onTimeout = options.onTimeout,
      onTimeout = _options$onTimeout === void 0 ? placeHolderFn : _options$onTimeout;
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
    isUpdate: false
  });
  var isInit = useIsInitMount();

  var _useState = react.useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      force = _useState2[0],
      forceUpdate = _useState2[1];

  var _useSetState = useSetState(initPayload),
      _useSetState2 = _slicedToArray(_useSetState, 3),
      payload = _useSetState2[0],
      setPayload = _useSetState2[1],
      setOverPayload = _useSetState2[2];
  /* 关联值存一个state减少更新 */


  var _useSetState3 = useSetState({
    data: undefined,
    loading: false,
    error: undefined,
    timeout: false,
    extraData: extraData
  }),
      _useSetState4 = _slicedToArray(_useSetState3, 2),
      state = _useSetState4[0],
      setState = _useSetState4[1];
  /* 将inputs改变标记为isUpdate*/


  react.useEffect(function flagUpdate() {
    self.isUpdate = true;
  }, _toConsumableArray(inputs));
  react.useEffect(function fetchHandle() {
    // 初始化时，如果initFetch为false则跳过
    if (isInit && !initFetch) {
      return;
    }

    var ignore = false;
    var timer;
    var _isUpdate = self.isUpdate; // 缓存,使状态只作用于当前effect周期

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
                timer = setTimeout(function () {
                  ignore = true;
                  onTimeout();
                  setState(_objectSpread2({}, getResetState('timeout', true)));
                }, timeout);
                _context.prev = 2;
                _context.next = 5;
                return method(payload);

              case 5:
                response = _context.sent;

                if (!ignore) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return");

              case 8:
                setState(_objectSpread2({}, getResetState('data', response)));
                onSuccess(response, _isUpdate);
                _context.next = 18;
                break;

              case 12:
                _context.prev = 12;
                _context.t0 = _context["catch"](2);

                if (!ignore) {
                  _context.next = 16;
                  break;
                }

                return _context.abrupt("return");

              case 16:
                setState(_objectSpread2({}, getResetState('error', _context.t0)));
                onError(_context.t0);

              case 18:
                _context.prev = 18;
                self.isUpdate = false;
                !ignore && onComplete();
                clearTimeout(timer);
                return _context.finish(18);

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[2, 12, 18, 23]]);
      }));
      return _fetcher.apply(this, arguments);
    }

    if (isPass) {
      fetcher().then();
    } else {
      self.isUpdate = false;
    }

    return function () {
      ignore = true;
      clearTimeout(timer);
    };
  }, [payload, isPass, force].concat(_toConsumableArray(inputs)));
  /* 返回一个将互斥的状态还原的对象，并通过键值设置某个值 */

  function getResetState(key, value) {
    return _defineProperty({
      loading: false,
      error: undefined,
      timeout: false
    }, key, value);
  }

  function _setState(patch) {
    setState(function (_ref2) {
      var data = _ref2.data;

      var _patch = utils.isFunction(patch) ? patch(data) : patch;

      return {
        data: _objectSpread2({}, data, {}, _patch)
      };
    });
  }

  function _setExtraData(patch) {
    setState(function (_ref3) {
      var extraData = _ref3.extraData;

      var _patch = utils.isFunction(patch) ? patch(extraData) : patch;

      return {
        extraData: _objectSpread2({}, extraData, {}, _patch)
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

  function _send(payload) {
    payload ? setOverPayload(payload) : update();
  }

  return _objectSpread2({}, state, {
    payload: payload,
    setPayload: setPayload,
    setOverPayload: setOverPayload,
    update: update,
    send: send,
    setData: _setState,
    setExtraData: _setExtraData
  });
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
 * 绑定一个自定义事件，可以在任意组件内触发它, 每个事件可以多次绑定不同的处理函数
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
      if (events.length === 0) return;
      var index = events.findIndex(function (item) {
        return item.flag === flag.current;
      });
      eventStore[key].splice(index, 1);
    };
  }, inputs);
  return customEventEmit;
}

var useBreakPoint = reactUse.createBreakpoint({
  'xs': 0,
  'sm': 576,
  'md': 768,
  'lg': 992,
  'xl': 1200
});

var VALUE = 'value';
var DEFAULT_VALUE = 'defaultValue';
var TRIGGER = 'onChange';
/**
 * 当useFormState传入props的key与预设的不一致时，通过此函数进行映射
 * props - 透传给useFormState
 * maps - 将props中的指定key映射为value、defaultValue、onChange
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
 * @param props - 透传消费组件的props，包含FormLike中的任意属性
 * @param defaultValue - 默认值，会被value与defaultValue覆盖
 * @interface <T> - value类型
 * @interface <Ext> - onChange接收的额外参数的类型
 * @returns [state, setFormState] - 表单状态与更新表单状态的方法，接口与useState相似
 * */

function useFormState(props, defaultValue) {
  var value = props.value,
      onChange = props.onChange,
      propDefaultValue = props.defaultValue; // 用于在一些特定的位置能立即获取到state

  var stateRef = react.useRef(); // 设置表单状态

  var _useState = react.useState(function () {
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

exports.customEventEmit = customEventEmit;
exports.formStateMap = formStateMap;
exports.useBreakPoint = useBreakPoint;
exports.useCustomEvent = useCustomEvent;
exports.useFetch = useFetch;
exports.useFormState = useFormState;
exports.useIsInitMount = useIsInitMount;
exports.useSelf = useSelf;
exports.useSetState = useSetState;
exports.useSyncState = useSyncState;
