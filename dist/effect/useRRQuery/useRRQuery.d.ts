import { AnyObject } from '@lxjx/utils';
interface UseQuerySet<Query> {
    (queryObject: Partial<Query>): void;
}
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
export declare function useRRQuery<Query extends object = any>(defaultQuery?: string | AnyObject): {
    query: string;
    queryObject: Partial<Query>;
    set: UseQuerySet<Query>;
    coverSet: UseQuerySet<Query>;
};
export {};
//# sourceMappingURL=useRRQuery.d.ts.map