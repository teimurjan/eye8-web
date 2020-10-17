import { normalize, schema } from 'normalizr';

import * as productAPI from 'src/api/ProductAPI';

export const errors = {
  ProductNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export interface IProductService {
  getAll(
    options: productAPI.IGetAllOptions,
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
    meta: productAPI.IProductListResponseMeta;
  }>;
  getForCart(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
  }>;
  delete(id: number): Promise<{}>;
  create(payload: productAPI.IProductCreatePayload): Promise<productAPI.IProductListResponseItem>;
  edit(id: number, payload: productAPI.IProductEditPayload): Promise<productAPI.IProductListResponseItem>;
  exists(id: number): Promise<boolean>;
  getOne(id: number): Promise<productAPI.IProductListResponseItem | undefined>;
  getForProductType(
    productTypeID: number,
    options?: productAPI.IGetForProductTypeOptions,
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
  }>;
  getSome(
    ids: number[],
  ): Promise<{
    entities: {
      products: {
        [key: string]: productAPI.IProductListResponseItem;
      };
    };
    result: number[];
  }>;
}

export class ProductService implements IProductService {
  private API: productAPI.IProductAPI;
  constructor(API: productAPI.IProductAPI) {
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

  public delete(id: number) {
    try {
      return this.API.delete(id);
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        throw new errors.ProductNotExists();
      }

      throw e;
    }
  }

  public create: IProductService['create'] = async (payload) => {
    return (await this.API.create(payload)).data;
  };

  public edit: IProductService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        throw new errors.ProductNotExists();
      }

      throw e;
    }
  };

  public exists: IProductService['exists'] = async (id) => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
        return false;
      }

      throw e;
    }
  };

  public getOne: IProductService['getOne'] = async (id) => {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof productAPI.errors.ProductNotFound) {
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
