/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import uniqBy from 'lodash/uniqBy';
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
import { InstagramPost } from '@eye8/client/components/instagram-post';
import { PriceCrossedText } from '@eye8/client/components/price';
import { ProductTypeImageCarousel } from '@eye8/client/components/product-type-image-carousel';
import { ViewProps as Props } from '@eye8/client/pages/product-type/presenter';
import { LoaderLayout, Select } from '@eye8/shared/components';
import { fadeInFromLeft, fadeInFromRight, fadeInFromBottom, easeOutCubic, mediaQueries } from '@eye8/shared/styles';
import { formatMediaURL } from '@eye8/shared/utils';

const getAllFeatureValuesGroupedByType = (
  products: Props['products'],
  allFeatureTypes: Array<Props['products'][0]['feature_values'][0]['feature_type']>,
) =>
  allFeatureTypes.reduce<{ [key: string]: Props['products'][0]['feature_values'] }>(
    (acc, featureType) => ({
      ...acc,
      [featureType.id]: products.reduce(
        (acc, product) =>
          uniqBy(
            [
              ...acc,
              ...product.feature_values.filter((featureValue) => featureValue.feature_type.id === featureType.id),
            ],
            'id',
          ),
        [] as Props['products'][0]['feature_values'],
      ),
    }),
    {},
  );

export const ProductTypePageView = ({ productType, products, error, isLoading, action, actionText }: Props) => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  const allImages = products.reduce(
    (acc, product) => {
      const productImages = product.images.map((image) => ({ productId: product.id, image }));
      return [...acc, ...productImages];
    },
    [...(productType ? [{ productId: NaN, image: productType.image }] : [])],
  );

  const allFeatureTypes =
    products.length > 0 ? products[0].feature_values.map((featureValue) => featureValue.feature_type) : [];

  const allFeatureValuesGroupedByFeatureType = getAllFeatureValuesGroupedByType(products, allFeatureTypes);
  const productsKey = products
    .map((product) => product.id)
    .sort()
    .join('');
  const initialFeatureValues = React.useMemo(
    () => {
      if (products.length > 0) {
        const firstAvailableProduct = products.find((product) => product.quantity > 0);
        return (firstAvailableProduct ?? products[0]).feature_values.reduce(
          (acc, featureValue) => ({ ...acc, [featureValue.feature_type.id]: featureValue.id }),
          {},
        );
      } else {
        return {};
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productsKey],
  );
  const [chosenFeatureValues, setChosenFeatureValues] = React.useState<{ [key: string]: number }>(initialFeatureValues);

  React.useEffect(() => {
    setChosenFeatureValues(initialFeatureValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFeatureValues]);

  const matchingProduct = products.find((product) =>
    product.feature_values.every(
      (featureValue) => chosenFeatureValues[featureValue.feature_type.id] === featureValue.id,
    ),
  );

  React.useEffect(() => {
    if (matchingProduct) {
      if (matchingProduct.images[0]) {
        setActiveImageIndex(allImages.findIndex((image) => image.productId === matchingProduct.id));
      } else {
        setActiveImageIndex(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchingProduct?.id]);

  const onImageChange = React.useCallback(
    (i: number) => {
      setActiveImageIndex(i);
      if (allImages[i]) {
        const { productId } = allImages[i];
        const product = products.find(({ id }) => id === productId) ?? products[0];

        if (product) {
          const chosenFeatureValues = product.feature_values.reduce((acc, featureValue) => {
            return {
              ...acc,
              [featureValue.feature_type.id]: featureValue.id,
            };
          }, {});

          setChosenFeatureValues(chosenFeatureValues);
        } else {
          setChosenFeatureValues(initialFeatureValues);
        }
      }
    },
    [allImages, products, initialFeatureValues],
  );

  const onFeatureValueChange = React.useCallback(
    (featureTypeId: number, featureValueId?: number) => {
      setChosenFeatureValues({ ...chosenFeatureValues, [featureTypeId]: featureValueId });
    },
    [chosenFeatureValues],
  );

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
    allFeatureValuesGroupedByFeatureType[featureType.id].map((featureValue) => ({
      title: featureValue.name,
      value: featureValue.id.toString(),
    }));

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
              animation: ${fadeInFromLeft} 700ms ${easeOutCubic};

              @media ${mediaQueries.maxWidth768} {
                width: 100%;
                animation: ${fadeInFromBottom} 500ms ${easeOutCubic};
              }
            `}
          >
            <ProductTypeImageCarousel
              images={allImages}
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
              {products.length === 0 ||
                (!matchingProduct && (
                  <Subtitle size={3}>{intl.formatMessage({ id: 'ProductPage.notInStock' })}</Subtitle>
                ))}
            </div>
            {allFeatureTypes.map((featureType) => {
              const chosenFeatureValue = chosenFeatureValues[featureType.id];
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
            className="content"
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
