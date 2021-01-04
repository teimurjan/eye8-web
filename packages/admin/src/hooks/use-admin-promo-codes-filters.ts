import { useFilters } from '@eye8/admin/hooks/use-filters';

const INITIAL_FILTERS = { deleted: false };

export const useAdminPromoCodesFilters = () =>
  useFilters({ initialFilters: INITIAL_FILTERS, relyOn: 'state', initialFrom: 'location' });
