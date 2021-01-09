/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import difference from 'lodash/difference';
import React from 'react';
import { Trash as TrashIcon } from 'react-feather';
import { Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import {
  Button,
  Field,
  FileInput,
  FormSelectField,
  FormTextField,
  HelpText,
  Label,
  SelectTrigger,
} from '@eye8/admin-ui';
import { ColorDecoration } from '@eye8/admin/components/color-decoration';
import { ProductTypeSelectView } from '@eye8/admin/components/product-type-select';
import { useFeatureValuesOfProductType } from '@eye8/admin/hooks/use-feature-values-of-product-type';
import { AdminFeatureValuesCreateContainer } from '@eye8/admin/pages/feature-values/create/container';
import { ContextValue as AdminFeatureValuesStateContextValue } from '@eye8/admin/state/feature-values';
import { FeatureTypeListRawIntlResponseItem } from '@eye8/api/feature-type';
import { FeatureValueListRawIntlResponseItem } from '@eye8/api/feature-value';
import { ProductTypeListRawIntlMinifiedResponseItem } from '@eye8/api/product-type';
import { IconWrapper, Popover } from '@eye8/shared/components';
import { IconSize } from '@eye8/shared/styles';
import {
  Accept,
  Locale,
  isAllowedForNumberInput,
  arePropsEqual,
  lengthCompare,
  defaultCompare,
} from '@eye8/shared/utils';

const QuantityField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminProducts.quantity' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.quantity',
        }),
        type: 'number',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
};

const DiscountField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: `${intl.formatMessage({ id: 'common.discount' })} (%)`,
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'common.discount',
        }),
        type: 'number',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
};

const PriceField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: `${intl.formatMessage({ id: 'AdminProducts.price' })} ($)`,
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.price',
        }),
        type: 'number',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
};

const useGroupedFeatureValuesByFeatureType = (featureValues: FieldsProps['featureValues']) => {
  return featureValues.reduce((acc, featureValue) => {
    const existingFeatureValues = acc[featureValue.feature_type.id]?.featureValues || [];
    return {
      ...acc,
      [featureValue.feature_type.id]: {
        featureType: featureValue.feature_type,
        featureValues: [...existingFeatureValues, featureValue],
      },
    };
  }, {} as { [key: string]: { featureType: FeatureTypeListRawIntlResponseItem; featureValues: FeatureValueListRawIntlResponseItem[] } });
};

interface FeatureValuesSelectProps extends FieldRenderProps<string[]> {
  featureValues: FieldsProps['featureValues'];
  featureValuesLoading: boolean;
}

const FeatureValuesSelect = ({ featureValues, featureValuesLoading, input, meta }: FeatureValuesSelectProps) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  const [isAddingFeatureValue, setAddingFeatureValue] = React.useState(false);
  const groupedFeatureValues = useGroupedFeatureValuesByFeatureType(featureValues);

  return (
    <React.Fragment>
      {Object.keys(groupedFeatureValues).map((featureTypeId) => {
        const featureType = groupedFeatureValues[featureTypeId].featureValues[0].feature_type;
        const decoration = featureType.name[Locale.Secondary].match(/[Cc]olor/) ? <ColorDecoration /> : null;
        return (
          <FormSelectField
            key={featureTypeId}
            labelProps={{
              children: (
                <>
                  <span
                    css={css`
                      margin-right: 10px;
                    `}
                  >
                    {featureType.name[intl.locale]}
                  </span>
                  {decoration}
                </>
              ),
            }}
            selectProps={{
              isLoading: featureValuesLoading,
              searchable: true,
              append: (
                <Popover.Item
                  Component="div"
                  onClick={() => {
                    setAddingFeatureValue(true);
                  }}
                  color={Popover.Item.Color.Dark}
                >
                  {intl.formatMessage({ id: 'common.add' })}
                </Popover.Item>
              ),
              value: Array.isArray(input.value)
                ? input.value.find((idStr) =>
                    groupedFeatureValues[featureTypeId].featureValues.some(({ id }) => id.toString() === idStr),
                  )
                : undefined,
              options: groupedFeatureValues[featureTypeId].featureValues.map(({ id, name }) => ({
                key: id.toString(),
                title: name[intl.locale],
                value: id.toString(),
              })),
              onChange: (id) => {
                const valueWithoutCurrentGroup = difference(
                  input.value,
                  groupedFeatureValues[featureTypeId].featureValues.map(({ id }) => id.toString()),
                );
                input.onChange([...valueWithoutCurrentGroup, id]);
              },
              TriggerComponent: SelectTrigger,
            }}
          />
        );
      })}
      {isAddingFeatureValue && <AdminFeatureValuesCreateContainer close={() => setAddingFeatureValue(false)} />}
      <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
    </React.Fragment>
  );
};

