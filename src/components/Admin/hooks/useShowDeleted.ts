import { useFilters } from 'src/components/Admin/hooks/useFilters';

export const useShowDeleted = () => {
  const {
    filters: { deleted, forever },
  } = useFilters({ initialFilters: { deleted: false, forever: false }, relyOn: 'location' });
  return deleted === true || forever === true;
};
