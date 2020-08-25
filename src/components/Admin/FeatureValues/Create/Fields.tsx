import * as React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { IntlShape, injectIntl } from 'react-intl';

import { FormSelectField } from 'src/components/admin-ui/FormSelectField/FormSelectField';
import { SearchableSelectTrigger } from 'src/components/admin-ui/Trigger/Trigger';
import {
  FEATURE_VALUE_NAME_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/FeatureValues/Create/AdminFeatureValuesCreatePresenter';
import { IntlField } from 'src/components/Admin/IntlField';
import { ContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';

export interface IFieldsProps {
  availableLocales: IProps['availableLocales'];
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
}

interface IFeatureTypeSelectProps extends FieldRenderProps<string> {
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
}

const FeatureTypeSelect = injectIntl(
  ({ featureTypes, intl, input, meta }: IFeatureTypeSelectProps & { intl: IntlShape }) => {
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
          TriggerComponent: SearchableSelectTrigger,
        }}
        helpTextProps={{
          children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
          type: 'is-danger',
        }}
      />
    );
  },
);

const getFeatureTypeSelectRenderer = (featureTypes: AdminFeatureTypesStateContextValue['state']['entities']) => (
  fieldRenderProps: FieldRenderProps<string>,
) => <FeatureTypeSelect featureTypes={featureTypes} {...fieldRenderProps} />;

export const Fields = injectIntl(({ availableLocales, intl, featureTypes }: IFieldsProps & { intl: IntlShape }) => (
  <>
    <IntlField
      key_={FEATURE_VALUE_NAME_FIELD_KEY}
      locales={availableLocales}
      label={intl.formatMessage({
        id: 'AdminFeatureValues.nameInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminFeatureValues.nameInput.placeholder',
      })}
    />
    <Field key="feature_type_id" name="feature_type_id" render={getFeatureTypeSelectRenderer(featureTypes)} />
  </>
));
