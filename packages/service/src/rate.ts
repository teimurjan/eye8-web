import { schema, normalize } from 'normalizr';

import {
  Rate,
  RateAPI,
  RateNotFoundError,
  RateDeletionWithOrdersError,
  RateCreationNotAllowedError,
  RateCreatePayload,
} from '@eye8/api';
import { StateCacheStorage } from '@eye8/storage/state-cache';

export { RateNotFoundError, RateDeletionWithOrdersError, RateCreationNotAllowedError };

export interface RateService {
  getAll(): Promise<{ entities: { rates: { [key: string]: Rate } }; result: number[] }>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
  create(payload: RateCreatePayload): Promise<Rate>;
  getAllGrouped(): Promise<{
    [key: string]: Rate[];
  }>;
  getAllCached(): {
    [key: string]: Rate[];
  };
  addChangeListener: StateCacheStorage['addChangeListener'];
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
        throw new RateNotFoundError();
      }
      if (e instanceof RateDeletionWithOrdersError) {
        throw new RateDeletionWithOrdersError();
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
        throw new RateCreationNotAllowedError();
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
    return (this.storage.get('rates') || {}) as {
      [key: string]: Rate[];
    };
  };

  public addChangeListener: RateService['addChangeListener'] = (listener) => {
    return this.storage.addChangeListener((key, value, options) => {
      if (key === 'rates') {
        listener(key, value, options);
      }
    });
  };
}
