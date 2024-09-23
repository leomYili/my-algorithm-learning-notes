/**
 * 防抖函数主要用于解决一段时间之内的无限触发阻止,直到停止触发之后的大于wait时间,才会真正执行
 * 当options中有关于是否第一次触发时,可以加上相应判断
 * @param {*} fn
 * @param {*} wait
 */
function debounce(fn, wait = 0, immediate) {
  let timer = null;

  return (...args) => {
    let self = this;
    if (timer) clearTimeout(timer);

    if (immediate && !timer) {
      fn.apply(self, args);
    }

    timer = setTimeout(() => {
      fn.apply(self, args);
    }, wait);
  };
}
