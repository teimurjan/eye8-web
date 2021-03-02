/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import React from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather';
import Slider from 'react-slick';

import { Button } from '@eye8/client-ui';
import { IconWrapper } from '@eye8/shared/components';
import { IconSize, mediaQueries } from '@eye8/shared/styles';

interface CarouselItemProps {
  className?: string;
  children: React.ReactNode;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(({ children, className }, ref) => {
  const item = (
    <div
      className={classNames(className)}
      ref={ref}
      css={css`
        position: relative;
      `}
    >
      {children}
    </div>
  );

  return item;
});

export interface Props {
  activeIndex?: number;
  className?: string;
  onChange?: (index: number) => void;
  children?: React.ReactNode;
  controls?: boolean;
  autoPlay?: boolean;
  autoPlaySpeed?: number;
}

const Carousel = ({ className, children, activeIndex, onChange, controls, autoPlay, autoPlaySpeed = 10000 }: Props) => {
  const sliderRef = React.useRef<Slider>(null);

  React.useEffect(() => {
    if (typeof activeIndex === 'number' && sliderRef && sliderRef.current) {
      sliderRef.current.slickGoTo(activeIndex, true);
    }
  }, [activeIndex]);

  return (
    <Slider
      ref={(ref) => {
        // @ts-ignore
        sliderRef.current = ref;
      }}
      className={className}
      touchThreshold={15}
      beforeChange={(_, nextIndex) => onChange?.(nextIndex)}
      nextArrow={<CarouselNextControl />}
      prevArrow={<CarouselPrevControl />}
      arrows={controls}
      autoplay={autoPlay}
      autoplaySpeed={autoPlaySpeed}
      speed={750}
      infinite
    >
      {children}
    </Slider>
  );
};

interface CarouselControlProps {
  onClick?: React.MouseEventHandler;
  className?: string;
  style?: React.CSSProperties;
}

const controlsCSS = css`
  z-index: 1 !important;
  width: auto !important;
  height: auto !important;

  &:before {
    display: none;
  }

  @media ${mediaQueries.maxWidth768} {
    display: none !important;
  }
`;

const CarouselPrevControl = ({ className, style, onClick }: CarouselControlProps) => (
  <div
    css={css`
      ${controlsCSS};
      left: 20px !important;
    `}
    className={className}
    style={style}
  >
    <Button color="primary" onClick={onClick} circled>
      <IconWrapper>
        <ChevronLeftIcon size={IconSize.Medium} />
      </IconWrapper>
    </Button>
  </div>
);

const CarouselNextControl = ({ className, style, onClick }: CarouselControlProps) => (
  <div
    css={css`
      ${controlsCSS};
      right: 20px !important;
    `}
    className={className}
    style={style}
  >
    <Button color="primary" onClick={onClick} circled>
      <IconWrapper>
        <ChevronRightIcon size={IconSize.Medium} />
      </IconWrapper>
    </Button>
  </div>
);

Carousel.Item = CarouselItem;

export default Carousel;
