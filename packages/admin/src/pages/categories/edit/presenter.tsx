import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { Category } from '@eye8/api';
import { CategoryService } from '@eye8/service';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { getFieldName, parseFieldName } from '../../../components';
import { AdminCategoriesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: CategoryService;
  history: History;
  categoryId: number;
  adminCategoriesState: AdminCategoriesState;
}

export interface ViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string }; parent_category_id?: string }) => void;
  error?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  categories: AdminCategoriesState['entities'];
  isLoading: boolean;
  isUpdating: boolean;
  preloadingError?: string;
  initialValues: object;
}

export const CATEGORY_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(CATEGORY_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {
        parent_category_id: yup.number().nullable(true),
      },
    ),
  ),
);

const AdminCategoriesEditPresenter: React.FC<Props> = ({
  history,
  adminCategoriesState: { entities: categories, set: setCategoryToState, isListLoading: categoriesLoading },

  service,
  View,
  categoryId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<Category<true> | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

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

  const edit: ViewProps['edit'] = React.useCallback(
    async (values) => {
      setUpdating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === CATEGORY_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
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
            [getFieldName(CATEGORY_NAME_FIELD_KEY, locale)]: category.name[locale],
          }),
          {},
        ),
        parent_category_id: category.parent_category_id,
      };
    }

    return {};
  }, [category]);

  return (
    <View
      categories={categories.filter((category) => category.id !== categoryId)}
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading || categoriesLoading}
      close={close}
      validate={validator.validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};

export default AdminCategoriesEditPresenter;
