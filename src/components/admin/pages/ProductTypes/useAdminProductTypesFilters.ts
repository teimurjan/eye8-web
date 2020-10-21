import { useFilters } from 'src/components/admin/hooks/useFilters';

export const useAdminProductTypesFilters = () =>
  useFilters({
    initialFilters: { deleted: false, available: false },
    relyOn: 'state',
    initialFrom: 'location',
  });
