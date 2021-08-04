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