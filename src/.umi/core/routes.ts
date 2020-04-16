import { ApplyPluginsType } from 'C:/Users/Administrator/Desktop/hooks-next/node_modules/@umijs/runtime/dist/index.js';
import { plugin } from './plugin';

const routes = [
  {
    "path": "/_demos/use-custom-event.demo",
    "component": require('..\\..\\effect\\useCustomEvent.demo.tsx').default
  },
  {
    "path": "/_demos/use-debounce.demo",
    "component": require('..\\..\\effect\\useDebounce.demo.tsx').default
  },
  {
    "path": "/_demos/use-effect-equal.demo",
    "component": require('..\\..\\effect\\useEffectEqual.demo.tsx').default
  },
  {
    "path": "/_demos/use-fetch.demo",
    "component": require('..\\..\\effect\\useFetch.demo.tsx').default
  },
  {
    "path": "/_demos/use-fn.demo",
    "component": require('..\\..\\effect\\useFn.demo.tsx').default
  },
  {
    "path": "/_demos/use-rrquery.demo",
    "component": require('..\\..\\effect\\useRRQuery.demo.tsx').default
  },
  {
    "path": "/_demos/use-throttle.demo",
    "component": require('..\\..\\effect\\useThrottle.demo.tsx').default
  },
  {
    "path": "/_demos/use-derived-state-from-props.demo",
    "component": require('..\\..\\state\\useDerivedStateFromProps.demo.tsx').default
  },
  {
    "path": "/_demos/use-form-state.demo",
    "component": require('..\\..\\state\\useFormState.demo.tsx').default
  },
  {
    "path": "/_demos/use-refize.demo",
    "component": require('..\\..\\state\\useRefize.demo.tsx').default
  },
  {
    "path": "/_demos/use-same-state.demo",
    "component": require('..\\..\\state\\useSameState.demo.tsx').default
  },
  {
    "path": "/_demos/use-self.demo",
    "component": require('..\\..\\state\\useSelf.demo.tsx').default
  },
  {
    "path": "/_demos/use-set-state.demo",
    "component": require('..\\..\\state\\useSetState.demo.tsx').default
  },
  {
    "path": "/_demos/use-storage-state.demo",
    "component": require('..\\..\\state\\useStorageState.demo.tsx').default
  },
  {
    "path": "/_demos/use-storage-set-state.demo",
    "component": require('..\\..\\state\\useStorageSetState.demo.tsx').default
  },
  {
    "path": "/_demos/use-break-point.demo",
    "component": require('..\\..\\ui\\useBreakPoint.demo.tsx').default
  },
  {
    "path": "/_demos/use-lock-body-scroll.demo",
    "component": require('..\\..\\ui\\useLockBodyScroll.demo.tsx').default
  },
  {
    "path": "/_demos/use-scroll.demo",
    "component": require('..\\..\\ui\\useScroll.demo.tsx').default
  },
  {
    "path": "/",
    "component": (props) => require('react').createElement(require('C:/Users/Administrator/Desktop/hooks-next/node_modules/@umijs/preset-dumi/lib/themes/default/layout.js').default, {
      ...{"menus":{"*":{"*":[{"path":"/","title":"安装","meta":{}},{"title":"Ui","path":"/ui","meta":{},"children":[{"path":"/ui/use-scroll","title":"useScroll","meta":{}},{"path":"/ui/use-break-point","title":"useBreakPoint","meta":{}},{"path":"/ui/use-lock-body-scroll","title":"useLockBodyScroll","meta":{}}]},{"title":"State","path":"/state","meta":{},"children":[{"path":"/state/use-set-state","title":"useSetState","meta":{"order":2}},{"path":"/state/use-self","title":"useSelf","meta":{"order":3}},{"path":"/state/use-storage-state","title":"useStorageState","meta":{"order":4}},{"path":"/state/use-refize","title":"useRefize","meta":{}},{"path":"/state/use-form-state","title":"useFormState","meta":{}},{"path":"/state/use-same-state","title":"useSameState","meta":{}},{"path":"/state/use-derived-state-from-props","title":"useDerivedStateFromProps","meta":{}}]},{"title":"Effect","path":"/effect","meta":{},"children":[{"path":"/effect/use-throttle","title":"useThrottle","meta":{"order":1}},{"path":"/effect/use-debounce","title":"useDebounce","meta":{"order":2}},{"path":"/effect/use-fn","title":"useFn","meta":{}},{"path":"/effect/use-fetch","title":"useFetch","meta":{}},{"path":"/effect/use-rrquery","title":"useRRQuery","meta":{}},{"path":"/effect/use-custom-event","title":"useCustomEvent","meta":{}},{"path":"/effect/use-effect-equal","title":"useEffectEqual","meta":{}}]}]}},"locales":[],"navs":{},"title":"hooks","desc":"Use Your Imagination\
","mode":"doc"},
      ...props,
    }),
    "routes": [
      {
        "path": "/",
        "component": require('../../index.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/index.md",
          "updatedTime": 1586788652680,
          "slugs": [
            {
              "depth": 2,
              "value": "安装",
              "heading": "安装"
            },
            {
              "depth": 2,
              "value": "介绍",
              "heading": "介绍"
            },
            {
              "depth": 2,
              "value": "组件库",
              "heading": "组件库"
            },
            {
              "depth": 2,
              "value": "其他",
              "heading": "其他"
            }
          ],
          "title": "安装"
        },
        "title": "安装"
      },
      {
        "path": "/effect/use-custom-event",
        "component": require('../../effect/useCustomEvent.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/effect/useCustomEvent.md",
          "updatedTime": 1586668446488,
          "title": "useCustomEvent",
          "slugs": [
            {
              "depth": 1,
              "value": "useCustomEvent",
              "heading": "usecustomevent"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/effect",
            "title": "Effect"
          }
        },
        "title": "useCustomEvent"
      },
      {
        "path": "/effect/use-debounce",
        "component": require('../../effect/useDebounce.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/effect/useDebounce.md",
          "updatedTime": 1586192703448,
          "title": "useDebounce",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "useDebounce",
              "heading": "usedebounce"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/effect",
            "title": "Effect"
          }
        },
        "title": "useDebounce"
      },
      {
        "path": "/effect/use-effect-equal",
        "component": require('../../effect/useEffectEqual.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/effect/useEffectEqual.md",
          "updatedTime": 1586825338906,
          "title": "useEffectEqual",
          "slugs": [
            {
              "depth": 1,
              "value": "useEffectEqual",
              "heading": "useeffectequal"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/effect",
            "title": "Effect"
          }
        },
        "title": "useEffectEqual"
      },
      {
        "path": "/effect/use-fetch",
        "component": require('../../effect/useFetch.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/effect/useFetch.md",
          "updatedTime": 1587058982448,
          "title": "useFetch",
          "slugs": [
            {
              "depth": 1,
              "value": "useFetch",
              "heading": "usefetch"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/effect",
            "title": "Effect"
          }
        },
        "title": "useFetch"
      },
      {
        "path": "/effect/use-fn",
        "component": require('../../effect/useFn.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/effect/useFn.md",
          "updatedTime": 1586449598239,
          "title": "useFn",
          "order": 0,
          "slugs": [
            {
              "depth": 1,
              "value": "useFn",
              "heading": "usefn"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/effect",
            "title": "Effect"
          }
        },
        "title": "useFn"
      },
      {
        "path": "/effect/use-rrquery",
        "component": require('../../effect/useRRQuery.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/effect/useRRQuery.md",
          "updatedTime": 1586535139959,
          "title": "useRRQuery",
          "slugs": [
            {
              "depth": 1,
              "value": "useRRQuery",
              "heading": "userrquery"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/effect",
            "title": "Effect"
          }
        },
        "title": "useRRQuery"
      },
      {
        "path": "/effect/use-throttle",
        "component": require('../../effect/useThrottle.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/effect/useThrottle.md",
          "updatedTime": 1586192506574,
          "title": "useThrottle",
          "order": 1,
          "slugs": [
            {
              "depth": 1,
              "value": "useThrottle",
              "heading": "usethrottle"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/effect",
            "title": "Effect"
          }
        },
        "title": "useThrottle"
      },
      {
        "path": "/state/use-derived-state-from-props",
        "component": require('../../state/useDerivedStateFromProps.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/state/useDerivedStateFromProps.md",
          "updatedTime": 1586709474934,
          "title": "useDerivedStateFromProps",
          "slugs": [
            {
              "depth": 1,
              "value": "useDerivedStateFromProps",
              "heading": "usederivedstatefromprops"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/state",
            "title": "State"
          }
        },
        "title": "useDerivedStateFromProps"
      },
      {
        "path": "/state/use-form-state",
        "component": require('../../state/useFormState.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/state/useFormState.md",
          "updatedTime": 1586706616788,
          "title": "useFormState",
          "slugs": [
            {
              "depth": 1,
              "value": "useFormState",
              "heading": "useformstate"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/state",
            "title": "State"
          }
        },
        "title": "useFormState"
      },
      {
        "path": "/state/use-refize",
        "component": require('../../state/useRefize.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/state/useRefize.md",
          "updatedTime": 1586822938453,
          "title": "useRefize",
          "slugs": [
            {
              "depth": 1,
              "value": "useRefize",
              "heading": "userefize"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/state",
            "title": "State"
          }
        },
        "title": "useRefize"
      },
      {
        "path": "/state/use-same-state",
        "component": require('../../state/useSameState.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/state/useSameState.md",
          "updatedTime": 1586821515699,
          "title": "useSameState",
          "slugs": [
            {
              "depth": 1,
              "value": "useSameState",
              "heading": "usesamestate"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/state",
            "title": "State"
          }
        },
        "title": "useSameState"
      },
      {
        "path": "/state/use-self",
        "component": require('../../state/useSelf.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/state/useSelf.md",
          "updatedTime": 1585582856737,
          "title": "useSelf",
          "order": 3,
          "slugs": [
            {
              "depth": 1,
              "value": "useSelf",
              "heading": "useself"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/state",
            "title": "State"
          }
        },
        "title": "useSelf"
      },
      {
        "path": "/state/use-set-state",
        "component": require('../../state/useSetState.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/state/useSetState.md",
          "updatedTime": 1586527544975,
          "title": "useSetState",
          "order": 2,
          "slugs": [
            {
              "depth": 1,
              "value": "useSetState",
              "heading": "usesetstate"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/state",
            "title": "State"
          }
        },
        "title": "useSetState"
      },
      {
        "path": "/state/use-storage-state",
        "component": require('../../state/useStorageState.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/state/useStorageState.md",
          "updatedTime": 1586529937521,
          "title": "useStorageState",
          "order": 4,
          "slugs": [
            {
              "depth": 1,
              "value": "useStorageState",
              "heading": "usestoragestate"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "useStorageSetState",
              "heading": "usestoragesetstate"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/state",
            "title": "State"
          }
        },
        "title": "useStorageState"
      },
      {
        "path": "/ui/use-break-point",
        "component": require('../../ui/useBreakPoint.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/ui/useBreakPoint.md",
          "updatedTime": 1586538682261,
          "title": "useBreakPoint",
          "slugs": [
            {
              "depth": 1,
              "value": "useBreakPoint",
              "heading": "usebreakpoint"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/ui",
            "title": "Ui"
          }
        },
        "title": "useBreakPoint"
      },
      {
        "path": "/ui/use-lock-body-scroll",
        "component": require('../../ui/useLockBodyScroll.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/ui/useLockBodyScroll.md",
          "updatedTime": 1586709633442,
          "title": "useLockBodyScroll",
          "slugs": [
            {
              "depth": 1,
              "value": "useLockBodyScroll",
              "heading": "uselockbodyscroll"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/ui",
            "title": "Ui"
          }
        },
        "title": "useLockBodyScroll"
      },
      {
        "path": "/ui/use-scroll",
        "component": require('../../ui/useScroll.md').default,
        "exact": true,
        "meta": {
          "filePath": "src/ui/useScroll.md",
          "updatedTime": 1586659983942,
          "title": "useScroll",
          "slugs": [
            {
              "depth": 1,
              "value": "useScroll",
              "heading": "usescroll"
            },
            {
              "depth": 2,
              "value": "示例",
              "heading": "示例"
            },
            {
              "depth": 2,
              "value": "API",
              "heading": "api"
            }
          ],
          "group": {
            "path": "/ui",
            "title": "Ui"
          }
        },
        "title": "useScroll"
      },
      {
        "path": "/effect",
        "meta": {},
        "exact": true,
        "redirect": "/effect/use-fn"
      },
      {
        "path": "/state",
        "meta": {},
        "exact": true,
        "redirect": "/state/use-set-state"
      },
      {
        "path": "/ui",
        "meta": {},
        "exact": true,
        "redirect": "/ui/use-scroll"
      }
    ],
    "title": "hooks"
  }
];

// allow user to extend routes
plugin.applyPlugins({
  key: 'patchRoutes',
  type: ApplyPluginsType.event,
  args: { routes },
});

export { routes };
