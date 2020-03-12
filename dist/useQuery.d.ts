interface UseQuerySet<Query> {
    (queryObject: Partial<Query>): void;
}
/**
 * 用于便捷的获取或设置react-router v5的query string
 * @interface <Query> - any | 查询对象的接口格式
 * @param defaultSearch - 默认查询
 * @return result
 * @return result.search - 原始查询字符串
 * @return result.queryObject - 根据search解析得到的对象
 * @return result.set - 将包含一个或多个查询值的对象覆盖到当前url查询上
 * @return result.coverSet - 同set，区别是会重置掉所有search并设置为传入的查询对象
 * */
export declare function useQuery<Query extends object = any>(defaultSearch?: string | Partial<Query>): {
    search: string;
    queryObject: Partial<Query>;
    set: UseQuerySet<Query>;
    coverSet: UseQuerySet<Query>;
};
export {};
