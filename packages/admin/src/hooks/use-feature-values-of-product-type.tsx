import { useFormState } from 'react-final-form';

import { FieldsProps } from '@eye8/admin/pages/products/create/fields';

const useFeatureValuesOfProductType = ({
  productTypes,
  featureValues,
}: Pick<FieldsProps, 'productTypes' | 'featureValues'>) => {
  const {
    values: { product_type_id: productTypeID },
  } = useFormState();

  const productType = productTypes.find(({ id }) => parseInt(productTypeID, 10) === id);

  return featureValues.filter(({ feature_type: { id: featureTypeID } }) =>
    productType ? productType.feature_types.indexOf(featureTypeID) !== -1 : false,
  );
};

export default useFeatureValuesOfProductType;
