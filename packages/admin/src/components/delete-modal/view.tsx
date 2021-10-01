import { Modal, Alert } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';

import { ViewProps as Props } from './presenter';

const DeleteModalView = ({ isOpen, onClose, onConfirm, isLoading = false, error, info, ...props }: Props) => {
  const intl = useIntl();
  const onConfirmClick = React.useCallback(() => onConfirm(), [onConfirm]);

  return (
    <Modal
      title={intl.formatMessage({ id: 'common.deleteApproval' })}
      visible={isOpen}
      onOk={onConfirmClick}
      okButtonProps={{ loading: isLoading }}
      onCancel={onClose}
      okText={intl.formatMessage({ id: 'common.yes' })}
      cancelText={intl.formatMessage({ id: 'common.no' })}
      {...props}
    >
      {error ? (
        <Alert
          message={intl.formatMessage({ id: 'common.error' })}
          description={intl.formatMessage({ id: error })}
          type="error"
        />
      ) : (
        info
      )}
    </Modal>
  );
};

export default DeleteModalView;
