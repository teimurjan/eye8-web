import { normalize, schema } from 'normalizr';

import {
  CharacteristicValueCreatePayload,
  CharacteristicValueEditPayload,
  CharacteristicValueNotFoundError,
  CharacteristicValue,
  CharacteristicValueAPI,
} from '@eye8/api';

export interface CharacteristicValueService {
  getAll(): Promise<{
    entities: {
      characteristicValues: {
        [key: string]: CharacteristicValue;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      characteristicValues: {
        [key: string]: CharacteristicValue<true>;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: CharacteristicValueCreatePayload): Promise<CharacteristicValue<true>>;
  edit(id: number, payload: CharacteristicValueEditPayload): Promise<CharacteristicValue<true>>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<CharacteristicValue<true> | undefined>;
}

export { CharacteristicValueNotFoundError };

export default class implements CharacteristicValueService {
  private API: CharacteristicValueAPI;
  constructor(API: CharacteristicValueAPI) {
    this.API = API;
  }

  public getAll: CharacteristicValueService['getAll'] = async () => {
    const characteristicValues = await this.API.getAll();
    return normalize(characteristicValues.data, [new schema.Entity('characteristicValues')]);
  };

  public getAllRawIntl: CharacteristicValueService['getAllRawIntl'] = async () => {
    const characteristicValues = await this.API.getAllRawIntl();
    return normalize(characteristicValues.data, [new schema.Entity('characteristicValues')]);
  };

  public delete: CharacteristicValueService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof CharacteristicValueNotFoundError) {
        throw new CharacteristicValueNotFoundError();
      }

      throw e;
    }
  };

  public create: CharacteristicValueService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: CharacteristicValueService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof CharacteristicValueNotFoundError) {
        throw new CharacteristicValueNotFoundError();
      }

      throw e;
    }
  };

  public exists: CharacteristicValueService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof CharacteristicValueNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: CharacteristicValueService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof CharacteristicValueNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
