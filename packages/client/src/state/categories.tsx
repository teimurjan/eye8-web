import React from 'react';

import { ICategoryListResponseItem } from '@eye8/api/category';
import { useDependencies } from '@eye8/di';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface IContextValue {
  categoriesState: {
    categories: ICategoryListResponseItem[];
    isLoading: boolean;
    error?: string;
  };
}

const Context = React.createContext<IContextValue | null>(null);

export interface IProviderProps {
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

  const [data, setData] = React.useState<{ entities: { [key: string]: ICategoryListResponseItem }; order: number[] }>({
    entities: initialProps?.categories ?? {},
    order: initialProps?.categoriesOrder ?? [],
  });
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(initialProps ? initialProps.error : undefined);

  React.useEffect(() => {
    if (!initialProps) {
      (async () => {
        setLoading(true);
        try {
          const { entities, result } = await service.getAll();
          setData({ entities: entities.categories, order: result });
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Context.Provider
      value={{
        categoriesState: {
          categories: agregateOrderedMapToArray(data.entities, data.order),
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
