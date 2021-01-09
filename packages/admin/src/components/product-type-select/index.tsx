import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { FormSelectField, SelectTrigger } from '@eye8/admin-ui';
import { ProductTypeListRawIntlMinifiedResponseItem } from '@eye8/api/product-type';

interface Props {
  productTypes: ProductTypeListRawIntlMinifiedResponseItem[];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  clearable?: boolean;
}

export const ProductTypeSelectView = <T extends string | undefined = string>({
  productTypes,
  input,
  meta,
  LoadMoreProductTypes,
  productTypesLoading,
  clearable,
}: Props & FieldRenderProps<T>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  const options = productTypes.map(({ id, name }) => ({
    title: name[intl.locale],
    value: `${id}`,
  }));

  return (
    <FormSelectField
      labelProps={{
        children: intl.formatMessage({
          id: 'AdminProducts.productTypeSelect.label',
        }),
      }}
      selectProps={{
        ...input,
        options,
        TriggerComponent: SelectTrigger,
        onLoadMore: LoadMoreProductTypes,
        isLoading: productTypesLoading,
        clearable,
        searchable: true,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};
