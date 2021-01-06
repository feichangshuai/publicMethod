export class Method {
    // 检查是否为空
    isEmpty<T>(x: T): boolean {
        if (Array.isArray(x)
            || typeof x === 'string'
            || x instanceof String
        ) {
            return x.length === 0;
        }

        if (x instanceof Map || x instanceof Set) {
            return x.size === 0;
        }

        if (({}).toString.call(x) === '[object Object]') {
            return Object.keys(x).length === 0;
        }

        return false;
    }
    // 获取列表最后一项
    lastItem<T>(list: T) {
        if (Array.isArray(list)) {
            return list.slice(-1)[0];
        }

        if (list instanceof Set) {
            return Array.from(list).slice(-1)[0];
        }

        if (list instanceof Map) {
            return Array.from(list.values()).slice(-1)[0];
        }
    }
    // 带有范围的随机数生成器
    randomNumber(max = 1, min = 0): number {
        if (min >= max) {
            return max;
        }

        return Math.floor(Math.random() * (max - min) + min);
    }

    // 随机ID生成器
    // 有时你只是需要一些 ID？除非你要的是更复杂的 ID 生成器（例如 UUID），
    // 否则用不着为此安装什么新库，下面这个选项足够了。你可以从当前时间（以毫秒为单位）或特定的整数和增量开始生成，也可以从字母生成 ID。
    // create unique id starting from current time in milliseconds
    // incrementing it by 1 everytime requested
    uniqueId = (() => {
        const id = (function* () {
            let mil = new Date().getTime();

            while (true)
                yield mil += 1;
        })();

        return () => id.next().value;
    })();
    // create unique incrementing id starting from provided value or zero
    // good for temporary things or things that id resets
    uniqueIncrementingId = ((lastId = 0) => {
        const id = (function* () {
            let numb = lastId;

            while (true)
                yield numb += 1;
        })()

        return (length = 12) => `${id.next().value}`.padStart(length, '0');
    })();
    // create unique id from letters and numbers
    uniqueAlphaNumericId = (() => {
        const heyStack = '0123456789abcdefghijklmnopqrstuvwxyz';
        const randomInt = () => Math.floor(Math.random() * Math.floor(heyStack.length))

        return (length = 24) => Array.from({ length }, () => heyStack[randomInt()]).join('');
    })();

    // 创建一个范围内的数字
    // Python 里我很喜欢的一个功能是 range 函数，
    // 而在 JavaScript 里我经常需要自己写这个功能。下面是一个简单的实现，非常适合 for…of 循环以及需要特定范围内数字的情况。
    range(maxOrStart, end = null, step = null) {
        if (!end) {
            return Array.from({ length: maxOrStart }, (_, i) => i)
        }

        if (end <= maxOrStart) {
            return [];
        }

        if (step !== null) {
            return Array.from(
                { length: Math.ceil(((end - maxOrStart) / step)) },
                (_, i) => (i * step) + maxOrStart
            );
        }

        return Array.from(
            { length: Math.ceil((end - maxOrStart)) },
            (_, i) => i + maxOrStart
        );
    }
    // 格式化 JSON 字符串，stringify 任何内容
    // 我在使用 NodeJs 将对象记录到控制台时经常使用这种方法。JSON.stringify 方法需要第三个参数，该参数必须有多个空格以缩进行。
    // 第二个参数可以为 null，但你可以用它来处理 function、Set、Map、Symbol 之类 JSON.stringify 方法无法处理或完全忽略的内容。
    stringify = (() => {
        const replacer = (key, val) => {
            if (typeof val === 'symbol') {
                return val.toString();
            }
            if (val instanceof Set) {
                return Array.from(val);
            }
            if (val instanceof Map) {
                return Array.from(val.entries());
            }
            if (typeof val === 'function') {
                return val.toString();
            }
            return val;
        }

        return (obj, spaces = 0) => JSON.stringify(obj, replacer, spaces)
    })();
    // 顺序执行 promise
    // 如果你有一堆异步或普通函数都返回 promise，要求你一个接一个地执行，这个工具就会很有用。
    // 它会获取函数或 promise 列表，并使用数组 reduce 方法按顺序解析它们。
    asyncSequentializer = (() => {
        const toPromise = (x) => {
            if (x instanceof Promise) { // if promise just return it
                return x;
            }

            if (typeof x === 'function') {
                // if function is not async this will turn its result into a promise
                // if it is async this will await for the result
                return (async () => await x())();
            }

            return Promise.resolve(x)
        }

        return (list) => {
            const results = [];

            return list
                .reduce((lastPromise, currentPromise) => {
                    return lastPromise.then(res => {
                        results.push(res); // collect the results
                        return toPromise(currentPromise);
                    });
                }, toPromise(list.shift()))
                // collect the final result and return the array of results as resolved promise
                .then(res => Promise.resolve([...results, res]));
        }
    })();
    // 轮询数据
    // 如果你需要持续检查数据更新，但系统中没有 WebSocket，则可以使用这个工具来执行操作。它非常适合上传文件时，
    // 想要持续检查文件是否已完成处理的情况，或者使用第三方 API（例如 dropbox 或 uber）并且想要持续检查过程是否完成或骑手是否到达目的地的情况。
    async poll(fn, validate, interval = 2500) {
        const resolver = async (resolve, reject) => {
            try { // catch any error thrown by the "fn" function
                const result = await fn(); // fn does not need to be asynchronous or return promise
                // call validator to see if the data is at the state to stop the polling
                const valid = validate(result);
                if (valid === true) {
                    resolve(result);
                } else if (valid === false) {
                    setTimeout(resolver, interval, resolve, reject);
                } // if validator returns anything other than "true" or "false" it stops polling
            } catch (e) {
                reject(e);
            }
        };
        return new Promise(resolver);
    }


}