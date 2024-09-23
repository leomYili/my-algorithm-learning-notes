function myNew() {
  const Con = [].shift.call(this, arguments);

  const obj = Object.create(Con.prototype);

  const ret = Con.call(obj,arguments);

  return ret instanceof Obj ? ret : obj;
}

Function.prototype.newCall = (context) => {
  let c = context ? Object(context) : window;

  let fn = Symbol();
  c[fn] = this; // 这里是关键步骤,绑定上下文对象,方便执行函数

  let args = [...arguments].slice(1);

  let result = c[fn](...args);

  delete c[fn]; // 这里是引用清除
  return result;
}

Function.prototype.newApply = (context,arr) => {
  let c = context ? Object(context) : window;

  let fn = Symbol();
  c[fn] = this;

  let result;
  if(arr){
    result = c[fn](...arr);
  }else{
    result = c[fn]();
  }

  delete c[fn]; // 这里是引用清除
  return result;
}