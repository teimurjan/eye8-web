import * as React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { IntlShape, injectIntl } from 'react-intl';

import { FormNativeSelectField } from 'src/components/admin-ui/FormNativeSelectField/FormNativeSelectField';
import { IntlField } from 'src/components/Admin/IntlField';
import { IContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

interface IParentCategorySelectProps extends FieldRenderProps<string> {
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
}

const ParentCategorySelect = injectIntl(
  ({ categories, intl, input, meta }: IParentCategorySelectProps & { intl: IntlShape }) => {
    const showError = meta.touched && meta.error;

    return (
      <FormNativeSelectField
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
          defaultOption: {
            title: intl.formatMessage({
              id: 'AdminCategories.parentCategorySelect.defaultOption.title',
            }),
          },
          options: categories.map(({ id, name }) => ({
            title: name[intl.locale],
            value: `${id}`,
          })),
        }}
        helpTextProps={{
          children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
          type: 'is-danger',
        }}
      />
    );
  },
);

const getParentCategoryIDRenderer = (
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'],
) => (fieldRenderProps: FieldRenderProps<string>) => (
  <ParentCategorySelect categories={categories} {...fieldRenderProps} />
);

export interface IFieldsProps {
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  categories: AdminCategoriesStateContextValue['adminCategoriesState']['categories'];
  nameFieldKey: string;
}

export const Fields = injectIntl(
  ({ availableLocales, categories, intl, nameFieldKey }: IFieldsProps & { intl: IntlShape }) => (
    <>
      <IntlField
        key_={nameFieldKey}
        locales={availableLocales}
        label={intl.formatMessage({
          id: 'AdminCategories.nameInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminCategories.nameInput.placeholder',
        })}
      />
      <Field key="parent_category_id" name="parent_category_id" render={getParentCategoryIDRenderer(categories)} />
    </>
  ),
);
