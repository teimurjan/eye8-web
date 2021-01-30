import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { FormSelectField, SelectTrigger } from '@eye8/admin-ui';
import { CHARACTERISTIC_VALUE_NAME_FIELD_KEY } from '@eye8/admin/pages/characteristic-values/create/presenter';

import { IntlField } from '../../../components';
import { AdminCharacteristicsState } from '../../../state';

export interface FieldsProps {
  characteristics: AdminCharacteristicsState['entities'];
}

const CharacteristicSelect = ({
  characteristics,
  input,
  meta,
}: FieldRenderProps<string> & Pick<FieldsProps, 'characteristics'>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormSelectField
      labelProps={{
        children: (
          <>
            {intl.formatMessage({
              id: 'AdminCharacteristicValues.characteristicSelect.label',
            })}
          </>
        ),
      }}
      selectProps={{
        ...input,
        placeholder: intl.formatMessage({
          id: 'AdminCharacteristicValues.characteristicSelect.defaultOption.title',
        }),
        options: characteristics.map(({ id, name }) => ({
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

export const Fields = ({ characteristics }: FieldsProps) => {
  const intl = useIntl();
  return (
    <>
      <IntlField
        key_={CHARACTERISTIC_VALUE_NAME_FIELD_KEY}
        label={intl.formatMessage({
          id: 'AdminCharacteristicValues.nameInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminCharacteristicValues.nameInput.placeholder',
        })}
      />
      <Field
        key="characteristic_id"
        name="characteristic_id"
        component={CharacteristicSelect}
        characteristics={characteristics}
      />
    </>
  );
};
