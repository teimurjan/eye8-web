import { normalize, schema } from 'normalizr';

import {
  IProductAPI,
  IGetAllOptions,
  IProductListResponseItem,
  IProductListResponseMeta,
  IDeleteOptions,
  IProductCreatePayload,
  IProductEditPayload,
  IGetOneOptions,
  IGetForProductTypeOptions,
  ProductNotFoundError,
} from '@eye8/api/product';

class ProductNotExistsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface IProductService {
  getAll(
    options: IGetAllOptions,
  ): Promise<{
    entities: {
      products: {
        [key: string]: IProductListResponseItem;
      };
    };
    result: number[];
    meta: IProductListResponseMeta;
  }>;
  getForCart(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: IProductListResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number, options?: IDeleteOptions): Promise<{}>;
  create(payload: IProductCreatePayload): Promise<IProductListResponseItem>;
  edit(id: number, payload: IProductEditPayload): Promise<IProductListResponseItem>;
  exists(id: number, options?: IGetOneOptions): Promise<boolean>;
  getOne(id: number, options?: IGetOneOptions): Promise<IProductListResponseItem | undefined>;
  getForProductType(
    productTypeID: number,
    options?: IGetForProductTypeOptions,
  ): Promise<{
    entities: {
      products: {
        [key: string]: IProductListResponseItem;
      };
    };
    result: number[];
  }>;
  getSome(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: IProductListResponseItem;
      };
    };
    result: number[];
  }>;
}

export class ProductService implements IProductService {
  private API: IProductAPI;
  constructor(API: IProductAPI) {
    this.API = API;
  }

  public getAll: IProductService['getAll'] = async (options) => {
    const products = await this.API.getAll(options);
    return {
      ...normalize(products.data, [new schema.Entity('products')]),
      meta: products.meta,
    };
  };

  public getSome: IProductService['getSome'] = async (ids) => {
    const products = await this.API.getSome(ids);
    return normalize(products.data, [new schema.Entity('products')]);
  };

  public getForCart: IProductService['getForCart'] = async (ids) => {
    const products = await this.API.getForCart(ids);
    return normalize(products.data, [new schema.Entity('products')]);
  };

  public delete: IProductService['delete'] = async (id, options = {}) => {
    try {
      return this.API.delete(id, options);
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        throw new ProductNotExistsError();
      }

      throw e;
    }
  };

  public create: IProductService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: IProductService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        throw new ProductNotExistsError();
      }

      throw e;
    }
  };

  public exists: IProductService['exists'] = async (id, options = {}) => {
    try {
      await this.API.status(id, options);
      return true;
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        return false;
      }

      throw e;
    }
  };

  public getOne: IProductService['getOne'] = async (id, options = {}) => {
    try {
      return (await this.API.getOne(id, options)).data;
    } catch (e) {
      if (e instanceof ProductNotFoundError) {
        return undefined;
      }

      throw e;
    }
  };

  public getForProductType: IProductService['getForProductType'] = async (productTypeID, options = {}) => {
    const products = await this.API.getForProductType(productTypeID, options);
    return normalize(products.data, [new schema.Entity('products')]);
  };
}
