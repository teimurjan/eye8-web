import { History } from 'history';
import React from 'react';

import { useAdminProductsFilters, useSelectProductTypes } from '@eye8/admin/hooks';
import { TinyProductType } from '@eye8/api';
import { ProductTypeService } from '@eye8/service';

import { AdminProductsState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminProductsState: AdminProductsState;
  productTypeService: ProductTypeService;
  history: History;
}

export interface ViewProps {
  products: AdminProductsState['entities'];
  meta: AdminProductsState['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  selectedProductTypeId?: number;
  productTypes: TinyProductType<true>[];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  onProductTypeChange: (id?: number) => void;
  onAvailabilityChange: () => void;
  onDeletedChange: () => void;
  available: boolean;
  deleted: boolean;
}

const AdminProductsListPresenter = ({
  View,
  adminProductsState: { isListLoading, entities: products, get: getProducts, hasListLoaded, meta },
}: Props) => {
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

export default AdminProductsListPresenter;
