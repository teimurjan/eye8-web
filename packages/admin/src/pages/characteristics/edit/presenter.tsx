import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { CharacteristicListRawIntlResponseItem } from '@eye8/api/characteristic';
import { CharacteristicService } from '@eye8/service/characteristic';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { getFieldName, parseFieldName } from '../../../components';
import { AdminCharacteristicsState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: CharacteristicService;
  characteristicId: number;
  history: History;
  adminCharacteristicsState: AdminCharacteristicsState;
}

export interface ViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string } }) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | undefined;
  close: () => void;
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
  preloadingError?: string;
}

export const CHARACTERISTIC_NAME_FIELD_KEY = 'name';

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

const AdminCharacteristicsEditPresenter: React.FC<Props> = ({
  View,
  history,
  service,
  adminCharacteristicsState: { set: setCharacteristicToState },
  characteristicId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [characteristic, setCharacteristic] = React.useState<CharacteristicListRawIntlResponseItem | undefined>(
    undefined,
  );
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const characteristic = await service.getOneRawIntl(characteristicId);
        if (characteristic) {
          setCharacteristic(characteristic);
        } else {
          setPreloadingError('AdminCharacteristics.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
  }, [characteristicId, service]);

  const close = React.useCallback(() => history.push('/admin/characteristics'), [history]);
  const edit: ViewProps['edit'] = async (values) => {
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
      const characteristic = await service.edit(characteristicId, formattedValues);
      setCharacteristicToState(characteristic);
      setUpdating(false);
      close();
    } catch (e) {
      setError('errors.common');
      setUpdating(false);
    }
  };

  const initialValues = React.useMemo(() => {
    return availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(CHARACTERISTIC_NAME_FIELD_KEY, locale)]: (characteristic || { name: '' }).name[locale],
      }),
      {},
    );
  }, [characteristic]);

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      preloadingError={preloadingError}
      isUpdating={isUpdating}
      isLoading={isLoading}
      initialValues={initialValues}
      close={close}
      validate={validator.validate}
    />
  );
};

export default AdminCharacteristicsEditPresenter;
