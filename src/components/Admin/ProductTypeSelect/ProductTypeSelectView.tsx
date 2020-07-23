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
  allowClear?: boolean;
}

export const ProductTypeSelectView = <T extends string | undefined = string>({
  productTypes,
  input,
  meta,
  LoadMoreProductTypes,
  productTypesLoading,
  allowClear,
}: IProps & FieldRenderProps<T>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  const [searchQuery, setSearchQuery] = React.useState('');

  const options = productTypes
    .filter(({ name }) => name[intl.locale].toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
    .map(({ id, name }) => ({
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
        clear: allowClear ? () => input.onChange(undefined) : undefined,
        onSearch: setSearchQuery,
        searchQuery,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};
