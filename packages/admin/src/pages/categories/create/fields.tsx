import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { FormSelectField, Trigger } from '@eye8/admin-ui/index';
import { IntlField } from '@eye8/admin/components/intl-field';
import { ContextValue as AdminCategoriesStateContextValue } from '@eye8/admin/state/categories';

const ParentCategorySelect = ({
  categories,
  input,
  meta,
}: FieldRenderProps<string> & Pick<IFieldsProps, 'categories'>) => {
  const intl = useIntl();
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
        TriggerComponent: Trigger,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

export interface IFieldsProps {
  categories: AdminCategoriesStateContextValue['state']['entities'];
  nameFieldKey: string;
}

export const Fields = ({ categories, nameFieldKey }: IFieldsProps) => {
  const intl = useIntl();
  return (
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
      <Field
        key="parent_category_id"
        name="parent_category_id"
        component={ParentCategorySelect}
        categories={categories}
      />
    </>
  );
};
