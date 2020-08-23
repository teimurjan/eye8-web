import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { IProductTypeDetailRawIntlResponseItem } from 'src/api/ProductTypeAPI';
import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import { Link } from 'src/components/Admin/LinksInput/LinksInput';
import {
  PRODUCT_TYPE_NAME_FIELD_KEY,
  PRODUCT_TYPE_DESCRIPTION_FIELD_KEY,
  PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY,
} from 'src/components/Admin/ProductTypes/Create/AdminProductTypesCreatePresenter';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useLazy } from 'src/hooks/useLazy';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { ContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { ContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { ContextValue as AdminProductTypesStateContextValue } from 'src/state/AdminProductTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IProductTypeService;
  history: History;
  productTypeId: number;
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
  edit: (values: IFormValues) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: IFormValues) => object | Promise<object>;
  categories: AdminCategoriesStateContextValue['state']['entities'];
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
  initialValues: object;
}

export const CATEGORY_NAME_FIELD_KEY = 'name';

export const AdminProductTypesEditPresenter: React.FC<IProps> = ({
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
  adminProductTypesState: { set: setProductTypeToState },
  intlState: { availableLocales },
  service,
  View,
  productTypeId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [productType, setProductType] = React.useState<IProductTypeDetailRawIntlResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const isLoading_ = isLoading || categoriesLoading || featureTypesLoading;

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          intlState.availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(PRODUCT_TYPE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
              [getFieldName(PRODUCT_TYPE_DESCRIPTION_FIELD_KEY, locale)]: yup
                .string()
                .required('common.errors.field.empty'),
              [getFieldName(PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY, locale)]: yup
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
    trigger: availableLocales.length,
  });

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const productType = await service.getOneRawIntl(productTypeId);
        if (productType) {
          const promises = [];
          if (!hasCategoriesLoaded) {
            promises.push(getCategories());
          }
          if (!hasFeatureTypesLoaded) {
            promises.push(getFeatureTypes());
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

  const edit: IViewProps['edit'] = React.useCallback(
    async values => {
      setUpdating(true);

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
          instagram_links: values.instagram_links.map(link => link.value),
          categories: values.categories ? values.categories.map(category => parseInt(category, 10)) : [],
          feature_types: values.feature_types.map(id => parseInt(id, 10)),
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
            [getFieldName(PRODUCT_TYPE_NAME_FIELD_KEY, locale)]: productType.name[locale.id],
            [getFieldName(PRODUCT_TYPE_DESCRIPTION_FIELD_KEY, locale)]: productType.description[locale.id],
            [getFieldName(PRODUCT_TYPE_SHORT_DESCRIPTION_FIELD_KEY, locale)]: productType.short_description[locale.id],
          }),
          {},
        ),
        instagram_links: productType.instagram_links.map(link => ({ id: link.id, value: link.link })),
        categories: productType.categories.map(({ id }) => id),
        feature_types: productType.feature_types,
        image: productType.image,
      };
    }

    return {};
  }, [availableLocales, productType]);

  return (
    <View
      featureTypes={featureTypes}
      categories={categories}
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading_}
      close={close}
      availableLocales={availableLocales}
      validate={(validator || { validate: undefined }).validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
