import { schema, normalize } from 'normalizr';

import {
  IRateAPI,
  IRateListResponseItem,
  IRatesCreatePayload,
  RateNotFoundError,
  RateWithOrdersNotDeletedError,
  RateCreationNotAllowedError,
} from '@eye8/api/rate';
import { IStateCacheStorage } from '@eye8/storage/state-cache';

export interface IGroupedRates {
  [key: string]: IRateListResponseItem[];
}

export interface IRateService {
  getAll(): Promise<{ entities: { rates: { [key: string]: IRateListResponseItem } }; result: number[] }>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
  create(payload: IRatesCreatePayload): Promise<IRateListResponseItem>;
  getAllGrouped(): Promise<IGroupedRates>;
  getAllCached(): IGroupedRates;
  addChangeListener: IStateCacheStorage['addChangeListener'];
}

export class RateLimitExceededError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class RateNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class RateHasOrdersError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class RateService implements IRateService {
  private storage: IStateCacheStorage;
  private API: IRateAPI;

  constructor(API: IRateAPI, storage: IStateCacheStorage) {
    this.API = API;
    this.storage = storage;
  }

  public getAll: IRateService['getAll'] = async () => {
    const rates = await this.API.getAll();
    return normalize(rates.data, [new schema.Entity('rates')]);
  };

  public delete: IRateService['delete'] = async (id) => {
    try {
      await this.API.delete(id);
    } catch (e) {
      if (e instanceof RateNotFoundError) {
        throw new RateNotExistsError();
      }
      if (e instanceof RateWithOrdersNotDeletedError) {
        throw new RateHasOrdersError();
      }
      throw e;
    }
  };

  public exists: IRateService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof RateNotFoundError) {
        return false;
      }
      throw e;
    }
  };

  public create: IRateService['create'] = async (payload) => {
    try {
      const rate = await this.API.create(payload);
      return rate.data;
    } catch (e) {
      if (e instanceof RateCreationNotAllowedError) {
        throw new RateLimitExceededError();
      }
      throw e;
    }
  };

  public getAllGrouped: IRateService['getAllGrouped'] = async () => {
    const rates = await this.API.getAll();
    const formattedRates = rates.data.reduce((acc, rate) => {
      return { ...acc, [rate.name]: [...(acc[rate.name] || []), rate] };
    }, {});
    this.storage.set('rates', formattedRates, { expireIn: 60 * 60 });
    return formattedRates;
  };

  public getAllCached: IRateService['getAllCached'] = () => {
    return (this.storage.get('rates') || {}) as IGroupedRates;
  };

  public addChangeListener: IRateService['addChangeListener'] = (listener) => {
    return this.storage.addChangeListener((key, value, options) => {
      if (key === 'rates') {
        listener(key, value, options);
      }
    });
  };
}
