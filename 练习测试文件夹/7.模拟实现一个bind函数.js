// 详细版
Function.prototype.myBind2 = function () {
  if (typeof this !== 'function') {
    throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
  }

  let self = this;
  let args = Array.prototype.slice.call(arguments, 1);

  let fNop = function () { };

  let fBound = function () {
    let bindArgs = Array.prototype.slice.call(arguments);
    return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
  };

  fNop.prototype = this.prototype;
  fBound.prototype = new fNop();

  return fBound;
}