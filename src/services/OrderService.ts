import { normalize, schema } from 'normalizr';

import * as orderAPI from 'src/api/OrderAPI';

export const errors = {
  OrderNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  PromoCodeInvalid: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export interface IOrderService {
  getAll(): Promise<{
    entities: {
      orders: {
        [key: string]: orderAPI.IOrderListResponseItem;
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
        [key: string]: orderAPI.IOrderListResponseItem;
      };
    };
    result: number[];
    meta: orderAPI.IOrderListResponseMeta;
  }>;
  create(payload: orderAPI.IOrderCreatePayload): Promise<orderAPI.IOrderListResponseItem>;
  edit(id: number, payload: orderAPI.IOrderEditPayload): Promise<orderAPI.IOrderListResponseItem>;
  delete(id: number): Promise<{}>;
  exists(id: number): Promise<boolean>;
  getOne(id: number): Promise<orderAPI.IOrderListResponseItem | undefined>;
}

export class OrderService implements IOrderService {
  private API: orderAPI.IOrderAPI;
  constructor(API: orderAPI.IOrderAPI) {
    this.API = API;
  }

  public getAll: IOrderService['getAll'] = async () => {
    const orders = await this.API.getAll();
    return normalize(orders.data, [new schema.Entity('orders')]);
  };

  public getForUser: IOrderService['getForUser'] = async (userID, page) => {
    const orders = await this.API.getForUser(userID, page);
    return { ...normalize(orders.data, [new schema.Entity('orders')]), meta: orders.meta };
  };

  public create: IOrderService['create'] = async (payload: orderAPI.IOrderCreatePayload) => {
    try {
      return (await this.API.create(payload)).data;
    } catch (e) {
      if (e instanceof orderAPI.errors.PromoCodeInvalid) {
        throw new errors.PromoCodeInvalid();
      }
      throw e;
    }
  };

  public edit: IOrderService['edit'] = async (id, payload: orderAPI.IOrderEditPayload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof orderAPI.errors.OrderNotFound) {
        throw new errors.OrderNotExists();
      }
      if (e instanceof orderAPI.errors.PromoCodeInvalid) {
        throw new errors.PromoCodeInvalid();
      }
      throw e;
    }
  };

  public delete: IOrderService['delete'] = async (id) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof orderAPI.errors.OrderNotFound) {
        throw new errors.OrderNotExists();
      }
      throw e;
    }
  };

  public exists: IOrderService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof orderAPI.errors.OrderNotFound) {
        return false;
      }
      throw e;
    }
  };

  public getOne: IOrderService['getOne'] = async (id) => {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof orderAPI.errors.OrderNotFound) {
        throw new errors.OrderNotExists();
      }
      throw e;
    }
  };
}
