import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from '@eye8/admin/components/intl-field';
import { Link } from '@eye8/admin/components/links-input';
import { useAdminProductTypesFilters } from '@eye8/admin/hooks/use-admin-product-types-filters';
import {
  PRODUCT_TYPE_NAME_FIELD_KEY,
  PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
  PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
} from '@eye8/admin/pages/product-types/create/presenter';
import { ContextValue as AdminCategoriesStateContextValue } from '@eye8/admin/state/categories';
import { ContextValue as AdminCharacteristicValuesStateContextValue } from '@eye8/admin/state/characteristic-values';
import { ContextValue as AdminFeatureTypesStateContextValue } from '@eye8/admin/state/feature-types';
import { ContextValue as AdminProductTypesStateContextValue } from '@eye8/admin/state/product-types';
import { ProductTypeDetailRawIntlResponseItem } from '@eye8/api/product-type';
import { ProductTypeService } from '@eye8/service/product-type';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: ProductTypeService;
  history: History;
  productTypeId: number;
  adminCategoriesState: AdminCategoriesStateContextValue['state'];
  adminFeatureTypesState: AdminFeatureTypesStateContextValue['state'];
  adminProductTypesState: AdminProductTypesStateContextValue['state'];
  adminCharacteristicValuesState: AdminCharacteristicValuesStateContextValue['state'];
}

interface FormValues {
  names: { [key: string]: string };
  descriptions: { [key: string]: string };
  short_descriptions: { [key: string]: string };
  instagram_links: Link[];
  feature_types: string[];
  characteristic_values: string[];
  categories?: string[];
  image: string;
}

export interface ViewProps {
  isOpen: boolean;
  edit: (values: FormValues) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: FormValues) => object | Promise<object>;
  categories: AdminCategoriesStateContextValue['state']['entities'];
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
  characteristicValues: AdminCharacteristicValuesStateContextValue['state']['entities'];
  initialValues: Partial<FormValues>;
}

export const CATEGORY_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(PRODUCT_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
        [getFieldName(PRODUCT_TYPE_DESCRIPTION_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
        [getFieldName(PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY, locale)]: yup
          .string()
          .required('common.errors.field.empty'),
      }),
      {
        instagram_links: yup
          .array()
          .test('areLinksValid', 'AdminProductTypes.errors.invalidInstagramLinks', (value: Link[] = []) => {
            return value.every((link) => link.value.match(/(https?:\/\/(?:www\.)?instagram\.com\/p\/([^/?#&]+)).*/));
          }),
        categories: yup
          .array()
          .of(yup.number())
          .required('AdminProductTypes.errors.noCategories')
          .min(1, 'AdminProductTypes.errors.noCategories'),
        feature_types: yup
          .array()
          .of(yup.number())
          .required('AdminProductTypes.errors.noFeatureTypes')
          .min(1, 'AdminProductTypes.errors.noFeatureTypes'),
        characteristic_values: yup.array().of(yup.number()),
        image: yup.mixed().required('common.errors.field.empty'),
      },
    ),
  ),
);

export const AdminProductTypesEditPresenter: React.FC<Props> = ({
  history,
  adminCategoriesState: {
    get: getCategories,
    entities: categories,
    isListLoading: categoriesLoading,
    hasListLoaded: hasCategoriesLoaded,
  },
  adminFeatureTypesState: {
    get: getFeatureTypes,
    entities: featureTypes,
    isListLoading: featureTypesLoading,
    hasListLoaded: hasFeatureTypesLoaded,
  },
  adminCharacteristicValuesState: {
    get: getCharacteristicValues,
    entities: characteristicValues,
    isListLoading: characteristicValuesLoading,
    hasListLoaded: hasCharacteristicValuesLoaded,
  },
  adminProductTypesState: { set: setProductTypeToState },
  service,
  View,
  productTypeId,
}) => {
  const {
    filters: { deleted },
  } = useAdminProductTypesFilters();
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [productType, setProductType] = React.useState<ProductTypeDetailRawIntlResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isLoading_ = isLoading || categoriesLoading || featureTypesLoading || characteristicValuesLoading;

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const productType = await service.getOneRawIntl(productTypeId, { deleted });
        if (productType) {
          const promises = [];
          if (!hasCategoriesLoaded) {
            promises.push(getCategories());
          }
          if (!hasFeatureTypesLoaded) {
            promises.push(getFeatureTypes());
          }
          if (!hasCharacteristicValuesLoaded) {
            promises.push(getCharacteristicValues());
          }

          Promise.all(promises);

          setProductType(productType);
        } else {
          setPreloadingError('AdminProductTypes.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/productTypes'), [history]);

  const edit: ViewProps['edit'] = React.useCallback(
    async (values) => {
      setUpdating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (
            [
              PRODUCT_TYPE_NAME_FIELD_KEY,
              PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
              PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
            ].indexOf(key) !== -1
          ) {
            const pluralKeys = `${key}s`;
            return { ...acc, [pluralKeys]: { ...acc[pluralKeys], [locale]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
          descriptions: {},
          short_descriptions: {},
          instagram_links: values.instagram_links.map((link) => link.value),
          categories: values.categories ? values.categories.map((category) => parseInt(category, 10)) : [],
          feature_types: values.feature_types.map((id) => parseInt(id, 10)),
          characteristic_values: values.characteristic_values.map((id) => parseInt(id, 10)),
          image: values.image,
        },
      );

      try {
        const productType = await service.edit(productTypeId, formattedValues);
        setProductTypeToState(productType);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [setProductTypeToState, productTypeId, close, service],
  );

  const initialValues = React.useMemo(() => {
    if (productType) {
      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(PRODUCT_TYPE_NAME_FIELD_KEY, locale)]: productType.name[locale],
            [getFieldName(PRODUCT_TYPE_DESCRIPTION_FIELD_KEY, locale)]: productType.description[locale],
            [getFieldName(PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY, locale)]: productType.short_description[locale],
          }),
          {},
        ),
        instagram_links: productType.instagram_links.map((link) => ({ id: link.id, value: link.link })),
        categories: productType.categories.map(({ id }) => id.toString()),
        feature_types: productType.feature_types.map((id) => id.toString()),
        characteristic_values: productType.characteristic_values.map((id) => id.toString()),
        image: productType.image,
      } as ViewProps['initialValues'];
    }

    return {};
  }, [productType]);

  return (
    <View
      characteristicValues={characteristicValues}
      featureTypes={featureTypes}
      categories={categories}
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading_}
      close={close}
      validate={validator.validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
