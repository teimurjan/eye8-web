import React from 'react';

import { useAdminPromoCodesFilters } from '@eye8/admin/hooks';

import { AdminPromoCodesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminPromoCodesState: AdminPromoCodesState;
}

export interface ViewProps {
  promoCodes: AdminPromoCodesState['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  deleted: boolean;
  onDeletedChange: () => void;
}

export const AdminPromoCodesListPresenter = ({
  View,
  adminPromoCodesState: { isListLoading, entities: promoCodes, get: getPromoCodes, hasListLoaded },
}: Props) => {
  const {
    filters: { deleted },
    setFilters,
  } = useAdminPromoCodesFilters();

  React.useEffect(() => {
    getPromoCodes({ deleted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

  const onDeletedChange = React.useCallback(() => {
    setFilters({ deleted: !deleted });
  }, [deleted, setFilters]);

  return (
    <View
      onDeletedChange={onDeletedChange}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      promoCodes={promoCodes}
      deleted={deleted}
    />
  );
};
