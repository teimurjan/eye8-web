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
  getAll(
    deleted?: boolean,
  ): Promise<{
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
  delete(id: number, forever?: boolean): Promise<{}>;
  exists(id: number, deleted?: boolean): Promise<boolean>;
  getOne(id: number, deleted?: boolean): Promise<Order | undefined>;
}

export default class implements OrderService {
  private API: OrderAPI;
  constructor(API: OrderAPI) {
    this.API = API;
  }

  public getAll: OrderService['getAll'] = async (deleted) => {
    const orders = await this.API.getAll(deleted);
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

  public delete: OrderService['delete'] = async (id, forever) => {
    try {
      return await this.API.delete(id, forever);
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        throw new OrderNotFoundError();
      }
      throw e;
    }
  };

  public exists: OrderService['exists'] = async (id, deleted) => {
    try {
      await this.API.status(id, deleted);
      return true;
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        return false;
      }
      throw e;
    }
  };

  public getOne: OrderService['getOne'] = async (id, deleted) => {
    try {
      return (await this.API.getOne(id, deleted)).data;
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        throw new OrderNotFoundError();
      }
      throw e;
    }
  };
}
