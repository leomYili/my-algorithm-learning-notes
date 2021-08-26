/**
 * 现在有一个字符串数组 ['a/b','a/b/c','a/b/c/d','a/b/c/e','a/b/c/e/f']
 * 要求转成 [{id:'a',subPath:[{id:'b',subPath:[...]}]}] 这种结构
 */

function conToTree(arr = []) {
  let result = [];

  if (arr.length === 0) return result;

  let itemMap = {}; // hash结构,用来存储数据关联
  let memo = {}; // 缓存结构,用来排除重复节点

  // 这里双循环,暂时没有什么思路可以简化时间复杂度
  for (let i = 0; i < arr.length; i++) {
    let res = arr[i].split("/");

    // 开始编写边界条件
    if (arr[i] === "") continue;

    for (let j = 0; j < res.length; j++) {
      let node = res[j];

      // j-1则为parentId

      if (!itemMap[node]) {
        itemMap[node] = {
          id: node,
          subPath: [],
        };
      }

      itemMap[node] = {
        ...itemMap[node],
        subPath: itemMap[node]["subPath"],
      };

      if (j === 0 && !memo[node]) {
        result.push(itemMap[node]);
        memo[node] = 1;
      } else {
        if (j - 1 < 0 || memo[node] >= 1) continue;

        let parent = res[j - 1];

        if (!itemMap[parent]) {
          itemMap[parent] = {
            id: parent,
            subPath: [],
          };
        }

        itemMap[parent].subPath.push(itemMap[node]);
        memo[node] ? memo[node]++ : (memo[node] = 1);
      }
    }
  }

  return result;
}

conToTree(["a/b", "a/b/c", "a/b/c/d", "a/b/c/e", "a/b/c/e/f"]);
