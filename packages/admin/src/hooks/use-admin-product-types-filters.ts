import { useFilters } from '@eye8/admin/hooks/use-filters';

const INITIAL_FILTERS = { deleted: false, available: false };

export const useAdminProductTypesFilters = () =>
  useFilters({
    initialFilters: INITIAL_FILTERS,
    relyOn: 'state',
    initialFrom: 'location',
  });
