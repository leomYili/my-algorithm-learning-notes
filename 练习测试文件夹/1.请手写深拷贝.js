// isObject和find函数

function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

function find(arr, source) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].source === source) {
      return arr[i];
    }
  }

  return null;
}

function cloneDeepDG(obj, uniqueList = []) {
  if (!isObject(obj)) return obj;

  let target = Array.isArray(obj) ? [] : {};

  let unique = find(uniqueList, obj);
  if (unique) {
    return unique.target;
  }

  uniqueList.push({
    source: obj,
    target,
  });

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (isObject(obj[key])) {
        target[key] = cloneDeepDG(obj[key], uniqueList);
      } else {
        target[key] = obj[key];
      }
    }
  }
}

// 这里和上面基本一致,除了需要依赖一个栈来进行迭代
function cloneDeepDP(obj) {
  if (!isObject) return obj;

  let root = Array.isArray(obj) ? [] : {};

  let loopList = [
    {
      parent: root,
      key: undefined,
      data: obj,
    },
  ];

  let uniqueList = [];

  while (loopList.length) {
    let node = loopList.pop();

    let { parent, key, data } = node;

    let res = parent;
    if (!key) {
      res = parent[key] = Array.isArray(obj) ? [] : {};
    }

    let unique = find(uniqueList, parent);
    if (unique) {
      parent[key] = unique.target;
      break;
    }

    uniqueList.push({
      source: data,
      target: res,
    });

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (isObject(data[key])) {
          loopList.push({
            parent: res,
            key,
            data: data[key],
          });
        } else {
          res[key] = data[key];
        }
      }
    }
  }

  return root;
}
