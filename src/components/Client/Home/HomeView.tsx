/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { LinkButton } from 'src/components/client-ui/Button/Button';
import { Carousel, CarouselItem } from 'src/components/client-ui/Carousel/Carousel';
import { Title } from 'src/components/client-ui/Title/Title';
import { IViewProps as IProps } from 'src/components/Client/Home/HomePresenter';
import { ProductTypesListView } from 'src/components/Client/ProductType/ProductTypesList/ProductTypesListView';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';

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

export interface IBannerButtonProps {
  banner: IProps['banners'][0];
  onMouseEnter: React.MouseEventHandler;
}

export const HomeView: React.FC<IProps> = ({ banners, productTypes }) => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: lazyIsMobile } = useLazyInitialization(isMobile, false);
  const [activeBannerIndex, setActiveBannerIndex] = React.useState(0);

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      const nextBannerIndex = activeBannerIndex < banners.length - 1 ? activeBannerIndex + 1 : 0;
      setActiveBannerIndex(nextBannerIndex);
    }, 5000);

    return () => clearInterval(intervalID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBannerIndex, banners.length]);

  return (
    <div>
      <Carousel
        css={css`
          text-align: center;
        `}
        activeIndex={activeBannerIndex}
        fullWidth
      >
        {banners.map((banner, i) => {
          return (
            <CarouselItem
              key={banner.id}
              css={css`
                width: 100%;
                overflow: hidden;
              `}
            >
              <img
                alt={banner.text}
                css={css`
                  width: 100%;
                  display: block;
                `}
                src={banner.image}
              />
              {banner.text && (
                <div
                  css={css`
                    position: absolute;
                    max-width: 33vw;
                    color: ${banner.text_color || theme.textOnPrimaryColor} !important;
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
                      size={lazyIsMobile ? 'small' : 'default'}
                      href={banner.link}
                    >
                      <b>{banner.link_text}</b>
                    </LinkButton>
                  )}
                </div>
              )}
            </CarouselItem>
          );
        })}
      </Carousel>

      <Container>
        <Title
          css={css`
            margin-top: 1rem;
          `}
          size={3}
        >
          {intl.formatMessage({ id: 'common.newest' })}
        </Title>
      </Container>

      <ProductTypesListView productTypes={productTypes} isLoading={false} />
    </div>
  );
};
