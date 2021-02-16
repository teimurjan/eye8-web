import React from 'react';

import { Category } from '@eye8/api';
import { useDI } from '@eye8/di';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface ContextValue {
  categories: Category[];
  isLoading: boolean;
  error?: string;
}

const Context = React.createContext<ContextValue | null>(null);

export interface ProviderProps {
  children?: React.ReactNode;
  initialProps?: {
    categories: { [key: string]: Category };
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

  const [data, setData] = React.useState<{ entities: { [key: string]: Category }; order: number[] }>({
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
        categories: agregateOrderedMapToArray(data.entities, data.order),
        isLoading,
        error,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useCategoriesState = () => React.useContext(Context) as ContextValue;
