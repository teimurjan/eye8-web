/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import uniqBy from 'lodash/uniqBy';
import Head from 'next/head';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Button } from 'src/components/client-ui/Button/Button';
import { ErrorLayout } from 'src/components/client-ui/ErrorLayout/ErrorLayout';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
import { Select, SelectTrigger } from 'src/components/client-ui/Select/Select';
import { Subtitle } from 'src/components/client-ui/Subtitle/Subtitle';
import { Title } from 'src/components/client-ui/Title/Title';
import { InstagramPost } from 'src/components/Client/InstagramPost/InstagramPost';
import { PriceCrossedText } from 'src/components/Client/Price/Price';
import { ProductTypeImageCarousel } from 'src/components/Client/ProductType/ProductTypeImageCarousel/ProductTypeImageCarousel';
import { IViewProps as IProps } from 'src/components/Client/ProductTypePage/ProductTypePagePresenter';
import { NotFoundView } from 'src/components/common-ui/NotFound/NotFoundView';
import { fadeInFromLeft, fadeInFromRight, fadeInFromBottom } from 'src/styles/keyframes';
import { mediaQueries } from 'src/styles/media';
import { easeOutCubic } from 'src/styles/timing-functions';
import { formatMediaURL } from 'src/utils/url';

const getAllFeatureValuesGroupedByType = (
  products: IProps['products'],
  allFeatureTypes: Array<IProps['products'][0]['feature_values'][0]['feature_type']>,
) =>
  allFeatureTypes.reduce<{ [key: string]: IProps['products'][0]['feature_values'] }>(
    (acc, featureType) => ({
      ...acc,
      [featureType.id]: products.reduce(
        (acc, product) =>
          uniqBy(
            [...acc, ...product.feature_values.filter(featureValue => featureValue.feature_type.id === featureType.id)],
            'id',
          ),
        [] as IProps['products'][0]['feature_values'],
      ),
    }),
    {},
  );

export const ProductTypePageView = ({ productType, products, error, isLoading, action, actionText }: IProps) => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();
  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  const allImages = products.reduce((acc, product) => [...acc, ...product.images], [
    ...(productType ? [productType.image] : []),
  ]);

  const allFeatureTypes =
    products.length > 0 ? products[0].feature_values.map(featureValue => featureValue.feature_type) : [];

  const allFeatureValuesGroupedByFeatureType = getAllFeatureValuesGroupedByType(products, allFeatureTypes);
  const initialFeatureValues = React.useMemo(
    () =>
      Object.keys(allFeatureValuesGroupedByFeatureType).reduce((acc, featureTypeId) => {
        const featueValues = allFeatureValuesGroupedByFeatureType[featureTypeId];
        return { ...acc, [featureTypeId]: featueValues.length > 0 ? featueValues[0].id : undefined };
      }, {}),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.keys(allFeatureValuesGroupedByFeatureType), productType?.id],
  );
  const [chosenFeatureValues, setChosenFeatureValues] = React.useState<{ [key: string]: number }>(initialFeatureValues);

  React.useEffect(() => {
    setChosenFeatureValues(initialFeatureValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFeatureValues]);

  const matchingProduct = products.find(product =>
    product.feature_values.every(featureValue => chosenFeatureValues[featureValue.feature_type.id] === featureValue.id),
  );

  React.useEffect(() => {
    if (matchingProduct) {
      if (matchingProduct.images[0]) {
        setActiveImageIndex(allImages.indexOf(matchingProduct.images[0]));
      } else {
        setActiveImageIndex(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchingProduct?.id]);

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

  const getOptions = (featureType: IProps['products'][0]['feature_values'][0]['feature_type']) =>
    allFeatureValuesGroupedByFeatureType[featureType.id].map(featureValue => ({
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
          {matchingProduct && <meta property="product:price:amount" content={matchingProduct.price.toString()} />}
          {matchingProduct && <meta property="product:price:currency" content="USD" />}
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
              images={allImages.map(formatMediaURL)}
              activeImageIndex={activeImageIndex}
              setActiveImageIndex={setActiveImageIndex}
            />
          </div>
          <div
            css={css`
              display: flex;
              padding: 0 0 7.5px 50px;
              flex-direction: column;
              flex: 1;
              animation: ${fadeInFromRight} 700ms ${easeOutCubic};
              position: relative;

              @media ${mediaQueries.maxWidth768} {
                padding: 25px 0 0 0;
                animation: ${fadeInFromBottom} 700ms ${easeOutCubic};
                width: 100%;
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
            {allFeatureTypes.map(featureType => {
              const chosenFeatureValue = chosenFeatureValues[featureType.id];
              return (
                <Select
                  TriggerComponent={SelectTrigger}
                  css={css`
                    margin-bottom: 20px;
                  `}
                  key={featureType.id}
                  value={chosenFeatureValue ? chosenFeatureValue.toString() : undefined}
                  onChange={value => onFeatureValueChange(featureType.id, value ? parseInt(value, 10) : undefined)}
                  placeholder={featureType.name}
                >
                  {getOptions(featureType).map(option => (
                    <Select.Option key={option.value} value={option.value}>
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

                  @media ${mediaQueries.maxWidth768}, ${mediaQueries.maxWidth1024} {
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
            <Anchor
              css={css`
                margin-top: 20px;
              `}
              primary
              href="/categories/[id]/products"
              asPath={`/categories/${productType.category.slug}/products`}
            >
              &gt;{' '}
              {intl.formatMessage({ id: 'ProductTypePage.findMoreForCategory' }, { value: productType.category.name })}
            </Anchor>
            <Anchor primary href="/how-it-works">
              &gt; {intl.formatMessage({ id: 'HowItWorks.help' })}
            </Anchor>
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
              {intl.formatMessage({ id: 'ProductTypePageView.instagram' })}
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
                  wide={productType.instagram_links.length === 1}
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
    <NotFoundView />
  );
};
