'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var reactUse = require('react-use');
var utils = require('@lxjx/utils');

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
      ownKeys(source, true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function (key) {
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

var useRef = React.useRef,
    useEffect = React.useEffect,
    useState = React.useState;

var placeHolderFn = function placeHolderFn() {
  return undefined;
};
/* ------------------------------------------------------------------------ */

/** 返回类似类组件的this的实例属性 */


function useSelf() {
  var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var self = useRef(init);
  return self.current;
}
/* ------------------------------------------------------------------------ */

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
/* 对传递key的useFetch的update进行绑定，使其能在任何地方进行更新 */

var useFetchMetas = {};
/* 可在注册useFetch的组件外对配置了option.key的useFetch进行一次更新请求，传递params时，使用传入的params合并后进行更新请求 */

var fetchTrigger = function fetchTrigger(key, params) {
  var triggers = useFetchMetas[key];
  if (!triggers || !Array.isArray(triggers)) return;
  if (triggers.length === 0) return;
  triggers.forEach(function (meta) {
    params ? meta.setParams(params) : meta.update();
  });
};
var useFetch = function useFetch(method, // 一个Promise return函数或async函数，resolve的结果会作为data，失败时会将reject的值设置为error, timeout 由 useFetch 内部进行处理
defaultParams) {
  var pass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  var _options$inputs = options.inputs,
      inputs = _options$inputs === void 0 ? [] : _options$inputs,
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
      onTimeout = _options$onTimeout === void 0 ? placeHolderFn : _options$onTimeout,
      key = options.key;
  /* pass规则：为函数时取返回值，函数内部报错时取false，否则直接取pass的值 */

  var isPass = false;

  if (utils.isFunction(pass)) {
    try {
      isPass = pass();
    } catch (err) {
      isPass = false;
    }
  } else {
    isPass = pass;
  }

  var _useState3 = useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      force = _useState4[0],
      forceUpdate = _useState4[1];

  var _useSetState = reactUse.useSetState(defaultParams),
      _useSetState2 = _slicedToArray(_useSetState, 2),
      params = _useSetState2[0],
      setParams = _useSetState2[1];

  var self = useSelf({
    isUpdate: false
  });
  /* 关联值存一个state减少更新 */

  var _useSetState3 = reactUse.useSetState({
    data: undefined,
    loading: false,
    error: undefined,
    timeout: false,
    extraData: extraData
  }),
      _useSetState4 = _slicedToArray(_useSetState3, 2),
      state = _useSetState4[0],
      setState = _useSetState4[1];
  /* fetch handle */


  useEffect(function () {
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
                return method(params);

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

    isPass && fetcher();
    return function () {
      ignore = true;
      clearTimeout(timer);
    };
  }, [params, isPass, force].concat(_toConsumableArray(inputs)));
  /* 当存在key时，存储update和setParams到meta对象中, 用于实现trigger */

  useEffect(function () {
    var flag = Math.random(); // 用于移除

    if (key) {
      if (!Array.isArray(useFetchMetas[key])) {
        useFetchMetas[key] = [];
      }

      useFetchMetas[key].push({
        update: update,
        setParams: setParams,
        flag: flag
      });
    }

    return function () {
      /* 移除meta数据 */
      if (!key) return;
      var index = useFetchMetas[key].findIndex(function (item) {
        return item.flag === flag;
      });
      useFetchMetas[key].splice(index, 1);
    };
  }, []);
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

  function update() {
    if (!isPass) return;
    self.isUpdate = true;
    forceUpdate(function (p) {
      return ++p;
    });
  }

  return _objectSpread2({}, state, {
    params: params,
    setParams: setParams,
    setData: _setState,
    update: update,
    setExtraData: _setExtraData
  });
};
/* ------------------------------------------------------------------------ */

exports.fetchTrigger = fetchTrigger;
exports.useFetch = useFetch;
exports.useSelf = useSelf;
exports.useSyncState = useSyncState;
