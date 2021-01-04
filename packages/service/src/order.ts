import { normalize, schema } from 'normalizr';

import {
  IOrderAPI,
  IOrderListResponseItem,
  IOrderListResponseMeta,
  IOrderCreatePayload,
  IOrderEditPayload,
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

export interface IOrderService {
  getAll(): Promise<{
    entities: {
      orders: {
        [key: string]: IOrderListResponseItem;
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
        [key: string]: IOrderListResponseItem;
      };
    };
    result: number[];
    meta: IOrderListResponseMeta;
  }>;
  create(payload: IOrderCreatePayload): Promise<IOrderListResponseItem>;
  edit(id: number, payload: IOrderEditPayload): Promise<IOrderListResponseItem>;
  delete(id: number): Promise<{}>;
  exists(id: number): Promise<boolean>;
  getOne(id: number): Promise<IOrderListResponseItem | undefined>;
}

export class OrderService implements IOrderService {
  private API: IOrderAPI;
  constructor(API: IOrderAPI) {
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

  public create: IOrderService['create'] = async (payload) => {
    try {
      return (await this.API.create(payload)).data;
    } catch (e) {
      if (e instanceof PromoCodeIsNotSetError) {
        throw new PromoCodeInvalidError();
      }
      throw e;
    }
  };

  public edit: IOrderService['edit'] = async (id, payload) => {
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

  public delete: IOrderService['delete'] = async (id) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof OrderNotFoundError) {
        throw new OrderNotExistsError();
      }
      throw e;
    }
  };

  public exists: IOrderService['exists'] = async (id) => {
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

  public getOne: IOrderService['getOne'] = async (id) => {
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
