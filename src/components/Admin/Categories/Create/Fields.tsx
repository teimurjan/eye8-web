import * as React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { IntlShape, injectIntl } from 'react-intl';

import { FormSelectField } from 'src/components/admin-ui/FormSelectField/FormSelectField';
import { SearchableSelectTrigger } from 'src/components/admin-ui/Trigger/Trigger';
import { IntlField } from 'src/components/Admin/IntlField';
import { ContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';

interface IParentCategorySelectProps extends FieldRenderProps<string> {
  categories: AdminCategoriesStateContextValue['state']['entities'];
}

const ParentCategorySelect = injectIntl(
  ({ categories, intl, input, meta }: IParentCategorySelectProps & { intl: IntlShape }) => {
    const showError = meta.touched && meta.error;

    return (
      <FormSelectField
        labelProps={{
          children: (
            <>
              {intl.formatMessage({
                id: 'AdminCategories.parentCategorySelect.label',
              })}
            </>
          ),
        }}
        selectProps={{
          ...input,
          placeholder: intl.formatMessage({
            id: 'AdminCategories.parentCategorySelect.defaultOption.title',
          }),
          options: categories.map(({ id, name }) => ({
            title: name[intl.locale],
            value: `${id}`,
          })),
          TriggerComponent: SearchableSelectTrigger,
        }}
        helpTextProps={{
          children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
          type: 'is-danger',
        }}
      />
    );
  },
);

const getParentCategoryIDRenderer = (categories: AdminCategoriesStateContextValue['state']['entities']) => (
  fieldRenderProps: FieldRenderProps<string>,
) => <ParentCategorySelect categories={categories} {...fieldRenderProps} />;

export interface IFieldsProps {
  categories: AdminCategoriesStateContextValue['state']['entities'];
  nameFieldKey: string;
}

export const Fields = injectIntl(({ categories, intl, nameFieldKey }: IFieldsProps & { intl: IntlShape }) => (
  <>
    <IntlField
      key_={nameFieldKey}
      label={intl.formatMessage({
        id: 'AdminCategories.nameInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminCategories.nameInput.placeholder',
      })}
    />
    <Field key="parent_category_id" name="parent_category_id" render={getParentCategoryIDRenderer(categories)} />
  </>
));
