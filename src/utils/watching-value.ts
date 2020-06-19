export class WatchingValue<T> {
  private value: T;
  private watchers: Set<(value: T) => void> = new Set();
  constructor(value: T) {
    this.value = value;
  }

  public set = (value: T) => {
    this.watchers.forEach(listener => listener(value));
    this.value = value;
  };

  public get = () => {
    return this.value;
  };

  public watch = (listener: (value: T) => void) => {
    this.watchers.add(listener);
    return () => {
      this.watchers.delete(listener);
    };
  };

  public watchPromise = (shouldResolve: (value: T) => boolean, shouldReject?: (value: T) => boolean) =>
    new Promise((resolve, reject) => {
      const stopWatching = this.watch(value => {
        if (shouldResolve(value)) {
          stopWatching();
          resolve();
        } else if (shouldReject && shouldReject(value)) {
          stopWatching();
          reject();
        }
      });
    });
}
