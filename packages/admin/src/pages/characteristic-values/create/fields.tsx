import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { FormSelectField, Trigger } from '@eye8/admin-ui/index';
import { IntlField } from '@eye8/admin/components/intl-field';
import { CHARACTERISTIC_VALUE_NAME_FIELD_KEY } from '@eye8/admin/pages/characteristic-values/create/presenter';
import { ContextValue as AdminCharacteristicsStateContextValue } from '@eye8/admin/state/characteristics';

export interface IFieldsProps {
  characteristics: AdminCharacteristicsStateContextValue['state']['entities'];
}

const CharacteristicSelect = ({
  characteristics,
  input,
  meta,
}: FieldRenderProps<string> & Pick<IFieldsProps, 'characteristics'>) => {
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
        TriggerComponent: Trigger,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

export const Fields = ({ characteristics }: IFieldsProps) => {
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
