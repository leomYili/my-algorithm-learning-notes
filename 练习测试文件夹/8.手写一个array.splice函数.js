// splice的参数一共是 start, deleteCount, [item,item...]
// 并以数组形式返回,且会对原数组进行修改
// 当start小于0时,需要根据定义,如果绝对值大于长度,则取0,如果小于长度,则取长度-start的数
// 当deleteCount被省略的时候,其值为this.length - start

Array.prototype._splice = function (start, deleteCount, ...rest) {
  if (start < 0) {
    if (Math.abs(start) > this.length) {
      start = 0;
    } else {
      start += this.length;
    }
  }

  if (typeof deleteCount === "undefined") {
    deleteCount = this.length - start;
  }

  const removeList = this.slice(start, start + deleteCount);

  const right = this.slice(start + deleteCount);

  let addIndex = start;

  rest.concat(right).forEach((item) => {
    this[addIndex] = item;
    addIndex++;
  });

  this.length = addIndex;

  return removeList;
};

var sd = [1, 2, 3, 4];

console.log(sd._splice(0));
