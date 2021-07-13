# 题目

后台返回一个扁平的数据结构，转成树

打平的数据内容如下：

```()
let arr = [
    {id: 1, name: '部门1', pid: 0},
    {id: 2, name: '部门2', pid: 1},
    {id: 3, name: '部门3', pid: 1},
    {id: 4, name: '部门4', pid: 3},
    {id: 5, name: '部门5', pid: 4},
]
```

输出结果是:

```()
[
    {
        "id": 1,
        "name": "部门1",
        "pid": 0,
        "children": [
            {
                "id": 2,
                "name": "部门2",
                "pid": 1,
                "children": []
            },
            {
                "id": 3,
                "name": "部门3",
                "pid": 1,
                "children": [
                    // 结果 ,,,
                ]
            }
        ]
    }
]
```

## 解析

随着n的不断增大，时间复杂度不断增大，算法花费时间越多。 常见的时间复杂度有

常数阶O(1)
对数阶O(log2 n)
线性阶O(n)
线性对数阶O(n log2 n)
平方阶O(n^2)
立方阶O(n^3)
k次方阶O(n^K)
指数阶O(2^n)

而这道题目如果直接用递归,那当扁平结构越大,则时间复杂度越高

## 解法一:递归(直觉方法)

```()
/**
 * 递归查找，获取children
 */
const getChildren = (data, result, pid) => {
  for (const item of data) {
    if (item.pid === pid) {
      const newItem = {...item, children: []};
      result.push(newItem);
      getChildren(data, newItem.children, item.id);
    }
  }
}

/**
* 转换方法
*/
const arrayToTree = (data, pid) => {
  const result = [];
  getChildren(data, result, pid)
  return result;
}

arrayToTree(arr,arr[0].pid)
```

从上面的代码我们分析，该实现的时间复杂度为O(2^n)。

## 解法二:备忘录,遍历

```()
function arrayToTree(items) {
  const result = [];   // 存放结果集
  const itemMap = {};  // 
    
  // 先转成map存储
  for (const item of items) {
    itemMap[item.id] = {...item, children: []}
  }
  
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;
    const treeItem = itemMap[id];
    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }

  }
  return result;
}
```

自顶向下,从最小层级开始遍历,一直到可以放到其上级结束

## 解法三:备忘录,链表直接引用

```()
function arrayToTree(items) {
  const result = [];   // 存放结果集
  const itemMap = {};  // 
  for (const item of items) {
    const id = item.id;
    const pid = item.pid;

    if (!itemMap[id]) {
      itemMap[id] = {
        children: [],
      }
    }

    itemMap[id] = {
      ...item,
      children: itemMap[id]['children']
    }

    const treeItem =  itemMap[id];

    if (pid === 0) {
      result.push(treeItem);
    } else {
      if (!itemMap[pid]) {
        itemMap[pid] = {
          children: [],
        }
      }
      itemMap[pid].children.push(treeItem)
    }

  }
  return result;
}
```

跟上面类似,只是在遍历时直接建立map结构体
