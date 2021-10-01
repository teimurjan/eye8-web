import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import * as yup from 'yup';

import { Category } from '@eye8/api';
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
        parent_category_id: yup.number().nullable(true),
      },
    ),
  ),
);

const AdminCategoriesEdit = () => {
  const history = useHistory();
  const { id: categoryIdStr } = useParams<{ id: string }>();
  const categoryId = parseInt(categoryIdStr, 10);

  const {
    di: {
      service: { category: categoryService },
    },
  } = useDI();
  const { entities: categories, set: setCategoryToState, isListLoading: categoriesLoading } = useAdminCategoriesState();

  const intl = useIntl();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [category, setCategory] = React.useState<Category<true> | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const category = await categoryService.getOneRawIntl(categoryId);
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

  const edit = React.useCallback(
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
        const category = await categoryService.edit(categoryId, formattedValues);
        setCategoryToState(category);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [categoryId, close, categoryService, setCategoryToState],
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
    <ModalForm
      isOpen
      formID="adminCategoriesEditForm"
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading || categoriesLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminCategories.edit.title' })}
      fields={
        <AdminCategoriesFields
          categories={categories.filter((category) => category.id !== categoryId)}
          nameFieldKey={CATEGORY_NAME_FIELD_KEY}
        />
      }
      validate={validator.validate}
      initialValues={initialValues}
    />
  );
};

export default AdminCategoriesEdit;
