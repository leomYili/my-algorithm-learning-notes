// 深拷贝
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

function find(arr, source) {
  for (let result of arr) {
    if (result.source === source) {
      return result;
    }
  }

  return null;
}

function cloneDeepDG(source, uniqueList = []) {
  if (!isObject(source)) return source;

  let target = Array.isArray(source) ? [] : {};

  let uniqueData = find(uniqueList, source);
  if (uniqueData) return uniqueData.target;

  uniqueList.push({
    source,
    target,
  })

  for (let key in source) {
    if (obj.hasOwnProperty(key)) {
      if (isObject(source[key])) {
        target = cloneDeepDG(source[key], uniqueList);
      } else {
        target[key] = source[key];
      }
    }
  }

  return target;
}

// 深拷贝,防止爆栈
function cloneDeepDP(source) {
  if (!isObject(source)) return source;

  let root = Array.isArray(source) ? [] : {};

  let uniqueList = [];

  let loopList = [{
    parent: root,
    key: undefined,
    data: source
  }]

  while (loopList.length) {
    let node = loopList.pop();

    const { parent, key, data } = node;

    let res = parent;
    if (typeof key !== "undefined") {
      res = parent[key] = Array.isArray(source) ? [] : {};
    }

    // 判断是否已存在
    let uniqueData = find(uniqueList, data);
    if (uniqueData) {
      parent[key] = uniqueData.target;
      break;
    }

    uniqueList.push({
      source: data,
      target: res
    });

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (isObject(data[key])) {
          loopList.push({
            parent: res,
            key,
            data: data[key]
          })
        } else {
          res[key] = data[key];
        }
      }
    }
  }

  return root;
}

// promise.all
class Promise {
  static all(list) {
    let result = [];

    return new Promise((resolve, reject) => {
      for (let i = 0; i < list.length; i++) {
        list[i].then((value) => {
          result.push(value);

          if (i + 1 === list.length) {
            resolve(result);
          }
        }, reject)
      }
    })
  }
}

// reduce
Array.prototype.newReduce = (fn, initialValue) => {
  if (typeof fn !== "function") {
    throw new Error("xxx")
  }

  let arr = Array.prototype.slice(this);

  let res = typeof initialValue !== "undefined" ? initialValue : arr[0];
  let startIndex = typeof initialValue !== "undefined" ? 0 : 1;

  for (let i = startIndex; i < arr.length; i++) {
    res = fn(res, arr[i], i, this);
  }

  return res;
};

// map foreach不需要返回res,直接执行循环即可
Array.prototype.newMap = (fn, context) => {
  if (typeof fn !== "function") {
    throw new Error("fn is not a function");
  }

  let arr = Array.prototype.slice(this);
  let res = [];

  for (let i = 0; i < arr.length; i++) {
    res.push(fn.call(context, arr[i], i, this));
  }

  return res;
}

// flatDeep
function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((sub, val) => sub.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), []) : arr.slice();
}

// 防抖和节流
function throttle(fn, delay = 50) {
  let prev = 0;

  return function (...args) {
    let now = +new Date();

    if (now - prew > delay) {
      prew = now;
      fn.apply(this, args)
    }
  }
}

function debounce(fn, delay, immediate) {
  let timer = null;

  return (...args) => {
    let self = this;

    if (timer) clearTimeout(timer);

    if (immediate && !timer) {
      fn.apply(self, args)
    }

    timer = setTimeout(() => {
      fn.apply(self, args)
    }, delay);
  }
}