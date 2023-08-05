export const haveRepeatedValues = (array: (string | number)[]) => {
  const set = new Set(array);
  return set.size !== array.length;
};

export const isValidArray = (array: (string | number)[]) =>
  Array.isArray(array) && !!array.length;
