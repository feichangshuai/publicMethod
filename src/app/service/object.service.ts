/**
 * 判断一个对象是否是基础对象
 * @param {any} obj The object to inspect.
 * @returns {boolean} True if the argument appears to be a plain object.
 */
 export default function isPlainObject(obj) {
    if (typeof obj !== 'object' || obj === null) return false
  
    let proto = obj
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto)
    }
  
    return Object.getPrototypeOf(obj) === proto
  }
/**
 * 将枚举转换为key value的数组
 * @param e enum
 * @returns key value
 * @example 
  enum DimensionTypes {
    普通维度,
    枚举维度,
    层级维度,
  }
 */
  export function loopEnum<T>(e:T): ({key:Array<any>,value:Array<any>}) {
    if(typeof e !== 'object' || e === null) {return {key:[],value:[]}};
    const data = Object.keys(e)
    return {key:data.slice(0,data.length/2),value:data.slice(data.length/2)}
}
/**
 * 将枚举转换为key value的数组
 * @param e enum
 * @returns key value
 * @example
enum DimensionTypes {
  普通维度 = 'dimension-normal',
  枚举维度 = 'dimension-enum',
  层级维度 = 'dimension-hierarchy',
}
 */
export function loopEnumWithKey<T>(e:T): ({key:Array<any>,value:Array<any>}) {
    if(typeof e !== 'object' || e === null) {return {key:[],value:[]}};
    const value = Object.keys(e)
    const key = value.map(t => {return e[t]},[])
    return {key: key,value: value}
}