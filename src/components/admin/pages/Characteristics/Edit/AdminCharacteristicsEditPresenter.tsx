import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { ICharacteristicListRawIntlResponseItem } from 'src/api/CharacteristicAPI';
import { getFieldName, parseFieldName } from 'src/components/admin/form/IntlField';
import { ICharacteristicService } from 'src/services/CharacteristicService';
import { ContextValue as AdminCharacteristicsStateContextValue } from 'src/state/Admin/AdminCharacteristicsState';
import { availableLocales } from 'src/utils/locale';
import * as schemaValidator from 'src/utils/schemaValidator';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  service: ICharacteristicService;
  characteristicId: number;
  history: History;
  adminCharacteristicsState: AdminCharacteristicsStateContextValue['state'];
}

export interface IViewProps {
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

const validator = new schemaValidator.SchemaValidator(
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

export const AdminCharacteristicsEditPresenter: React.FC<IProps> = ({
  View,
  history,
  service,
  adminCharacteristicsState: { set: setCharacteristicToState },
  characteristicId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);
  const [characteristic, setCharacteristic] = React.useState<ICharacteristicListRawIntlResponseItem | undefined>(
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
  const edit: IViewProps['edit'] = async (values) => {
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
