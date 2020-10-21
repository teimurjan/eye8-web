import { useFilters } from 'src/components/admin/hooks/useFilters';

export const useAdminPromoCodesFilters = () =>
  useFilters({ initialFilters: { deleted: false }, relyOn: 'state', initialFrom: 'location' });
