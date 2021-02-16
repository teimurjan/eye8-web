import React from 'react';
import * as yup from 'yup';

import { CharacteristicValueService } from '@eye8/service';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { getFieldName, parseFieldName } from '../../../components';
import { AdminCharacteristicsState, AdminCharacteristicValuesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: CharacteristicValueService;
  close: () => void;
  adminCharacteristicsState: AdminCharacteristicsState;
  adminCharacteristicValuesState: AdminCharacteristicValuesState;
}

export interface ViewProps {
  isOpen: boolean;
  create: (values: { names: { [key: string]: string }; characteristic_id: string }) => void;
  isCreating: boolean;
  isLoading: boolean;
  error: string | undefined;
  close: () => void;
  characteristics: AdminCharacteristicsState['entities'];
  validate?: (values: object) => object | Promise<object>;
}

export const CHARACTERISTIC_VALUE_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
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

const AdminCharacteristicValuesCreatePresenter: React.FC<Props> = ({
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

  const create: ViewProps['create'] = React.useCallback(
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

export default AdminCharacteristicValuesCreatePresenter;
