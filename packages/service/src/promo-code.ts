import { normalize, schema } from 'normalizr';

import {
  PromoCode,
  PromoCodeAPI,
  PromoCodeNotFoundError,
  PromoCodeValueDuplicatedError,
  PromoCodeDeletionWithOrdersError,
  PromoCodeCreatePayload,
  PromoCodeEditPayload,
  PromoCodeGetOneOptions,
} from '@eye8/api';

export { PromoCodeNotFoundError, PromoCodeValueDuplicatedError, PromoCodeDeletionWithOrdersError };
export interface PromoCodeService {
  getAll(
    deleted?: boolean,
  ): Promise<{
    entities: {
      promoCodes: {
        [key: string]: PromoCode;
      };
    };
    result: number[];
  }>;
  create(payload: PromoCodeCreatePayload): Promise<PromoCode>;
  edit(id: number, payload: PromoCodeEditPayload): Promise<PromoCode>;
  delete(id: number, forever?: boolean): Promise<{}>;
  exists(id: number, deleted?: boolean): Promise<boolean>;
  getOne(id: number, options?: PromoCodeGetOneOptions): Promise<PromoCode | undefined>;
  getByValue(value: string): Promise<PromoCode | undefined>;
}

export default class implements PromoCodeService {
  private API: PromoCodeAPI;
  constructor(API: PromoCodeAPI) {
    this.API = API;
  }

  public getAll: PromoCodeService['getAll'] = async (deleted) => {
    const products = await this.API.getAll(deleted);
    return normalize(products.data, [new schema.Entity('promoCodes')]);
  };

  public create: PromoCodeService['create'] = async (payload) => {
    try {
      return (await this.API.create(payload)).data;
    } catch (e) {
      if (e instanceof PromoCodeValueDuplicatedError) {
        throw new PromoCodeValueDuplicatedError();
      }
      throw e;
    }
  };

  public edit: PromoCodeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof PromoCodeNotFoundError) {
        throw new PromoCodeNotFoundError();
      }
      if (e instanceof PromoCodeValueDuplicatedError) {
        throw new PromoCodeValueDuplicatedError();
      }
      if (e instanceof PromoCodeDeletionWithOrdersError) {
        throw new PromoCodeDeletionWithOrdersError();
      }
      throw e;
    }
  };

  public delete: PromoCodeService['delete'] = async (id, forever) => {
    try {
      return await this.API.delete(id, forever);
    } catch (e) {
      if (e instanceof PromoCodeNotFoundError) {
        throw new PromoCodeNotFoundError();
      }
      if (e instanceof PromoCodeDeletionWithOrdersError) {
        throw new PromoCodeDeletionWithOrdersError();
      }
      throw e;
    }
  };

  public exists: PromoCodeService['exists'] = async (id, deleted) => {
    try {
      await this.API.status(id, deleted);
      return true;
    } catch (e) {
      if (e instanceof PromoCodeNotFoundError) {
        return false;
      }
      throw e;
    }
  };

  public getOne: PromoCodeService['getOne'] = async (id, options = {}) => {
    try {
      return (await this.API.getOne(id, options)).data;
    } catch (e) {
      if (e instanceof PromoCodeNotFoundError) {
        return undefined;
      }
      throw e;
    }
  };

  public getByValue: PromoCodeService['getByValue'] = async (value) => {
    try {
      return (await this.API.getByValue(value)).data;
    } catch (e) {
      if (e instanceof PromoCodeNotFoundError) {
        return undefined;
      }
      throw e;
    }
  };
}
