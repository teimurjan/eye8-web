export const makeNoop = <T>(value: T) => () => value;

export const noop = makeNoop(undefined);
