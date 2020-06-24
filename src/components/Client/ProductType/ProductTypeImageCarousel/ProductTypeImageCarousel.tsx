/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { Carousel, CarouselItem } from 'src/components/client-ui/Carousel/Carousel';
import { mediaQueries } from 'src/styles/media';

const CONTROL_IMAGE_SIZE = '8vw';
const CONTROL_IMAGE_MOBILE_SIZE = '25vw';
const MAX_CONTROL_IMAGE_SIZE = '150px';

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
            <img
              css={css`
                margin: auto;
                display: flex;
                height: 30vw;
                width: 30vw;

                @media ${mediaQueries.maxWidth768} {
                  width: 100%;
                  height: 100%;
                }
              `}
              {...{ src: image, alt: image }}
            />
          </CarouselItem>
        ))}
      </Carousel>
      <div
        css={css`
          height: ${CONTROL_IMAGE_SIZE};
          max-height: ${MAX_CONTROL_IMAGE_SIZE};
          overflow: auto;
          display: flex;
          width: 30vw;
          margin: auto;

          @media ${mediaQueries.maxWidth768} {
            height: ${CONTROL_IMAGE_MOBILE_SIZE};
            width: 100%;
          }
        `}
      >
        {images.map(image => {
          const currentImageIndex = images.indexOf(image);
          const isActive = currentImageIndex === activeImageIndex;
          const onImageClick = () => setActiveImageIndex(currentImageIndex);

          return (
            <img
              key={image}
              onClick={onImageClick}
              css={css`
                cursor: pointer;
                height: ${CONTROL_IMAGE_SIZE};
                width: ${CONTROL_IMAGE_SIZE};
                max-height: ${MAX_CONTROL_IMAGE_SIZE};
                max-width: ${MAX_CONTROL_IMAGE_SIZE};
                border: ${isActive ? `5px solid ${theme.primaryColor}` : 'unset'};
                display: flex;

                @media ${mediaQueries.maxWidth768} {
                  height: ${CONTROL_IMAGE_MOBILE_SIZE};
                  width: ${CONTROL_IMAGE_MOBILE_SIZE};
                }
              `}
              {...{ src: image, alt: image }}
            />
          );
        })}
      </div>
    </div>
  );
};
