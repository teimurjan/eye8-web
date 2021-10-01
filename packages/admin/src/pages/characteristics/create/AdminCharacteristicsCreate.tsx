import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminCharacteristicsState } from '../../../state';
import { getFieldName, parseFieldName } from '../../../utils';
import AdminCharacteristicsFields from '../fields';

const CHARACTERISTIC_NAME_FIELD_KEY = 'name';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(CHARACTERISTIC_NAME_FIELD_KEY, locale)]: yup.string().required('common.errors.field.empty'),
      }),
      {},
    ),
  ),
);

const AdminCharacteristicsCreate = () => {
  const intl = useIntl();
  const history = useHistory();

  const {
    di: {
      service: { characteristic: characteristicService },
    },
  } = useDI();
  const { add: addCharacteristic } = useAdminCharacteristicsState();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/characteristics'), [history]);

  const create = React.useCallback(
    async (values) => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === CHARACTERISTIC_NAME_FIELD_KEY) {
            return { ...acc, names: { ...acc.names, [locale]: values[fieldName] } };
          }

          return acc;
        },
        {
          names: {},
        },
      );

      try {
        const characteristic = await characteristicService.create(formattedValues);
        addCharacteristic(characteristic);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addCharacteristic, close, characteristicService],
  );

  return (
    <ModalForm
      isOpen
      formID="adminCharacteristicsCreateForm"
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminCharacteristics.create.title' })}
      fields={<AdminCharacteristicsFields nameFieldKey={CHARACTERISTIC_NAME_FIELD_KEY} />}
      validate={validator.validate}
    />
  );
};

export default AdminCharacteristicsCreate;
