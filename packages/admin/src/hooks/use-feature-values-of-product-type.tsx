import { useFormState } from 'react-final-form';

import { FeatureValueListRawIntlResponseItem } from '@eye8/api/feature-value';
import { ProductTypeListRawIntlMinifiedResponseItem } from '@eye8/api/product-type';

const useFeatureValuesOfProductType = ({
  productTypes,
  featureValues,
}: {
  productTypes: ProductTypeListRawIntlMinifiedResponseItem[];
  featureValues: FeatureValueListRawIntlResponseItem[];
}) => {
  const {
    values: { product_type_id: productTypeID },
  } = useFormState();

  const productType = productTypes.find(({ id }) => parseInt(productTypeID, 10) === id);

  return featureValues.filter(({ feature_type: { id: featureTypeID } }) =>
    productType ? productType.feature_types.indexOf(featureTypeID) !== -1 : false,
  );
};

export default useFeatureValuesOfProductType;
