import * as React from 'react';

import { ICategoryListRawIntlResponseItem } from 'src/api/CategoryAPI';
import { useDependencies } from 'src/DI/DI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue {
  adminCategoriesState: {
    categories: ICategoryListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getCategories: () => Promise<void>;
    deleteCategory: (id: number) => void;
    addCategory: (category: ICategoryListRawIntlResponseItem) => void;
    setCategory: (category: ICategoryListRawIntlResponseItem) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminCategoriesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const {
    dependencies: {
      services: { category: service },
    },
  } = useDependencies();

  const [categories, setCategories] = React.useState<{ [key: string]: ICategoryListRawIntlResponseItem }>({});
  const [categoriesOrder, setCategoriesOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getCategories = React.useCallback(async () => {
    setListLoading(true);
    try {
      const { entities, result } = await service.getAllRawIntl();
      setCategories(entities.categories);
      setCategoriesOrder(result);
    } catch (e) {
      setListError('errors.common');
    } finally {
      setListLoading(false);
      setListLoaded(true);
    }
  }, [service]);

  const addCategory = React.useCallback(
    (category: ICategoryListRawIntlResponseItem) => {
      const newCategories = {
        ...categories,
        [category.id]: category,
      };

      const newCategoriesOrder = [...categoriesOrder, category.id];

      setCategories(newCategories);
      setCategoriesOrder(newCategoriesOrder);
    },
    [categories, categoriesOrder],
  );

  const setCategory = React.useCallback(
    (category: ICategoryListRawIntlResponseItem) => {
      const newCategories = {
        ...categories,
        [category.id]: category,
      };

      setCategories(newCategories);
    },
    [categories],
  );

  const deleteCategory = React.useCallback(
    (id: number) => {
      const newCategories = { ...categories };
      delete newCategories[id];

      const newCategoriesOrder = categoriesOrder.filter(idFromOrder => idFromOrder !== id);
      setCategoriesOrder(newCategoriesOrder);
      setCategories(newCategories);
    },
    [categories, categoriesOrder],
  );

  return (
    <Context.Provider
      value={{
        adminCategoriesState: {
          addCategory,
          deleteCategory,
          categories: agregateOrderedMapToArray(categories, categoriesOrder, category => ({
            ...category,
            name: extendIntlTextWithLocaleNames(category.name, availableLocales),
          })),
          getCategories,
          hasListLoaded,
          isListLoading,
          listError,
          setCategory,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminCategoriesState = () => React.useContext(Context) as IContextValue;
