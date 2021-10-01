
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import React from 'react';
import { useIntl } from 'react-intl';

import { Container, LinkButton, Image, Title, Carousel } from '@eye8/client-ui';
import { useLazyInitialization, useMedia } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';
import { arePropsEqual, guessPageHref } from '@eye8/shared/utils';

import { ProductTypeList } from '../../components';

import { ViewProps as Props } from './presenter';

const getTextPositioningCSS = (banner: Props['banners'][0]) => {
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

interface BannerCarouselItemProps {
  banner: Props['banners'][0];
  isMobile: boolean;
  dataKey?: string;
}

const BannerCarouselItem = ({ banner, isMobile, dataKey }: BannerCarouselItemProps) => {
  const theme = useTheme() as ClientUITheme;
  return (
    <Carousel.Item>
      <Image alt={banner.text} src={banner.image} squared={false} />
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
        {banner.text && (
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
        )}
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
    </Carousel.Item>
  );
};

export interface BannerButtonProps {
  banner: Props['banners'][0];
  onMouseEnter: React.MouseEventHandler;
}

const HomeView = ({ banners, productTypes }: Props) => {
  const intl = useIntl();
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: lazyIsMobile } = useLazyInitialization(isMobile, false);

  return (
    <div>
      <Carousel
        controls
        autoPlay
        css={css`
          text-align: center;
        `}
      >
        {banners.map((banner) => (
          <BannerCarouselItem key={banner.id} banner={banner} isMobile={lazyIsMobile} />
        ))}
      </Carousel>

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

      <ProductTypeList productTypes={productTypes} isLoading={false} />
    </div>
  );
};

const MemoizedHomeView = React.memo<Props>(HomeView, (prevProps, nextProps) =>
  arePropsEqual(prevProps, nextProps, {
    banners: (prev, next) => prev.map(({ id }) => id).join('') === next.map(({ id }) => id).join(''),
    productTypes: (prev, next) => prev.map(({ id }) => id).join('') === next.map(({ id }) => id).join(''),
  }),
);

export default MemoizedHomeView;
