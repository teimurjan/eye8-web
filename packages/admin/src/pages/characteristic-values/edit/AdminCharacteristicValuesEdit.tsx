import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import * as yup from 'yup';

import { CharacteristicValue } from '@eye8/api';
import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminCharacteristicValuesState, useAdminCharacteristicsState } from '../../../state';
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
        characteristic_id: yup.number().nullable(true),
      },
    ),
  ),
);

const AdminCharacteristicValuesEdit = () => {
  const history = useHistory();
  const { id: characteristicValueIdStr } = useParams<{ id: string }>();
  const characteristicValueId = parseInt(characteristicValueIdStr, 10);

  const {
    di: {
      service: { characteristicValue: characteristicValueService },
    },
  } = useDI();
  const {
    get: getCharacteristics,
    entities: characteristics,
    isListLoading: characteristicsLoading,
    listError,
  } = useAdminCharacteristicsState();
  const { set: setCharacteristicValueToState } = useAdminCharacteristicValuesState();

  const intl = useIntl();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [characteristicValue, setCharachteristicValue] = React.useState<CharacteristicValue<true> | undefined>(
    undefined,
  );
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        getCharacteristics();

        const characteristicValue = await characteristicValueService.getOneRawIntl(characteristicValueId);
        if (characteristicValue) {
          setCharachteristicValue(characteristicValue);
        } else {
          setPreloadingError('AdminCharacteristicValues.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/characteristicValues'), [history]);

  const edit = React.useCallback(
    async (values) => {
      setUpdating(true);

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
          characteristic_id: parseInt(values.characteristic_id, 10),
        },
      );

      try {
        const characteristicValue = await characteristicValueService.edit(characteristicValueId, formattedValues);
        setCharacteristicValueToState(characteristicValue);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [characteristicValueId, close, characteristicValueService, setCharacteristicValueToState],
  );

  const initialValues = React.useMemo(() => {
    if (characteristicValue) {
      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(CHARACTERISTIC_VALUE_NAME_FIELD_KEY, locale)]: characteristicValue.name[locale],
          }),
          {},
        ),
        characteristic_id: characteristicValue.characteristic.id,
      };
    }

    return {};
  }, [characteristicValue]);

  return (
    <ModalForm
      isOpen
      formID="adminCharacteristicValuesEditForm"
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading || characteristicsLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError || listError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminCharacteristicValues.edit.title' })}
      fields={
        <AdminCharacteristicValuesFields
          characteristics={characteristics}
          nameFieldKey={CHARACTERISTIC_VALUE_NAME_FIELD_KEY}
        />
      }
      validate={validator.validate}
      initialValues={initialValues}
    />
  );
};

export default AdminCharacteristicValuesEdit;
