import { useFilters } from 'src/components/admin/hooks/useFilters';

export const useAdminProductTypesFilters = () =>
  useFilters({
    initialFilters: { deleted: false, forever: false, available: false },
    relyOn: 'state',
    initialFrom: 'location',
  });
