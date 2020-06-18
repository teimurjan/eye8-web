import * as React from 'react';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { useDependencies } from 'src/DI/DI';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue {
  categoriesState: {
    categories: ICategoryListResponseItem[];
    isLoading: boolean;
    error?: string;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
  initialProps?: {
    categories: { [key: string]: ICategoryListResponseItem };
    categoriesOrder: number[];
    error?: string;
  };
}

export const CategoriesStateProvider: React.SFC<IProviderProps> = ({ children, initialProps }) => {
  const {
    dependencies: {
      services: { category: service },
    },
  } = useDependencies();

  const [categories, setCategories] = React.useState<{ [key: string]: ICategoryListResponseItem }>(
    initialProps ? initialProps.categories : {},
  );
  const [categoriesOrder, setCategoriesOrder] = React.useState<number[]>(
    initialProps ? initialProps.categoriesOrder : [],
  );
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(initialProps ? initialProps.error : undefined);

  React.useEffect(() => {
    if (!initialProps) {
      (async () => {
        setLoading(true);
        try {
          const { entities, result } = await service.getAll();
          setCategories(entities.categories);
          setCategoriesOrder(result);
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);

  return (
    <Context.Provider
      value={{
        categoriesState: {
          categories: agregateOrderedMapToArray(categories, categoriesOrder),
          isLoading,
          error,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCategoriesState = () => React.useContext(Context) as IContextValue;
