import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { useSelectProductTypes } from '@eye8/admin/hooks';
import { TinyProductType } from '@eye8/api';
import { ProductService } from '@eye8/service';
import { ProductTypeService } from '@eye8/service';
import { SchemaValidator } from '@eye8/shared/utils';

import { AdminProductsState, AdminFeatureValuesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  productService: ProductService;
  productTypeService: ProductTypeService;
  history: History;
  adminProductsState: AdminProductsState;
  adminFeatureValuesState: AdminFeatureValuesState;
}

export interface ViewProps {
  isOpen: boolean;
  create: (values: {
    quantity: string;
    discount: string;
    price: string;
    feature_values: string[];
    product_type_id: string;
    images?: Array<string | File>;
  }) => void;
  isCreating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  featureValues: AdminFeatureValuesState['entities'];
  productTypes: TinyProductType<true>[];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  featureValuesLoading: boolean;
}

const AdminProductsCreatePresenter: React.FC<Props> = ({
  history,
  adminFeatureValuesState: {
    get: getFeatureValues,
    entities: featureValues,
    isListLoading: featureValuesLoading,
    hasListLoaded: isDataLoaded,
  },
  adminProductsState: { get: getProducts },
  productService,
  productTypeService,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const {
    productTypes,
    isLoading: productTypesLoading,
    error: productTypesError,
    loadMore: LoadMoreProductTypes,
  } = useSelectProductTypes({
    productTypeService,
  });

  const validator = new SchemaValidator(
    yup.object().shape({
      quantity: yup.number().required('common.errors.field.empty'),
      discount: yup.number().required('common.errors.field.empty'),
      price: yup.number().required('common.errors.field.empty'),
      product_type_id: yup.number().required('common.errors.field.empty'),
      feature_values: yup
        .array()
        .of(yup.number())
        .test('allFeatureValuesChosen', 'AdminProducts.errors.noFeatureValues', function (value) {
          if (!this.parent.product_type_id) {
            return true;
          }

          const chosenProductType = productTypes.find(({ id }) => this.parent.product_type_id === id);
          return chosenProductType ? chosenProductType.feature_types.length === (value || []).length : false;
        }),
      images: yup.array().of(yup.mixed()),
    }),
  );

  React.useEffect(() => {
    if (isDataLoaded) {
      return;
    }

    (async () => {
      try {
        await getFeatureValues();
      } catch (e) {
        setPreloadingError('errors.common');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/products'), [history]);

  const create: ViewProps['create'] = React.useCallback(
    async (values) => {
      setCreating(true);

      const formattedValues = {
        ...values,
        product_type_id: parseInt(values.product_type_id, 10),
        quantity: parseInt(values.quantity, 10),
        discount: parseInt(values.discount, 10),
        price: parseInt(values.price, 10),
        feature_values: values.feature_values.map((id) => parseInt(id, 10)),
      };

      try {
        await productService.create(formattedValues);
        getProducts();
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [close, getProducts, productService],
  );

  return (
    <View
      productTypesLoading={productTypesLoading}
      LoadMoreProductTypes={LoadMoreProductTypes}
      featureValues={featureValues}
      productTypes={productTypes}
      isOpen={true}
      create={create}
      error={error ? error : productTypesError}
      featureValuesLoading={featureValuesLoading}
      isCreating={isCreating}
      close={close}
      validate={validator.validate}
      preloadingError={preloadingError}
    />
  );
};

export default AdminProductsCreatePresenter;
