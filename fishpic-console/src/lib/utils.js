export const hasValue = x => x !== undefined && x !== null && x !== '';

export const anyField = (obj, predicate) => {
  return hasValue(obj) && Object.keys(obj).map(key => obj[key]).filter(predicate).length > 0;
}