/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import Magnifier from 'react-magnifier';

import { Carousel, CarouselItem } from 'src/components/client-ui/Carousel/Carousel';
import { mediaQueries } from 'src/styles/media';

const CONTROL_IMAGE_SIZE = '8vw';
const CONTROL_IMAGE_MOBILE_SIZE = '25vw';
const MAX_CONTROL_IMAGE_SIZE = '100px';

interface IProps {
  images: string[];
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;
}

export const ProductTypeImageCarousel: React.FC<IProps> = ({ images, activeImageIndex, setActiveImageIndex }) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      <Carousel activeIndex={activeImageIndex}>
        {images.map(image => (
          <CarouselItem key={image}>
            <Magnifier
              css={css`
                display: flex !important;
                width: 100%;
                height: 100% !important;
                align-items: center;
                justify-content: center;

                .magnifying-glass {
                  border: 1px solid ${theme.primaryColor};
                }
              `}
              src={image}
              mgShape="square"
              zoomFactor={1.25}
            />
          </CarouselItem>
        ))}
      </Carousel>
      <div
        css={css`
          overflow: auto;
          display: flex;
          flex: 1 0 0;
          margin: auto;
          margin-top: 5px;
        `}
      >
        {images.map(image => {
          const currentImageIndex = images.indexOf(image);
          const isActive = currentImageIndex === activeImageIndex;
          const onImageClick = () => setActiveImageIndex(currentImageIndex);

          return (
            <div
              key={image}
              onClick={onImageClick}
              className={isActive ? 'active' : undefined}
              css={css`
                cursor: pointer;
                margin: 2.5px;
                border: 1px solid transparent;

                &.active,
                &:hover {
                  border-color: ${theme.borderColor};
                }

                &:first-child {
                  margin-left: 0;
                }

                &:last-child {
                  margin-right: 0;
                }

                height: ${CONTROL_IMAGE_SIZE};
                width: ${CONTROL_IMAGE_SIZE};
                max-height: ${MAX_CONTROL_IMAGE_SIZE};
                max-width: ${MAX_CONTROL_IMAGE_SIZE};

                @media ${mediaQueries.maxWidth768} {
                  height: ${CONTROL_IMAGE_MOBILE_SIZE};
                  width: ${CONTROL_IMAGE_MOBILE_SIZE};
                }
              `}
            >
              <img
                css={css`
                  width: 100%;
                  height: 100%;
                `}
                {...{ src: image, alt: image }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
