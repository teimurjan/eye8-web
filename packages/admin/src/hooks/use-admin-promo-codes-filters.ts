import useFilters from './use-filters';

const INITIAL_FILTERS = { deleted: false };

const useAdminPromoCodesFilters = () =>
  useFilters({ initialFilters: INITIAL_FILTERS, relyOn: 'state', initialFrom: 'location' });

export default useAdminPromoCodesFilters;
