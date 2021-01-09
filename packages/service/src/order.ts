import { normalize, schema } from 'normalizr';

import {
  OrderAPI,
  OrderListResponseItem,
  OrderListResponseMeta,
  OrderCreatePayload,
  OrderEditPayload,
  PromoCodeIsNotSetError,
  OrderNotFoundError,
} from '@eye8/api/order';

export class OrderNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class PromoCodeInvalidError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface OrderService {
  getAll(): Promise<{
    entities: {
      orders: {
        [key: string]: OrderListResponseItem;
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
        [key: string]: OrderListResponseItem;
      };
    };
    result: number[];
    meta: OrderListResponseMeta;
  }>;
  create(payload: OrderCreatePayload): Promise<OrderListResponseItem>;
  edit(id: number, payload: OrderEditPayload): Promise<OrderListResponseItem>;
  delete(id: number): Promise<{}>;
  exists(id: number): Promise<boolean>;
  getOne(id: number): Promise<OrderListResponseItem | undefined>;
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
      if (e instanceof PromoCodeIsNotSetError) {
        throw new PromoCodeInvalidError();
      }
      throw e;
    }
  };

  public edit: OrderService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        throw new OrderNotExistsError();
      }
      if (e instanceof PromoCodeIsNotSetError) {
        throw new PromoCodeInvalidError();
      }
      throw e;
    }
  };

  public delete: OrderService['delete'] = async (id) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        throw new OrderNotExistsError();
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
        throw new OrderNotExistsError();
      }
      throw e;
    }
  };
}
