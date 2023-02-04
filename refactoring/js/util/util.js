function checkAvailType(types, type) {
  if (isIn(types, type) === false) {
    const textTypes = Object.keys(types).join(", ");
    throw new TypeError(`'${type}' is not include [${textTypes}]`);
  }
}

function isIn(list, target) {
  return target in list;
}
