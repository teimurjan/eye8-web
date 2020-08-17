import { useLocation } from 'react-router';

import { useSearchParams } from 'src/components/Admin/useSearchParams';

export const useShowDeleted = () => {
  const location = useLocation();
  const [deletedParam, foreverParam] = useSearchParams('deleted', 'forever');
  const isDeletion = location.pathname.includes('/delete/') && foreverParam === 'true';
  return deletedParam === 'true' || isDeletion;
};
