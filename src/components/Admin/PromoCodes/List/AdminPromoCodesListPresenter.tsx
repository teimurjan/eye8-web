import * as React from 'react';

import { useAdminPromoCodesFilters } from 'src/components/Admin/PromoCodes/useAdminPromoCodesFilters';
import { ContextValue as AdminPromoCodesStateContextValue } from 'src/state/Admin/AdminPromoCodesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
}

export interface IViewProps {
  promoCodes: AdminPromoCodesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  isDeletedMode: boolean;
  onDeletedModeChange: () => void;
}

export const AdminPromoCodesListPresenter = ({
  View,
  adminPromoCodesState: { isListLoading, entities: promoCodes, get: getPromoCodes, hasListLoaded },
}: IProps) => {
  const {
    filters: { deleted, forever },
    setFilters,
  } = useAdminPromoCodesFilters();
  const isDeletedMode = deleted === true || forever === true;

  React.useEffect(() => {
    getPromoCodes({ deleted: isDeletedMode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDeletedMode]);

  const onDeletedModeChange = React.useCallback(() => {
    setFilters({ forever, deleted: !deleted });
  }, [forever, deleted, setFilters]);

  return (
    <View
      onDeletedModeChange={onDeletedModeChange}
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      promoCodes={promoCodes}
      isDeletedMode={isDeletedMode}
    />
  );
};
