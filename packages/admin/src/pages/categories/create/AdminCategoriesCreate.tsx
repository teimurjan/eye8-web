import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminCategoriesState } from '../../../state';
import { getFieldName, parseFieldName } from '../../../utils';
import AdminCategoriesFields from '../fields';

const CATEGORY_NAME_FIELD_KEY = 'name';

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

const AdminCategoriesCreate = () => {
  const intl = useIntl();
  const history = useHistory();

  const {
    di: {
      service: { category: categoryService },
    },
  } = useDI();
  const {
    entities: categories,
    add: addCategory,
    isListLoading: categoriesLoading,
    listError,
  } = useAdminCategoriesState();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/categories'), [history]);

  const create = React.useCallback(
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
        const category = await categoryService.create(formattedValues);
        addCategory(category);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addCategory, close, categoryService],
  );

  return (
    <ModalForm
      isOpen
      formID="adminCategoriesCreateForm"
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      isPreloading={categoriesLoading}
      preloadingError={listError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminCategories.create.title' })}
      fields={<AdminCategoriesFields categories={categories} nameFieldKey={CATEGORY_NAME_FIELD_KEY} />}
      validate={validator.validate}
    />
  );
};

export default AdminCategoriesCreate;
