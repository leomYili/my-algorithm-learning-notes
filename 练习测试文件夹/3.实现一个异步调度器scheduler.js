// 1. 设计一个异步队列,并发数量为n

// 实现一个 taskpool类，其至少具有 add 方法和最大并发数 max，该 add 方法接收函数(返回值为 promise)，当当前执行的任务数小于设定值 max 时，立即执行，大于 max，则等待任务空闲时执行该任务，模版代码如下:
class Scheduler {
  constructor() {
    this.tasks = [];
    this.maxLength = 2; // 最大并发数
    this.count = 0; //当前运行函数个数
    this.resolveArr = []; //队列
  }

  add(promiseCreator) {
    // 队列设值
    this.tasks.push(promiseCreator);
    // 返回值是一个promise,所以要返回promise
    return new Promise((resolve, reject) => {
      this.resolveArr.push(resolve);// 与队列保持一致,真实用来进行执行到then的

      this.run();
    });
  }

  /**
   * 这是一个递归函数,目的是在每次有任务进入队列时,判断是否符合并发条件,
   * 如果符合,则开始执行即可,在执行完之后,需要检测队列中是否还有函数,有则执行即可
   * 队列是先进先出,所以array.shift即可
   * 如果不符合,则不做任何处理
   *
   * @memberof Scheduler
   */
  run() {
    if (this.count < this.maxLength && this.resolveArr.length > 0) {
      this.count++;
      const resolveFn= this.resolveArr.shift();
      const task = this.tasks.shift();

      task().then(() => {
        this.count--;
        resolveFn();
        this.run();
      })
    }
  }
}

const timeout = (time) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

const scheduler = new Scheduler();

const addTask = (time, order) => {
  scheduler
    .add(() => {
      return timeout(time);
    })
    .then(() => console.log(order));
};

addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");

// output: 2 3 1 4
// 一开始，1，2两个任务进入队列
// 500ms时，2完成，输出2，3进入执行队列
// 800ms时，3完成，输出3，4进入执行队列
// 1000ms时，1完成，输出1
// 1200ms时，4完成，输出4
// 如果是全部并发,结果是3,4,2,1,这里限制同时最多只有两个

// 2. 设计一个任务队列，并发数量为 n，按顺序输出任务执行结果

// 设计一个函数 schedule，schedule 接收一个数量 n，返回一个新函数，新函数接受一个返回 promise 的函数数组，会按照顺序执行函数，并且同时执行的函数数量不超过 n。并且该函数的返回值是一个 promsie，该 promise 会在所有函数执行完后 resolve, 其值是函数数组的返回值按顺序构成的数组


function schedule(n) {
  // 此处不需要做任何操作，借助作用域可直接保存并发限制 n
  return function (tasks) {
    // 保存执行结果
    const res = [];
    // 待执行的任务队列
    let queue = [];
    // 记录当前执行中的任务数量
    let cur = 0;
    // 记录执行完成的任务数量
    let finished = 0;
    // 映射一下，保留任务的顺序 index，以便后期按顺序存储到 res 中
    queue = tasks.map((v, index) => ({
      task: v,
      index,
    }));
    return new Promise((resolve) => {
      // 类似于上一题中的 run，抽离统一的 runTask 逻辑
      function runTask() {
        // 判断当前执行中的任务数量和待执行的数量
        while (cur < n && queue[0]) {
          // 取出第一个任务
          const item = queue.shift();
          // 执行任务
          item.task().then((result) => {
            // 结束后记录结果
            res[item.index] = result;
            // 执行中的任务数量减少
            cur--;
            // 完成的任务数量增加
            finished++;
            // 如果全部完成
            if (finished === tasks.length) {
              // 返回结果
              resolve(res);
            } else {
              // 否则继续执行
              runTask(resolve);
            }
          });
          // 增加执行中的任务数量
          cur++;
        }
      }
      runTask();
    });
  };
}

const runTask = schedule(4);

const tasks = new Array(10).fill(0).map((x, i) => () => new Promise(resolve => {
    setTimeout(() => {
        console.log(`task${i} complete`);
        resolve(`task${i}`);
    }, 2000);
}));

runTask(tasks).then(console.log);

// 预期输出
// 2s 后
// task0 complete
// task1 complete
// task2 complete
// task3 complete
// 再2s 后
// task4 complete
// task5 complete
// task6 complete
// task7 complete
// 再2s 后
// task8 complete
// task9 complete
// ['task0', 'task1', ..., 'task9']

// 3. 设计一个异步事件队列，能够由任务本身控制后续流程

// 设计一个类 AsyncQueue，其具备两个方法，tap 和 exec，tap 可以绑定回调(可以绑定多个)，exec 执行回调。回调是一个函数，该函数接受一个入参 cb，如果在该函数中不主动调用 cb，则后续的回调不会执行。

class AsyncQueue {
  constructor() {
    // 函数实现
    this.events = {};
  }
  // 事件注册
  tap(name, fn) {
    if (this.events[name]) {
      this.events[name].push(fn);
    } else {
      this.events[name] = [fn];
    }
  }
  // 事件触发
  exec(name, fn) {
    // 函数实现
    if (this.events[name]) {
      const dispatch = (i) => {
        // 取出第 i 个任务
        const event = this.events[name][i];
        if (event) {
          // 执行的时候，将 dispatch(i + 1) 作为入参提供给当前任务，由其决定调用时机
          event(() => dispatch(i+1));          
        } else {
          // 都执行完了，则执行回调 fn
          fn();
        }
      }
      // 手动触发第一个任务的执行
      dispatch(0);
    }
  }
}

function fn1(cb) {
  console.log('fn1');
  cb();
}

function fn2(cb) {
  console.log('fn2');
  cb();
}

function fn3(cb) {
  setTimeout(() => {
    console.log('fn3');
    cb();
  }, 2000);
}

function fn4(cb) {
  setTimeout(() => {
    console.log('fn4');
    cb();
  }, 3000);
}

// 创建事件队列
const asyncQueue = new AsyncQueue();
// 注册事件队列
asyncQueue.tap('init', fn1);
asyncQueue.tap('init', fn2);
asyncQueue.tap('init', fn3);
asyncQueue.tap('init', fn4);

// 执行事件队列
asyncQueue.exec('init', () => {
  console.log('执行结束');
});

// 预期输出
// fn1
// fn2
// 2s 后
// fn3
// 再 3s 后
// fn4
// 执行结束