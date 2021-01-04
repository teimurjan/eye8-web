/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather';
import { useSwipeable, SwipeableOptions } from 'react-swipeable';

import { Button, IconWrapper } from '@eye8/client-ui';
import { IconSize, mediaQueries } from '@eye8/shared/styles';

interface ICarouselItemProps {
  className?: string;
  children: React.ReactNode;
}

const CarouselItem = React.forwardRef<HTMLDivElement, ICarouselItemProps>(({ children, className }, ref) => {
  const item = (
    <div
      className={classNames(className)}
      ref={ref}
      css={css`
        flex: 0 0 100%;
        position: relative;
      `}
    >
      {children}
    </div>
  );

  return item;
});

export interface IProps {
  activeIndex: number;
  fullWidth?: boolean;
  className?: string;
  onEnter?: () => void;
  onEntered?: () => void;
  children?: React.ReactNode;
  controls?: React.ReactElement<ICarouselControlsProps>;
  swipeableOptions?: SwipeableOptions;
}

const Carousel = ({
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
      <IconWrapper>
        <ChevronLeftIcon size={IconSize.Medium} />
      </IconWrapper>
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
      <IconWrapper>
        <ChevronRightIcon size={IconSize.Medium} />
      </IconWrapper>
    </Button>
  </>
);

Carousel.Item = CarouselItem;

export default Carousel;
