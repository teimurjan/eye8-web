import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/Admin/ModalForm';
import { IViewProps as IProps } from 'src/components/Admin/PromoCodes/Create/AdminPromoCodesCreatePresenter';
import { Fields } from 'src/components/Admin/PromoCodes/Create/Fields';

export const AdminPromoCodesCreateView = ({ isOpen, create, close, error, validate, isCreating }: IProps) => {
  const intl = useIntl();
  return (
    <ModalForm
      formID="adminPromoCodesCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminPromoCodes.create.title' })}
      fields={<Fields />}
      validate={validate}
      wide
    />
  );
};
