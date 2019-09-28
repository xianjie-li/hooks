import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import React from 'react';

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var useRef = React.useRef,
    useEffect = React.useEffect,
    useState = React.useState;
/** 返回类似类组件的this的实例属性 */

function useSelf(init) {
  var self = useRef(init || {});
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
        return _objectSpread({}, prev, {}, SetStateAction(prev));
      });
    } else {
      setState(function (prev) {
        return _objectSpread({}, prev, {}, SetStateAction);
      });
    }
  }

  return [state, _setState];
}

export { useLegacyState, useSelf, useUpdate };
