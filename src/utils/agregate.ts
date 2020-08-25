export const agregateOrderedMapToArray = <T, I = T>(
  items: { [key: number]: T } = {},
  order: number[] = [],
  itemModifier?: (item: T) => I,
) =>
  itemModifier
    ? order.reduce((acc, key) => {
        if (items[key]) {
          return [...acc, itemModifier(items[key])];
        }

        return acc;
      }, [] as I[])
    : order.map((i) => items[i]);
