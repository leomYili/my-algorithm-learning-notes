# 正文

> LRU 算法的淘汰策略是 Least Recently Used，也就是每次淘汰那些最久没被使用的数据；LFU 算法的淘汰策略是 Least Frequently Used，也就是每次淘汰那些使用次数最少的数据。

## 算法描述

要求你写一个类，接受一个 capacity 参数，实现 get 和 put 方法：

```()
class LFUCache {
    // 构造容量为 capacity 的缓存
    public LFUCache(int capacity) {}
    // 在缓存中查询 key
    public int get(int key) {}
    // 将 key 和 val 存入缓存
    public void put(int key, int val) {}
}
```

get(key) 方法会去缓存中查询键 key，如果 key 存在，则返回 key 对应的 val，否则返回 -1。
put(key, value) 方法插入或修改缓存。如果 key 已存在，则将它对应的值改为 val；如果 key 不存在，则插入键值对 (key, val)。

当缓存达到容量 capacity 时，则应该在插入新的键值对之前，删除使用频次（后文用 freq 表示）最低的键值对。如果 freq 最低的键值对有多个，则删除其中最旧的那个。

## 思路分析

先列举出算法执行过程中的几个显而易见的事实：

1. 调用 get(key) 方法时，要返回该 key 对应的 val。
2. 只要用 get 或者 put 方法访问一次某个 key，该 key 的 freq 就要加一。
3. 如果在容量满了的时候进行插入，则需要将 freq 最小的 key 删除，如果最小的 freq 对应多个 key，则删除其中最旧的那一个。

也就是key是按照时间顺序插入的,而freq则根据请求次数来确认

可以使用基本数据结构来逐个击破

1. 使用一个类 HashMap 存储 key 到 val 的映射，就可以快速计算 get(key)。
2. 使用一个类 HashMap 存储 key 到 freq 的映射，就可以快速操作 key 对应的 freq。
3. 这个需求应该是 LFU 算法的核心，所以我们分开说。
   3.1. 首先，肯定是需要 freq 到 key 的映射，用来找到 freq 最小的 key。
   3.2. 将 freq 最小的 key 删除，那你就得快速得到当前所有 key 最小的 freq 是多少。想要时间复杂度 O(1) 的话，肯定不能遍历一遍去找，那就用一个变量 minFreq 来记录当前最小的 freq 吧。
   3.3. 可能有多个 key 拥有相同的 freq，所以 freq 对 key 是一对多的关系，即一个 freq 对应一个 key 的列表。
   3.4. 希望 freq 对应的 key 的列表是存在时序的，便于快速查找并删除最旧的 key。
   3.5. 希望能够快速删除 key 列表中的任何一个 key，因为如果频次为 freq 的某个 key 被访问，那么它的频次就会变成 freq+1，就应该从 freq 对应的 key 列表中删除，加到 freq+1 对应的 key 的列表中。

综上,可以写出lfu的基础结构:

```()
class LFUCache {
  constructor (capacity) {
    this.size = capacity
    this.valuesMap = new Map()  // key, value
    this.timesMap = new Map()   // key, 次数
    this.useMap = new Map()     // 次数 set{key}
    this.min = 0
  }
  get (key) {
    if(this.valuesMap.has(key)){
      this.increaseTimes(key)
      return this.valuesMap.get(key)
    }
    return -1
  }
  put (key, value) {
    if(this.size === 0) return
    if(this.valuesMap.has(key)){             // 1. 修改
      this.valuesMap.set(key, value)
      this.increaseTimes(key)
    } else {                                 // 2. 新增
      if(this.size === this.valuesMap.size){ // 2.1 当要超出, 先删除最不常用的
        let minSet = this.useMap.get(this.min)
        let minKey = minSet.keys().next().value // map起始的元素
        minSet.delete(minKey)
        this.valuesMap.delete(minKey)
        this.timesMap.delete(minKey)
      }
      // 2.2 新增属性, 更新最小使用次数
      this.valuesMap.set(key, value)
      let useSet = this.useMap.get(1)
      if(!useSet) {
        useSet = new Set()
        this.useMap.set(1, useSet)
      }
      this.timesMap.set(key, 1)
      useSet.add(key)
      this.min = 1
    }
  }
  increaseTimes (key) { // 次数加1
    let times = this.timesMap.get(key)
    let useSet = this.useMap.get(times)
    if(this.min === times && useSet.size === 1){
      this.min += 1
    }
    useSet.delete(key) 
    this.timesMap.set(key, times + 1)
    useSet = this.useMap.get(times + 1)
    if(!useSet){
      useSet = new Set()
      this.useMap.set(times + 1, useSet)
    }
    useSet.add(key)
  }
}
```