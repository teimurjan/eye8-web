/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Link from 'next/link';
import * as React from 'react';

import { getPageHref } from 'src/helpers/link';

interface ICarouselItemProps {
  className?: string;
  children: React.ReactNode;
  asPath?: string | null;
}

export const CarouselItem = React.forwardRef<HTMLDivElement, ICarouselItemProps>(
  ({ children, className, asPath }, ref) => {
    const item = (
      <div
        className={className}
        ref={ref}
        css={css`
          flex: 0 0 100%;
          position: relative;
          cursor: ${asPath ? 'pointer' : 'auto'};
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
}

export const Carousel: React.FC<IProps> = ({
  className,
  children,
  activeIndex,
  fullWidth = false,
  onEnter,
  onEntered,
}) => {
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
      `}
    >
      <div
        css={css`
          display: flex;
          width: ${width};
          transform: translateX(-${activeIndex * 100}%);
          transition: transform 500ms ease-in-out;
        `}
        className="carousel"
      >
        {children}
      </div>
    </div>
  );
};
