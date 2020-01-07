import { useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import qs from 'query-string';

interface UseQuerySet<Query> {
  (queryObject: Partial<Query>): void;
}

/**
 * 用于便捷的获取或设置react-router v5的query string
 * @interface <Query> - any | 查询对象的接口格式
 * @return result
 * @return result.search - 原始查询字符串
 * @return result.queryObject - 根据search解析得到的对象
 * @return result.set - 将包含一个或多个查询值的对象覆盖到当前url查询上
 * @return result.coverSet - 同set，区别是会重置掉所有search并设置为传入的查询对象
 * */
function useQuery<Query extends object = any>() {
  const { replace } = useHistory();
  const { search, pathname, hash } = useLocation();
  const queryObject = qs.parse(search);

  function navWidthNewSearch(newQO: Partial<Query>) {
    replace(`${pathname}?${qs.stringify(newQO)}${hash}`);
  }

  const set: UseQuerySet<Query> = useCallback((queryItem) => {
    const newQueryObject = {
      ...queryObject,
      ...queryItem,
    };
    navWidthNewSearch(newQueryObject);
    // eslint-disable-next-line
  }, [search]);

  const coverSet: UseQuerySet<Query> = useCallback((queryItem) => {
    navWidthNewSearch(queryItem);
    // eslint-disable-next-line
  }, [search]);

  return {
    search,
    queryObject: queryObject as Partial<Query>,
    set,
    coverSet,
  };
}