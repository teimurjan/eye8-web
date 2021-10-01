import { css, useTheme } from '@emotion/react';
import Head from 'next/head';
import React from 'react';
import { useIntl } from 'react-intl';

import {
  Container,
  Anchor,
  Button,
  ErrorLayout,
  LinkPassingProps,
  NotFound,
  SelectTrigger,
  Subtitle,
  Tag,
  Title,
} from '@eye8/client-ui';
import { LoaderLayout, Select } from '@eye8/shared/components';
import { fadeInFromLeft, fadeInFromRight, fadeInFromBottom, easeOutCubic, mediaQueries } from '@eye8/shared/styles';
import { formatMediaURL } from '@eye8/shared/utils';

import { ProductTypeImageCarousel, PriceCrossedText, InstagramPost } from '../../components';
import { useProductTypePageInfo } from '../../hooks';

import { ViewProps as Props } from './presenter';

const ProductTypePageView = ({ productType, products, error, isLoading, action, actionText }: Props) => {
  const intl = useIntl();
  const theme = useTheme() as ClientUITheme;

  const { images, features, activeImageIndex, matchingProduct, onImageChange, onFeatureValueChange, selectedFeatures } =
    useProductTypePageInfo(productType, products);

  const onActionClick = React.useCallback(() => {
    if (matchingProduct && action) {
      action(matchingProduct);
    }
  }, [action, matchingProduct]);

  if (isLoading) {
    return <LoaderLayout />;
  }

  if (error) {
    return <ErrorLayout>{intl.formatMessage({ id: error })}</ErrorLayout>;
  }

  const getOptions = (featureType: Props['products'][0]['feature_values'][0]['feature_type']) =>
    features[featureType.id]?.map((featureValue) => ({
      title: featureValue.name,
      value: featureValue.id.toString(),
    })) ?? [];

  return productType ? (
    <div
      css={css`
        margin-top: 20px;
      `}
    >
      <Container>
        <Head>
          <title>{productType.name}</title>
          <meta name="description" content={productType.short_description} />
          <meta property="og:title" content={productType.name} />
          <meta property="og:description" content={productType.short_description} />
          <meta property="og:type" content="og:product" />
          <meta property="product:condition" content="new" />
          {matchingProduct && <meta property="product:price:amount" content={matchingProduct.price.toString()} />}
          {matchingProduct && <meta property="product:price:currency" content="USD" />}
          {matchingProduct && (
            <meta property="product:availability" content={matchingProduct.quantity > 0 ? 'instock' : 'oos'}></meta>
          )}
          <meta property="og:image" content={productType.image} />
          <meta name="twitter:title" content={productType.name} />
          <meta name="twitter:description" content={productType.short_description} />
          <meta name="twitter:image:src" content={productType.image} />
        </Head>
        <div
          css={css`
            align-items: center;
            margin-bottom: 1.5rem;
            display: flex;

            @media ${mediaQueries.maxWidth768} {
              flex-direction: column;
            }
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: flex-start;
              flex: 0 0 40%;
              overflow: hidden;
              animation: ${fadeInFromLeft} 700ms ${easeOutCubic};

              @media ${mediaQueries.maxWidth768} {
                width: 100%;
                animation: ${fadeInFromBottom} 500ms ${easeOutCubic};
              }
            `}
          >
            <ProductTypeImageCarousel
              images={images}
              getImageProps={(image) => ({ src: formatMediaURL(image.image), alt: image.productId.toString() })}
              activeImageIndex={activeImageIndex}
              onChange={onImageChange}
            />
          </div>
          <div
            css={css`
              display: flex;
              padding: 0 0 7.5px 50px;
              margin-top: -100px;
              flex-direction: column;
              flex: 1;
              animation: ${fadeInFromRight} 700ms ${easeOutCubic};
              position: relative;

              @media ${mediaQueries.maxWidth768} {
                padding: 25px 0 0 0;
                animation: ${fadeInFromBottom} 700ms ${easeOutCubic};
                width: 100%;
                margin-top: 0;
              }
            `}
          >
            <div
              css={css`
                display: flex;
                justify-content: space-between;
                margin-bottom: 15px;
              `}
            >
              <Title
                css={css`
                  flex: 0 0 60%;
                `}
                size={3}
                tag={1}
              >
                {productType.name}
              </Title>
              {matchingProduct && matchingProduct.quantity > 0 && (
                <Subtitle
                  css={css`
                    color: ${theme.textColor};

                    del {
                      color: ${theme.textSecondaryColor};
                      font-size: 18px;
                    }
                  `}
                  size={3}
                >
                  <PriceCrossedText price={matchingProduct.price} discount={matchingProduct.discount} />
                </Subtitle>
              )}
              {matchingProduct && matchingProduct.quantity === 0 && (
                <Subtitle size={3}>{intl.formatMessage({ id: 'ProductPage.sold' })}</Subtitle>
              )}
              {(!matchingProduct || products.length === 0) && (
                <Subtitle size={3}>{intl.formatMessage({ id: 'ProductPage.notInStock' })}</Subtitle>
              )}
            </div>
            {productType.feature_types.map((featureType) => {
              const chosenFeatureValue = selectedFeatures[featureType.id];
              return (
                <Select
                  TriggerComponent={SelectTrigger}
                  css={css`
                    margin-bottom: 20px;
                  `}
                  key={featureType.id}
                  value={chosenFeatureValue ? chosenFeatureValue.toString() : undefined}
                  onChange={(value) => {
                    onFeatureValueChange(featureType.id, value ? parseInt(value as string, 10) : undefined);
                  }}
                  placeholder={featureType.name}
                >
                  {getOptions(featureType).map((option) => (
                    <Select.Option key={option.value} value={option.value} name={option.title}>
                      {option.title}
                    </Select.Option>
                  ))}
                </Select>
              );
            })}
            {productType.short_description && (
              <Subtitle
                css={css`
                  width: 100%;
                  margin-top: 10px;
                `}
                size={5}
                tag={2}
              >
                {productType.short_description}
              </Subtitle>
            )}
            {matchingProduct && matchingProduct.quantity > 0 && (
              <Button
                color="dark"
                onClick={onActionClick}
                css={css`
                  position: absolute;
                  right: 0;
                  top: 50px;

                  @media ${mediaQueries.maxWidth768}, ${mediaQueries.maxWidth1440} {
                    position: static;
                    margin-top: 20px;
                  }

                  @media ${mediaQueries.maxWidth768} {
                    width: 100%;
                  }
                `}
              >
                {actionText}
              </Button>
            )}
            {productType.categories.length && (
              <div
                css={css`
                  margin-top: 20px;
                `}
              >
                <span
                  css={css`
                    margin-right: 10px;
                    font-weight: bold;
                    color: ${theme.textColor};
                  `}
                >
                  {intl.formatMessage({ id: 'ProductTypePage.findMoreForCategory' })}
                </span>
                {productType.categories.map((category) => (
                  <LinkPassingProps
                    key={category.id}
                    href="/categories/[slug]/products"
                    as={`/categories/${category.slug}/products`}
                  >
                    <Tag
                      css={css`
                        margin-right: 10px;
                      `}
                      color="default"
                    >
                      {category.name}
                    </Tag>
                  </LinkPassingProps>
                ))}
              </div>
            )}
            <div>
              <Anchor href="/how-it-works" weight={Anchor.Weight.Bold} underline>
                {intl.formatMessage({ id: 'HowItWorks.help' })}
              </Anchor>
            </div>
          </div>
        </div>
      </Container>
      <div
        css={css`
          background-color: ${theme.backgroundSecondaryColor};
          padding: 30px 0;
          border-top: 1px solid ${theme.borderColor};
          border-bottom: 1px solid ${theme.borderColor};
        `}
      >
        <Container>
          <div
            css={css`
              animation: ${fadeInFromBottom} 700ms ${easeOutCubic};
              color: ${theme.textColor};

              table {
                background-color: ${theme.backgroundSecondaryColor};

                th,
                td {
                  color: ${theme.textColor};
                }
              }

              strong {
                color: ${theme.textColor};
              }
            `}
            dangerouslySetInnerHTML={{ __html: productType.description }}
          />
        </Container>
      </div>
      {productType.instagram_links.length > 0 && (
        <div
          css={css`
            margin-top: 20px;
          `}
        >
          <Container>
            <Title
              css={css`
                padding-bottom: 20px;
              `}
              size={3}
            >
              {intl.formatMessage({ id: 'ProductTypePage.instagram' })}
            </Title>
            <div
              css={css`
                display: flex;
                width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
                position: relative;
              `}
            >
              {productType.instagram_links.map(({ id, link }) => (
                <InstagramPost
                  key={id}
                  css={css`
                    margin-right: 20px;

                    &:last-child {
                      margin-right: 0;
                    }
                  `}
                  size={productType.instagram_links.length === 1 ? InstagramPost.Size.Wide : undefined}
                  id={id}
                  url={link}
                />
              ))}
            </div>
          </Container>
        </div>
      )}
    </div>
  ) : (
    <NotFound />
  );
};

export default ProductTypePageView;
