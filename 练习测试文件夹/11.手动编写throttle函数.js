/**
 * 节流函数共有两个参数,一个是延迟执行的回调,另一个是等待时间
 *
 * @param {*} fn
 * @param {*} wait
 */
function throttle(fn, wait = 50) {
  let prev = 0;

  return (...args) => {
    let now = +new Date();

    if (now - prev > wait) {
      prev = now;// 这里需要记忆,否则下次就没办法继续节流了
      fn.apply(this, args);
    }
  };
}
