type PickedProps<T> = Partial<
  {
    [P in keyof T]: (prev: T[P], next: T[P]) => boolean;
  }
>;

export const arePropsEqual = <T extends { [K in keyof T]: T[K] }>(
  prevProps: T,
  nextProps: T,
  pickedProps?: PickedProps<T>,
) => {
  return Object.keys(pickedProps || prevProps).every(pickedPropKey => {
    const compare = (prev: T[keyof T], next: T[keyof T]) => {
      return pickedProps ? pickedProps[pickedPropKey](prev, next) : defaultCompare(prev, next);
    };

    return compare(prevProps[pickedPropKey], nextProps[pickedPropKey]);
  });
};

export const defaultCompare = <T>(prev: T, next: T) => {
  if (typeof prev === typeof next && typeof prev === 'object') {
    const deepEqual = require('fast-deep-equal/es6/react');
    return deepEqual(prev, next);
  }

  return prev === next;
};
export const lengthCompare = <T>(prev: T[], next: T[]) => prev.length === next.length;
