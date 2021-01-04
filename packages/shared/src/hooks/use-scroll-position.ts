import React from 'react';

const useScrollPosition = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  const el = ref.current;
  React.useEffect(() => {
    if (el) {
      const handleScroll = () => {
        const { scrollTop, scrollLeft } = el;
        setPosition({ top: scrollTop, left: scrollLeft });
      };
      el.addEventListener('scroll', handleScroll, { passive: true });
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, [el]);

  return position;
};

export default useScrollPosition;
