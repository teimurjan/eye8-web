import { normalize, schema } from 'normalizr';

import {
  ProductType,
  TinyProductType,
  PaginationMeta,
  ProductTypeAPI,
  ProductTypeNotFoundError,
  ProductTypeDeletionWithProductsError,
  ProductTypeGetForCategoryOptions,
  ProductTypeGetAllOptions,
  ProductTypeSearchOptions,
  ProductTypeGetOneOptions,
  ProductTypeGetAllRawIntlMinifiedOptions,
  ProductTypeDeleteOptions,
  ProductTypeCreatePayload,
  ProductTypeEditPayload,
} from '@eye8/api';

export { ProductTypeNotFoundError, ProductTypeDeletionWithProductsError };

export interface ProductTypeService {
  getForCategory(
    categorySlug: string,
    options: ProductTypeGetForCategoryOptions,
  ): Promise<{
    entities: {
      productTypes?: {
        [key: string]: ProductType;
      };
    };
    result: number[];
    meta: PaginationMeta;
  }>;
  getAll(
    options: ProductTypeGetAllOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductType;
      };
    };
    result: number[];
  }>;
  search(
    query: string,
    options?: ProductTypeSearchOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductType;
      };
    };
    result: number[];
    meta: PaginationMeta;
  }>;
  searchRawIntl(
    query: string,
    options?: ProductTypeSearchOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductType<true>;
      };
    };
    result: number[];
    meta: PaginationMeta;
  }>;
  getNewest(): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductType;
      };
    };
    result: number[];
  }>;
  getByID(id: number, options?: ProductTypeGetOneOptions): Promise<ProductType | null>;
  getBySlug(slug: string): Promise<ProductType | null>;
  getAllRawIntl(
    options: ProductTypeGetAllOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: ProductType<true>;
      };
    };
    result: number[];
    meta: PaginationMeta;
  }>;
  getAllMinified(
    options: ProductTypeGetAllRawIntlMinifiedOptions,
  ): Promise<{
    entities: {
      productTypes: {
        [key: string]: TinyProductType;
      };
    };
    result: number[];
    meta: PaginationMeta;
  }>;
  delete(id: number, options?: ProductTypeDeleteOptions): Promise<void>;
  create(payload: ProductTypeCreatePayload): Promise<ProductType<true>>;
  edit(id: number, payload: ProductTypeEditPayload): Promise<ProductType<true>>;
  exists(id: number, options?: ProductTypeGetOneOptions): Promise<boolean>;
  getOneRawIntl(id: number, options?: ProductTypeGetOneOptions): Promise<ProductType<true> | undefined>;
}

export default class implements ProductTypeService {
  private API: ProductTypeAPI;
  constructor(API: ProductTypeAPI) {
    this.API = API;
  }

  public getForCategory: ProductTypeService['getForCategory'] = async (
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

  public getAll: ProductTypeService['getAll'] = async (options) => {
    const productTypes = await this.API.getAll(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public search: ProductTypeService['search'] = async (query, options = {}) => {
    const productTypes = await this.API.search(query, options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public searchRawIntl: ProductTypeService['searchRawIntl'] = async (query, options = {}) => {
    const productTypes = await this.API.searchRawIntl(query, options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getAllMinified: ProductTypeService['getAllMinified'] = async (options) => {
    const productTypes = await this.API.getAllMinified(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public getNewest: ProductTypeService['getNewest'] = async () => {
    const productTypes = await this.API.getNewest();
    return normalize(productTypes.data, [new schema.Entity('productTypes')]);
  };

  public getByID: ProductTypeService['getByID'] = async (id, options = {}) => {
    try {
      return (await this.API.getByID(id, options)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return null;
      }

      throw e;
    }
  };

  public getBySlug: ProductTypeService['getBySlug'] = async (slug) => {
    try {
      return (await this.API.getBySlug(slug)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        return null;
      }

      throw e;
    }
  };

  public getAllRawIntl: ProductTypeService['getAllRawIntl'] = async (options) => {
    const productTypes = await this.API.getAllRawIntl(options);
    return {
      ...normalize(productTypes.data, [new schema.Entity('productTypes')]),
      meta: productTypes.meta,
    };
  };

  public delete: ProductTypeService['delete'] = async (id, options = {}) => {
    try {
      await this.API.delete(id, options);
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        throw new ProductTypeNotFoundError();
      }
      if (e instanceof ProductTypeDeletionWithProductsError) {
        throw new ProductTypeDeletionWithProductsError();
      }

      throw e;
    }
  };

  public create: ProductTypeService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: ProductTypeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof ProductTypeNotFoundError) {
        throw new ProductTypeNotFoundError();
      }

      throw e;
    }
  };

  public exists: ProductTypeService['exists'] = async (id, options = {}) => {
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

  public getOneRawIntl: ProductTypeService['getOneRawIntl'] = async (id, options = {}) => {
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
