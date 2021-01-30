import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { FormSelectField, SelectTrigger } from '@eye8/admin-ui';

import { IntlField } from '../../../components';
import { AdminCategoriesState } from '../../../state';

const ParentCategorySelect = ({
  categories,
  input,
  meta,
}: FieldRenderProps<string> & Pick<FieldsProps, 'categories'>) => {
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
        TriggerComponent: SelectTrigger,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

export interface FieldsProps {
  categories: AdminCategoriesState['entities'];
  nameFieldKey: string;
}

export const Fields = ({ categories, nameFieldKey }: FieldsProps) => {
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
