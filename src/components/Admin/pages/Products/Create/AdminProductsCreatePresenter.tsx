import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
import { useSelectProductTypes } from 'src/components/admin/ProductTypeSelect/useSelectProductTypes';
import { IProductService } from 'src/services/ProductService';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { ContextValue as AdminFeatureValuesStateContextValue } from 'src/state/Admin/AdminFeatureValuesState';
import { ContextValue as AdminProductsStateContextValue } from 'src/state/Admin/AdminProductsState';
import * as schemaValidator from 'src/utils/schemaValidator';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  productService: IProductService;
  productTypeService: IProductTypeService;
  history: History;
  adminProductsState: AdminProductsStateContextValue['state'];
  adminFeatureValuesState: AdminFeatureValuesStateContextValue['state'];
}

export interface IViewProps {
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
  featureValues: AdminFeatureValuesStateContextValue['state']['entities'];
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  featureValuesLoading: boolean;
}

export const AdminProductsCreatePresenter: React.FC<IProps> = ({
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

  const validator = new schemaValidator.SchemaValidator(
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

  const create: IViewProps['create'] = React.useCallback(
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
