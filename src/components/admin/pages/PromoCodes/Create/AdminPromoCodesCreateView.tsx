import * as React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from 'src/components/admin/form/ModalForm';
import { IViewProps as IProps } from 'src/components/admin/pages/PromoCodes/Create/AdminPromoCodesCreatePresenter';
import { Fields } from 'src/components/admin/pages/PromoCodes/Create/Fields';

export const AdminPromoCodesCreateView = ({
  isOpen,
  create,
  close,
  error,
  validate,
  isCreating,
  initialValues,
}: IProps) => {
  const intl = useIntl();
  return (
    <ModalForm
      initialValues={initialValues}
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
