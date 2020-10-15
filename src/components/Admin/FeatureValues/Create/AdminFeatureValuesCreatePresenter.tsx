import * as React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { IFeatureValueService } from 'src/services/FeatureValueService';
import { ContextValue as AdminFeatureTypesStateContextValue } from 'src/state/Admin/AdminFeatureTypesState';
import { ContextValue as AdminFeatureValuesStateContextValue } from 'src/state/Admin/AdminFeatureValuesState';
import { availableLocales } from 'src/utils/locale';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IFeatureValueService;
  close: () => void;
  adminFeatureTypesState: AdminFeatureTypesStateContextValue['state'];
  adminFeatureValuesState: AdminFeatureValuesStateContextValue['state'];
}

export interface IViewProps {
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

const validator = new schemaValidator.SchemaValidator(
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

export const AdminFeatureValuesCreatePresenter: React.FC<IProps> = ({
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

  const create: IViewProps['create'] = React.useCallback(
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
