// 这里指的是异步,在js中想要延迟执行,可以通过setTimeout,promise,MessageChannel()之类模拟

let sleepCb = (wait, fn) => setTimeout(fn, wait);

let sleepPromise = (wait, fn) =>
  new Promise((resolve, reject) => setTimeout(() => resolve(fn()), wait));

sleepCb(1000, () => {
  console.log("sleepCb");
});

sleepPromise(1000, () => {
  console.log("sleepPromise");
});
