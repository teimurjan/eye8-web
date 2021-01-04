import { normalize, schema } from 'normalizr';

import {
  ICharacteristicValueAPI,
  CharacteristicValueNotFoundError,
  ICharacteristicValueListResponseItem,
  ICharacteristicValueListRawIntlResponseItem,
  ICharacteristicValueCreatePayload,
  ICharacteristicValueEditPayload,
} from '@eye8/api/characteristic-value';

export interface ICharacteristicValueService {
  getAll(): Promise<{
    entities: {
      characteristicValues: {
        [key: string]: ICharacteristicValueListResponseItem;
      };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      characteristicValues: {
        [key: string]: ICharacteristicValueListRawIntlResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: ICharacteristicValueCreatePayload): Promise<ICharacteristicValueListRawIntlResponseItem>;
  edit(id: number, payload: ICharacteristicValueEditPayload): Promise<ICharacteristicValueListRawIntlResponseItem>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<ICharacteristicValueListRawIntlResponseItem | undefined>;
}

export class CharacteristicValueNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CharacteristicValueService implements ICharacteristicValueService {
  private API: ICharacteristicValueAPI;
  constructor(API: ICharacteristicValueAPI) {
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
      if (e instanceof CharacteristicValueNotFoundError) {
        throw new CharacteristicValueNotExistsError();
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
      if (e instanceof CharacteristicValueNotFoundError) {
        throw new CharacteristicValueNotExistsError();
      }

      throw e;
    }
  };

  public exists: ICharacteristicValueService['exists'] = async (id) => {
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

  public getOneRawIntl: ICharacteristicValueService['getOneRawIntl'] = async (id) => {
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
