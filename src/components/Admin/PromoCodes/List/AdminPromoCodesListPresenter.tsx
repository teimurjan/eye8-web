import * as React from 'react';

import { useShowDeleted } from 'src/components/Admin/hooks/useShowDeleted';
import { ContextValue as AdminPromoCodesStateContextValue } from 'src/state/Admin/AdminPromoCodesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
}

export interface IViewProps {
  promoCodes: AdminPromoCodesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  showDeleted: boolean;
}

export const AdminPromoCodesListPresenter = ({
  View,
  adminPromoCodesState: { isListLoading, entities: promoCodes, get: getPromoCodes, hasListLoaded },
}: IProps) => {
  const showDeleted = useShowDeleted();

  React.useEffect(() => {
    getPromoCodes({ deleted: showDeleted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDeleted]);

  return (
    <View isDataLoaded={hasListLoaded} isLoading={isListLoading} promoCodes={promoCodes} showDeleted={showDeleted} />
  );
};
