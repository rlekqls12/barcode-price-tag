/**
 * @param {T} value
 * @returns {T}
 */
function cloneDeep(value) {
  if (Array.isArray(value)) {
    const copied = new value.constructor(value.length);
    for (let i = 0; i < value.length; i++) {
      copied[i] = cloneDeep(value[i]);
    }
    return copied;
  }
  if (typeof value === "object") {
    const copied = new value.constructor();
    for (let key in value) {
      copied[key] = cloneDeep(value[key]);
    }
    return copied;
  }
  return value;
}
