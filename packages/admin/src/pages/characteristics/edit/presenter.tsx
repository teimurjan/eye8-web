import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { Characteristic } from '@eye8/api';
import { CharacteristicService, CharacteristicValueService } from '@eye8/service';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { getFieldName, parseFieldName } from '../../../components';
import { AdminCharacteristicsState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  service: CharacteristicService;
  characteristicValueService: CharacteristicValueService;
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
  // characteristicValues: CharacteristicValue<true>[];
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
  characteristicValueService,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [characteristic, setCharacteristic] = React.useState<Characteristic<true> | undefined>(undefined);
  // const [characteristicValuesData, setCharacteristicValuesData] = React.useState<{
  //   entities: { [key: string]: CharacteristicValue<true> };
  //   order: number[];
  // }>({ entities: {}, order: [] });
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const characteristic = await service.getOneRawIntl(characteristicId);
        if (characteristic) {
          // const { entities, result } = await characteristicValueService.getForCharacteristicRawIntl(characteristic.id);
          // setCharacteristicValuesData({ entities: entities.characteristicValues, order: result });
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
      // characteristicValues={agregateOrderedMapToArray(
      //   characteristicValuesData.entities,
      //   characteristicValuesData.order,
      // )}
    />
  );
};

export default AdminCharacteristicsEditPresenter;
