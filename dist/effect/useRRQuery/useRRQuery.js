import { __assign } from "tslib";
import { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'query-string';
import { useFn } from '@lxjx/hooks';
/*
 * 新版思路
 * createUseQuery({ useLocation, useHistory })
 * 两个参数分别表示用于获取history和location对象的方法
 * history应包含push和replace方法(接收字符串路径)、新版支持配置支持push方式的参数切换
 * location应包含search/pathname/hash属性
 * */
/**
 * 用于便捷的获取或设置react-router的url query
 * @type <Query> - any | 查询对象的接口格式
 * @param defaultQuery - 默认查询, 会与url查询合并, 可以是查询对象或查询字符串(只在初始化时读取)
 * @return result
 * @return result.query - 查询字符串
 * @return result.queryObject - 根据search解析得到的对象
 * @return result.set - 将包含一个或多个查询值的对象设置到当前url查询上
 * @return result.coverSet - 类似set，区别是会重置掉所有search并设置为传入的查询对象(仍包含默认查询)
 * */
export function useRRQuery(defaultQuery) {
    var replace = useHistory().replace;
    var _a = useLocation(), search = _a.search, pathname = _a.pathname, hash = _a.hash;
    /** 取默认查询 */
    var _default = useMemo(function () {
        if (defaultQuery) {
            if (typeof defaultQuery === 'string') {
                return qs.parse(defaultQuery);
            }
            return defaultQuery;
        }
        return {};
    }, []);
    /** 合并默认查询和url查询 */
    var queryObject = useMemo(function () {
        return __assign(__assign({}, _default), qs.parse(search));
    }, [_default, search]);
    var query = useMemo(function () { return qs.stringify(queryObject); }, [queryObject]);
    /** 传入一个查询对象，将其转换为查询串后替换当前url */
    function navWithNewSearch(newQO) {
        replace(pathname + "?" + qs.stringify(newQO) + hash);
    }
    var set = useFn(function (queryItem) {
        var newQueryObject = __assign(__assign({}, queryObject), queryItem);
        navWithNewSearch(newQueryObject);
    });
    var coverSet = useFn(function (queryItem) {
        navWithNewSearch(__assign(__assign({}, _default), queryItem));
    });
    return {
        query: query ? "?" + query : '',
        queryObject: queryObject,
        set: set,
        coverSet: coverSet,
    };
}
//# sourceMappingURL=useRRQuery.js.map