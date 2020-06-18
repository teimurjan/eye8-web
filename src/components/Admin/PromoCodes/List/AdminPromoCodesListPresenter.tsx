import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { IContextValue as AdminPromoCodesContextValue } from 'src/state/AdminPromoCodesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  promoCodes: AdminPromoCodesContextValue['adminPromoCodesState']['promoCodes'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminPromoCodesListPresenter = ({
  View,
  adminPromoCodesState: { isListLoading, promoCodes, getPromoCodes, hasListLoaded },
}: IProps & AdminPromoCodesContextValue & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getPromoCodes();
  }, [getPromoCodes]);

  return <View isDataLoaded={hasListLoaded} isLoading={isLoadingDebounced} promoCodes={promoCodes} />;
};
