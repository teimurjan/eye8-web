import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import * as yup from 'yup';

import { Characteristic } from '@eye8/api';
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

const AdminCharacteristicsEdit = () => {
  const history = useHistory();
  const { id: characteristicIdStr } = useParams<{ id: string }>();
  const characteristicId = parseInt(characteristicIdStr, 10);

  const {
    di: {
      service: { characteristic: characteristicService },
    },
  } = useDI();
  const { set: setCharacteristicToState } = useAdminCharacteristicsState();

  const intl = useIntl();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [characteristic, setCharachteristic] = React.useState<Characteristic<true> | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const characteristic = await characteristicService.getOneRawIntl(characteristicId);
        if (characteristic) {
          setCharachteristic(characteristic);
        } else {
          setPreloadingError('AdminCharacteristics.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/characteristics'), [history]);

  const edit = React.useCallback(
    async (values) => {
      setUpdating(true);

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
        const characteristic = await characteristicService.edit(characteristicId, formattedValues);
        setCharacteristicToState(characteristic);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [characteristicId, close, characteristicService, setCharacteristicToState],
  );

  const initialValues = React.useMemo(() => {
    if (characteristic) {
      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(CHARACTERISTIC_NAME_FIELD_KEY, locale)]: characteristic.name[locale],
          }),
          {},
        ),
      };
    }

    return {};
  }, [characteristic]);

  return (
    <ModalForm
      isOpen
      formID="adminCharacteristicsEditForm"
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminCharacteristics.edit.title' })}
      fields={<AdminCharacteristicsFields nameFieldKey={CHARACTERISTIC_NAME_FIELD_KEY} />}
      validate={validator.validate}
      initialValues={initialValues}
    />
  );
};

export default AdminCharacteristicsEdit;
