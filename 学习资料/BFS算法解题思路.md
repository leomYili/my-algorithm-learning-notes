# 正文

> BFS 的核心思想应该不难理解的，就是把一些问题抽象成图，从一个点开始，向四周开始扩散。一般来说，我们写 BFS 算法都是用「队列」这种数据结构，每次将一个节点周围的所有节点加入队列。
> BFS 相对 DFS 的最主要的区别是：BFS 找到的路径一定是最短的，但代价就是空间复杂度比 DFS 大很多，至于为什么，我们后面介绍了框架就很容易看出来了。

## 算法框架

从最基本的框架开始：

```()
function BFS(start,target){
    let q = []; // 模拟队列，先进先出
    let visited = [];

    q.push(start);// 将起点加入队列
    visited.push(start);

    let step = 0;

    while (q.length !== 0) {
        let sz = q.length;
        /* 将当前队列中的所有节点向四周扩散 */
        for (let i = 0; i < sz; i++) {
            let cur = q.shift();
            /* 划重点：这里判断是否到达终点 */
            if (cur is target)
                return step;
            /* 将 cur 的相邻节点加入队列 */
            for (let x of cur)
                if (!visited.includes(x)) {
                    q.push(x);
                    visited.push(x);
                }
        }
        /* 划重点：更新步数在这里 */
        step++;
    }
}
```

### 二叉树的最小深度

判断一棵二叉树的最小高度，

例如：

给定二叉树 [3,9,20,null,null,15,7]，

```()
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最小高度 2

显然起点就是 root 根节点，终点就是最靠近根节点的那个「叶子节点」嘛，叶子节点就是两个子节点都是 null 的节点：

```()
if (cur.left == null && cur.right == null)
    // 到达叶子节点
```

首先这道题当然可以用 dfs，也就是

```(DFS)
var minDepth = function(root) {
    if(root == null) {
        return 0;
    }
    if(root.left == null && root.right == null) {
        return 1;
    }
    let ans = Number.MAX_SAFE_INTEGER;
    if(root.left != null) {
        ans = Math.min(minDepth(root.left), ans);
    }
    if(root.right != null) {
        ans = Math.min(minDepth(root.right), ans);
    }
    return ans + 1;
};
```

不过既然是 BFS 解题思路，那像这种最短路径的方式，当然要用 BFS 去解题：

```(BFS)
const minDepth = (root) => {
    if (root == null) return 0;

    const queue = [root]; // 根节点入队列
    let depth = 1;        // 当前层的深度

    while (queue.length) { // 直到清空队列
        const levelSize = queue.length; // 当前层的节点个数
        for (let i = 0; i < levelSize; i++) { // 遍历 逐个出队列，广度所在
            const cur = queue.shift();  // 出队列
            if (cur.left == null && cur.right == null) { // 如果没有孩子，直接返回所在层数
                return depth;
            }
            if (cur.left) queue.push(cur.left); // 有孩子，让孩子入列
            if (cur.right) queue.push(cur.right);
        }
        depth++; // 肯定有下一层，如果没有早就return了
    }
};
```
