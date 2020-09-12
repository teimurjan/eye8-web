import * as React from 'react';

import { useFilters } from 'src/components/Admin/useFilters';
import { ISearchParams } from 'src/utils/queryString';

export interface IContextValue {
  adminProductsFiltersState: {
    filters: ISearchParams<'productTypeId'>;
    setFilters: (filters: ISearchParams<'productTypeId'>) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children: React.ReactNode;
}

export const AdminProductsFiltersStateProvider: React.FC<IProviderProps> = ({ children }) => {
  const { filters, setFilters } = useFilters({
    initialFilters: { productTypeId: undefined },
    relyOn: 'state',
    initialFrom: 'location',
  });
  return <Context.Provider value={{ adminProductsFiltersState: { filters, setFilters } }}>{children}</Context.Provider>;
};

export const useAdminProductsFiltersState = () => React.useContext(Context) as IContextValue;
