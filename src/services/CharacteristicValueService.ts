import { normalize, schema } from 'normalizr';

import * as characteristicValueAPI from 'src/api/CharacteristicValueAPI';

export interface ICharacteristicValueService {
  getAll(): Promise<{
    entities: {
      characteristicValues: {
        [key: string]: characteristicValueAPI.ICharacteristicValueListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      characteristicValues: {
        [key: string]: characteristicValueAPI.ICharacteristicValueListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(
    payload: characteristicValueAPI.ICharacteristicValueCreatePayload,
  ): Promise<characteristicValueAPI.ICharacteristicValueListRawIntlResponseItem>;
  edit(
    id: number,
    payload: characteristicValueAPI.ICharacteristicValueEditPayload,
  ): Promise<characteristicValueAPI.ICharacteristicValueListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<characteristicValueAPI.ICharacteristicValueListRawIntlResponseItem | undefined>;
}

export const errors = {
  CharacteristicValueNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class CharacteristicValueService implements ICharacteristicValueService {
  private API: characteristicValueAPI.ICharacteristicValueAPI;
  constructor(API: characteristicValueAPI.ICharacteristicValueAPI) {
    this.API = API;
  }

  public getAll: ICharacteristicValueService['getAll'] = async () => {
    const characteristicValues = await this.API.getAll();
    return normalize(characteristicValues.data, [new schema.Entity('characteristicValues')]);
  };

  public getAllRawIntl: ICharacteristicValueService['getAllRawIntl'] = async () => {
    const characteristicValues = await this.API.getAllRawIntl();
    return normalize(characteristicValues.data, [new schema.Entity('characteristicValues')]);
  };

  public delete: ICharacteristicValueService['delete'] = async (id) => {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof characteristicValueAPI.errors.CharacteristicValueNotFound) {
        throw new errors.CharacteristicValueNotExists();
      }

      throw e;
    }
  };

  public create: ICharacteristicValueService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: ICharacteristicValueService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof characteristicValueAPI.errors.CharacteristicValueNotFound) {
        throw new errors.CharacteristicValueNotExists();
      }

      throw e;
    }
  };

  public exists: ICharacteristicValueService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof characteristicValueAPI.errors.CharacteristicValueNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: ICharacteristicValueService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof characteristicValueAPI.errors.CharacteristicValueNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
