import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/Admin/ModalForm';
import { IViewProps as IProps } from 'src/components/Admin/Rates/Create/AdminRatesCreatePresenter';
import { Fields } from 'src/components/Admin/Rates/Create/Fields';

export const AdminRatesCreateView = ({ isOpen, create, close, error, validate, isCreating }: IProps) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminRatesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminRates.create.title' })}
      fields={<Fields />}
      validate={validate}
      wide
    />
  );
};
