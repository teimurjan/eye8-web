import useFilters from './use-filters';

const INITIAL_FILTERS = { deleted: false };

const useAdminOrdersFilters = () =>
  useFilters({ initialFilters: INITIAL_FILTERS, relyOn: 'state', initialFrom: 'location' });

export default useAdminOrdersFilters;
