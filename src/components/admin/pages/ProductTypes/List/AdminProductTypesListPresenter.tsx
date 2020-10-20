import * as React from 'react';

import { useAdminProductTypesFilters } from 'src/components/admin/pages/ProductTypes/useAdminProductTypesFilters';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { ContextValue as AdminProductTypesStateContextValue } from 'src/state/Admin/AdminProductTypesState';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  service: IProductTypeService;
  adminProductTypesState: AdminProductTypesStateContextValue['state'];
}

export interface IViewProps {
  productTypes: AdminProductTypesStateContextValue['state']['entities'];
  meta: AdminProductTypesStateContextValue['state']['meta'];
  isDataLoaded: boolean;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onDeletedModeChange: () => void;
  onAvailabilityChange: () => void;
  onSearchChange: (query: string) => void;
  isDeletedMode: boolean;
  available: boolean;
}

export const AdminProductTypesListPresenter = ({
  View,
  adminProductTypesState: { isListLoading, entities: productTypes, get: getProductTypes, hasListLoaded, meta },
  service,
}: IProps) => {
  const {
    filters: { deleted, forever, available },
    setFilters,
  } = useAdminProductTypesFilters();
  const isDeletedMode = deleted === true || forever === true;

  React.useEffect(() => {
    getProductTypes({ page: 1, deleted: isDeletedMode, available: !!available });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeletedMode, available]);

  const onDeletedModeChange = React.useCallback(() => {
    setFilters({ forever, available, deleted: !deleted });
  }, [forever, deleted, available, setFilters]);

  const onAvailabilityChange = React.useCallback(() => {
    setFilters({ forever, available: !available, deleted });
  }, [forever, deleted, available, setFilters]);

  const onPageChange = React.useCallback(
    (page: number) => {
      getProductTypes({ page, deleted: isDeletedMode, available: !!available });
    },
    [getProductTypes, isDeletedMode, available],
  );

  const onSearchChange = React.useCallback(
    async (query: string) => {
      getProductTypes({ page: 1, deleted: isDeletedMode, available: !!available, query });
    },
    [available, getProductTypes, isDeletedMode],
  );

  return (
    <View
      onDeletedModeChange={onDeletedModeChange}
      onAvailabilityChange={onAvailabilityChange}
      meta={meta}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      productTypes={productTypes}
      onPageChange={onPageChange}
      isDeletedMode={isDeletedMode}
      onSearchChange={onSearchChange}
      available={!!available}
    />
  );
};
