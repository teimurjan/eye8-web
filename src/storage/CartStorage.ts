import { IStateCacheStorage } from 'src/storage/StateCacheStorage';

export interface ICartItem {
  id: number;
  count?: number;
}

export interface ICartStorage {
  getItems(): ICartItem[];
  getItem(id: number): ICartItem | undefined;
  add(item: ICartItem): number;
  remove(item: ICartItem): number;
  setItems(items: ICartItem[]): void;
  clear(): void;
  addChangeListener: IStateCacheStorage['addChangeListener'];
}

export class CartStorage implements ICartStorage {
  private storage: IStateCacheStorage;
  constructor(storage: IStateCacheStorage) {
    this.storage = storage;
  }

  public getItems(): ICartItem[] {
    return (this.storage.get('cart') || []) as ICartItem[];
  }

  public setItems(items: ICartItem[]) {
    this.storage.set('cart', items);
  }

  public getItem(id: number) {
    const cartItems = this.getItems();
    return cartItems.find((cartItem) => cartItem.id === id);
  }

  private updateItem(item: ICartItem, delta: number) {
    const cartItems = this.getItems();
    const existingItem = this.getItem(item.id);
    if (existingItem) {
      const newCount = (existingItem.count || 0) + delta;
      this.setItems(
        newCount === 0
          ? cartItems.filter((item) => item.id !== existingItem.id)
          : cartItems.map((item) => (item.id === existingItem.id ? { ...existingItem, count: newCount } : item)),
      );
      return newCount;
    } else if (delta > 0) {
      this.setItems([...cartItems, { ...item, count: delta }]);
      return delta;
    }

    return 0;
  }

  public add = (item: ICartItem) => {
    return this.updateItem(item, 1);
  };

  public remove(item: ICartItem) {
    return this.updateItem(item, -1);
  }

  public clear() {
    this.storage.clear('cart');
  }

  public addChangeListener: IStateCacheStorage['addChangeListener'] = (listener) => {
    return this.storage.addChangeListener(listener);
  };
}
