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
  categoryIdOrSlug?: number | string;
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
  categoryIdOrSlug,
  productTypeService,
  initialProps,
  router,
}: IProps) => {
  const intl = useIntl();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isLoading, setLoading] = React.useState(false);
  const [productTypes, setProductTypes] = React.useState<{ [key: string]: IProductTypeListResponseItem }>({});
  const [category, setCategory] = React.useState<ICategoryListResponseItem | undefined>(undefined);
  const [productTypesMeta, setProductTypesMeta] = React.useState<IProductTypeListResponseMeta>({
    count: 0,
    pages_count: 0,
    limit: 0,
    page: 0,
  });
  const [productTypesOrder, setProductTypesOrder] = React.useState<number[]>([]);
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
          categoryIdOrSlug!,
          page,
          typeof newSortingType === 'undefined' ? sortingType : newSortingType,
        );
        setProductTypes(entities.productTypes || {});
        setProductTypesMeta(meta);
        setProductTypesOrder(result);
      } catch (e) {
        setError('errors.common');
      } finally {
        setLoading(false);
      }
    },
    [categoryIdOrSlug, productTypeService, sortingType],
  );

  const getNextURL = React.useCallback(
    ({ page, newSortingType }: { page?: number; newSortingType?: ProductTypeSortingType }) => {
      const pageQueryValue = page || productTypesMeta.page;
      const sortByQueryValue =
        queryValueOfSortingType[typeof newSortingType === 'undefined' ? sortingType : newSortingType];
      return `${router.asPath.split('?')[0]}?page=${pageQueryValue}&sort_by=${sortByQueryValue}`;
    },
    [router, sortingType, productTypesMeta],
  );

  const onPageChange = React.useCallback(
    (page: number) => {
      router.push(router.pathname, getNextURL({ page }), { shallow: true });
      loadProductTypes(page);
    },
    [router, loadProductTypes, getNextURL],
  );

  // When navigating between categories the initialProps are changing and needed to be set to state
  React.useEffect(() => {
    if (initialProps) {
      setError(initialProps.error);
      setCategory(initialProps.category);
      setProductTypes(initialProps.productTypes);
      setProductTypesMeta(initialProps.productTypesMeta);
      setProductTypesOrder(initialProps.productTypesOrder);
    }
  }, [initialProps]);

  React.useEffect(() => {
    if (categoryIdOrSlug && !initialProps) {
      loadProductTypes(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryIdOrSlug]);

  const setSortingTypeAndLoad = React.useCallback(
    (newSortingType: ProductTypeSortingType) => {
      setSortingType(newSortingType);
      router.push(router.pathname, getNextURL({ newSortingType }), {
        shallow: true,
      });
      loadProductTypes(1, newSortingType);
    },
    [router, getNextURL, loadProductTypes],
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
      productTypes={agregateOrderedMapToArray(productTypes, productTypesOrder)}
      category={category}
      meta={productTypesMeta}
      isLoading={isLoading}
      error={error}
      onPageChange={onPageChange}
    />
  );
};
