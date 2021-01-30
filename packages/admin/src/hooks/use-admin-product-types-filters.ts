import useFilters from './use-filters';

const INITIAL_FILTERS = { deleted: false, available: false };

const useAdminProductTypesFilters = () =>
  useFilters({
    initialFilters: INITIAL_FILTERS,
    relyOn: 'state',
    initialFrom: 'location',
  });

export default useAdminProductTypesFilters;
