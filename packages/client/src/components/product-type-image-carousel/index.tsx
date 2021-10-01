import { css, useTheme } from '@emotion/react';

import { Carousel } from '@eye8/client-ui';
import { mediaQueries } from '@eye8/shared/styles';

const CONTROL_IMAGE_SIZE = '8vw';
const CONTROL_IMAGE_MOBILE_SIZE = '25vw';
const MAX_CONTROL_IMAGE_SIZE = '100px';

interface Props<T> {
  images: T[];
  getImageProps: (image: T) => { src: string; alt: string };
  activeImageIndex: number;
  onChange: (index: number) => void;
}

const ProductTypeImageCarousel = <T extends any = string>({
  images,
  activeImageIndex,
  onChange,
  getImageProps,
}: Props<T>) => {
  const theme = useTheme() as ClientUITheme;
  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      <Carousel onChange={onChange} activeIndex={activeImageIndex} controls={false}>
        {images.map((image) => {
          const { src, alt } = getImageProps(image);
          return (
            <Carousel.Item key={src}>
              <img
                css={css`
                  width: 100%;
                `}
                src={src}
                alt={alt}
              />
            </Carousel.Item>
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
        {images.map((image, index) => {
          const { src, alt } = getImageProps(image);

          const isActive = index === activeImageIndex;
          const onImageClick = () => onChange(index);

          return (
            <div
              key={src}
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

export default ProductTypeImageCarousel;
