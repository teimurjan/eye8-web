import * as React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { IntlShape, injectIntl, useIntl } from 'react-intl';

import { FormSelectField } from 'src/components/admin-ui/FormSelectField/FormSelectField';
import { SearchableSelectTrigger } from 'src/components/admin-ui/Trigger/Trigger';
import {
  CHARACTERISTIC_VALUE_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/CharacteristicValues/Create/AdminCharacteristicValuesCreatePresenter';
import { IntlField } from 'src/components/Admin/IntlField';
import { ContextValue as AdminCharacteristicsStateContextValue } from 'src/state/AdminCharacteristicsState';

export interface IFieldsProps {
  availableLocales: IProps['availableLocales'];
  characteristics: AdminCharacteristicsStateContextValue['state']['entities'];
}

interface ICharacteristicSelectProps extends FieldRenderProps<string> {
  characteristics: AdminCharacteristicsStateContextValue['state']['entities'];
}

const CharacteristicSelect = ({ characteristics, input, meta }: ICharacteristicSelectProps) => {
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
        TriggerComponent: SearchableSelectTrigger,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const getCharacteristicSelectRenderer = (
  characteristics: AdminCharacteristicsStateContextValue['state']['entities'],
) => (fieldRenderProps: FieldRenderProps<string>) => (
  <CharacteristicSelect characteristics={characteristics} {...fieldRenderProps} />
);

export const Fields = injectIntl(({ availableLocales, intl, characteristics }: IFieldsProps & { intl: IntlShape }) => (
  <>
    <IntlField
      key_={CHARACTERISTIC_VALUE_NAME_FIELD_KEY}
      locales={availableLocales}
      label={intl.formatMessage({
        id: 'AdminCharacteristicValues.nameInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminCharacteristicValues.nameInput.placeholder',
      })}
    />
    <Field key="characteristic_id" name="characteristic_id" render={getCharacteristicSelectRenderer(characteristics)} />
  </>
));
