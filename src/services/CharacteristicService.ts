import { normalize, schema } from 'normalizr';

import * as characteristicAPI from 'src/api/CharacteristicAPI';

export interface ICharacteristicService {
  getAll(): Promise<{
    entities: {
      characteristics: {
        [key: string]: characteristicAPI.ICharacteristicListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      characteristics: {
        [key: string]: characteristicAPI.ICharacteristicListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(
    payload: characteristicAPI.ICharacteristicCreatePayload,
  ): Promise<characteristicAPI.ICharacteristicListRawIntlResponseItem>;
  edit(
    id: number,
    payload: characteristicAPI.ICharacteristicEditPayload,
  ): Promise<characteristicAPI.ICharacteristicListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<characteristicAPI.ICharacteristicListRawIntlResponseItem | undefined>;
}

export const errors = {
  CharacteristicNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class CharacteristicService implements ICharacteristicService {
  private API: characteristicAPI.ICharacteristicAPI;
  constructor(API: characteristicAPI.ICharacteristicAPI) {
    this.API = API;
  }

  public getAll: ICharacteristicService['getAll'] = async () => {
    const characteristics = await this.API.getAll();
    return normalize(characteristics.data, [new schema.Entity('characteristics')]);
  };

  public getAllRawIntl: ICharacteristicService['getAllRawIntl'] = async () => {
    const characteristics = await this.API.getAllRawIntl();
    return normalize(characteristics.data, [new schema.Entity('characteristics')]);
  };

  public delete(id: number) {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof characteristicAPI.errors.CharacteristicNotFound) {
        throw new errors.CharacteristicNotExists();
      }

      throw e;
    }
  }

  public create: ICharacteristicService['create'] = async (payload: characteristicAPI.ICharacteristicCreatePayload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: ICharacteristicService['edit'] = async (
    id: number,
    payload: characteristicAPI.ICharacteristicEditPayload,
  ) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof characteristicAPI.errors.CharacteristicNotFound) {
        throw new errors.CharacteristicNotExists();
      }

      throw e;
    }
  };

  public exists: ICharacteristicService['exists'] = async (id: number) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof characteristicAPI.errors.CharacteristicNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: ICharacteristicService['getOneRawIntl'] = async (id: number) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof characteristicAPI.errors.CharacteristicNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
