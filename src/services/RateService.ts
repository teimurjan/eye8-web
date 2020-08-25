import { schema, normalize } from 'normalizr';

import * as ratesAPI from 'src/api/RateAPI';
import * as stateCacheStorage from 'src/storage/StateCacheStorage';

export interface IGroupedRates {
  [key: string]: ratesAPI.IRateListResponseItem[];
}

export interface IRateService {
  getAll(): Promise<{ entities: { rates: { [key: string]: ratesAPI.IRateListResponseItem } }; result: number[] }>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
  create(payload: ratesAPI.IRatesCreatePayload): Promise<ratesAPI.IRateListResponseItem>;
  getAllGrouped(): Promise<IGroupedRates>;
  getAllCached(): IGroupedRates;
  addChangeListener: stateCacheStorage.IStateCacheStorage['addChangeListener'];
}

export const errors = {
  LimitExceeded: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  RateNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  RateHasOrders: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class RateService implements IRateService {
  private storage: stateCacheStorage.IStateCacheStorage;
  private API: ratesAPI.IRateAPI;

  constructor(API: ratesAPI.IRateAPI, storage: stateCacheStorage.IStateCacheStorage) {
    this.API = API;
    this.storage = storage;
  }

  public getAll: IRateService['getAll'] = async () => {
    try {
      const rates = await this.API.getAll();
      return normalize(rates.data, [new schema.Entity('rates')]);
    } catch (e) {
      if (e instanceof ratesAPI.errors.LimitExceeded) {
        throw new errors.LimitExceeded();
      }
      throw e;
    }
  };

  public delete: IRateService['delete'] = async (id) => {
    try {
      await this.API.delete(id);
    } catch (e) {
      if (e instanceof ratesAPI.errors.RateNotFound) {
        throw new errors.RateNotExists();
      }
      if (e instanceof ratesAPI.errors.RateWithOrdersIsUntouchable) {
        throw new errors.RateHasOrders();
      }
      throw e;
    }
  };

  public exists: IRateService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof ratesAPI.errors.RateNotFound) {
        return false;
      }
      throw e;
    }
  };

  public create: IRateService['create'] = async (payload) => {
    const rate = await this.API.create(payload);
    return rate.data;
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
