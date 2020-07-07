import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
import { useSelectProductTypes } from 'src/components/Admin/ProductTypeSelect/useSelectProductTypes';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useDebounce } from 'src/hooks/useDebounce';
import { IProductService } from 'src/services/ProductService';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { IContextValue as AdminFeatureValuesStateContextValue } from 'src/state/AdminFeatureValuesState';
import { IContextValue as AdminProductsStateContextValue } from 'src/state/AdminProductsState';

export interface IProps extends AdminFeatureValuesStateContextValue, AdminProductsStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  productService: IProductService;
  productTypeService: IProductTypeService;
  history: History;
  productId: number;
}

interface IFormValues {
  quantity: string;
  discount: string;
  price: string;
  upc?: string;
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
  featureValues: AdminFeatureValuesStateContextValue['adminFeatureValuesState']['featureValues'];
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
  initialValues?: IFormValues;
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  featureValuesLoading: boolean;
}

export const AdminProductsEditPresenter: React.FC<IProps> = ({
  productId,
  history,
  adminFeatureValuesState: { getFeatureValues, featureValues, isListLoading: featureValuesLoading },
  adminProductsState: { getProducts },
  productService,
  productTypeService,
  View,
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

  const isLoadingDebounced = useDebounce(isLoading, 500);

  const validator = new schemaValidator.SchemaValidator(
    yup.object().shape({
      quantity: yup.number().required('common.errors.field.empty'),
      discount: yup.number().required('common.errors.field.empty'),
      price: yup.number().required('common.errors.field.empty'),
      upc: yup.string().nullable(true),
      product_type_id: yup.number().required('common.errors.field.empty'),
      feature_values: yup
        .array()
        .of(yup.number())
        .test('allFeatureValuesChosen', 'AdminProducts.errors.noFeatureValues', function(value) {
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
        await getFeatureValues();
        const product = await productService.getOne(productId);
        if (product) {
          setProduct(product);
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

  const close = React.useCallback(() => history.push('/admin/products'), [history]);

  const edit: IViewProps['edit'] = React.useCallback(
    async values => {
      setUpdating(true);

      const formattedValues = {
        ...values,
        product_type_id: parseInt(values.product_type_id, 10),
        quantity: parseInt(values.quantity, 10),
        discount: parseInt(values.discount, 10),
        price: parseInt(values.price, 10),
        feature_values: values.feature_values.map(id => parseInt(id, 10)),
      };

      try {
        await productService.edit(productId, formattedValues);
        getProducts();
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [close, getProducts, productId, productService],
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
      isLoading={isLoadingDebounced}
      isUpdating={isUpdating}
      close={close}
      validate={(validator || { validate: undefined }).validate}
      preloadingError={preloadingError}
      initialValues={
        product
          ? {
              quantity: product.quantity.toString(),
              discount: product.discount.toString(),
              price: product.price.toString(),
              upc: product.upc,
              feature_values: product.feature_values.map(id => id.toString()),
              product_type_id: product.product_type.id.toString(),
              images: product.images,
            }
          : undefined
      }
    />
  );
};
