 let isType = (type) => {
    return (obj) => {
      return Object.prototype.toString.call(obj) === `[object ${type}]`;
    }
  }
let isString = isType('String');
let isArray = isType('Array');
isString("123");    // true
isArray([1,2,3]);   // true