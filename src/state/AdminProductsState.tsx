import * as React from 'react';

import { IProductListResponseItem, IProductListResponseMeta } from 'src/api/ProductAPI';
import { useDependencies } from 'src/DI/DI';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

const defaultMeta = { count: undefined, pages_count: undefined, page: undefined, limit: undefined };

export interface IContextValue {
  adminProductsState: {
    products: IProductListResponseItem[];
    meta: IProductListResponseMeta | typeof defaultMeta;
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getProducts: (page?: number) => Promise<void>;
    deleteProduct: (id: number) => void;
    addProduct: (product: IProductListResponseItem) => void;
    setProduct: (product: IProductListResponseItem) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminProductsStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      services: { product: service },
    },
  } = useDependencies();

  const [meta, setMeta] = React.useState<IProductListResponseMeta | typeof defaultMeta>(defaultMeta);
  const [products, setProducts] = React.useState<{ [key: string]: IProductListResponseItem }>({});
  const [productsOrder, setProductsOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getProducts = React.useCallback(
    async (page = 1) => {
      setListLoading(true);
      try {
        const { entities, result, meta } = await service.getAll(page);
        setProducts(entities.products);
        setMeta(meta);
        setProductsOrder(result);
      } catch (e) {
        setListError('errors.common');
      } finally {
        setListLoading(false);
        setListLoaded(true);
      }
    },
    [service],
  );

  const addProduct = React.useCallback(
    (product: IProductListResponseItem) => {
      const newProducts = {
        ...products,
        [product.id]: product,
      };

      const newProductsOrder = [...productsOrder, product.id];

      setProducts(newProducts);
      setProductsOrder(newProductsOrder);
    },
    [products, productsOrder],
  );

  const setProduct = React.useCallback(
    (product: IProductListResponseItem) => {
      const newProducts = {
        ...products,
        [product.id]: product,
      };

      setProducts(newProducts);
    },
    [products],
  );

  const deleteProduct = React.useCallback(
    (id: number) => {
      const newProducts = { ...products };
      delete newProducts[id];

      const newProductsOrder = productsOrder.filter(idFromOrder => idFromOrder !== id);
      setProductsOrder(newProductsOrder);
      setProducts(newProducts);
    },
    [products, productsOrder],
  );

  return (
    <Context.Provider
      value={{
        adminProductsState: {
          addProduct,
          deleteProduct,
          products: agregateOrderedMapToArray(products, productsOrder),
          getProducts,
          hasListLoaded,
          isListLoading,
          listError,
          setProduct,
          meta,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminProductsState = () => React.useContext(Context) as IContextValue;
