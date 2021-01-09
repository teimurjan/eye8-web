import { StateCacheStorage } from '@eye8/storage/state-cache';

export interface CartItem {
  id: number;
  count?: number;
}

export interface CartStorage {
  getItems(): CartItem[];
  getItem(id: number): CartItem | undefined;
  add(item: CartItem): number;
  remove(item: CartItem): number;
  setItems(items: CartItem[]): void;
  clear(): void;
  addChangeListener: StateCacheStorage['addChangeListener'];
}

export default class implements CartStorage {
  private storage: StateCacheStorage;
  constructor(storage: StateCacheStorage) {
    this.storage = storage;
  }

  public getItems(): CartItem[] {
    return (this.storage.get('cart') || []) as CartItem[];
  }

  public setItems(items: CartItem[]) {
    this.storage.set('cart', items);
  }

  public getItem(id: number) {
    const cartItems = this.getItems();
    return cartItems.find((cartItem) => cartItem.id === id);
  }

  private updateItem(item: CartItem, delta: number) {
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

  public add = (item: CartItem) => {
    return this.updateItem(item, 1);
  };

  public remove(item: CartItem) {
    return this.updateItem(item, -1);
  }

  public clear() {
    this.storage.clear('cart');
  }

  public addChangeListener: StateCacheStorage['addChangeListener'] = (listener) => {
    return this.storage.addChangeListener(listener);
  };
}
