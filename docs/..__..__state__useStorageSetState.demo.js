(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[32],{"2dX0":function(t,n,e){"use strict";e.d(n,"a",(function(){return o}));var r=e("q1tI");function o(t,n){var e=Object(r["useRef"])(()=>{throw new Error("Cannot call function while rendering")});e.current=t;var o=Object(r["useMemo"])(()=>{var t=function(){return e.current(...arguments)};return n?n(t):t},[]),u=Object(r["useCallback"])(o,[e]);return u}},"2yn9":function(t,n,e){"use strict";e.r(n);var r=e("k1fw"),o=e("tJVT"),u=e("q1tI"),i=e.n(u),a=e("xQ7e"),c=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},e=arguments.length>2?arguments[2]:void 0,r=Object(u["useState"])(0),i=Object(o["a"])(r,2),c=i[1],f=Object(a["a"])(t,n,e),l=Object(o["a"])(f,2),s=l[0],d=l[1],b=Object(u["useCallback"])(t=>{d(Object.assign(s,t instanceof Function?t(s):t)),c(t=>t+1)},[d]);return[s,b]},f=()=>{var t=c("usestorage_setState_demo",{name:"lxj",id:Math.random()}),n=Object(o["a"])(t,2),e=n[0],u=n[1],a=c("usestorage_setState_local_demo",{name:"lxj",id:Math.random()},{type:"local"}),f=Object(o["a"])(a,2),l=f[0],s=f[1];return i.a.createElement("div",null,i.a.createElement("h3",null,JSON.stringify(e,null,2)),i.a.createElement("p",null,"\u901a\u8fc7sessionStorage\u7f13\u5b58, \u8ddf\u968f\u4f1a\u8bdd\u5931\u6548"),i.a.createElement("button",{onClick:()=>u(t=>Object(r["a"])({},t,{id:Math.random()}))},"add"),i.a.createElement("hr",null),i.a.createElement("h3",null,JSON.stringify(l,null,2)),i.a.createElement("p",null,"\u901a\u8fc7localStorage\u7f13\u5b58"),i.a.createElement("button",{onClick:()=>s(t=>Object(r["a"])({},t,{id:Math.random()}))},"add"))};n["default"]=f},K3qG:function(t,n,e){"use strict";(function(t){e.d(n,"a",(function(){return g})),e.d(n,"b",(function(){return v})),e.d(n,"c",(function(){return u})),e.d(n,"d",(function(){return l})),e.d(n,"e",(function(){return m})),e.d(n,"f",(function(){return d})),e.d(n,"g",(function(){return i})),e.d(n,"h",(function(){return f}));var r=e("U8pU");e("KQm4"),e("rePB");function o(t){return Object.prototype.toString.call(t)}function u(t){return Array.isArray?Array.isArray(t):"[object Array]"===o(t)}function i(t){return"number"===typeof t}function a(t){return"string"===typeof t}function c(t){return"[object Error]"===o(t)||t instanceof Error}function f(t){return"[object Object]"===o(t)}function l(t){return!!t&&(!(!t.querySelectorAll||!t.querySelector)&&(!(!f(document)||t!==document)||("object"===("undefined"===typeof HTMLElement?"undefined":Object(r["a"])(HTMLElement))?t instanceof HTMLElement:t&&"object"===Object(r["a"])(t)&&1===t.nodeType&&"string"===typeof t.nodeName)))}function s(t){return"[object RegExp]"===o(t)}function d(t){return"function"===typeof t}function b(t){return"[object Date]"===o(t)}function y(t){return"boolean"===typeof t}function p(t){return void 0===t||null===t||""===t||!(!i(t)||!isNaN(t))}function m(t){if(p(t))return!0;if(s(t))return!1;if(b(t))return!1;if(c(t))return!1;if(u(t))return 0===t.length;if(a(t))return 0===t.length;if(i(t))return 0===t;if(y(t))return!t;if(f(t)){for(var n in t)return!1;return!0}return!1}function v(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:1;return Array.from({length:t}).reduce((function(t){return t+Math.random().toString(36).substr(2)}),"")}function j(){if("undefined"!==typeof self)return self;if("undefined"!==typeof window)return window;if("undefined"!==typeof t)return t;throw new Error("unable to locate global object")}var g=j()}).call(this,e("yLpj"))},KQm4:function(t,n,e){"use strict";function r(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}function o(t){if(Array.isArray(t))return r(t)}function u(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function i(t,n){if(t){if("string"===typeof t)return r(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(e):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?r(t,n):void 0}}function a(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function c(t){return o(t)||u(t)||i(t)||a()}e.d(n,"a",(function(){return c}))},U8pU:function(t,n,e){"use strict";function r(t){return r="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"===typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}e.d(n,"a",(function(){return r}))},rePB:function(t,n,e){"use strict";function r(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}e.d(n,"a",(function(){return r}))},tJVT:function(t,n,e){"use strict";function r(t){if(Array.isArray(t))return t}function o(t,n){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var e=[],r=!0,o=!1,u=void 0;try{for(var i,a=t[Symbol.iterator]();!(r=(i=a.next()).done);r=!0)if(e.push(i.value),n&&e.length===n)break}catch(c){o=!0,u=c}finally{try{r||null==a["return"]||a["return"]()}finally{if(o)throw u}}return e}}function u(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function i(t,n){return r(t)||o(t,n)||u()}e.d(n,"a",(function(){return i}))},xQ7e:function(t,n,e){"use strict";e.d(n,"a",(function(){return p}));var r=e("tJVT"),o=e("k1fw"),u=e("K3qG"),i=e("q1tI"),a=e("2dX0"),c="USE_STORAGE_CACHE",f={local:u["a"].localStorage,session:u["a"].sessionStorage};function l(t,n){var e=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"session";if(void 0!==n){var r=f[e];r&&r.setItem("".concat(c,"_").concat(t.toUpperCase()),JSON.stringify(n))}}function s(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"session",e=f[n];if(e){var r=e.getItem("".concat(c,"_").concat(t.toUpperCase()));return null===r?r:JSON.parse(r)}}function d(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"session",e=f[n];e&&e.removeItem("".concat(c,"_").concat(t.toUpperCase()))}var b={type:"session",disabled:!1};function y(t,n,e){var u=Object(o["a"])({},b,{},e),c=Object(i["useState"])(()=>{if(!u.disabled){var e=s(t,u.type);if(null!==e)return e}if(n instanceof Function){var r=n();return!u.disabled&&l(t,r,u.type),r}return!u.disabled&&l(t,n,u.type),n}),f=Object(r["a"])(c,2),d=f[0],y=f[1],p=Object(a["a"])(n=>{n instanceof Function?y(e=>{var r=n(e);return!u.disabled&&l(t,r,u.type),r}):(!u.disabled&&l(t,n,u.type),y(n))});return[d,p]}var p=Object.assign(y,{get:s,set:l,remove:d})}}]);