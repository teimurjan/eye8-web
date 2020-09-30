export type ISearchParams<T extends string> = {
  [key in T]: string | number | undefined | boolean | Array<number | string | boolean>;
};

export const buildSearchString = <T extends string>(queryObj: ISearchParams<T>) => {
  const queryArr = Object.keys(queryObj).reduce((acc, k) => {
    const value = queryObj[k];
    if (typeof value === 'undefined') {
      return acc;
    }

    const encodedKey = encodeURIComponent(k);
    if (Array.isArray(value)) {
      const queryArr = value.map((valueItem) => `${encodedKey}=${encodeURIComponent(valueItem)}`);
      return [...acc, queryArr.join('&')];
    }

    return [...acc, `${encodedKey}=${encodeURIComponent(value as string)}`];
  }, [] as string[]);

  return queryArr.length > 0 ? `?${queryArr.join('&')}` : '';
};
