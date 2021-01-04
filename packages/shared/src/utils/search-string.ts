export const buildSearchString = <T>(searchParams: T) => {
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

const deserialize = (value: string | null) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value?.match(/^\d+$/)) return parseInt(value, 10);
  return value;
};

export const extractFromSearchString = <T>(searchString: string, defaultSearchParams: T): T => {
  const searchParams = new URLSearchParams(searchString);

  return Object.keys(defaultSearchParams).reduce(
    (acc, param) => ({ ...acc, [param]: deserialize(searchParams.get(param)) }),
    {} as T,
  );
};

export const flagToSearchStringValue = (flag: boolean | undefined) => (flag ? 1 : 0);
