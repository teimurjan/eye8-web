import { normalize, schema } from 'normalizr';

import {
  PromoCodeAPI,
  PromoCodeListResponseItem,
  PromoCodeCreatePayload,
  PromoCodeEditPayload,
  GetOneOptions,
  PromoCodeNotFoundError,
  PromoCodeValueDuplicatedError,
  PromoCodeWithOrdersNotDeletedError,
} from '@eye8/api/promo-code';

export class PromoCodeNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class PromoCodeValueAlreadyExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class PromoCodeHasOrdersError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface PromoCodeService {
  getAll(
    deleted?: boolean,
  ): Promise<{
    entities: {
      promoCodes: {
        [key: string]: PromoCodeListResponseItem;
      };
    };
    result: number[];
  }>;
  create(payload: PromoCodeCreatePayload): Promise<PromoCodeListResponseItem>;
  edit(id: number, payload: PromoCodeEditPayload): Promise<PromoCodeListResponseItem>;
  delete(id: number, forever?: boolean): Promise<{}>;
  exists(id: number, deleted?: boolean): Promise<boolean>;
  getOne(id: number, options?: GetOneOptions): Promise<PromoCodeListResponseItem | undefined>;
  getByValue(value: string): Promise<PromoCodeListResponseItem | undefined>;
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
        throw new PromoCodeValueAlreadyExistsError();
      }
      throw e;
    }
  };

  public edit: PromoCodeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof PromoCodeNotFoundError) {
        throw new PromoCodeNotExistsError();
      }
      if (e instanceof PromoCodeValueDuplicatedError) {
        throw new PromoCodeValueAlreadyExistsError();
      }
      if (e instanceof PromoCodeWithOrdersNotDeletedError) {
        throw new PromoCodeHasOrdersError();
      }
      throw e;
    }
  };

  public delete: PromoCodeService['delete'] = async (id, forever) => {
    try {
      return await this.API.delete(id, forever);
    } catch (e) {
      if (e instanceof PromoCodeNotFoundError) {
        throw new PromoCodeNotExistsError();
      }
      if (e instanceof PromoCodeWithOrdersNotDeletedError) {
        throw new PromoCodeHasOrdersError();
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
