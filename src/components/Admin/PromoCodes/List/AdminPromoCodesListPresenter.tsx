import * as React from 'react';

import { ContextValue as AdminPromoCodesStateContextValue } from 'src/state/AdminPromoCodesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
}

export interface IViewProps {
  promoCodes: AdminPromoCodesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminPromoCodesListPresenter = ({
  View,
  adminPromoCodesState: { isListLoading, entities: promoCodes, get: getPromoCodes, hasListLoaded },
}: IProps & IntlStateContextValue) => {
  React.useEffect(() => {
    getPromoCodes();
  }, [getPromoCodes]);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} promoCodes={promoCodes} />;
};
