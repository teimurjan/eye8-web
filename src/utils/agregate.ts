export const agregateOrderedMapToArray = <T, I = T>(
  items: { [key: number]: T } = {},
  order: number[] = [],
  itemModifier?: (item: T) => I,
): (T | I)[] =>
  order.reduce((acc, key) => {
    if (items[key]) {
      return [...acc, itemModifier ? itemModifier(items[key]) : items[key]];
    }

    return acc;
  }, [] as (T | I)[]);
