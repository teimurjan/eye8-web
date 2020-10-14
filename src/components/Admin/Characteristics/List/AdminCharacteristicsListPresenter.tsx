import * as React from 'react';

import { ContextValue as AdminCharacteristicsContextValue } from 'src/state/AdminCharacteristicsState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminCharacteristicsState: AdminCharacteristicsContextValue['state'];
}

export interface IViewProps {
  characteristics: AdminCharacteristicsContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminCharacteristicsListPresenter = ({
  View,
  adminCharacteristicsState: { isListLoading, entities: characteristics, get: getCharacteristics, hasListLoaded },
}: IProps) => {
  React.useEffect(() => {
    getCharacteristics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} characteristics={characteristics} />;
};
