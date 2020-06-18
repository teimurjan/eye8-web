import * as React from 'react';

import { IFeatureValueListRawIntlResponseItem } from 'src/api/FeatureValueAPI';
import { useDependencies } from 'src/DI/DI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue {
  adminFeatureValuesState: {
    featureValues: IFeatureValueListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getFeatureValues: () => Promise<void>;
    deleteFeatureValue: (id: number) => void;
    addFeatureValue: (featureValue: IFeatureValueListRawIntlResponseItem) => void;
    setFeatureValue: (featureValue: IFeatureValueListRawIntlResponseItem) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminFeatureValuesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const {
    dependencies: {
      services: { featureValue: service },
    },
  } = useDependencies();

  const [featureValues, setFeatureValues] = React.useState<{ [key: string]: IFeatureValueListRawIntlResponseItem }>({});
  const [featureValuesOrder, setFeatureValuesOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getFeatureValues = React.useCallback(async () => {
    setListLoading(true);
    try {
      const { entities, result } = await service.getAllRawIntl();
      setFeatureValues(entities.featureValues);
      setFeatureValuesOrder(result);
    } catch (e) {
      setListError('errors.common');
    } finally {
      setListLoading(false);
      setListLoaded(true);
    }
  }, [service]);

  const addFeatureValue = React.useCallback(
    (featureValue: IFeatureValueListRawIntlResponseItem) => {
      const newFeatureValues = {
        ...featureValues,
        [featureValue.id]: featureValue,
      };

      const newFeatureValuesOrder = [...featureValuesOrder, featureValue.id];

      setFeatureValues(newFeatureValues);
      setFeatureValuesOrder(newFeatureValuesOrder);
    },
    [featureValues, featureValuesOrder],
  );

  const setFeatureValue = React.useCallback(
    (featureValue: IFeatureValueListRawIntlResponseItem) => {
      const newFeatureValues = {
        ...featureValues,
        [featureValue.id]: featureValue,
      };

      setFeatureValues(newFeatureValues);
    },
    [featureValues],
  );

  const deleteFeatureValue = React.useCallback(
    (id: number) => {
      const newFeatureValues = { ...featureValues };
      delete newFeatureValues[id];

      const newFeatureValuesOrder = featureValuesOrder.filter(idFromOrder => idFromOrder !== id);
      setFeatureValuesOrder(newFeatureValuesOrder);
      setFeatureValues(newFeatureValues);
    },
    [featureValues, featureValuesOrder],
  );

  return (
    <Context.Provider
      value={{
        adminFeatureValuesState: {
          addFeatureValue,
          deleteFeatureValue,
          featureValues: agregateOrderedMapToArray(featureValues, featureValuesOrder, featureValue => ({
            ...featureValue,
            feature_type: {
              ...featureValue.feature_type,
              name: extendIntlTextWithLocaleNames(featureValue.feature_type.name, availableLocales),
            },
            name: extendIntlTextWithLocaleNames(featureValue.name, availableLocales),
          })),
          getFeatureValues,
          hasListLoaded,
          isListLoading,
          listError,
          setFeatureValue,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminFeatureValuesState = () => React.useContext(Context) as IContextValue;
