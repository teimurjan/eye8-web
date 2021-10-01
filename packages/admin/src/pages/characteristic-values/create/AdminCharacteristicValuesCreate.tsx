import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminCharacteristicsState, useAdminCharacteristicValuesState } from '../../../state';
import { getFieldName, parseFieldName } from '../../../utils';
import AdminCharacteristicValuesFields from '../fields';

const CHARACTERISTIC_VALUE_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(CHARACTERISTIC_VALUE_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {
        characteristic_id: yup.string().required(),
      },
    ),
  ),
);

const AdminCharacteristicValuesCreate = () => {
  const intl = useIntl();
  const history = useHistory();

  const {
    di: {
      service: { characteristicValue: characteristicValueService },
    },
  } = useDI();
  const {
    entities: characteristics,
    isListLoading: characteristicsLoading,
    listError,
    get: getCharacteristics,
  } = useAdminCharacteristicsState();
  const { add: addCharacteristicValue } = useAdminCharacteristicValuesState();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/characteristicValues'), [history]);

  useEffect(() => {
    getCharacteristics();
  }, [getCharacteristics]);

  const create = React.useCallback(
    async (values) => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === CHARACTERISTIC_VALUE_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
          characteristic_id: values.characteristic_id,
        },
      );

      try {
        const characteristicValue = await characteristicValueService.create(formattedValues);
        addCharacteristicValue(characteristicValue);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addCharacteristicValue, close, characteristicValueService],
  );

  return (
    <ModalForm
      isOpen
      formID="adminCharacteristicValuesCreateForm"
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      isPreloading={characteristicsLoading}
      preloadingError={listError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminCharacteristicValues.create.title' })}
      fields={
        <AdminCharacteristicValuesFields
          characteristics={characteristics}
          nameFieldKey={CHARACTERISTIC_VALUE_NAME_FIELD_KEY}
        />
      }
      validate={validator.validate}
    />
  );
};

export default AdminCharacteristicValuesCreate;
