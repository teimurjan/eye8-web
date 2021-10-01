import uniq from 'lodash/uniq';
import React from 'react';

import { TinyProductType, PaginationMeta, ProductTypeSortingType } from '@eye8/api';
import { useDI } from '@eye8/di';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

interface Args {
  mandatoryProductTypeId?: number;
}

const useSelectProductTypes = ({ mandatoryProductTypeId }: Args) => {
  const {
    di: {
      service: { productType: productTypeService },
    },
  } = useDI();
  const [data, setData] = React.useState<{
    entities: { [id: string]: TinyProductType };
    order: number[];
  }>({ entities: {}, order: [] });
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [meta, setMeta] = React.useState<PaginationMeta>({
    count: 0,
    pages_count: 0,
    page: 0,
    limit: 0,
  });

  const getProductTypes = React.useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const { entities, result, meta } = await productTypeService.getAllMinified({
          page,
          sortingType: ProductTypeSortingType.RECENT,
        });
        setData({ entities: { ...data.entities, ...entities.productTypes }, order: uniq([...data.order, ...result]) });
        setMeta(meta);
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [productTypeService, data],
  );

  React.useEffect(() => {
    getProductTypes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    (async () => {
      if (mandatoryProductTypeId && !data.entities[mandatoryProductTypeId]) {
        try {
          setLoading(true);
          const productType = await productTypeService.getByID(mandatoryProductTypeId);
          if (productType) {
            setData({
              entities: { ...data.entities, [productType.id]: productType },
              order: [...data.order, productType.id],
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
  }, [typeof mandatoryProductTypeId !== 'undefined']);

  const loadMore = React.useCallback(() => {
    if (meta.page < meta.pages_count && !isLoading) {
      getProductTypes(meta.page + 1);
    }
  }, [getProductTypes, meta, isLoading]);

  return {
    productTypes: agregateOrderedMapToArray(data.entities, data.order, (productType) => ({
      ...productType,
      name: productType.name,
    })),
    isLoading,
    error,
    loadMore,
  };
};

export default useSelectProductTypes;
