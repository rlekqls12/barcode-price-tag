/**
 * @callback ObservableCallback<T>
 * @param {T} value
 * @returns {void}
 */

/**
 * @param {T} value
 * @param {ObservableCallback} callback
 */
function observable(value, callback = new Function(), callbackRoot) {
  if (typeof value === "object") {
    let copied;
    if (Array.isArray(value)) {
      copied = new value.constructor(value.length);
      callbackRoot = callbackRoot || copied;
      for (let i = 0; i < copied.length; i++) {
        copied[i] = observable(value[i], callback, callbackRoot);
      }
    } else {
      copied = new value.constructor();
      for (let key in value) {
        callbackRoot = callbackRoot || copied;
        copied[key] = observable(value[key], callback, callbackRoot);
      }
    }

    const proxyArray = new Proxy(copied, {
      get: (target, property) => target[property],
      set: (target, property, value) => {
        callbackRoot = callbackRoot || copied;
        target[property] = observable(value, callback, callbackRoot);
        callback(callbackRoot);
        return true;
      },
    });

    return proxyArray;
  }

  return value;
}
