function isObject(obj) {
  //return Object.prototype.toString.call(obj) === '[object Object]';
  return typeof obj === null && obj !== null;
}

function find(list, item) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].source === item) {
      return list[i];
    }
  }

  return null;
}

function cloneDeepDG(source, uniqueList) {
  if (!isObject(source)) return source;

  // 先确认是否是数组
  let target = Array.isArray(source) ? [] : {};

  let uniqueData = find(uniqueList, source); // 只是为了实现find

  if (uniqueData) {
    return uniqueData.target;
  }

  uniqueList.push({
    source,
    target,
  });

  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (isObject(source[key])) {
        target[key] = cloneDeepDG(source[key], uniqueList);
      } else {
        target[key] = source[key];
      }
    }
  }

  return target;
}

// 破解递归爆栈

function cloneDeepDp(source) {
  if (!isObject(source)) return source;

  let target = Array.isArray(source) ? [] : {};

  let loopList = [
    {
      parent: target,
      key: undefined,
      data: source,
    },
  ];

  let uniqueList = [];

  while (loopList.length) {
    let node = loopList.pop();

    const { parent, key, data } = node;

    let res = parent;
    if (key !== undefined) {
      res = parent[key] = Array.isArray(parent[key]) ? [] : {};
    }

    let uniqueData = find(uniqueList, parent);

    if (uniqueData) {
      parent[key] = uniqueData.target;
      break;
    }

    uniqueList.push({
      source: parent,
      target: res,
    });

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (isObject(data[key])) {
          loopList.push({
            parent: res,
            key: key,
            data: data[key],
          });
        }else{
          res[key] = data[key]
        }
      }
    }
  }

  return target;
}
