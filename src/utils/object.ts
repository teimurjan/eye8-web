export const objectWithout = <T, K extends keyof T>(obj: T, ...keys: K[]) => {
  const newObj = { ...obj };
  keys.forEach(k => delete newObj[k]);
  return newObj;
};
