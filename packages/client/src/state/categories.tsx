import React from 'react';

import { CategoryListResponseItem } from '@eye8/api/category';
import { useDI } from '@eye8/di';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface ContextValue {
  categoriesState: {
    categories: CategoryListResponseItem[];
    isLoading: boolean;
    error?: string;
  };
}

const Context = React.createContext<ContextValue | null>(null);

export interface ProviderProps {
  children?: React.ReactNode;
  initialProps?: {
    categories: { [key: string]: CategoryListResponseItem };
    categoriesOrder: number[];
    error?: string;
  };
}

export const CategoriesStateProvider: React.SFC<ProviderProps> = ({ children, initialProps }) => {
  const {
    di: {
      service: { category: service },
    },
  } = useDI();

  const [data, setData] = React.useState<{ entities: { [key: string]: CategoryListResponseItem }; order: number[] }>({
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

export const useCategoriesState = () => React.useContext(Context) as ContextValue;
