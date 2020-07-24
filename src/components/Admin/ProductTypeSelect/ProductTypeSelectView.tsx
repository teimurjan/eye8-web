import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
import { FormSelectField } from 'src/components/admin-ui/FormSelectField/FormSelectField';
import { SelectTrigger } from 'src/components/admin-ui/Select/Select';

interface IProps {
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  hasClear?: boolean;
}

export const ProductTypeSelectView = <T extends string | undefined = string>({
  productTypes,
  input,
  meta,
  LoadMoreProductTypes,
  productTypesLoading,
  hasClear,
}: IProps & FieldRenderProps<T>) => {
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
        placeholder: intl.formatMessage({
          id: 'AdminProducts.productTypeSelect.defaultOption.title',
        }),
        options,
        TriggerComponent: SelectTrigger,
        onLoadMore: LoadMoreProductTypes,
        isLoading: productTypesLoading,
        clear: hasClear ? () => input.onChange(undefined) : undefined,
        hasSearch: true,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};
