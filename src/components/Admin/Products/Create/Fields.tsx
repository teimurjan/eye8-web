/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import difference from 'lodash/difference';
import * as React from 'react';
import { Field as FinalFormField, FieldRenderProps, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { IFeatureTypeListRawIntlResponseItem } from 'src/api/FeatureTypeAPI';
import { IFeatureValueListRawIntlResponseItem } from 'src/api/FeatureValueAPI';
import { IProductTypeListRawIntlMinifiedResponseItem } from 'src/api/ProductTypeAPI';
import { Button } from 'src/components/admin-ui/Button/Button';
import { Field } from 'src/components/admin-ui/Field/Field';
import { FileInput } from 'src/components/admin-ui/FileInput/FileInput';
import { FormSelectField } from 'src/components/admin-ui/FormSelectField/FormSelectField';
import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { HelpText } from 'src/components/admin-ui/HelpText/HelpText';
import { Label } from 'src/components/admin-ui/Label/Label';
import { SelectTrigger } from 'src/components/admin-ui/Select/Select';
import { ColorDecoration } from 'src/components/Admin/FeatureTypes/Decorations/Color';
import { ProductTypeSelectView } from 'src/components/Admin/ProductTypeSelect/ProductTypeSelectView';
import { IContextValue as AdminFeatureValuesStateContextValue } from 'src/state/AdminFeatureValuesState';
import { Accept } from 'src/utils/accept';
import { isAllowedForNumberInput } from 'src/utils/number';
import { arePropsEqual, lengthCompare } from 'src/utils/propEquality';

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

const UPCField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminProducts.upc' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.upc',
        }),
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
        children: intl.formatMessage({ id: 'AdminProducts.discount' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminProducts.discount',
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
        children: intl.formatMessage({ id: 'AdminProducts.price' }),
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

const useGroupedFeatureValuesByFeatureType = (featureValues: IFieldsProps['featureValues']) => {
  const intl = useIntl();

  return featureValues.reduce((acc, featureValue) => {
    const existingFeatureValues = acc[featureValue.feature_type.name[intl.locale]]?.featureValues || [];
    return {
      ...acc,
      [featureValue.feature_type.id]: {
        featureType: featureValue.feature_type,
        featureValues: [...existingFeatureValues, featureValue],
      },
    };
  }, {} as { [key: string]: { featureType: IFeatureTypeListRawIntlResponseItem; featureValues: IFeatureValueListRawIntlResponseItem[] } });
};

interface IFeatureValuesSelectProps extends FieldRenderProps<string[]> {
  featureValues: IFieldsProps['featureValues'];
}

const FeatureValuesSelect = ({ featureValues, input, meta }: IFeatureValuesSelectProps) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  const groupedFeatureValues = useGroupedFeatureValuesByFeatureType(featureValues);

  return (
    <React.Fragment>
      {Object.keys(groupedFeatureValues).map(featureTypeId => {
        const featureType = groupedFeatureValues[featureTypeId].featureValues[0].feature_type;
        const decoration = featureType.name['en'].match(/[Cc]olor/) ? <ColorDecoration /> : null;
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
              value: Array.isArray(input.value)
                ? input.value.find(idStr =>
                    groupedFeatureValues[featureTypeId].featureValues.some(({ id }) => id.toString() === idStr),
                  )
                : undefined,
              placeholder: intl.formatMessage({
                id: 'AdminProducts.productTypeSelect.defaultOption.title',
              }),
              options: groupedFeatureValues[featureTypeId].featureValues.map(({ id, name }) => ({
                key: id.toString(),
                title: name[intl.locale],
                value: id.toString(),
              })),
              onChange: id => {
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
              onChange={newFile => {
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
              onClick={e => {
                e.preventDefault();
                const newFiles = value.filter((_, j) => j !== i);
                onChange(newFiles);
              }}
            >
              <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
          </div>
        ))}
        <FileInput
          value={undefined}
          onChange={newFile => {
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
  (prevProps, nextProps) => arePropsEqual(prevProps, nextProps, ['input']),
);

export interface IFieldsProps {
  productTypes: IProductTypeListRawIntlMinifiedResponseItem[];
  featureValues: AdminFeatureValuesStateContextValue['adminFeatureValuesState']['featureValues'];
  LoadMoreProductTypes: () => void;
  productTypesLoading: boolean;
}

export const Fields: React.SFC<IFieldsProps> = React.memo(
  ({ productTypes, featureValues, LoadMoreProductTypes, productTypesLoading }) => {
    const {
      values: { product_type_id: productTypeID },
    } = useFormState();

    const productType = productTypes.find(({ id }) => parseInt(productTypeID, 10) === id);

    return (
      <React.Fragment>
        <FinalFormField key="price" name="price" component={PriceField} />
        <FinalFormField key="discount" name="discount" component={DiscountField} />
        <FinalFormField key="quantity" name="quantity" component={QuantityField} />
        <FinalFormField key="upc" name="upc" component={UPCField} />
        <FinalFormField
          key="product_type_id"
          name="product_type_id"
          component={ProductTypeSelectView}
          productTypes={productTypes}
          LoadMoreProductTypes={LoadMoreProductTypes}
          productTypesLoading={productTypesLoading}
        />
        <FinalFormField
          key="feature_values"
          name="feature_values"
          component={FeatureValuesSelect}
          featureValues={featureValues.filter(({ feature_type: { id: featureTypeID } }) =>
            productType ? productType.feature_types.indexOf(featureTypeID) !== -1 : false,
          )}
        />
        <FinalFormField key="images" name="images" component={ImagesInput} />
      </React.Fragment>
    );
  },
  (prevProps, nextProps) =>
    arePropsEqual(prevProps, nextProps, [
      { key: 'productTypes' as keyof IFieldsProps, compare: lengthCompare },
      { key: 'featureValues' as keyof IFieldsProps, compare: lengthCompare },
      'productTypesLoading',
    ]),
);
