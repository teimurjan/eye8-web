import * as React from 'react';

import { ContextValue as AdminPromoCodesStateContextValue } from 'src/state/AdminPromoCodesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
  showDeleted: boolean;
}

export interface IViewProps {
  promoCodes: AdminPromoCodesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  showDeleted: boolean;
}

export const AdminPromoCodesListPresenter = ({
  View,
  showDeleted,
  adminPromoCodesState: { isListLoading, entities: promoCodes, get: getPromoCodes, hasListLoaded },
}: IProps) => {
  React.useEffect(() => {
    getPromoCodes({ deleted: showDeleted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showDeleted]);

  return (
    <View isDataLoaded={hasListLoaded} isLoading={isListLoading} promoCodes={promoCodes} showDeleted={showDeleted} />
  );
};
