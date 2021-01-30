import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { FormSelectField, SelectTrigger } from '@eye8/admin-ui';
import { FEATURE_VALUE_NAME_FIELD_KEY } from '@eye8/admin/pages/feature-values/create/presenter';

import { IntlField } from '../../../components';
import { AdminFeatureTypesState } from '../../../state';

export interface FieldsProps {
  featureTypes: AdminFeatureTypesState['entities'];
}

const FeatureTypeSelect = ({
  featureTypes,
  input,
  meta,
}: FieldRenderProps<string> & Pick<FieldsProps, 'featureTypes'>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormSelectField
      labelProps={{
        children: (
          <>
            {intl.formatMessage({
              id: 'AdminFeatureValues.featureTypeSelect.label',
            })}
          </>
        ),
      }}
      selectProps={{
        ...input,
        placeholder: intl.formatMessage({
          id: 'AdminFeatureValues.featureTypeSelect.defaultOption.title',
        }),
        options: featureTypes.map(({ id, name }) => ({
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

export const Fields = ({ featureTypes }: FieldsProps) => {
  const intl = useIntl();
  return (
    <>
      <IntlField
        key_={FEATURE_VALUE_NAME_FIELD_KEY}
        label={intl.formatMessage({
          id: 'AdminFeatureValues.nameInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminFeatureValues.nameInput.placeholder',
        })}
      />
      <Field key="feature_type_id" name="feature_type_id" component={FeatureTypeSelect} featureTypes={featureTypes} />
    </>
  );
};
