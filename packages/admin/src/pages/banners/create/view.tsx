import React from 'react';
import { useIntl } from 'react-intl';

import { ModalForm } from '../../../components';
import {
  BANNER_TEXT_FIELD_KEY,
  BANNER_LINK_TEXT_FIELD_KEY,
  ViewProps as Props,
} from '../create/presenter';


import Fields from './fields';

const AdminBannersCreateView = ({ isOpen, create, close, error, validate, isCreating }: Props) => {
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

export default AdminBannersCreateView;
