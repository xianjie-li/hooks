(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[32],{"4H9c":function(t,n,e){"use strict";e.d(n,"a",(function(){return c}));var r=e("tJVT"),a=e("q1tI"),c=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=Object(a["useState"])(0),e=Object(r["a"])(n,2),c=e[1],o=Object(a["useState"])(t),u=Object(r["a"])(o,2),i=u[0],l=u[1],s=Object(a["useCallback"])(t=>{l(Object.assign(i,t instanceof Function?t(i):t)),c(t=>t+1)},[l]);return[i,s]}},fh59:function(t,n,e){"use strict";e.r(n);var r=e("tJVT"),a=e("q1tI"),c=e.n(a),o=e("4H9c"),u=()=>{var t=Object(o["a"])({count:0,other:"lxj"}),n=Object(r["a"])(t,2),e=n[0],a=n[1],u=c.a.useCallback(()=>{a({count:e.count+1}),console.log(e)},[]);return c.a.createElement("div",null,c.a.createElement("div",null,JSON.stringify(e)),c.a.createElement("br",null),c.a.createElement("button",{onClick:u},"add ",e.count))};n["default"]=u},tJVT:function(t,n,e){"use strict";function r(t){if(Array.isArray(t))return t}function a(t,n){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var e=[],r=!0,a=!1,c=void 0;try{for(var o,u=t[Symbol.iterator]();!(r=(o=u.next()).done);r=!0)if(e.push(o.value),n&&e.length===n)break}catch(i){a=!0,c=i}finally{try{r||null==u["return"]||u["return"]()}finally{if(a)throw c}}return e}}function c(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function o(t,n){return r(t)||a(t,n)||c()}e.d(n,"a",(function(){return o}))}}]);