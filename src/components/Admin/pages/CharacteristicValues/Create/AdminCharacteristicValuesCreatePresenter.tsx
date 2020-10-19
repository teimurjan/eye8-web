import * as React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from 'src/components/admin/IntlField';
import { ICharacteristicValueService } from 'src/services/CharacteristicValueService';
import { ContextValue as AdminCharacteristicsStateContextValue } from 'src/state/Admin/AdminCharacteristicsState';
import { ContextValue as AdminCharacteristicValuesStateContextValue } from 'src/state/Admin/AdminCharacteristicValuesState';
import { availableLocales } from 'src/utils/locale';
import * as schemaValidator from 'src/utils/schemaValidator';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  service: ICharacteristicValueService;
  close: () => void;
  adminCharacteristicsState: AdminCharacteristicsStateContextValue['state'];
  adminCharacteristicValuesState: AdminCharacteristicValuesStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string }; characteristic_id: string }) => void;
  isCreating: boolean;
  isLoading: boolean;
  error: string | undefined;
  close: () => void;
  characteristics: AdminCharacteristicsStateContextValue['state']['entities'];
  validate?: (values: object) => object | Promise<object>;
}

export const CHARACTERISTIC_VALUE_NAME_FIELD_KEY = 'name';

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(CHARACTERISTIC_VALUE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {
        characteristic_id: yup.number().required('common.errors.field.empty'),
      },
    ),
  ),
);

export const AdminCharacteristicValuesCreatePresenter: React.FC<IProps> = ({
  adminCharacteristicsState: {
    get: getCharacteristics,
    isListLoading: characteristicsLoading,
    entities: characteristics,
    hasListLoaded: isDataLoaded,
  },
  adminCharacteristicValuesState: { add: addCharacteristicValue },
  View,
  service,
  close,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  React.useEffect(() => {
    if (!isDataLoaded) {
      getCharacteristics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const create: IViewProps['create'] = React.useCallback(
    async (values) => {
      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === CHARACTERISTIC_VALUE_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
          }

          return acc;
        },
        {
          characteristic_id: parseInt(values.characteristic_id, 10),
          names: {},
        },
      );

      try {
        const featureValue = await service.create(formattedValues);
        addCharacteristicValue(featureValue);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addCharacteristicValue, close, service],
  );

  return (
    <View
      isOpen={true}
      create={create}
      error={error}
      isCreating={isCreating}
      isLoading={characteristicsLoading}
      close={close}
      characteristics={characteristics}
      validate={validator.validate}
    />
  );
};
