import * as React from 'react';
import { useIntl } from 'react-intl';

import {
  BANNER_TEXT_FIELD_KEY,
  BANNER_LINK_TEXT_FIELD_KEY,
  IViewProps as IProps,
} from 'src/components/Admin/Banners/Create/AdminBannersCreatePresenter';
import { Fields } from 'src/components/Admin/Banners/Create/Fields';
import { ModalForm } from 'src/components/Admin/ModalForm';

export const AdminBannersCreateView = ({ isOpen, create, close, error, validate, isCreating }: IProps) => {
  const intl = useIntl();

  return (
    <ModalForm
      formID="adminBannersCreateForm"
      isOpen={isOpen}
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error}
      title={intl.formatMessage({ id: 'AdminBanners.create.title' })}
      fields={<Fields textFieldKey={BANNER_TEXT_FIELD_KEY} linkTextFieldKey={BANNER_LINK_TEXT_FIELD_KEY} />}
      validate={validate}
    />
  );
};
