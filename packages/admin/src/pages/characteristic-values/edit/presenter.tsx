import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { CharacteristicValueListRawIntlResponseItem } from '@eye8/api/characteristic-value';
import { CharacteristicValueService } from '@eye8/service/characteristic-value';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { getFieldName, parseFieldName } from '../../../components';
import { AdminCharacteristicsState, AdminCharacteristicValuesState } from '../../../state';

export interface Props {
  characteristicValueId: number;
  history: History;
  View: React.ComponentType<ViewProps>;
  service: CharacteristicValueService;
  adminCharacteristicsState: AdminCharacteristicsState;
  adminCharacteristicValuesState: AdminCharacteristicValuesState;
}

export interface ViewProps {
  isOpen: boolean;
  edit: (values: { names: { [key: string]: string }; characteristic_id: string }) => void;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | undefined;
  close: () => void;
  characteristics: AdminCharacteristicsState['entities'];
  validate?: (values: object) => object | Promise<object>;
  initialValues: object;
  preloadingError?: string;
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

const AdminCharacteristicValuesEditPresenter: React.FC<Props> = ({
  characteristicValueId,

  service,
  adminCharacteristicsState: {
    get: getCharacteristics,
    isListLoading: characteristicsLoading,
    entities: characteristics,
    hasListLoaded: isDataLoaded,
  },
  history,
  adminCharacteristicValuesState: { set: setCharacteristicValueToState },
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [characteristicValue, setCharacteristicValue] = React.useState<
    undefined | CharacteristicValueListRawIntlResponseItem
  >(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const characteristicValue = await service.getOneRawIntl(characteristicValueId);
        if (characteristicValue) {
          if (!isDataLoaded) {
            getCharacteristics();
          }

          setCharacteristicValue(characteristicValue);
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

  const edit: ViewProps['edit'] = async (values) => {
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
      const characteristicValue = await service.edit(characteristicValueId, formattedValues);
      setCharacteristicValueToState(characteristicValue);
      setUpdating(false);
      close();
    } catch (e) {
      setError('errors.common');
      setUpdating(false);
    }
  };

  const initialValues = React.useMemo(
    () =>
      availableLocales.reduce(
        (acc, locale) => ({
          ...acc,
          [getFieldName(CHARACTERISTIC_VALUE_NAME_FIELD_KEY, locale)]: (characteristicValue || { name: '' }).name[
            locale
          ],
        }),
        {
          characteristic_id: characteristicValue?.characteristic.id.toString(),
        },
      ),
    [characteristicValue],
  );

  return (
    <View
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading || characteristicsLoading}
      close={close}
      characteristics={characteristics}
      validate={validator.validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};

export default AdminCharacteristicValuesEditPresenter;
