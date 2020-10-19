import { useFormState } from 'react-final-form';

import { IFieldsProps } from 'src/components/admin/pages/Products/Create/Fields';

export const useFeatureValuesOfProductType = ({
  productTypes,
  featureValues,
}: Pick<IFieldsProps, 'productTypes' | 'featureValues'>) => {
  const {
    values: { product_type_id: productTypeID },
  } = useFormState();

  const productType = productTypes.find(({ id }) => parseInt(productTypeID, 10) === id);

  return featureValues.filter(({ feature_type: { id: featureTypeID } }) =>
    productType ? productType.feature_types.indexOf(featureTypeID) !== -1 : false,
  );
};
