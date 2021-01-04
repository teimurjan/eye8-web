import React from 'react';

import { useAdminProductTypesFilters } from '@eye8/admin/hooks/use-admin-product-types-filters';
import { ContextValue as AdminProductTypesStateContextValue } from '@eye8/admin/state/product-types';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  adminProductTypesState: AdminProductTypesStateContextValue['state'];
}

export interface IViewProps {
  productTypes: AdminProductTypesStateContextValue['state']['entities'];
  meta: AdminProductTypesStateContextValue['state']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onDeletedChange: () => void;
  onAvailabilityChange: () => void;
  onSearchChange: (query: string) => void;
  deleted: boolean;
  available: boolean;
}

export const AdminProductTypesListPresenter = ({
  View,
  adminProductTypesState: { isListLoading, entities: productTypes, get: getProductTypes, hasListLoaded, meta },
}: IProps) => {
  const {
    filters: { deleted, available },
    setFilters,
  } = useAdminProductTypesFilters();

  React.useEffect(() => {
    getProductTypes({ page: 1, deleted: deleted, available });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted, available]);

  const onDeletedChange = React.useCallback(() => {
    setFilters({ available, deleted: !deleted });
  }, [deleted, available, setFilters]);

  const onAvailabilityChange = React.useCallback(() => {
    setFilters({ available: !available, deleted });
  }, [deleted, available, setFilters]);

  const onPageChange = React.useCallback(
    (page: number) => {
      getProductTypes({ page, deleted: deleted, available });
    },
    [getProductTypes, deleted, available],
  );

  const onSearchChange = React.useCallback(
    async (query: string) => {
      getProductTypes({ page: 1, deleted: deleted, available, query });
    },
    [available, getProductTypes, deleted],
  );

  return (
    <View
      onDeletedChange={onDeletedChange}
      onAvailabilityChange={onAvailabilityChange}
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      productTypes={productTypes}
      onPageChange={onPageChange}
      deleted={deleted}
      onSearchChange={onSearchChange}
      available={available}
    />
  );
};