import { schema, normalize } from 'normalizr';

import {
  RateAPI,
  RateListResponseItem,
  RatesCreatePayload,
  RateNotFoundError,
  RateWithOrdersNotDeletedError,
  RateCreationNotAllowedError,
} from '@eye8/api/rate';
import { StateCacheStorage } from '@eye8/storage/state-cache';

export interface GroupedRates {
  [key: string]: RateListResponseItem[];
}

export interface RateService {
  getAll(): Promise<{ entities: { rates: { [key: string]: RateListResponseItem } }; result: number[] }>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
  create(payload: RatesCreatePayload): Promise<RateListResponseItem>;
  getAllGrouped(): Promise<GroupedRates>;
  getAllCached(): GroupedRates;
  addChangeListener: StateCacheStorage['addChangeListener'];
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

export default class implements RateService {
  private storage: StateCacheStorage;
  private API: RateAPI;

  constructor(API: RateAPI, storage: StateCacheStorage) {
    this.API = API;
    this.storage = storage;
  }

  public getAll: RateService['getAll'] = async () => {
    const rates = await this.API.getAll();
    return normalize(rates.data, [new schema.Entity('rates')]);
  };

  public delete: RateService['delete'] = async (id) => {
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

  public exists: RateService['exists'] = async (id) => {
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

  public create: RateService['create'] = async (payload) => {
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

  public getAllGrouped: RateService['getAllGrouped'] = async () => {
    const rates = await this.API.getAll();
    const formattedRates = rates.data.reduce((acc, rate) => {
      return { ...acc, [rate.name]: [...(acc[rate.name] || []), rate] };
    }, {});
    this.storage.set('rates', formattedRates, { expireIn: 60 * 60 });
    return formattedRates;
  };

  public getAllCached: RateService['getAllCached'] = () => {
    return (this.storage.get('rates') || {}) as GroupedRates;
  };

  public addChangeListener: RateService['addChangeListener'] = (listener) => {
    return this.storage.addChangeListener((key, value, options) => {
      if (key === 'rates') {
        listener(key, value, options);
      }
    });
  };
}
