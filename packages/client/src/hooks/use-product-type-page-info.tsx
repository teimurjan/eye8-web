import uniqBy from 'lodash/uniqBy';
import React from 'react';

import { Product, ProductType } from '@eye8/api';

interface Image {
  image: string;
  productId: number;
}

const getImages = (productType: ProductType | null, products: Product[]): Image[] =>
  products.reduce(
    (acc, product) => {
      const productImages = product.images.map((image) => ({ productId: product.id, image }));
      return [...acc, ...productImages];
    },
    [...(productType ? [{ productId: NaN, image: productType.image }] : [])],
  );

const getFeatures = (products: Product[]) => {
  const featureValues = products.flatMap((product) => product.feature_values);
  const featureTypes = products.flatMap((product) =>
    product.feature_values.flatMap((featureValue) => featureValue.feature_type),
  );

  return featureTypes.reduce(
    (acc, featureType) => ({
      ...acc,
      [featureType.id]: uniqBy(
        featureValues.filter((featureValue) => featureValue.feature_type.id === featureType.id),
        'id',
      ),
    }),
    {} as { [key: string]: Product['feature_values'] },
  );
};

const getProductFeatures = (product: Product) =>
  product.feature_values.reduce(
    (acc, featureValue) => ({
      ...acc,
      [featureValue.feature_type.id]: featureValue.id,
    }),
    {} as { [key: string]: number },
  );

const getInitiallySelectedFeatures = (products: Product[]) => {
  if (products.length > 0) {
    return getProductFeatures(products[0]);
  }

  return {};
};

const getImageIndex = (matchingProduct: Product | undefined, images: Image[]) =>
  matchingProduct ? images.findIndex(({ productId }) => matchingProduct.id === productId) : 0;

const getMatchingProduct = (products: Product[], selectedFeatures: { [key: string]: number }) =>
  products.find((product) => {
    return Object.keys(selectedFeatures).every((featureTypeId) => {
      const featureValueId = selectedFeatures[featureTypeId];
      return product.feature_values.some(({ id }) => id === featureValueId);
    });
  });

const useProductTypePageInfo = (productType: ProductType | null, products: Product[]) => {
  const images = getImages(productType, products);
  const features = getFeatures(products);
  const [selectedFeatures, setSelectedFeatures] = React.useState(getInitiallySelectedFeatures(products));
  const matchingProduct = getMatchingProduct(products, selectedFeatures);
  const [activeImageIndex, setActiveImageIndex] = React.useState(getImageIndex(matchingProduct, images));

  React.useEffect(() => {
    setActiveImageIndex(getImageIndex(matchingProduct, images));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchingProduct]);

  const onImageChange = React.useCallback(
    (index: number) => {
      const { productId } = images[index];
      const product = products.find(({ id }) => id === productId);

      if (product && product.id !== matchingProduct?.id) {
        setSelectedFeatures(getProductFeatures(product));
        return;
      }

      setActiveImageIndex(index);
    },
    [products, images, matchingProduct],
  );

  const onFeatureValueChange = React.useCallback(
    (featureTypeId: number, featureValueId?: number) => {
      setSelectedFeatures({ ...selectedFeatures, [featureTypeId]: featureValueId });
    },
    [selectedFeatures],
  );

  return {
    selectedFeatures,
    images,
    features,
    activeImageIndex,
    matchingProduct,
    onImageChange,
    onFeatureValueChange,
  };
};

export default useProductTypePageInfo;
