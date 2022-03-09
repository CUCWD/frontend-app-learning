/* eslint-disable import/prefer-default-export */

export const isEmptyObject = (obj) => {
  Object.keys(obj).forEach(k => {
    if (Object.prototype.hasOwnProperty.call(obj, k)) {
      return false;
    }
    return true;
  });
};
