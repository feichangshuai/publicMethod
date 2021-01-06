import { type } from "os";

/**
 * 集合工具类
 */
export class CollectionUtil {
    /**
     * 构建唯一集合
     * @param source 数据源 
     * @param identifier 标识符，为string代表id,为function代表比较表达式
     * @requires Array<T> source中去掉重复项 
     */
    static toSet<T>(source: Array<T>, identifier?: string | ((li: T, ri: T) => boolean)): Array<T> {
        if (!source || !Array.isArray(source)) { return source; }
        identifier = identifier || ((li, ri) => li == ri);
        const result = [];
        source.forEach(li => {
            if (!result.some(ri => typeof identifier === 'function' ? identifier(li, ri) : li[identifier] == ri[identifier])) {
                result.push(li);
            }
        })
        return result
    }
    /**
     * 将数组类型按照特定特定字段值映射成对象
     * @param source 
     * @param keyPropName 
     * 
     */
    static toMap<T, R>(source: T[], keyPropName: string | ((source: T) => string), valueFactory?: (source: T) => R): { [key: string]: R } {
        if (!source) { return {}; }
        if (!keyPropName) { throw new Error('keyPropName must has value') }
        const isFuncKeyPropName = typeof keyPropName === 'function';
        return source.reduce((pre, cur) => {
            const key = isFuncKeyPropName ? (keyPropName as Function).call(void 0, cur) : cur[keyPropName as string];
            const value = valueFactory ? valueFactory(cur) : cur;
            pre[key] = value;
            return pre
        }, {})
    }
    /**
     * 将list转成tree
     * @param metux 
     * @param depth 
     */
    static toTree<T extends { [key: string]: any }>(data: T[], options: CovertListToTreeOptions)
        : { [key: string]: any } {
        const { indentityKey, parentKey, childrenKey, allowVirtualRoot = true } = options;
        const result = {};
        if (!data) { return result };
        const dataMap = this.toMap(data, indentityKey);
        const needVirtualRoot = data.filter(item => !dataMap[item[parentKey]]).length > 1;
        if (needVirtualRoot && !allowVirtualRoot) {
            throw new Error('There are more than one roots, but you abandon virtual root!');
        }
        data.forEach(item => {
            const parentKeyVal = item[parentKey] || '';
            const parentNode = dataMap[parentKeyVal] || result;
            let childrenList = parentNode[childrenKey];
            if (!childrenList) {
                childrenList = [];
                parentNode[childrenKey] = childrenList;
            }
            childrenList.push(item);
        })
        return result;
    }
    /**
     * 获取数组的第一个值，如果数组为空或者第一个值为null，则返回defaultValue
     * @param source
     * @param defaultValue
     */
    static firstOrDefault<T>(source: Array<T>, defaultValue?: T): T {
        const firstValue = source && source[0];
        if (firstValue == null) {
            return defaultValue;
        }
        return firstValue;
    }
    /**
     *  获取数组的是一个值，如果数组为空，则返回null
     * @param source 
     *  
     */
    static first<T>(source: Array<T>): T {
        return this.firstOrDefault(source, null);
    }
    /**
     * 检查数组是否为空
     * @param data 
     */
    static isEmpty<T>(data: T[]): boolean {
        return !data || data.length === 0;
    }
    /**
     * 比较两个数组是否相同
     * @param l 
     * @param r 
     */
    static equals<T>(l: T[], r: T[]) {
        return l === r || (
            (!((!l && r) || (l && !r))) &&
            ((!l.some(xi => !r.some(yi => xi === yi)) && (!r.some(yi => !l.some(xi => xi === yi)))))
        );
    }
    /**
     * 数组求差
     * @param left 
     * @param right 
     * @param identifier 标识符，为string代表id,为function代表比较表达式
     * @return left中存在但是right中不存在的 
     * var x = [{a:1,b:1},{a:2,b:2},{a:3,b:3}];
     * var y = [{a:2,b:3},{a:3,b:3}];
     * CollectionUtil.substract(x,y,'a'); return [{a:1, b:1}]
     * CollectionUtil.substract(x,y,(li,ri)=>li.a == ri.a); return [{a:1, b:1}]
     * CollectionUtil.substract(x,y,(li,ri)=>li.a == ri.b); return [{a:1, b:1},{a:2,b:2}]
     */
    static substract<T,R=T>(left:T[],right:R[],identifier:string | ((li:T,ri:R)=> boolean)):Array<T> {
        if(left == null || right == null || identifier == null) {
            return left;
        }
        return left.filter(li => {
            !right.some(ri => typeof identifier === 'function' ? identifier(li,ri):li[identifier] == ri[identifier]);
        })
    }

    /**
    * 将矩阵打平
    * @param metux
    * @param depth 
    */
    static flat(metux: any, depth: number = 1) {
        if (!metux) { return [] }
        if (!(Array.isArray(metux)) || depth < 1) { return metux; }
        if (depth === 1) {
            return metux.reduce((pre, cur) => pre.concat(cur), [])
        } else {
            return metux.reduce((pre, cur) => { pre.concat(this.flat(cur, depth - 1)), [] })
        }

    }
    /**
     * 将矩阵打平去重
     * @param metux
     */
    static flatAndUnique(metux:any[]) {
        if(metux.length<1) {
            return [];
        }
        const platDics = this.flat(metux);
        return Array.from(new Set(platDics));
    }
}
export interface CovertListToTreeOptions {
    // 唯一标识
    indentityKey: string;
    // 父节点标识
    parentKey: string;
    // 子节点列表标识
    childrenKey: string;
    // 根节点可能是空，即输入可能是森林，需要创建虚拟根节点
    allowVirtualRoot?: boolean;
}