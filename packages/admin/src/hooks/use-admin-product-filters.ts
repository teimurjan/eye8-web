import { useFilters } from '@eye8/admin/hooks/use-filters';

const INITIAL_FILTERS = { productTypeId: NaN, available: true, deleted: false };

export const useAdminProductsFilters = () =>
  useFilters({
    initialFilters: INITIAL_FILTERS,
    relyOn: 'state',
    initialFrom: 'location',
  });
