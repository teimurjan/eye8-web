import { normalize, schema } from 'normalizr';

import {
  CategoryCreatePayload,
  CategoryNotFoundError,
  CategoryDeletionWithChildrenError,
  CategoryDeletionWithProductTypesError,
  Category,
  CategoryAPI,
} from '@eye8/api';

export interface CategoryService {
  getAll(): Promise<{
    entities: {
      categories: { [key: string]: Category };
    };
    result: number[];
  }>;
  getAllRawIntl(): Promise<{
    entities: {
      categories: {
        [key: string]: Category<true>;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: CategoryCreatePayload): Promise<Category<true>>;
  exists(id: number): Promise<boolean>;
  getOneRawIntl(id: number): Promise<Category<true> | undefined>;
  getOne(id: number): Promise<Category | undefined>;
  getOneBySlug(slug: string): Promise<Category | undefined>;
  edit(id: number, payload: CategoryCreatePayload): Promise<Category<true>>;
}

export { CategoryNotFoundError, CategoryDeletionWithChildrenError, CategoryDeletionWithProductTypesError };

export default class implements CategoryService {
  private API: CategoryAPI;
  constructor(API: CategoryAPI) {
    this.API = API;
  }

  public getAll: CategoryService['getAll'] = async () => {
    const categories = await this.API.getAll();
    return normalize(categories.data, [new schema.Entity('categories')]);
  };

  public getAllRawIntl: CategoryService['getAllRawIntl'] = async () => {
    const categories = await this.API.getAllRawIntl();
    return normalize(categories.data, [new schema.Entity('categories')]);
  };

  public delete: CategoryService['delete'] = async (id) => {
    try {
      return await this.API.delete(id);
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        throw new CategoryNotFoundError();
      }
      if (e instanceof CategoryDeletionWithChildrenError) {
        throw new CategoryDeletionWithChildrenError();
      }
      if (e instanceof CategoryDeletionWithProductTypesError) {
        throw new CategoryDeletionWithProductTypesError();
      }

      throw e;
    }
  };

  public create: CategoryService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public exists: CategoryService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public edit: CategoryService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        throw new CategoryNotFoundError();
      }

      throw e;
    }
  };

  public getOneRawIntl: CategoryService['getOneRawIntl'] = async (id) => {
    try {
      return (await this.API.getOneRawIntl(id)).data;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };

  public getOne: CategoryService['getOne'] = async (id) => {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };

  public getOneBySlug: CategoryService['getOneBySlug'] = async (slug) => {
    try {
      return (await this.API.getOneBySlug(slug)).data;
    } catch (e) {
      if (e instanceof CategoryNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
