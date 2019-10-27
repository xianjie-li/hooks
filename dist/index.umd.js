(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/slicedToArray'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/slicedToArray', 'react'], factory) :
  (global = global || self, factory(global.hooks = {}, global._slicedToArray, global.React));
}(this, function (exports, _slicedToArray, React) { 'use strict';

  _slicedToArray = _slicedToArray && _slicedToArray.hasOwnProperty('default') ? _slicedToArray['default'] : _slicedToArray;
  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  var useRef = React.useRef,
      useEffect = React.useEffect,
      useState = React.useState;
  /** 返回类似类组件的this的实例属性 */

  function useSelf() {
    var init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var self = useRef(init);
    return self.current;
  }
  /**
   * 可以把它理解为类组件setState API风格的useSelf，但它包含以下特点
   * 1. 在setState之后，可以立即通过state获取新的值
   * 2. 在一些被memo的回调中，即使没有设置更新数组，依然可以通过state获取到最新的值
   * 3. 总之，它使用useSelf这样的可以在函数组件内任何地方使用的实例属性，又能在setState后触发组件的更新
   * */

  function useSyncState(init) {
    var _useState = useState(0),
        _useState2 = _slicedToArray(_useState, 2),
        count = _useState2[0],
        setCount = _useState2[1];

    var self = useSelf(init);

    function setSelf(patch) {
      if (typeof patch === 'function') {
        setHandle(patch(self));
      } else {
        setHandle(patch);
      }
    }

    function setHandle(patch) {
      for (var _i = 0, _Object$entries = Object.entries(patch); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
            key = _Object$entries$_i[0],
            value = _Object$entries$_i[1];

        self[key] = value;
      } // 触发更新


      setCount(function (prev) {
        return prev + 1;
      });
    }

    return [self, setSelf];
  }

  exports.useSelf = useSelf;
  exports.useSyncState = useSyncState;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
