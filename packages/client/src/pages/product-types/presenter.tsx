import { NextRouter } from 'next/router';
import React from 'react';

import {
  Category,
  ProductType,
  PaginationMeta,
  ProductTypeSortingType,
  queryValueOfProductTypeSortingType,
} from '@eye8/api';
import { ProductTypeService } from '@eye8/service';
import { agregateOrderedMapToArray, buildSearchString } from '@eye8/shared/utils';

import { ProductTypeListViewProps, ProductTypesPageFilter } from '../../components';

export interface Props {
  ListView: React.ComponentClass<ProductTypeListViewProps> | React.SFC<ProductTypeListViewProps>;
  productTypeService: ProductTypeService;
  router: NextRouter;
  initialProps: {
    productTypes: { [key: string]: ProductType };
    productTypesMeta: PaginationMeta;
    category?: Category;
    productTypesOrder: number[];
    error?: string;
    categorySlug?: string;
    sortingType?: ProductTypeSortingType;
    characteristicValuesIds: number[];
    page: number;
  };
}

export const getCharacteristicValuesIdsFromQuery = (query: NextRouter['query']) =>
  (Array.isArray(query.characteristics) ? query.characteristics : [query.characteristics])
    .map((id) => (id ? parseInt(id, 10) : NaN))
    .filter((id) => !isNaN(id));

const ProductTypesPagePresenter = ({ ListView, productTypeService, initialProps, router }: Props) => {
  const [error, setError] = React.useState<string | undefined>(initialProps?.error);
  const [isLoading, setLoading] = React.useState(false);
  const [category, setCategory] = React.useState<Category | undefined>(initialProps?.category);
  const [productTypesData, setProductTypesData] = React.useState<{
    entities: { [key: number]: ProductType };
    order: number[];
    meta: PaginationMeta;
  }>({
    entities: initialProps?.productTypes ?? {},
    order: initialProps?.productTypesOrder ?? [],
    meta: initialProps?.productTypesMeta ?? {
      count: 0,
      pages_count: 0,
      limit: 0,
      page: 0,
    },
  });
  const [sortingType, setSortingType] = React.useState<ProductTypeSortingType>(
    initialProps.sortingType ?? ProductTypeSortingType.RECENT,
  );

  const [characteristicValuesIds, setCharacteristicValuesIds] = React.useState(
    getCharacteristicValuesIdsFromQuery(router.query),
  );

  const loadProductTypes = React.useCallback(
    async (page: number = 1, newSortingType?: ProductTypeSortingType, newCharacteristicValuesIds?: number[]) => {
      if (initialProps.categorySlug) {
        setLoading(true);
        try {
          const { entities, result, meta } = await productTypeService.getForCategory(initialProps.categorySlug, {
            page,
            sortingType: newSortingType ?? sortingType,
            characteristicValuesIds: newCharacteristicValuesIds ?? characteristicValuesIds,
          });
          setProductTypesData({ entities: entities.productTypes ?? {}, meta, order: result });
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      }
    },
    [initialProps.categorySlug, productTypeService, sortingType, characteristicValuesIds],
  );

  const getQuery = React.useCallback(
    ({
      page,
      newSortingType,
      newCharacteristicValuesIds,
    }: {
      page?: number;
      newSortingType?: ProductTypeSortingType;
      newCharacteristicValuesIds?: number[];
    }) => {
      const pageQueryValue = page || productTypesData.meta.page;
      const sortByQueryValue =
        queryValueOfProductTypeSortingType[typeof newSortingType === 'undefined' ? sortingType : newSortingType];
      return buildSearchString({
        page: pageQueryValue,
        sort_by: sortByQueryValue,
        characteristics: newCharacteristicValuesIds,
      });
    },
    [sortingType, productTypesData],
  );

  const getBasePath = React.useCallback(() => router.asPath.split('?')[0], [router]);

  const onPageChange = React.useCallback(
    (page: number) => {
      const query = getQuery({ page });
      const basePath = getBasePath();
      router.push(`${router.pathname}${query}`, `${basePath}${query}`, { shallow: true });
      loadProductTypes(page);
    },
    [router, loadProductTypes, getBasePath, getQuery],
  );

  // When navigating between categories the initialProps are changing and needed to be set to state
  React.useEffect(() => {
    setError(initialProps.error);
    setCategory(initialProps.category);
    setProductTypesData({
      entities: initialProps.productTypes,
      meta: initialProps.productTypesMeta,
      order: initialProps.productTypesOrder,
    });
    setSortingType(initialProps.sortingType ?? ProductTypeSortingType.RECENT);
    setCharacteristicValuesIds(initialProps.characteristicValuesIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProps.categorySlug]);

  const onSortingTypeChange = React.useCallback(
    (newSortingType: ProductTypeSortingType) => {
      setSortingType(newSortingType);
      const query = getQuery({ newSortingType });
      const basePath = getBasePath();
      router.push(`${router.pathname}${query}`, `${basePath}${query}`, { shallow: true });
      loadProductTypes(1, newSortingType);
    },
    [router, getQuery, getBasePath, loadProductTypes],
  );

  const onCharacteristicValuesChange = React.useCallback(
    (newCharacteristicValuesIds: number[]) => {
      setCharacteristicValuesIds(newCharacteristicValuesIds);
      const query = getQuery({ newCharacteristicValuesIds });
      const basePath = getBasePath();
      router.push(`${router.pathname}${query}`, `${basePath}${query}`, { shallow: true });
      loadProductTypes(1, undefined, newCharacteristicValuesIds);
    },
    [router, getQuery, getBasePath, loadProductTypes],
  );

  return (
    <ListView
      filter={
        <ProductTypesPageFilter
          disabled={isLoading}
          sortingType={sortingType}
          characteristicValuesIds={characteristicValuesIds}
          onSortingTypeChange={onSortingTypeChange}
          onCharacteristicValuesChange={onCharacteristicValuesChange}
        />
      }
      productTypes={agregateOrderedMapToArray(productTypesData.entities, productTypesData.order)}
      category={category}
      meta={productTypesData.meta}
      isLoading={isLoading}
      error={error}
      onPageChange={onPageChange}
    />
  );
};

export default ProductTypesPagePresenter;
