import { History } from 'history';
import React from 'react';

import { useAdminProductsFilters } from '@eye8/admin/hooks/use-admin-product-filters';
import { useSelectProductTypes } from '@eye8/admin/hooks/use-select-product-types';
import { ContextValue as AdminProductsStateContextValue } from '@eye8/admin/state/products';
import { IProductTypeListRawIntlMinifiedResponseItem } from '@eye8/api/product-type';
import { IProductTypeService } from '@eye8/service/product-type';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  adminProductsState: AdminProductsStateContextValue['state'];
  productTypeService: IProductTypeService;
  history: History;
}

export interface IViewProps {
  products: AdminProductsStateContextValue['state']['entities'];
  meta: AdminProductsStateContextValue['state']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  selectedProductTypeId?: number;
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  onProductTypeChange: (id?: number) => void;
  onAvailabilityChange: () => void;
  onDeletedChange: () => void;
  available: boolean;
  deleted: boolean;
}

export const AdminProductsListPresenter = ({
  View,
  adminProductsState: { isListLoading, entities: products, get: getProducts, hasListLoaded, meta },
  productTypeService,
}: IProps) => {
  const {
    filters: { available, productTypeId, deleted },
    setFilters,
  } = useAdminProductsFilters();

  const onDeletedChange = React.useCallback(() => {
    setFilters({ productTypeId, available, deleted: !deleted });
  }, [productTypeId, available, deleted, setFilters]);

  const onProductTypeChange = React.useCallback(
    (newProductTypeId?: number) => {
      setFilters({ available, deleted, productTypeId: parseInt(`${newProductTypeId}`, 10) });
    },
    [available, deleted, setFilters],
  );

  const onAvailabilityChange = React.useCallback(() => {
    setFilters({ productTypeId, available: !available, deleted });
  }, [available, deleted, productTypeId, setFilters]);

  React.useEffect(() => {
    getProducts({ productTypeId: productTypeId, page: 1, available, deleted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productTypeId, available, deleted]);

  const { productTypes, isLoading: productTypesLoading, loadMore: LoadMoreProductTypes } = useSelectProductTypes({
    productTypeService,
    mandatoryProductTypeId: productTypeId,
  });

  const onPageChange = React.useCallback(
    (page: number) => {
      getProducts({ page, available, deleted });
    },
    [getProducts, available, deleted],
  );

  return (
    <View
      deleted={deleted}
      available={available}
      onAvailabilityChange={onAvailabilityChange}
      selectedProductTypeId={productTypeId}
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      products={products}
      onPageChange={onPageChange}
      productTypes={productTypes}
      productTypesLoading={productTypesLoading}
      LoadMoreProductTypes={LoadMoreProductTypes}
      onProductTypeChange={onProductTypeChange}
      onDeletedChange={onDeletedChange}
    />
  );
};
