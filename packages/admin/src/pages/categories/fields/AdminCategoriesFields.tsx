import { Form, Select, Tag, Input } from 'antd';
import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Category } from '@eye8/api';
import { availableLocales } from '@eye8/shared/utils';

import { getFieldName } from '../../../utils';

const ParentCategorySelect = ({ categories, input, meta }: FieldRenderProps<string> & Pick<Props, 'categories'>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminCategories.parentCategorySelect.label',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Select
        placeholder={intl.formatMessage({
          id: 'AdminCategories.parentCategorySelect.defaultOption.title',
        })}
        {...input}
      >
        {categories.map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name[intl.locale]}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

const NameField = ({ input, meta, locale }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={
        <>
          {intl.formatMessage({
            id: 'AdminCategories.nameInput.label',
          })}
          <Tag>{locale}</Tag>
        </>
      }
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input placeholder={intl.formatMessage({ id: 'AdminCategories.nameInput.placeholder' })} {...input} />
    </Form.Item>
  );
};

export interface Props {
  categories: Category<true>[];
  nameFieldKey: string;
}

const AdminCategoriesFields = ({ categories, nameFieldKey }: Props) => {
  return (
    <>
      {availableLocales.map((locale) => (
        <Field
          key={getFieldName(nameFieldKey, locale)}
          name={getFieldName(nameFieldKey, locale)}
          component={NameField}
          locale={locale}
        />
      ))}
      <Field
        key="parent_category_id"
        name="parent_category_id"
        component={ParentCategorySelect}
        categories={categories}
      />
    </>
  );
};

export default AdminCategoriesFields;
