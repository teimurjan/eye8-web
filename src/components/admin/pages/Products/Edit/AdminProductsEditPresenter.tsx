import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
import { useSelectProductTypes } from 'src/components/admin/form/ProductTypeSelect/useSelectProductTypes';
import { useAdminProductsFilters } from 'src/components/admin/pages/Products/useAdminProductFilters';
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
  productId: number;
  adminProductsState: AdminProductsStateContextValue['state'];
  adminFeatureValuesState: AdminFeatureValuesStateContextValue['state'];
  close: () => void;
}

interface IFormValues {
  quantity: string;
  discount: string;
  price: string;
  feature_values: string[];
  product_type_id: string;
  images: Array<string | File>;
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: IFormValues) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  featureValues: AdminFeatureValuesStateContextValue['state']['entities'];
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
  initialValues?: IFormValues;
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  featureValuesLoading: boolean;
}

export const AdminProductsEditPresenter: React.FC<IProps> = ({
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
  const [product, setProduct] = React.useState<IProductListResponseItem | undefined>(undefined);
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

  const edit: IViewProps['edit'] = React.useCallback(
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
