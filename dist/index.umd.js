(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@babel/runtime/helpers/defineProperty'), require('@babel/runtime/helpers/slicedToArray'), require('react')) :
  typeof define === 'function' && define.amd ? define(['exports', '@babel/runtime/helpers/defineProperty', '@babel/runtime/helpers/slicedToArray', 'react'], factory) :
  (global = global || self, factory(global.hooks = {}, global._defineProperty, global._slicedToArray, global.React));
}(this, function (exports, _defineProperty, _slicedToArray, React) { 'use strict';

  _defineProperty = _defineProperty && _defineProperty.hasOwnProperty('default') ? _defineProperty['default'] : _defineProperty;
  _slicedToArray = _slicedToArray && _slicedToArray.hasOwnProperty('default') ? _slicedToArray['default'] : _slicedToArray;
  React = React && React.hasOwnProperty('default') ? React['default'] : React;

  function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
  var useRef = React.useRef,
      useEffect = React.useEffect,
      useState = React.useState;
  /** 返回类似类组件的this的实例属性 */

  function useSelf(init) {
    var _init = init;

    if (init === undefined) {
      _init = {};
    }

    var self = useRef(_init);
    return self.current;
  }
  /** 与useEffect参数一致，区别是不会在初次渲染时触发 */

  function useUpdate(didUpdate, source) {
    var self = useSelf({
      updated: false
    });
    useEffect(function () {
      if (self.updated) {
        return didUpdate();
      }

      self.updated = true;
    }, source);
  }
  function useLegacyState(init) {
    var _useState = useState(init),
        _useState2 = _slicedToArray(_useState, 2),
        state = _useState2[0],
        setState = _useState2[1];

    function _setState(SetStateAction) {
      if (typeof SetStateAction === 'function') {
        setState(function (prev) {
          return SetStateAction(prev);
        });
      } else {
        setState(function (prev) {
          return _objectSpread({}, prev, {}, SetStateAction);
        });
      }
    }

    return [state, _setState];
  }

  exports.useLegacyState = useLegacyState;
  exports.useSelf = useSelf;
  exports.useUpdate = useUpdate;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
