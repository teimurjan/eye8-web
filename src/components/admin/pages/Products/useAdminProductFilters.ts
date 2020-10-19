import { useFilters } from 'src/components/admin/hooks/useFilters';

export const useAdminProductsFilters = () =>
  useFilters({
    initialFilters: { productTypeId: undefined, available: true },
    relyOn: 'state',
    initialFrom: 'location',
  });
