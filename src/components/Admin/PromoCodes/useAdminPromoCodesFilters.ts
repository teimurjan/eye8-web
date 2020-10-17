import { useFilters } from 'src/components/Admin/hooks/useFilters';

export const useAdminPromoCodesFilters = () =>
  useFilters({ initialFilters: { deleted: false, forever: false }, relyOn: 'state', initialFrom: 'location' });
