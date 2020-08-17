import { useLocation } from 'react-router';

export const useIsInstantDeletion = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  return searchParams.get('instantly') === 'true';
};
