import { normalize, schema } from 'normalizr';

import * as productTypeAPI from 'src/api/ProductTypeAPI';

export const errors = {
  ProductTypeNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  ProductTypeHasProducts: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export interface IProductTypeService {
  getForCategory(
    categorySlug: string,
    options: productTypeAPI.IGetForCategoryOptions,
  ): Promise<{
    entities: {
      productTypes?: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  getAll(
    options: productTypeAPI.IGetAllOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  search(
    query: string,
    options?: productTypeAPI.ISearchOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  searchRawIntl(
    query: string,
    options?: productTypeAPI.ISearchOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListRawIntlResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  getNewest(): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListResponseItem;
      };
    };
    result: number[];
  }>;
  getByID(
    id: number,
    options?: productTypeAPI.IGetOneOptions,
  ): Promise<productTypeAPI.IProductTypeDetailResponseItem | null>;
  getBySlug(slug: string): Promise<productTypeAPI.IProductTypeDetailResponseItem | null>;
  getAllRawIntl(
    options: productTypeAPI.IGetAllOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListRawIntlResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  getAllRawIntlMinified(
    options: productTypeAPI.IGetAllRawIntlMinifiedOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: productTypeAPI.IProductTypeListRawIntlMinifiedResponseItem;
      };
    };
    result: number[];
    meta: productTypeAPI.IProductTypeListResponseMeta;
  }>;
  delete(id: number, options?: productTypeAPI.IDeleteOptions): Promise<void>;
  create(
    payload: productTypeAPI.IProductTypeCreatePayload,
  ): Promise<productTypeAPI.IProductTypeDetailRawIntlResponseItem>;
  edit(
    id: number,
    payload: productTypeAPI.IProductTypeEditPayload,
  ): Promise<productTypeAPI.IProductTypeDetailRawIntlResponseItem>;
  exists(id: number, options?: productTypeAPI.IGetOneOptions): Promise<boolean>;
  getOneRawIntl(
    id: number,
    options?: productTypeAPI.IGetOneOptions,
  ): Promise<productTypeAPI.IProductTypeDetailRawIntlResponseItem | undefined>;
}

export class ProductTypeService implements IProductTypeService {
  private API: productTypeAPI.IProductTypeAPI;
  constructor(API: productTypeAPI.IProductTypeAPI) {
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
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return null;
      }

      throw e;
    }
  };

  public getBySlug: IProductTypeService['getBySlug'] = async (slug) => {
    try {
      return (await this.API.getBySlug(slug)).data;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
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
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        throw new errors.ProductTypeNotExists();
      }
      if (e instanceof productTypeAPI.errors.ProductTypeWithProductsIsUntouchable) {
        throw new errors.ProductTypeHasProducts();
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
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        throw new errors.ProductTypeNotExists();
      }

      throw e;
    }
  };

  public exists: IProductTypeService['exists'] = async (id, options = {}) => {
    try {
      await this.API.status(id, options);
      return true;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOneRawIntl: IProductTypeService['getOneRawIntl'] = async (id, options = {}) => {
    try {
      return (await this.API.getOneRawIntl(id, options)).data;
    } catch (e) {
      if (e instanceof productTypeAPI.errors.ProductTypeNotFound) {
        return undefined;
      }

      throw e;
    }
  };
}
