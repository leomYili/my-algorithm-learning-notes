Function.prototype.myBind = function (context) {
  let _this = this;

  let args = Array.prototype.slice.call(arguments, 1);

  return function () {
    var bindArgs = Array.prototype.slice.call(arguments);

    return _this.apply(context, args.concat(bindArgs));
  };
};
