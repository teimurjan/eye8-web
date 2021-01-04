import React from 'react';

import { useAdminPromoCodesFilters } from '@eye8/admin/hooks/use-admin-promo-codes-filters';
import { ContextValue as AdminPromoCodesStateContextValue } from '@eye8/admin/state/promo-codes';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
}

export interface IViewProps {
  promoCodes: AdminPromoCodesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  deleted: boolean;
  onDeletedChange: () => void;
}

export const AdminPromoCodesListPresenter = ({
  View,
  adminPromoCodesState: { isListLoading, entities: promoCodes, get: getPromoCodes, hasListLoaded },
}: IProps) => {
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
