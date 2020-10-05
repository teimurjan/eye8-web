import * as React from 'react';

import { ContextValue as AdminCharacteristicsContextValue } from 'src/state/AdminCharacteristicsState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminCharacteristicsState: AdminCharacteristicsContextValue['state'];
}

export interface IViewProps {
  characteristics: AdminCharacteristicsContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminCharacteristicsListPresenter = ({
  View,
  adminCharacteristicsState: { isListLoading, entities: characteristics, get: getCharacteristics, hasListLoaded },
  intlState: { availableLocales },
}: IProps) => {
  React.useEffect(() => {
    getCharacteristics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      locales={availableLocales.map(({ name }) => name)}
      characteristics={characteristics}
    />
  );
};