const ImagesInput = React.memo<FieldRenderProps<Array<File | undefined>>>(
  ({ input, meta }) => {
    const intl = useIntl();
    const showError = meta.touched && meta.error;

    const { onChange } = input;
    const value = typeof input.value.map !== 'function' ? [] : input.value;

    return (
      <Field>
        <Label>{intl.formatMessage({ id: 'AdminProducts.images' })}</Label>
        {value.map((file, i) => (
          <div
            css={css`
              position: relative;
            `}
            key={typeof file === 'string' ? file : (file as File).lastModified.toString()}
          >
            <FileInput
              value={file}
              onChange={(newFile) => {
                const newFiles = [...value];
                newFiles[i] = newFile;
                onChange(newFiles);
              }}
              accept={Accept.Image}
              placeholder={intl.formatMessage({
                id: 'common.chooseImage',
              })}
            />
            <Button
              css={css`
                position: absolute;
                bottom: 0;
                right: 0;
              `}
              color="is-danger"
              onClick={(e) => {
                e.preventDefault();
                const newFiles = value.filter((_, j) => j !== i);
                onChange(newFiles);
              }}
            >
              <IconWrapper>
                <TrashIcon size={IconSize.Medium} />
              </IconWrapper>
            </Button>
          </div>
        ))}
        <FileInput
          value={undefined}
          onChange={(newFile) => {
            onChange([...value, newFile]);
          }}
          accept={Accept.Image}
          placeholder={intl.formatMessage({
            id: 'common.chooseImage',
          })}
        />
        <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
      </Field>
    );
  },
  (prevProps, nextProps) => arePropsEqual(prevProps, nextProps, { input: defaultCompare }),
);

export interface FieldsProps {
  productTypes: ProductTypeListRawIntlMinifiedResponseItem[];
  featureValues: AdminFeatureValuesStateContextValue['state']['entities'];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
  featureValuesLoading: boolean;
}

export const Fields: React.SFC<FieldsProps> = React.memo(
  ({ productTypes, featureValues, LoadMoreProductTypes, productTypesLoading, featureValuesLoading }) => {
    const featureValuesOfProductType = useFeatureValuesOfProductType({ productTypes, featureValues });
    return (
      <React.Fragment>
        <FinalFormField key="price" name="price" component={PriceField} />
        <FinalFormField key="discount" name="discount" component={DiscountField} />
        <FinalFormField key="quantity" name="quantity" component={QuantityField} />
        <FinalFormField
          key="product_type_id"
          name="product_type_id"
          component={ProductTypeSelectView}
          productTypes={productTypes}
          LoadMoreProductTypes={LoadMoreProductTypes}
          productTypesLoading={productTypesLoading}
          clearable
        />
        <FinalFormField
          key="feature_values"
          name="feature_values"
          component={FeatureValuesSelect}
          featureValues={featureValuesOfProductType}
          featureValuesLoading={featureValuesLoading}
        />
        <FinalFormField key="images" name="images" component={ImagesInput} />
      </React.Fragment>
    );
  },
  (prevProps, nextProps) =>
    arePropsEqual(prevProps, nextProps, {
      productTypes: lengthCompare,
      featureValues: lengthCompare,
      productTypesLoading: defaultCompare,
      featureValuesLoading: defaultCompare,
    }),
);
