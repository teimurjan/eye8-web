/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { NextRouter } from 'next/router';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import {
  IProductTypeListResponseItem,
  IProductTypeListResponseMeta,
  ProductTypeSortingType,
  sortingTypeOfQueryValue,
  queryValueOfSortingType,
} from 'src/api/ProductTypeAPI';
import { Filter } from 'src/components/client-ui/Filter/Filter';
import { IProps as IListViewProps } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { mediaQueries } from 'src/styles/media';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

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

export const ProductTypesPagePresenter = ({
  ListView,
  categorySlug,
  productTypeService,
  initialProps,
  router,
}: IProps) => {
  const intl = useIntl();
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
  const sortByQuery = (router.query.sort_by || '') as string;
  const [sortingType, setSortingType] = React.useState<ProductTypeSortingType>(
    typeof sortingTypeOfQueryValue[sortByQuery] === 'undefined'
      ? ProductTypeSortingType.RECENT
      : sortingTypeOfQueryValue[sortByQuery],
  );

  const loadProductTypes = React.useCallback(
    async (page: number = 1, newSortingType?: ProductTypeSortingType) => {
      setLoading(true);
      try {
        const { entities, result, meta } = await productTypeService.getForCategory(
          categorySlug!,
          page,
          typeof newSortingType === 'undefined' ? sortingType : newSortingType,
        );
        setProductTypesData({ entities: entities.productTypes ?? {}, meta, order: result });
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [categorySlug, productTypeService, sortingType],
  );

  const getQuery = React.useCallback(
    ({ page, newSortingType }: { page?: number; newSortingType?: ProductTypeSortingType }) => {
      const pageQueryValue = page || productTypesData.meta.page;
      const sortByQueryValue =
        queryValueOfSortingType[typeof newSortingType === 'undefined' ? sortingType : newSortingType];
      return `?page=${pageQueryValue}&sort_by=${sortByQueryValue}`;
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

  const setSortingTypeAndLoad = React.useCallback(
    (newSortingType: ProductTypeSortingType) => {
      setSortingType(newSortingType);
      const query = getQuery({ newSortingType });
      const basePath = getBasePath();
      router.push(`${router.pathname}?${query}`, `${basePath}?${query}`, { shallow: true });
      loadProductTypes(1, newSortingType);
    },
    [router, getQuery, getBasePath, loadProductTypes],
  );

  const onPriceAscendingSortingTypeClick = React.useCallback(
    () => setSortingTypeAndLoad(ProductTypeSortingType.PRICE_ASCENDING),
    [setSortingTypeAndLoad],
  );
  const onPriceDescendingSortingTypeClick = React.useCallback(
    () => setSortingTypeAndLoad(ProductTypeSortingType.PRICE_DESCENDING),
    [setSortingTypeAndLoad],
  );
  const onRecentSortingTypeClick = React.useCallback(() => setSortingTypeAndLoad(ProductTypeSortingType.RECENT), [
    setSortingTypeAndLoad,
  ]);

  return (
    <ListView
      filter={
        <Filter
          css={css`
            padding: 20px 30px 0 0;

            @media ${mediaQueries.maxWidth768} {
              padding: 0;
            }
          `}
        >
          <Filter.ItemGroup title={intl.formatMessage({ id: 'common.sortBy' })}>
            <Filter.Item active={sortingType === ProductTypeSortingType.RECENT} onClick={onRecentSortingTypeClick}>
              {intl.formatMessage({ id: 'filter.newlyAdded' })}
            </Filter.Item>
            <Filter.Item
              active={sortingType === ProductTypeSortingType.PRICE_ASCENDING}
              onClick={onPriceAscendingSortingTypeClick}
            >
              {intl.formatMessage({ id: 'filter.priceAscending' })}
            </Filter.Item>
            <Filter.Item
              active={sortingType === ProductTypeSortingType.PRICE_DESCENDING}
              onClick={onPriceDescendingSortingTypeClick}
            >
              {intl.formatMessage({ id: 'filter.priceDescending' })}
            </Filter.Item>
          </Filter.ItemGroup>
        </Filter>
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
