import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

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
  adminCategoriesState: AdminCategoriesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string }; parent_category_id?: string }) => void;
  isLoading: boolean;
  isCreating: boolean;
  error?: string;
  preloadingError?: string;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
  categories: AdminCategoriesStateContextValue['state']['entities'];
}

export const CATEGORY_NAME_FIELD_KEY = 'name';

export const AdminCategoriesCreatePresenter: React.FC<IProps> = ({
  intlState,
  history,
  adminCategoriesState: { entities: categories, add: addCategory, isListLoading: categoriesLoading, listError },
  service,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

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
              parent_category_id: yup.number(),
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

  const close = React.useCallback(() => history.push('/admin/categories'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async values => {
      setCreating(true);

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
      availableLocales={intlState.availableLocales}
      validate={(validator || { validate: undefined }).validate}
      preloadingError={listError}
    />
  );
};
