import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { CategoryService } from '@eye8/service';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { getFieldName, parseFieldName } from '../../../components';
import { AdminCategoriesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: CategoryService;
  history: History;
  adminCategoriesState: AdminCategoriesState;
}

export interface ViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string }; parent_category_id?: string }) => void;
  isLoading: boolean;
  isCreating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  categories: AdminCategoriesState['entities'];
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
        parent_category_id: yup.number(),
      },
    ),
  ),
);

const AdminCategoriesCreatePresenter: React.FC<Props> = ({
  history,
  adminCategoriesState: { entities: categories, add: addCategory, isListLoading: categoriesLoading, listError },
  service,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/categories'), [history]);

  const create: ViewProps['create'] = React.useCallback(
    async (values) => {
      setCreating(true);

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
        const category = await service.create(formattedValues);
        addCategory(category);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addCategory, close, service],
  );

  return (
    <View
      categories={categories}
      isOpen={true}
      create={create}
      error={error}
      isLoading={categoriesLoading}
      isCreating={isCreating}
      close={close}
      validate={validator.validate}
      preloadingError={listError}
    />
  );
};

export default AdminCategoriesCreatePresenter;
