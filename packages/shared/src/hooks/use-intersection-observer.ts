import React from 'react';

const useIntersectionObserver = (ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) => {
  const [isIntersecting, setIntersecting] = React.useState(false);
  const [hasIntersected, setHasIntersected] = React.useState(false);

  React.useEffect(() => {
    const refCurrent = ref.current;

    if (refCurrent) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          setIntersecting(entry.isIntersecting);
          if (entry.isIntersecting) {
            setHasIntersected(true);
          }
        });
      }, options);

      observer.observe(refCurrent);

      return () => observer.unobserve(refCurrent);
    }
  }, [ref, options]);

  return { isIntersecting, hasIntersected };
};

export default useIntersectionObserver;
