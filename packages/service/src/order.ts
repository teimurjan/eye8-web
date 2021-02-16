import { normalize, schema } from 'normalizr';

import {
  Order,
  PaginationMeta,
  OrderAPI,
  OrderPromoCodeEmptyError,
  OrderNotFoundError,
  OrderCreatePayload,
  OrderEditPayload,
} from '@eye8/api';

export { OrderPromoCodeEmptyError, OrderNotFoundError };

export interface OrderService {
  getAll(): Promise<{
    entities: {
      orders: {
        [key: string]: Order;
      };
    };
    result: number[];
  }>;
  getForUser(
    userID: number,
    page: number,
  ): Promise<{
    entities: {
      orders: {
        [key: string]: Order;
      };
    };
    result: number[];
    meta: PaginationMeta;
  }>;
  create(payload: OrderCreatePayload): Promise<Order>;
  edit(id: number, payload: OrderEditPayload): Promise<Order>;
  delete(id: number): Promise<{}>;
  exists(id: number): Promise<boolean>;
  getOne(id: number): Promise<Order | undefined>;
}

export default class implements OrderService {
  private API: OrderAPI;
  constructor(API: OrderAPI) {
    this.API = API;
  }

  public getAll: OrderService['getAll'] = async () => {
    const orders = await this.API.getAll();
    return normalize(orders.data, [new schema.Entity('orders')]);
  };

  public getForUser: OrderService['getForUser'] = async (userID, page) => {
    const orders = await this.API.getForUser(userID, page);
    return { ...normalize(orders.data, [new schema.Entity('orders')]), meta: orders.meta };
  };

  public create: OrderService['create'] = async (payload) => {
    try {
      return (await this.API.create(payload)).data;
    } catch (e) {
      if (e instanceof OrderPromoCodeEmptyError) {
        throw new OrderPromoCodeEmptyError();
      }
      throw e;
    }
  };

  public edit: OrderService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        throw new OrderNotFoundError();
      }
      if (e instanceof OrderPromoCodeEmptyError) {
        throw new OrderPromoCodeEmptyError();
      }
      throw e;
    }
  };

  public delete: OrderService['delete'] = async (id) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        throw new OrderNotFoundError();
      }
      throw e;
    }
  };

  public exists: OrderService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        return false;
      }
      throw e;
    }
  };

  public getOne: OrderService['getOne'] = async (id) => {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        throw new OrderNotFoundError();
      }
      throw e;
    }
  };
}
