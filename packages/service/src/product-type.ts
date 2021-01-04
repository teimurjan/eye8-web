import { normalize, schema } from 'normalizr';

import {
  IProductTypeAPI,
  IGetForCategoryOptions,
  IProductTypeListResponseItem,
  IGetAllOptions,
  ISearchOptions,
  IProductTypeListResponseMeta,
  IProductTypeListRawIntlResponseItem,
  IGetOneOptions,
  IProductTypeDetailResponseItem,
  IGetAllRawIntlMinifiedOptions,
  IDeleteOptions,
  IProductTypeCreatePayload,
  IProductTypeDetailRawIntlResponseItem,
  IProductTypeEditPayload,
  IProductTypeListRawIntlMinifiedResponseItem,
  ProductTypeNotFoundError,
  ProductTypeWithProductsNotDeletedError,
} from '@eye8/api/product-type';

export class ProductTypeNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ProductTypeHasProductsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface IProductTypeService {
  getForCategory(
    categorySlug: string,
    options: IGetForCategoryOptions,
  ): Promise<{
    entities: {
      productTypes?: {
        [key: string]: IProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: IProductTypeListResponseMeta;
  }>;
  getAll(
    options: IGetAllOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: IProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  search(
    query: string,
    options?: ISearchOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: IProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: IProductTypeListResponseMeta;
  }>;
  searchRawIntl(
    query: string,
    options?: ISearchOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: IProductTypeListRawIntlResponseItem;
      };
    };
    result: number[];
    meta: IProductTypeListResponseMeta;
  }>;
  getNewest(): Promise<{
    entities: {
      productTypes: {
        [key: string]: IProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getByID(id: number, options?: IGetOneOptions): Promise<IProductTypeDetailResponseItem | null>;
  getBySlug(slug: string): Promise<IProductTypeDetailResponseItem | null>;
  getAllRawIntl(
    options: IGetAllOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: IProductTypeListRawIntlResponseItem;
      };
    };
    result: number[];
    meta: IProductTypeListResponseMeta;
  }>;
  getAllRawIntlMinified(
    options: IGetAllRawIntlMinifiedOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: IProductTypeListRawIntlMinifiedResponseItem;
      };
    };
    result: number[];
    meta: IProductTypeListResponseMeta;
  }>;
  delete(id: number, options?: IDeleteOptions): Promise<void>;
  create(payload: IProductTypeCreatePayload): Promise<IProductTypeDetailRawIntlResponseItem>;
  edit(id: number, payload: IProductTypeEditPayload): Promise<IProductTypeDetailRawIntlResponseItem>;
  exists(id: number, options?: IGetOneOptions): Promise<boolean>;
  getOneRawIntl(id: number, options?: IGetOneOptions): Promise<IProductTypeDetailRawIntlResponseItem | undefined>;
}

export class ProductTypeService implements IProductTypeService {
  private API: IProductTypeAPI;
  constructor(API: IProductTypeAPI) {
    this.API = API;
  }

  public getForCategory: IProductTypeService['getForCategory'] = async (
    categorySlug,
    { page, sortingType, characteristicValuesIds, available },
  ) => {
    const productTypes = await this.API.getForCategory(categorySlug, {
      page,
      sortingType,
      characteristicValuesIds,
      available,
    });
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getAll: IProductTypeService['getAll'] = async (options) => {
    const productTypes = await this.API.getAll(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public search: IProductTypeService['search'] = async (query, options = {}) => {
    const productTypes = await this.API.search(query, options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public searchRawIntl: IProductTypeService['searchRawIntl'] = async (query, options = {}) => {
    const productTypes = await this.API.searchRawIntl(query, options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getAllRawIntlMinified: IProductTypeService['getAllRawIntlMinified'] = async (options) => {
    const productTypes = await this.API.getAllRawIntlMinified(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getNewest: IProductTypeService['getNewest'] = async () => {
    const productTypes = await this.API.getNewest();
    return normalize(productTypes.data, [new schema.Entity('productTypes')]);
  };

  public getByID: IProductTypeService['getByID'] = async (id, options = {}) => {
    try {
      return (await this.API.getByID(id, options)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return null;
      }

      throw e;
    }
  };

  public getBySlug: IProductTypeService['getBySlug'] = async (slug) => {
    try {
      return (await this.API.getBySlug(slug)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return null;
      }

      throw e;
    }
  };

  public getAllRawIntl: IProductTypeService['getAllRawIntl'] = async (options) => {
    const productTypes = await this.API.getAllRawIntl(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public delete: IProductTypeService['delete'] = async (id, options = {}) => {
    try {
      await this.API.delete(id, options);
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        throw new ProductTypeNotExistsError();
      }
      if (e instanceof ProductTypeWithProductsNotDeletedError) {
        throw new ProductTypeHasProductsError();
      }

      throw e;
    }
  };

  public create: IProductTypeService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: IProductTypeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        throw new ProductTypeNotExistsError();
      }

      throw e;
    }
  };

  public exists: IProductTypeService['exists'] = async (id, options = {}) => {
    try {
      await this.API.status(id, options);
      return true;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: IProductTypeService['getOneRawIntl'] = async (id, options = {}) => {
    try {
      return (await this.API.getOneRawIntl(id, options)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };
}
