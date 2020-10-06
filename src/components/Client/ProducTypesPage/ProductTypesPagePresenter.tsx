import { NextRouter } from 'next/router';
import * as React from 'react';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import {
  IProductTypeListResponseItem,
  IProductTypeListResponseMeta,
  ProductTypeSortingType,
  sortingTypeOfQueryValue,
  queryValueOfSortingType,
} from 'src/api/ProductTypeAPI';
import { IProps as IListViewProps } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { ProductTypesPageFilterContainer as ProductTypesPageFilter } from 'src/components/Client/ProducTypesPage/ProductTypesPageFilter/ProductTypesPageFilterContainer';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { agregateOrderedMapToArray } from 'src/utils/agregate';
import { buildSearchString } from 'src/utils/queryString';

export interface IProps {
  ListView: React.ComponentClass<IListViewProps> | React.SFC<IListViewProps>;
  productTypeService: IProductTypeService;
  categorySlug?: string;
  router: NextRouter;
  initialProps?: {
    productTypes: { [key: string]: IProductTypeListResponseItem };
    productTypesMeta: IProductTypeListResponseMeta;
    category?: ICategoryListResponseItem;
    productTypesOrder: number[];
    error?: string;
  };
}

export const getCharacteristicValuesIdsFromQuery = (query: NextRouter['query']) =>
  (Array.isArray(query.characteristics) ? query.characteristics : [query.characteristics])
    .map((id) => parseInt(id, 10))
    .filter((id) => !isNaN(id));

export const ProductTypesPagePresenter = ({
  ListView,
  categorySlug,
  productTypeService,
  initialProps,
  router,
}: IProps) => {
  const [error, setError] = React.useState<string | undefined>(initialProps?.error);
  const [isLoading, setLoading] = React.useState(false);
  const [category, setCategory] = React.useState<ICategoryListResponseItem | undefined>(initialProps?.category);
  const [productTypesData, setProductTypesData] = React.useState<{
    entities: { [key: number]: IProductTypeListResponseItem };
    order: number[];
    meta: IProductTypeListResponseMeta;
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
  const sortByQuery = (router.query.sort_by ?? '') as string;
  const [sortingType, setSortingType] = React.useState<ProductTypeSortingType>(
    typeof sortingTypeOfQueryValue[sortByQuery] === 'undefined'
      ? ProductTypeSortingType.RECENT
      : sortingTypeOfQueryValue[sortByQuery],
  );

  const [characteristicValuesIds, setCharacteristicValuesIds] = React.useState(
    getCharacteristicValuesIdsFromQuery(router.query),
  );

  const loadProductTypes = React.useCallback(
    async (page: number = 1, newSortingType?: ProductTypeSortingType, newCharacteristicValuesIds?: number[]) => {
      setLoading(true);
      try {
        const { entities, result, meta } = await productTypeService.getForCategory(categorySlug!, {
          page,
          sortBy: newSortingType ?? sortingType,
          characteristicValuesIds: newCharacteristicValuesIds ?? characteristicValuesIds,
        });
        setProductTypesData({ entities: entities.productTypes ?? {}, meta, order: result });
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [categorySlug, productTypeService, sortingType, characteristicValuesIds],
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
        queryValueOfSortingType[typeof newSortingType === 'undefined' ? sortingType : newSortingType];
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
    if (initialProps) {
      setError(initialProps.error);
      setCategory(initialProps.category);
      setProductTypesData({
        entities: initialProps.productTypes,
        meta: initialProps.productTypesMeta,
        order: initialProps.productTypesOrder,
      });
    }
  }, [initialProps]);

  React.useEffect(() => {
    if (categorySlug && !initialProps) {
      loadProductTypes(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug]);

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
