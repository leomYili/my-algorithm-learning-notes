function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

// 用来解决循环引用的查找问题
function find(list, item) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].source === item) {
      return list[i];
    }
  }

  return null;
}

function cloneDeepDG(source, uniqueList = []) {
  if (!isObject) return source;

  let target = Array.isArray(source) ? [] : {};

  let uniqueData = find(uniqueList, source);

  if (uniqueData) {
    return uniqueData.target;
  }

  uniqueList.push({
    source: source,
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

function cloneDeepDp(source) {
  if (!isObject) return source;

  let root = Array.isArray(source) ? [] : {};

  let uniqueList = [];

  let loopList = [
    {
      parent: root,
      key: undefined,
      data: source,
    },
  ];

  while (loopList.length) {
    const node = loopList.pop();

    const { parent, key, data } = node;

    let res = parent;
    if (key !== undefined) {
      res = parent[key] = Array.isArray(parent[key]) ? [] : {};
    }

    let uniqueData = find(uniqueList,data);
    if(uniqueData){
      // 这里还是错了,要记忆成break,如果return,就终止了,没办法继续往下走了
      parent[key] = uniqueData.target;
      break;
    }

    uniqueList.push({
      source: data,
      target: res,
    });

    for(let k in data){
      if(data.hasOwnProperty(k)){
        if(isObject(data[k])){
          loopList.push({
            parent:res,
            key:k,
            data:data[k]
          })
        }else{
          res[k] = data[k]
        }
      }
    }
  }

  return root;
}
