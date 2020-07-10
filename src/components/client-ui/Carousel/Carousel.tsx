/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';
import { useSwipeable, SwipeableOptions } from 'react-swipeable';

import { Button } from 'src/components/client-ui/Button/Button';
import { getPageHref } from 'src/helpers/link';
import { mediaQueries } from 'src/styles/media';

interface ICarouselItemProps {
  className?: string;
  children: React.ReactNode;
  asPath?: string | null;
}

export const CarouselItem = React.forwardRef<HTMLDivElement, ICarouselItemProps>(
  ({ children, className, asPath }, ref) => {
    const item = (
      <div
        className={classNames(className, { link: typeof asPath === 'string' })}
        ref={ref}
        css={css`
          flex: 0 0 100%;
          position: relative;

          &.link {
            cursor: pointer;
          }
        `}
      >
        {children}
      </div>
    );

    return asPath ? (
      <Link as={asPath} href={getPageHref(asPath)}>
        {item}
      </Link>
    ) : (
      item
    );
  },
);

interface IProps {
  activeIndex: number;
  fullWidth?: boolean;
  className?: string;
  onEnter?: () => void;
  onEntered?: () => void;
  children?: React.ReactNode;
  controls?: React.ReactElement<ICarouselControlsProps>;
  swipeableOptions?: SwipeableOptions;
}

export const Carousel = ({
  className,
  children,
  activeIndex,
  fullWidth = false,
  onEnter,
  onEntered,
  controls,
  swipeableOptions,
}: IProps) => {
  const swipeableHandlers = useSwipeable(swipeableOptions || {});
  const width = React.useMemo(() => {
    if (fullWidth) {
      return '100%';
    }
    return undefined;
  }, [fullWidth]);

  React.useEffect(() => {
    onEnter && onEnter();
    const timeoutID = setTimeout(() => {
      onEntered && onEntered();
    }, 500);

    return () => clearTimeout(timeoutID);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  return (
    <div
      className={className}
      css={css`
        overflow: hidden;
        position: relative;
      `}
    >
      <div
        style={{ transform: `translateX(-${activeIndex * 100}%)`, width }}
        css={css`
          display: flex;
          transition: transform 500ms ease-in-out;
        `}
        className="carousel"
        {...(swipeableOptions ? swipeableHandlers : {})}
      >
        {children}
      </div>
      {controls}
    </div>
  );
};

interface IInifiniteCarouselProps extends Omit<IProps, 'children' | 'activeIndex' | 'swipeableOptions'> {
  children: React.ReactElement | React.ReactElement[];
  delay?: number;
  swipeable?: boolean;
}

export const InfiniteCarousel = ({
  children,
  delay,
  controls,
  onEnter,
  onEntered,
  swipeable,
  ...props
}: IInifiniteCarouselProps) => {
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
    if (!isTransitioning && activeIndex % childrenCount == 0) {
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

interface ICarouselControlsProps {
  onNextClick?: React.MouseEventHandler;
  onPrevClick?: React.MouseEventHandler;
}

const controlsCSS = css`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  @media ${mediaQueries.maxWidth768} {
    display: none !important;
  }
`;

Carousel.Controls = ({ onNextClick, onPrevClick }: ICarouselControlsProps) => (
  <>
    <Button
      css={css`
        ${controlsCSS};
        left: 20px;
      `}
      color="primary"
      onClick={onPrevClick}
      circled
    >
      <FontAwesomeIcon icon={faAngleLeft} size="lg" />
    </Button>
    <Button
      css={css`
        ${controlsCSS};
        right: 20px;
      `}
      color="primary"
      onClick={onNextClick}
      circled
    >
      <FontAwesomeIcon icon={faAngleRight} size="lg" />
    </Button>
  </>
);

InfiniteCarousel.whyDidYouRender = true;
