import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { useAdminProductsFilters, useSelectProductTypes } from '@eye8/admin/hooks';
import { ProductListResponseItem } from '@eye8/api/product';
import { ProductTypeListRawIntlMinifiedResponseItem } from '@eye8/api/product-type';
import { ProductService } from '@eye8/service/product';
import { ProductTypeService } from '@eye8/service/product-type';
import { SchemaValidator } from '@eye8/shared/utils';

import { AdminProductsState, AdminFeatureValuesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  productService: ProductService;
  productTypeService: ProductTypeService;
  history: History;
  productId: number;
  adminProductsState: AdminProductsState;
  adminFeatureValuesState: AdminFeatureValuesState;
  close: () => void;
}

interface FormValues {
  quantity: string;
  discount: string;
  price: string;
  feature_values: string[];
  product_type_id: string;
  images: Array<string | File>;
}

export interface ViewProps {
  isOpen: boolean;
  edit: (values: FormValues) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  featureValues: AdminFeatureValuesState['entities'];
  productTypes: ProductTypeListRawIntlMinifiedResponseItem[];
  initialValues?: FormValues;
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  featureValuesLoading: boolean;
}

export const AdminProductsEditPresenter: React.FC<Props> = ({
  productId,
  adminFeatureValuesState: {
    get: getFeatureValues,
    entities: featureValues,
    isListLoading: featureValuesLoading,
    hasListLoaded: isDataLoaded,
  },
  adminProductsState: { set: setProductToState },
  productService,
  productTypeService,
  View,
  close,
}) => {
  const [product, setProduct] = React.useState<ProductListResponseItem | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const {
    productTypes,
    isLoading: productTypesLoading,
    error: productTypesError,
    loadMore: LoadMoreProductTypes,
  } = useSelectProductTypes({
    productTypeService,
    mandatoryProductTypeId: product?.product_type.id,
  });
  const {
    filters: { deleted },
  } = useAdminProductsFilters();

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
    (async () => {
      try {
        setLoading(true);
        const product = await productService.getOne(productId, { deleted });
        if (product) {
          setProduct(product);
          if (!isDataLoaded) {
            getFeatureValues();
          }
        } else {
          setPreloadingError('AdminProducts.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const edit: ViewProps['edit'] = React.useCallback(
    async (values) => {
      setUpdating(true);

      const formattedValues = {
        ...values,
        product_type_id: parseInt(values.product_type_id, 10),
        quantity: parseInt(values.quantity, 10),
        discount: parseInt(values.discount, 10),
        price: parseInt(values.price, 10),
        feature_values: values.feature_values.map((id) => parseInt(id, 10)),
      };

      try {
        const product = await productService.edit(productId, formattedValues);
        setProductToState(product);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [close, setProductToState, productId, productService],
  );

  return (
    <View
      productTypesLoading={productTypesLoading}
      featureValuesLoading={featureValuesLoading}
      LoadMoreProductTypes={LoadMoreProductTypes}
      productTypes={productTypes}
      featureValues={featureValues}
      isOpen={true}
      edit={edit}
      error={error ? error : productTypesError}
      isLoading={isLoading}
      isUpdating={isUpdating}
      close={close}
      validate={validator.validate}
      preloadingError={preloadingError}
      initialValues={
        product
          ? {
              quantity: product.quantity.toString(),
              discount: product.discount.toString(),
              price: product.price.toString(),
              feature_values: product.feature_values.map((id) => id.toString()),
              product_type_id: product.product_type.id.toString(),
              images: product.images,
            }
          : undefined
      }
    />
  );
};
