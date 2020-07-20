/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';

import { Carousel, CarouselItem } from 'src/components/client-ui/Carousel/Carousel';
import { mediaQueries } from 'src/styles/media';

const CONTROL_IMAGE_SIZE = '8vw';
const CONTROL_IMAGE_MOBILE_SIZE = '25vw';
const MAX_CONTROL_IMAGE_SIZE = '100px';

interface IProps<T> {
  images: T[];
  getImageProps: (image: T) => { src: string; alt: string };
  activeImageIndex: number;
  onChange: (index: number) => void;
}

export const ProductTypeImageCarousel = <T extends any = string>({
  images,
  activeImageIndex,
  onChange,
  getImageProps,
}: IProps<T>) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      <Carousel activeIndex={activeImageIndex}>
        {images.map(image => {
          const { src, alt } = getImageProps(image);
          return (
            <CarouselItem key={src}>
              <div
                css={css`
                  display: flex !important;
                  align-items: center;
                  justify-content: center;
                  width: 100%;
                  height: 100%;

                  img {
                    width: 100%;
                    height: 100%;
                  }
                `}
              >
                <img src={src} alt={alt} />
              </div>
            </CarouselItem>
          );
        })}
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
          const { src, alt } = getImageProps(image);

          const currentImageIndex = images.indexOf(image);
          const isActive = currentImageIndex === activeImageIndex;
          const onImageClick = () => onChange(currentImageIndex);

          return (
            <div
              key={src}
              onClick={onImageClick}
              className={isActive ? 'active' : undefined}
              css={css`
                cursor: pointer;
                margin: 2.5px;
                border: 5px solid transparent;

                &.active,
                &:hover {
                  border-color: ${theme.primaryColor};
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
                src={src}
                alt={alt}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
