(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[7],{"2dX0":function(t,n,r){"use strict";r.d(n,"a",(function(){return o}));var e=r("q1tI");function o(t,n){var r=Object(e["useRef"])(()=>{throw new Error("Cannot call function while rendering")});r.current=t;var o=Object(e["useMemo"])(()=>{var t=function(){return r.current(...arguments)};return n?n(t):t},[]),u=Object(e["useCallback"])(o,[r]);return u}},K1X7:function(t,n,r){"use strict";r.r(n);var e=r("tJVT"),o=r("q1tI"),u=r.n(o),i=r("QwEV");function c(){var t=Object(o["useState"])(0),n=Object(e["a"])(t,2),r=n[0],c=n[1];return Object(i["a"])("my-event-1",()=>{console.log("my-event-1 trigger",r)}),Object(i["a"])("my-event-1",()=>{console.log("my-event-1 trigger2",r)}),u.a.createElement("div",null,u.a.createElement("h3",null,"useCustomEvent ",r),u.a.createElement("button",{onClick:()=>c(t=>t+1)},"change count"))}var f=()=>{var t=Object(i["a"])();return u.a.createElement("div",null,u.a.createElement(c,null),u.a.createElement("button",{onClick:()=>t("my-event-1")},"trigger my-event-1"))};n["default"]=f},K3qG:function(t,n,r){"use strict";(function(t){r.d(n,"a",(function(){return j})),r.d(n,"b",(function(){return v})),r.d(n,"c",(function(){return u})),r.d(n,"d",(function(){return l})),r.d(n,"e",(function(){return p})),r.d(n,"f",(function(){return b})),r.d(n,"g",(function(){return i})),r.d(n,"h",(function(){return a}));var e=r("U8pU");r("KQm4"),r("rePB");function o(t){return Object.prototype.toString.call(t)}function u(t){return Array.isArray?Array.isArray(t):"[object Array]"===o(t)}function i(t){return"number"===typeof t}function c(t){return"string"===typeof t}function f(t){return"[object Error]"===o(t)||t instanceof Error}function a(t){return"[object Object]"===o(t)}function l(t){return!!t&&(!(!t.querySelectorAll||!t.querySelector)&&(!(!a(document)||t!==document)||("object"===("undefined"===typeof HTMLElement?"undefined":Object(e["a"])(HTMLElement))?t instanceof HTMLElement:t&&"object"===Object(e["a"])(t)&&1===t.nodeType&&"string"===typeof t.nodeName)))}function y(t){return"[object RegExp]"===o(t)}function b(t){return"function"===typeof t}function d(t){return"[object Date]"===o(t)}function s(t){return"boolean"===typeof t}function m(t){return void 0===t||null===t||""===t||!(!i(t)||!isNaN(t))}function p(t){if(m(t))return!0;if(y(t))return!1;if(d(t))return!1;if(f(t))return!1;if(u(t))return 0===t.length;if(c(t))return 0===t.length;if(i(t))return 0===t;if(s(t))return!t;if(a(t)){for(var n in t)return!1;return!0}return!1}function v(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return Array.from({length:t}).reduce((function(t){return t+Math.random().toString(36).substr(2)}),"")}function g(){if("undefined"!==typeof self)return self;if("undefined"!==typeof window)return window;if("undefined"!==typeof t)return t;throw new Error("unable to locate global object")}var j=g()}).call(this,r("yLpj"))},KQm4:function(t,n,r){"use strict";function e(t,n){(null==n||n>t.length)&&(n=t.length);for(var r=0,e=new Array(n);r<n;r++)e[r]=t[r];return e}function o(t){if(Array.isArray(t))return e(t)}function u(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function i(t,n){if(t){if("string"===typeof t)return e(t,n);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(r):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?e(t,n):void 0}}function c(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function f(t){return o(t)||u(t)||i(t)||c()}r.d(n,"a",(function(){return f}))},QwEV:function(t,n,r){"use strict";r.d(n,"a",(function(){return f}));var e=r("q1tI"),o=r("K3qG"),u=r("2dX0"),i={};function c(t,n){var r=i[t];Object(o["c"])(r)&&0!==r.length&&r.forEach(t=>{t.handle(n)})}function f(t,n){var r=Object(e["useRef"])(Math.random()),f=t,a=Object(u["a"])((function(){for(var t=arguments.length,r=new Array(t),e=0;e<t;e++)r[e]=arguments[e];null===n||void 0===n||n(...r)}));return Object(e["useEffect"])(()=>{if(f){Object(o["c"])(i[f])||(i[f]=[]);var t=i[f].findIndex(t=>t.flag===r.current),n={handle:a,flag:r.current};-1!==t?i[f][t]=n:i[f].push(n)}return()=>{var t=i[f];if(f&&t&&0!==t.length){var n=t.findIndex(t=>t.flag===r.current);i[f].splice(n,1)}}},[f]),c}},U8pU:function(t,n,r){"use strict";function e(t){return e="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e(t)}r.d(n,"a",(function(){return e}))},rePB:function(t,n,r){"use strict";function e(t,n,r){return n in t?Object.defineProperty(t,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[n]=r,t}r.d(n,"a",(function(){return e}))},tJVT:function(t,n,r){"use strict";function e(t){if(Array.isArray(t))return t}function o(t,n){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var r=[],e=!0,o=!1,u=void 0;try{for(var i,c=t[Symbol.iterator]();!(e=(i=c.next()).done);e=!0)if(r.push(i.value),n&&r.length===n)break}catch(f){o=!0,u=f}finally{try{e||null==c["return"]||c["return"]()}finally{if(o)throw u}}return r}}function u(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function i(t,n){return e(t)||o(t,n)||u()}r.d(n,"a",(function(){return i}))}}]);