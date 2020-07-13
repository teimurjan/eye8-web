/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { LinkButton } from 'src/components/client-ui/Button/Button';
import { InfiniteCarousel, CarouselItem, Carousel } from 'src/components/client-ui/Carousel/Carousel';
import { Image } from 'src/components/client-ui/Image/Image';
import { Title } from 'src/components/client-ui/Title/Title';
import { IViewProps as IProps } from 'src/components/Client/Home/HomePresenter';
import { ProductTypesListView } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { guessPageHref } from 'src/helpers/link';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';
import { arePropsEqual } from 'src/utils/propEquality';

const getTextPositioningCSS = (banner: IProps['banners'][0]) => {
  const horizontalRule = banner.text_left_offset
    ? { key: 'left', value: banner.text_left_offset, tranlate: -banner.text_left_offset }
    : { key: 'right', value: banner.text_right_offset, tranlate: banner.text_right_offset };
  const verticalRule = banner.text_top_offset
    ? { key: 'top', value: banner.text_top_offset, tranlate: -banner.text_top_offset }
    : { key: 'bottom', value: banner.text_bottom_offset, tranlate: banner.text_bottom_offset };
  const textAlign = (() => {
    if (!horizontalRule.value || horizontalRule.value === 50) {
      return 'center';
    }

    if (
      (horizontalRule.value > 50 && horizontalRule.key === 'left') ||
      (horizontalRule.value < 50 && horizontalRule.key === 'right')
    ) {
      return 'right';
    }

    if (
      (horizontalRule.value > 50 && horizontalRule.key === 'right') ||
      (horizontalRule.value < 50 && horizontalRule.key === 'left')
    ) {
      return 'left';
    }
  })();
  return `
    ${verticalRule.key}: ${verticalRule.value}%;
    ${horizontalRule.key}: ${horizontalRule.value}%;
    text-align: ${textAlign};
    transform: translate(${horizontalRule.tranlate}%, ${verticalRule.tranlate}%);
  `;
};

interface IBannerCarouselItemProps {
  banner: IProps['banners'][0];
  isMobile: boolean;
  dataKey?: string;
}

const BannerCarouselItem = ({ banner, isMobile, dataKey }: IBannerCarouselItemProps) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <CarouselItem
      css={css`
        width: 100%;
        overflow: hidden;
      `}
    >
      <Image alt={banner.text} src={banner.image} squared={false} />
      {banner.text && (
        <div
          data-key={dataKey}
          css={css`
            position: absolute;
            max-width: 33vw;
            color: ${banner.text_color || theme.textBrightColor} !important;
            ${getTextPositioningCSS(banner)};

            @media ${mediaQueries.maxWidth768} {
              max-width: 50vw;
            }
          `}
        >
          <div
            css={css`
              color: inherit;
              text-align: inherit;

              h1 {
                line-height: 1.35;
                font-size: 40px;
              }
              h2 {
                line-height: 1.25;
                font-size: 30px;
              }
              h3 {
                line-height: 1.15;
                font-size: 24px;
              }

              @media ${mediaQueries.maxWidth768} {
                h1 {
                  font-size: 24px;
                }
                h2 {
                  font-size: 18px;
                }
                h3 {
                  font-size: 16px;
                }
              }
            `}
            dangerouslySetInnerHTML={{ __html: banner.text }}
          ></div>
          {banner.link && banner.link_text && (
            <LinkButton
              css={css`
                margin-top: 10px;
              `}
              color="primary"
              size={isMobile ? 'small' : 'default'}
              as={banner.link}
              href={guessPageHref(banner.link)}
            >
              <b>{banner.link_text}</b>
            </LinkButton>
          )}
        </div>
      )}
    </CarouselItem>
  );
};

export interface IBannerButtonProps {
  banner: IProps['banners'][0];
  onMouseEnter: React.MouseEventHandler;
}

const HomeView = ({ banners, productTypes }: IProps) => {
  const intl = useIntl();
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: lazyIsMobile } = useLazyInitialization(isMobile, false);

  return (
    <div>
      <InfiniteCarousel
        delay={10000}
        css={css`
          text-align: center;
        `}
        controls={<Carousel.Controls />}
        fullWidth
        swipeable
      >
        {banners.map(banner => (
          <BannerCarouselItem key={banner.id} banner={banner} isMobile={lazyIsMobile} />
        ))}
      </InfiniteCarousel>

      <Container>
        <Title
          css={css`
            margin-top: 1rem;
          `}
          size={3}
          tag={1}
        >
          {intl.formatMessage({ id: 'common.newest' })}
        </Title>
      </Container>

      <ProductTypesListView productTypes={productTypes} isLoading={false} />
    </div>
  );
};

const MemoizedHomeView = React.memo<IProps>(HomeView, (prevProps, nextProps) =>
  arePropsEqual(prevProps, nextProps, {
    banners: (prev, next) => prev.map(({ id }) => id).join('') === next.map(({ id }) => id).join(''),
    productTypes: (prev, next) => prev.map(({ id }) => id).join('') === next.map(({ id }) => id).join(''),
  }),
);

export { MemoizedHomeView as HomeView };
