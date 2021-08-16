class Promise {
  constructor(exFn) {
    this.status = "PENDING";
    this.value = null;
    this.fulfillArray = [];
    this.rejectedArray = [];

    let resolveFn = (value) => {
      if (this.status !== "PENDING") return;
      setTimeout(() => {
        this.status = "FULFILLED";
        this.value = value;
        this.fulfillArray.forEach((item) => item(this.value));
      }, 0);
    };

    let rejectFn = (reason) => {
      if (this.status !== "PENDING") return;

      setTimeout(() => {
        this.status = "REJECTED";
        this.value = reason;
        this.rejectedArray.forEach((item) => item(this.value));
      }, 0);
    };

    try {
      exFn(resolveFn, rejectFn);
    } catch (err) {
      rejectFn(err);
    }
  }

  then(fulfillFn, rejectFn) {
    // 这里先判断默认值是否存在
    typeof fulfillFn !== "function" ? (fulfillFn = (item) => item) : null;
    typeof rejectFn !== "function"
      ? (rejectFn = (reason) => {
          throw new Error(reason instanceof Error ? reason.message : reason);
        })
      : null;

    // 解决链式调用的问题
    return new Promise((resolve, reject) => {
      if (this.status === "PENDING") {
        this.fulfillArray.push(() => {
          try {
            let x = fulfillFn(this.value);
            x instanceof Promise ? x.then(resolve, reject) : resolve(x);
          } catch (err) {
            reject(err);
          }
        });
        this.rejectedArray.push(() => {
          try {
            let x = rejectFn(this.value);
            x instanceof Promise ? x.then(resolve, reject) : resolve(x);
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === "FULFILLED") {
        setTimeout(() => {
          try {
            let x = fulfillFn(this.value);
            x instanceof Promise ? x.then(resolve, reject) : resolve(x);
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === "REJECTED") {
        setTimeout(() => {
          try {
            let x = rejectFn(this.value);
            x instanceof Promise ? x.then(resolve, reject) : resolve(x);
          } catch (err) {
            reject(err);
          }
        });
      }
    });
  }

  catch(fn) {
    return this.then(null, fn);
  }

  // 这里是基础,要先写
  // 同时value有可能是一个promise
  static resolve(value) {
    if (value instanceof Promise) return value;
    return new Promise((resolve) => resolve(value));
  }

  static reject(value) {
    return new Promise((resolve, reject) => reject(value));
  }

  static all(list) {
    let result = [];

    return new Promise((resolve, reject) => {
      for (let i = 0; i < list.length; i++) {
        list[i].then((value) => {
          result.push(value);

          if (i + 1 === list.length) {
            resolve(result);
          }
        }, reject);
      }
    });
  }

  static finally(callback) {
    let P = this;

    return P.then(
      (value) => {
        P.resolve(callback()).then(() => value);
      },
      (reason) => {
        P.resolve(callback()).then(() => {
          throw reason;
        });
      }
    );
  }
}
