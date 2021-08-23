class Immutable {
  modified = false; // 是否被修改
  target = undefined; // 目标对象
  copy = undefined; // 拷贝的对象

  constructor(target){
      this.target = target;
  }

  //如果目标对象没有被修改，直接返回原对象的某个值，否则返回拷贝对象的某个值
  get(key){
      if (!this.modified) return this.target[key];
      return this.copy[key];
  }

  //如果目标对象没有被修改，对目标对象进行标记修改，否则修改拷贝的对象
  set(key,value){
      if(!this.modified) this.handleChanged()
      return (this.copy[key] = value);
  }

  handleChanged(){
      if(!this.modified){
          this.modified = true;
          //浅拷贝结构共享
          this.copy = shallowCopy(this.target)
      }
  }
}

function shallowCopy(value){
  if(Array.isArray(value)) return value.slice();
  if(value.__proto__ == undefined){
      return Object.assign(Object.create(null),value)
  }
  return Object.assign({}, value)
}

const PROXY_STATE = Symbol('state')
//对目标对象的操作行为拦截
const handler = {
    get: function(target, propKey){
        if(propKey === PROXY_STATE) return target
        return target.get(propKey);
    },
    set: function (target, propKey, value) {
        return target.set(propKey, value);
    }
}
/**
 * @param {object} target 目标对象
 * @param {function} producer 对目标对象进行操作的方法
 */
function produce(target,producer){
    const store = new Immutable(target);
    const proxy = new Proxy(store,handler)
    producer(proxy)

    const newState = proxy[PROXY_STATE]

    if(newState.modified) return newState.copy;

    return newState.target
}

let target = {
  name:'tom',
  age:18,
  address:{
      country:'China',
      province:'Henan'
  },
  hobby:{
      sport:['basketball','run'],
      art:['draw']
  }
}

const result = produce(target,res=>{
  res.name='xiaoming'
})
console.log(target,result)

// {
//   name: 'tom',
//   age: 18,
//   address: { country: 'China', province: 'Henan' },
//   hobby: { sport: [ 'basketball', 'run' ], art: [ 'draw' ] }
// } {
//   name: 'xiaoming',
//   age: 18,
//   address: { country: 'China', province: 'Henan' },
//   hobby: { sport: [ 'basketball', 'run' ], art: [ 'draw' ] }
// }
