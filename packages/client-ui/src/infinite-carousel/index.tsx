import React from 'react';

import { Carousel, ICarouselProps } from '@eye8/client-ui';

export interface IProps extends Omit<ICarouselProps, 'children' | 'activeIndex' | 'swipeableOptions'> {
  children: React.ReactElement | React.ReactElement[];
  delay?: number;
  swipeable?: boolean;
}

const InfiniteCarousel = ({ children, delay, controls, onEnter, onEntered, swipeable, ...props }: IProps) => {
  const [isTransitioning, setTransitioning] = React.useState(false);

  const childrenCount = React.Children.count(children);

  const [activeIndex, setActiveIndex] = React.useState(childrenCount);

  const offsetRatio = Math.floor(activeIndex / childrenCount);

  React.useEffect(() => {
    if (!delay) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setActiveIndex(activeIndex + 1);
    }, delay);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const onNextClick = React.useCallback(() => {
    if (!isTransitioning) {
      setActiveIndex(activeIndex + 1);
    }
  }, [activeIndex, isTransitioning]);

  const onPrevClick = React.useCallback(() => {
    if (!isTransitioning && activeIndex % childrenCount !== 0) {
      setActiveIndex(activeIndex - 1);
    }
  }, [activeIndex, isTransitioning, childrenCount]);

  const onEnter_ = React.useCallback(() => {
    setTransitioning(true);
    onEnter && onEnter();
  }, [onEnter]);

  const onEntered_ = React.useCallback(() => {
    setTransitioning(false);
    onEntered && onEntered();
  }, [onEntered]);

  return (
    <Carousel
      activeIndex={activeIndex}
      controls={controls ? React.cloneElement(controls, { onNextClick, onPrevClick }) : undefined}
      onEnter={onEnter_}
      onEntered={onEntered_}
      swipeableOptions={
        swipeable ? { onSwipedRight: onPrevClick, onSwipedLeft: onNextClick, trackMouse: true } : undefined
      }
      {...props}
    >
      <div style={{ flex: `0 0 ${offsetRatio * (childrenCount * 100) - childrenCount * 100}%` }} />
      {children}
      {children}
      {children}
    </Carousel>
  );
};

InfiniteCarousel.whyDidYouRender = true;

export default InfiniteCarousel;
