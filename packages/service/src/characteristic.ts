import { normalize, schema } from 'normalizr';

import {
  CharacteristicCreatePayload,
  CharacteristicEditPayload,
  CharacteristicNotFoundError,
  Characteristic,
  CharacteristicAPI,
} from '@eye8/api';

export interface CharacteristicService {
  getAll(): Promise<{
    entities: {
      characteristics: {
        [key: string]: Characteristic;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      characteristics: {
        [key: string]: Characteristic<true>;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: CharacteristicCreatePayload): Promise<Characteristic<true>>;
  edit(id: number, payload: CharacteristicEditPayload): Promise<Characteristic<true>>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<Characteristic<true> | undefined>;
}

export { CharacteristicNotFoundError };

export default class implements CharacteristicService {
  private API: CharacteristicAPI;
  constructor(API: CharacteristicAPI) {
    this.API = API;
  }

  public getAll: CharacteristicService['getAll'] = async () => {
    const characteristics = await this.API.getAll();
    return normalize(characteristics.data, [new schema.Entity('characteristics')]);
  };

  public getAllRawIntl: CharacteristicService['getAllRawIntl'] = async () => {
    const characteristics = await this.API.getAllRawIntl();
    return normalize(characteristics.data, [new schema.Entity('characteristics')]);
  };

  public delete: CharacteristicService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        throw new CharacteristicNotFoundError();
      }

      throw e;
    }
  };

  public create: CharacteristicService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: CharacteristicService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        throw new CharacteristicNotFoundError();
      }

      throw e;
    }
  };

  public exists: CharacteristicService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: CharacteristicService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof CharacteristicNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
