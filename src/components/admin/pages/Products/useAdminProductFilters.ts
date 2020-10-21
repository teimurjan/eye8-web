import { useFilters } from 'src/components/admin/hooks/useFilters';

export const useAdminProductsFilters = () =>
  useFilters({
    initialFilters: { productTypeId: NaN, available: true, deleted: false },
    relyOn: 'state',
    initialFrom: 'location',
  });
