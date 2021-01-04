import { normalize, schema } from 'normalizr';

import {
  IPromoCodeAPI,
  IPromoCodeListResponseItem,
  IPromoCodeCreatePayload,
  IPromoCodeEditPayload,
  IGetOneOptions,
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

export interface IPromoCodeService {
  getAll(
    deleted?: boolean,
  ): Promise<{
    entities: {
      promoCodes: {
        [key: string]: IPromoCodeListResponseItem;
      };
    };
    result: number[];
  }>;
  create(payload: IPromoCodeCreatePayload): Promise<IPromoCodeListResponseItem>;
  edit(id: number, payload: IPromoCodeEditPayload): Promise<IPromoCodeListResponseItem>;
  delete(id: number, forever?: boolean): Promise<{}>;
  exists(id: number, deleted?: boolean): Promise<boolean>;
  getOne(id: number, options?: IGetOneOptions): Promise<IPromoCodeListResponseItem | undefined>;
  getByValue(value: string): Promise<IPromoCodeListResponseItem | undefined>;
}

export class PromoCodeService implements IPromoCodeService {
  private API: IPromoCodeAPI;
  constructor(API: IPromoCodeAPI) {
    this.API = API;
  }

  public getAll: IPromoCodeService['getAll'] = async (deleted) => {
    const products = await this.API.getAll(deleted);
    return normalize(products.data, [new schema.Entity('promoCodes')]);
  };

  public create: IPromoCodeService['create'] = async (payload) => {
    try {
      return (await this.API.create(payload)).data;
    } catch (e) {
      if (e instanceof PromoCodeValueDuplicatedError) {
        throw new PromoCodeValueAlreadyExistsError();
      }
      throw e;
    }
  };

  public edit: IPromoCodeService['edit'] = async (id, payload) => {
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

  public delete: IPromoCodeService['delete'] = async (id, forever) => {
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

  public exists: IPromoCodeService['exists'] = async (id, deleted) => {
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

  public getOne: IPromoCodeService['getOne'] = async (id, options = {}) => {
    try {
      return (await this.API.getOne(id, options)).data;
    } catch (e) {
      if (e instanceof PromoCodeNotFoundError) {
        return undefined;
      }
      throw e;
    }
  };

  public getByValue: IPromoCodeService['getByValue'] = async (value) => {
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
