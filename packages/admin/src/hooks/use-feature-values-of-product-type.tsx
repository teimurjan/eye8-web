import { useFormState } from 'react-final-form';

import { FeatureValue, TinyProductType } from '@eye8/api';

const useFeatureValuesOfProductType = ({
  productTypes,
  featureValues,
}: {
  productTypes: TinyProductType[];
  featureValues: FeatureValue<true>[];
}) => {
  const {
    values: { product_type_id: productTypeID },
  } = useFormState();

  const productType = productTypes.find(({ id }) => parseInt(productTypeID, 10) === id);

  return featureValues.filter(({ feature_type: { id } }) =>
    productType?.feature_types.some((featureType) => featureType.id === id),
  );
};

export default useFeatureValuesOfProductType;
