import { useFilters } from 'src/components/Admin/hooks/useFilters';

export const useAdminProductTypesFilters = () =>
  useFilters({ initialFilters: { deleted: false, forever: false }, relyOn: 'state', initialFrom: 'location' });
