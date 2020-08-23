import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import { Link } from 'src/components/Admin/LinksInput/LinksInput';
import { IProps as IModalFormProps } from 'src/components/Admin/ModalForm';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useLazy } from 'src/hooks/useLazy';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { ContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { ContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { ContextValue as AdminProductTypesStateContextValue } from 'src/state/AdminProductTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';
import { IStateCacheStorage } from 'src/storage/StateCacheStorage';
import { objectWithout } from 'src/utils/object';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IProductTypeService;
  history: History;
  stateCacheStorage: IStateCacheStorage;
  adminCategoriesState: AdminCategoriesStateContextValue['state'];
  adminFeatureTypesState: AdminFeatureTypesStateContextValue['state'];
  adminProductTypesState: AdminProductTypesStateContextValue['state'];
}

interface IFormValues {
  names: { [key: string]: string };
  descriptions: { [key: string]: string };
  short_descriptions: { [key: string]: string };
  instagram_links: Link[];
  feature_types: string[];
  categories?: string[];
  image: string;
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: IFormValues) => void;
  isLoading: boolean;
  isCreating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: IFormValues) => object | Promise<object>;
  categories: AdminCategoriesStateContextValue['state']['entities'];
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
  onChange: IModalFormProps<IFormValues>['onChange'];
  initialValues: object;
}

export const PRODUCT_TYPE_NAME_FIELD_KEY = 'name';
export const PRODUCT_TYPE_DESCRIPTION_FIELD_KEY = 'description';
export const PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY = 'short_description';

const STATE_CACHE_KEY = 'adminProductTypeCreationForm';

export const AdminProductTypesCreatePresenter: React.FC<IProps> = ({
  intlState,
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
  adminProductTypesState: { get: getProductTypes },
  service,
  View,
  stateCacheStorage,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isLoading = categoriesLoading && featureTypesLoading;

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          intlState.availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(PRODUCT_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
              [getFieldName(PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY, locale)]: yup
                .string()
                .required('common.errors.field.empty'),
              [getFieldName(PRODUCT_TYPE_DESCRIPTION_FIELD_KEY, locale)]: yup
                .string()
                .required('common.errors.field.empty'),
            }),
            {
              instagram_links: yup
                .array()
                .test('areLinksValid', 'AdminProductTypes.errors.invalidInstagramLinks', (value: Link[] = []) => {
                  return value.every(link =>
                    link.value.match(/(https?:\/\/(?:www\.)?instagram\.com\/p\/([^/?#&]+)).*/),
                  );
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
              image: yup.mixed().required('common.errors.field.empty'),
            },
          ),
        ),
      ),
    [intlState],
  );

  const validator = useLazy({
    make: makeValidator,
    trigger: intlState.availableLocales.length,
  });

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

        await Promise.all(promises);
      } catch (e) {
        setPreloadingError('errors.common');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/productTypes'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async values => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (
            [
              PRODUCT_TYPE_NAME_FIELD_KEY,
              PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
              PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
            ].indexOf(key) !== -1
          ) {
            const pluralKeys = `${key}s`;
            return { ...acc, [pluralKeys]: { ...acc[pluralKeys], [id]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
          descriptions: {},
          short_descriptions: {},
          instagram_links: Array.isArray(values.instagram_links) ? values.instagram_links.map(link => link.value) : [],
          categories: values.categories ? values.categories.map(category => parseInt(category as string, 10)) : [],
          feature_types: values.feature_types.map(id => parseInt(id, 10)),
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

  const onChange: IViewProps['onChange'] = React.useCallback(
    values => {
      // Filter if cached feature type and category does not exist anymore
      values.feature_types = values.feature_types
        ? values.feature_types.filter((idStr: string) => featureTypes.some(({ id }) => id.toString() === idStr))
        : undefined;
      values.categories = values.categories
        ? values.categories.filter((idStr: string) => categories.some(({ id }) => id.toString() === idStr))
        : undefined;

      stateCacheStorage.set(STATE_CACHE_KEY, objectWithout(values, 'image'), { expireIn: 3600 });
    },
    [featureTypes, categories, stateCacheStorage],
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
      availableLocales={intlState.availableLocales}
      validate={(validator || { validate: undefined }).validate}
      preloadingError={preloadingError}
      onChange={onChange}
      initialValues={stateCacheStorage.get(STATE_CACHE_KEY) || {}}
    />
  );
};
