import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { RateName } from '@eye8/client/components';
import { useDI } from '@eye8/di';
import { RateCreationNotAllowedError } from '@eye8/service';
import { SchemaValidator } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
import { useAdminRatesState } from '../../../state';
import AdminRatesFields from '../fields';

const validator = new SchemaValidator(
  yup.object().shape({
    value: yup.number().required('common.errors.field.empty'),
    name: yup
      .string()
      .required('common.errors.field.empty')
      .oneOf([RateName.Primary], 'AdminRates.errors.unallowedName'),
  }),
);

export const getErrorMessageID = (e: Error) => {
  if (e instanceof RateCreationNotAllowedError) {
    return 'AdminRates.errors.limitExceeded';
  }

  return 'errors.common';
};

const AdminRatesCreate = () => {
  const intl = useIntl();
  const history = useHistory();
  const { get: getRates } = useAdminRatesState();
  const {
    di: {
      service: { rate: rateService },
    },
  } = useDI();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/rates'), [history]);

  const create = React.useCallback(
    async (values) => {
      setCreating(true);
      try {
        const formattedValues = { name: values.name.toLowerCase(), value: parseFloat(values.value) };
        await rateService.create(formattedValues);
        getRates();
        close();
      } catch (e) {
        setError(getErrorMessageID(e));
      } finally {
        setCreating(false);
      }
    },
    [rateService, getRates, close],
  );

  return (
    <ModalForm
      isOpen
      formID="adminRatesCreateForm"
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminRates.create.title' })}
      fields={<AdminRatesFields />}
      validate={validator.validate}
    />
  );
};

export default AdminRatesCreate;
