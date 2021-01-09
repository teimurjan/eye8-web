import React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from '@eye8/admin/components/intl-field';
import { ContextValue as AdminFeatureTypesStateContextValue } from '@eye8/admin/state/feature-types';
import { ContextValue as AdminFeatureValuesStateContextValue } from '@eye8/admin/state/feature-values';
import { FeatureValueService } from '@eye8/service/feature-value';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: FeatureValueService;
  close: () => void;
  adminFeatureTypesState: AdminFeatureTypesStateContextValue['state'];
  adminFeatureValuesState: AdminFeatureValuesStateContextValue['state'];
}

export interface ViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string }; feature_type_id: string }) => void;
  isCreating: boolean;
  isLoading: boolean;
  error: string | undefined;
  close: () => void;
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
  validate?: (values: object) => object | Promise<object>;
}

export const FEATURE_VALUE_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(FEATURE_VALUE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {
        feature_type_id: yup.number().required('common.errors.field.empty'),
      },
    ),
  ),
);

export const AdminFeatureValuesCreatePresenter: React.FC<Props> = ({
  adminFeatureTypesState: {
    get: getFeatureTypes,
    isListLoading: featureTypesLoading,
    entities: featureTypes,
    hasListLoaded: isDataLoaded,
  },
  adminFeatureValuesState: { add: addFeatureValue },
  View,
  service,
  close,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  React.useEffect(() => {
    if (!isDataLoaded) {
      getFeatureTypes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create: ViewProps['create'] = React.useCallback(
    async (values) => {
      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === FEATURE_VALUE_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
          }

          return acc;
        },
        {
          feature_type_id: parseInt(values.feature_type_id, 10),
          names: {},
        },
      );

      try {
        const featureValue = await service.create(formattedValues);
        addFeatureValue(featureValue);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addFeatureValue, close, service],
  );

  return (
    <View
      isOpen={true}
      create={create}
      error={error}
      isCreating={isCreating}
      isLoading={featureTypesLoading}
      close={close}
      featureTypes={featureTypes}
      validate={validator.validate}
    />
  );
};
