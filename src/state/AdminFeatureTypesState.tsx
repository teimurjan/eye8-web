import * as React from 'react';

import { IFeatureTypeListRawIntlResponseItem } from 'src/api/FeatureTypeAPI';
import { useDependencies } from 'src/DI/DI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue {
  adminFeatureTypesState: {
    featureTypes: IFeatureTypeListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getFeatureTypes: () => Promise<void>;
    deleteFeatureType: (id: number) => void;
    addFeatureType: (featureType: IFeatureTypeListRawIntlResponseItem) => void;
    setFeatureType: (featureType: IFeatureTypeListRawIntlResponseItem) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminFeatureTypesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const {
    dependencies: {
      services: { featureType: service },
    },
  } = useDependencies();

  const [featureTypes, setFeatureTypes] = React.useState<{ [key: string]: IFeatureTypeListRawIntlResponseItem }>({});
  const [featureTypesOrder, setFeatureTypesOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getFeatureTypes = React.useCallback(async () => {
    setListLoading(true);
    try {
      const { entities, result } = await service.getAllRawIntl();
      setFeatureTypes(entities.featureTypes);
      setFeatureTypesOrder(result);
    } catch (e) {
      setListError('errors.common');
    } finally {
      setListLoading(false);
      setListLoaded(true);
    }
  }, [service]);

  const addFeatureType = React.useCallback(
    (featureType: IFeatureTypeListRawIntlResponseItem) => {
      const newFeatureTypes = {
        ...featureTypes,
        [featureType.id]: featureType,
      };

      const newFeatureTypesOrder = [...featureTypesOrder, featureType.id];

      setFeatureTypes(newFeatureTypes);
      setFeatureTypesOrder(newFeatureTypesOrder);
    },
    [featureTypes, featureTypesOrder],
  );

  const setFeatureType = React.useCallback(
    (featureType: IFeatureTypeListRawIntlResponseItem) => {
      const newFeatureTypes = {
        ...featureTypes,
        [featureType.id]: featureType,
      };

      setFeatureTypes(newFeatureTypes);
    },
    [featureTypes],
  );

  const deleteFeatureType = React.useCallback(
    (id: number) => {
      const newFeatureTypes = { ...featureTypes };
      delete newFeatureTypes[id];

      const newFeatureTypesOrder = featureTypesOrder.filter(idFromOrder => idFromOrder !== id);
      setFeatureTypesOrder(newFeatureTypesOrder);
      setFeatureTypes(newFeatureTypes);
    },
    [featureTypes, featureTypesOrder],
  );

  return (
    <Context.Provider
      value={{
        adminFeatureTypesState: {
          addFeatureType,
          deleteFeatureType,
          featureTypes: agregateOrderedMapToArray(featureTypes, featureTypesOrder, featureType => ({
            ...featureType,
            name: extendIntlTextWithLocaleNames(featureType.name, availableLocales),
          })),
          getFeatureTypes,
          hasListLoaded,
          isListLoading,
          listError,
          setFeatureType,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminFeatureTypesState = () => React.useContext(Context) as IContextValue;
