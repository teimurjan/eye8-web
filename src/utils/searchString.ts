export type ISearchParams<K extends string, V> = {
  [key in K]: V;
};

export const buildSearchString = <K extends string, V>(searchParams: ISearchParams<K, V>) => {
  const searchArr = Object.keys(searchParams).reduce((acc, k) => {
    const value = searchParams[k];
    if (typeof value === 'undefined' || value === null) {
      return acc;
    }

    const encodedKey = encodeURIComponent(k);
    if (Array.isArray(value)) {
      const searchArr = value.map((valueItem) => `${encodedKey}=${encodeURIComponent(valueItem)}`);
      return [...acc, searchArr.join('&')];
    }

    return [...acc, `${encodedKey}=${encodeURIComponent(value as string)}`];
  }, [] as string[]);

  return searchArr.length > 0 ? `?${searchArr.join('&')}` : '';
};

export const flagToSearchStringValue = (flag: boolean | undefined) => (flag ? 1 : 0);
