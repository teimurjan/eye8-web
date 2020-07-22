import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { ICategoryListRawIntlResponseItem } from 'src/api/CategoryAPI';
import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useLazy } from 'src/hooks/useLazy';
import { ICategoryService } from 'src/services/CategoryService';
import { ContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: ICategoryService;
  history: History;
  categoryId: number;
  adminCategoriesState: AdminCategoriesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string }; parent_category_id?: string }) => void;
  error?: string;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
  categories: AdminCategoriesStateContextValue['state']['entities'];
  isLoading: boolean;
  isUpdating: boolean;
  preloadingError?: string;
  initialValues: object;
}

export const CATEGORY_NAME_FIELD_KEY = 'name';

export const AdminCategoriesEditPresenter: React.FC<IProps> = ({
  intlState,
  history,
  adminCategoriesState: { entities: categories, set: setCategoryToState, isListLoading: categoriesLoading },
  intlState: { availableLocales },
  service,
  View,
  categoryId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<ICategoryListRawIntlResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          intlState.availableLocales.reduce(
            (acc, locale) => ({
              ...acc,
              [getFieldName(CATEGORY_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
            }),
            {
              parent_category_id: yup.number().nullable(true),
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

        const category = await service.getOneRawIntl(categoryId);
        if (category) {
          setCategory(category);
        } else {
          setPreloadingError('AdminCategories.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/categories'), [history]);

  const edit: IViewProps['edit'] = React.useCallback(
    async values => {
      setUpdating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (key === CATEGORY_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [id]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
          parent_category_id: values.parent_category_id ? parseInt(values.parent_category_id, 10) : undefined,
        },
      );

      try {
        const category = await service.edit(categoryId, formattedValues);
        setCategoryToState(category);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [categoryId, close, service, setCategoryToState],
  );

  const initialValues = React.useMemo(() => {
    if (category) {
      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(CATEGORY_NAME_FIELD_KEY, locale)]: category.name[locale.id],
          }),
          {},
        ),
        parent_category_id: category.parent_category_id,
      };
    }

    return {};
  }, [availableLocales, category]);

  return (
    <View
      categories={categories.filter(category => category.id !== categoryId)}
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading || categoriesLoading}
      close={close}
      availableLocales={availableLocales}
      validate={(validator || { validate: undefined }).validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
