import * as React from 'react';

import { ContextValue as AdminPromoCodesStateContextValue } from 'src/state/AdminPromoCodesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminPromoCodesState: AdminPromoCodesStateContextValue['state'];
  deleted: boolean;
}

export interface IViewProps {
  promoCodes: AdminPromoCodesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  deleted: boolean;
}

export const AdminPromoCodesListPresenter = ({
  View,
  deleted,
  adminPromoCodesState: { isListLoading, entities: promoCodes, get: getPromoCodes, hasListLoaded },
}: IProps & IntlStateContextValue) => {
  React.useEffect(() => {
    getPromoCodes({ deleted });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} promoCodes={promoCodes} deleted={deleted} />;
};
