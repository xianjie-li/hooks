import { useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'query-string';
import { AnyObject } from '@lxjx/utils';
import { useFn } from './useFn';

interface UseQuerySet<Query> {
  (queryObject: Partial<Query>): void;
}

/**
 * 用于便捷的获取或设置react-router的url query
 * @type <Query> - any | 查询对象的接口格式
 * @param defaultSearch - 默认查询, 会与url查询合并, 可以是查询对象或查询字符串(只在初始化时读取)
 * @return result
 * @return result.search - 查询字符串
 * @return result.queryObject - 根据search解析得到的对象
 * @return result.set - 将包含一个或多个查询值的对象设置到当前url查询上
 * @return result.coverSet - 类似set，区别是会重置掉所有search并设置为传入的查询对象(仍包含默认查询)
 * */
export function useRRQuery<Query extends object = any>(
  defaultSearch?: string | AnyObject
) {
  const { replace } = useHistory();
  const { search, pathname, hash } = useLocation();
  /** 取默认查询 */
  const _default = useMemo<Partial<Query>>(() => {
    if (defaultSearch) {
      if (typeof defaultSearch === 'string') {
        return qs.parse(defaultSearch) as Partial<Query>;
      }
      return defaultSearch as Partial<Query>;
    }
    return {};
  }, []);

  /** 合并默认查询和url查询 */
  const queryObject = useMemo(() => {
    return { ..._default, ...qs.parse(search) };
  }, [_default, search]);

  const _search = qs.stringify(queryObject);

  /** 传入一个查询对象，将其转换为查询串后替换当前url */
  function navWithNewSearch(newQO: Partial<Query>) {
    replace(`${pathname}?${qs.stringify(newQO)}${hash}`);
  }

  const set: UseQuerySet<Query> = useFn(queryItem => {
    const newQueryObject = {
      ...queryObject,
      ...queryItem,
    };
    navWithNewSearch(newQueryObject);
  });

  const coverSet: UseQuerySet<Query> = useFn(queryItem => {
    navWithNewSearch({ ..._default, ...queryItem });
  });

  return {
    search: _search ? `?${_search}` : '',
    queryObject: queryObject as Partial<Query>,
    set,
    coverSet,
  };
}
