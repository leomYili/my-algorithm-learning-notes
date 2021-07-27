class MyPromise {
  constructor(excaFn) {
    this.status = "pending";
    this.value = undefined;
    this.fulfillArray = [];
    this.rejectArray = [];

    let resolveFn = (value) => {
      if (this.status === "pending") return;
      setTimeout(() => {
        this.status = "fulfilled";
        this.value = value;
        this.fulfillArray.forEach((item) => item(this.value));
      }, 0);
    };

    let rejectFn = (reason) => {
      if (this.status === "pending") return;
      setTimeout(() => {
        this.status = "rejected";
        this.value = reason;
        this.fulfillArray.forEach((item) => item(this.value));
      }, 0);
    };

    try {
      excaFn(resolveFn, rejectFn);
    } catch (err) {
      rejectCallback(err);
    }
  }

  then(fulfillFn, rejectFn) {
    // 这里首先需要注意默认值
    typeof fulfillFn !== "function"
      ? (fulfilledCallBack = (value) => value)
      : null;
    typeof rejectFn !== "function"
      ? (rejectFn = (reason) => {
          throw new Error(reason instanceof Error ? reason.message : reason);
        })
      : null;

    return new Promise((resolve, reject) => {
      if (this.status === "pending") {
        this.fulfillArray.push(() => {
          try {
            let x = fulfillFn(this.value);

            x instanceof Promise ? x.then(resolve, reject) : resolve(x);
          } catch (err) {
            reject(err);
          }
        });

        this.rejectArray.push(() => {
          try {
            let x = rejectFn(this.value);

            x instanceof Promise ? x.then(resolve, reject) : resolve(x);
          } catch (err) {
            reject(err);
          }
        });
      } else if (this.status === "fulfilled") {
        setTimeout(() => {
          let x = fulfillFn(this.value);

          x instanceof Promise ? x.then(resolve, reject) : resolve(x);
        });
      } else if (this.status === "rejected") {
        setTimeout(() => {
          let x = rejectFn(this.value);

          x instanceof Promise ? x.then(resolve, reject) : resolve(x);
        });
      }
    });
  }

  catch(rejectFn) {
    this.then(null, rejectFn);
  }

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
        list[i].then((val) => {
          result[i] = val;

          if (i + 1 === list.length) {
            resolve(result);
          }
        }, reject);
      }
    });
  }

  static finally(fn) {
    let P = this;

    return this.then(
      (value) => {
        fn();
        return value;
      },
      (reason) => {
        fn();
        throw reason;
      }
    );
  }
}
