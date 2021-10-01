import uniq from 'lodash/uniq';
import React from 'react';

import { PaginationMeta, Product } from '@eye8/api';
import { useDI } from '@eye8/di';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

interface Args {
  mandatoryProductId?: number;
}

const useSelectProducts = ({ mandatoryProductId }: Args) => {
  const {
    di: {
      service: { product: productService },
    },
  } = useDI();
  const [data, setData] = React.useState<{
    entities: { [id: string]: Product };
    order: number[];
  }>({ entities: {}, order: [] });
  const [isLoading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [meta, setMeta] = React.useState<PaginationMeta>({
    count: 0,
    pages_count: 0,
    page: 0,
    limit: 0,
  });

  const getProducts = React.useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const { entities, result, meta } = await productService.getAll({
          page,
        });
        setData({ entities: { ...data.entities, ...entities.products }, order: uniq([...data.order, ...result]) });
        setMeta(meta);
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [productService, data],
  );

  React.useEffect(() => {
    getProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    (async () => {
      if (mandatoryProductId && !data.entities[mandatoryProductId] && !isLoading) {
        try {
          setLoading(true);
          const product = await productService.getOne(mandatoryProductId);
          if (product) {
            setData({
              entities: { ...data.entities, [product.id]: product },
              order: [...data.order, product.id],
            });
          }
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeof mandatoryProductId !== 'undefined', isLoading]);

  const loadMore = React.useCallback(() => {
    if (meta.page < meta.pages_count && !isLoading) {
      getProducts(meta.page + 1);
    }
  }, [getProducts, meta, isLoading]);

  return {
    products: agregateOrderedMapToArray(data.entities, data.order),
    isLoading,
    error,
    loadMore,
  };
};

export default useSelectProducts;
