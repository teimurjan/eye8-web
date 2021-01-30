import useFilters from './use-filters';

const INITIAL_FILTERS = { productTypeId: NaN, available: true, deleted: false };

const useAdminProductsFilters = () =>
  useFilters({
    initialFilters: INITIAL_FILTERS,
    relyOn: 'state',
    initialFrom: 'location',
  });

export default useAdminProductsFilters;
