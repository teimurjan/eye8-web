import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { ProductTypeService } from '@eye8/service';
import { availableLocales, objectWithout, SchemaValidator } from '@eye8/shared/utils';
import { StateCacheStorage } from '@eye8/storage/state-cache';

import { LinksInputProps, ModalFormProps, getFieldName, parseFieldName } from '../../../components';
import {
  AdminCategoriesState,
  AdminCharacteristicValuesState,
  AdminFeatureTypesState,
  AdminProductTypesState,
} from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: ProductTypeService;
  history: History;
  stateCacheStorage: StateCacheStorage;
  adminCategoriesState: AdminCategoriesState;
  adminFeatureTypesState: AdminFeatureTypesState;
  adminProductTypesState: AdminProductTypesState;
  adminCharacteristicValuesState: AdminCharacteristicValuesState;
}

interface FormValues {
  names: { [key: string]: string };
  descriptions: { [key: string]: string };
  short_descriptions: { [key: string]: string };
  instagram_links: LinksInputProps['links'];
  feature_types: string[];
  characteristic_values: string[];
  categories?: string[];
  image: string;
}

export interface ViewProps {
  isOpen: boolean;
  create: (values: FormValues) => void;
  isLoading: boolean;
  isCreating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: FormValues) => object | Promise<object>;
  categories: AdminCategoriesState['entities'];
  featureTypes: AdminFeatureTypesState['entities'];
  characteristicValues: AdminCharacteristicValuesState['entities'];
  onChange: ModalFormProps<FormValues>['onChange'];
  initialValues: Partial<FormValues>;
}

export const PRODUCT_TYPE_NAME_FIELD_KEY = 'name';
export const PRODUCT_TYPE_DESCRIPTION_FIELD_KEY = 'description';
export const PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY = 'short_description';

const STATE_CACHE_KEY = 'adminProductTypeCreationForm';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(PRODUCT_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
        [getFieldName(PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY, locale)]: yup
          .string()
          .required('common.errors.field.empty'),
        [getFieldName(PRODUCT_TYPE_DESCRIPTION_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {
        instagram_links: yup
          .array()
          .test(
            'areLinksValid',
            'AdminProductTypes.errors.invalidInstagramLinks',
            (value: LinksInputProps['links'] = []) => {
              return value.every((link) => link.value.match(/(https?:\/\/(?:www\.)?instagram\.com\/p\/([^/?#&]+)).*/));
            },
          ),
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
        characteristic_values: yup.array().of(yup.number()).required('AdminProductTypes.errors.noFeatureTypes'),
        image: yup.mixed().required('common.errors.field.empty'),
      },
    ),
  ),
);

const AdminProductTypesCreatePresenter: React.FC<Props> = ({
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
  adminProductTypesState: { get: getProductTypes },
  service,
  View,
  stateCacheStorage,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isLoading = categoriesLoading || featureTypesLoading || characteristicValuesLoading;

  React.useEffect(() => {
    (async () => {
      try {
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

        await Promise.all(promises);
      } catch (e) {
        setPreloadingError('errors.common');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/productTypes'), [history]);

  const create: ViewProps['create'] = React.useCallback(
    async (values) => {
      setCreating(true);

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
          instagram_links: Array.isArray(values.instagram_links)
            ? values.instagram_links.map((link) => link.value)
            : [],
          categories: values.categories ? values.categories.map((category) => parseInt(category as string, 10)) : [],
          feature_types: values.feature_types.map((id) => parseInt(id, 10)),
          characteristic_values: values.characteristic_values.map((id) => parseInt(id, 10)),
          image: values.image,
        },
      );

      try {
        await service.create(formattedValues);
        getProductTypes();
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [getProductTypes, close, service],
  );

  const onChange: ViewProps['onChange'] = React.useCallback(
    (values) => {
      // Filter if cached feature type and category does not exist anymore
      values.feature_types = values.feature_types
        ? values.feature_types.filter((idStr: string) => featureTypes.some(({ id }) => id.toString() === idStr))
        : undefined;
      values.categories = values.categories
        ? values.categories.filter((idStr: string) => categories.some(({ id }) => id.toString() === idStr))
        : undefined;
      values.characteristic_values = values.characteristic_values
        ? values.characteristic_values.filter((idStr: string) =>
            characteristicValues.some(({ id }) => id.toString() === idStr),
          )
        : undefined;

      stateCacheStorage.set(STATE_CACHE_KEY, objectWithout(values, 'image'), { expireIn: 3600 });
    },
    [featureTypes, categories, characteristicValues, stateCacheStorage],
  );

  return (
    <View
      categories={categories}
      featureTypes={featureTypes}
      isOpen={true}
      create={create}
      error={error}
      isLoading={isLoading}
      isCreating={isCreating}
      close={close}
      validate={validator.validate}
      preloadingError={preloadingError}
      onChange={onChange}
      initialValues={stateCacheStorage.get(STATE_CACHE_KEY) || {}}
      characteristicValues={characteristicValues}
    />
  );
};

export default AdminProductTypesCreatePresenter;
