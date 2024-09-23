Function.prototype.myCall = function (context) {
  context = context ? Object(context) : window;

  let fn = Symbol();
  context[fn] = this;

  let args = [...arguments].slice(1);
  let result = context[fn](...args);

  delete context[fn];
  return result;
}

Function.prototype.myApply = function (context, arr) {
  context = context ? Object(context) : window;

  let fn = Symbol();
  context[fn] = this;

  let result;
  if (!arr) {
    result = context.fn();
  } else {
    result = context.fn(...arr);
  }

  delete context[fn];
  return result;
}