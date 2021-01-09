import React from 'react';
import { useIntl } from 'react-intl';

import { Button, Message, Modal, ModalBackground, ModalCard, ModalContent } from '@eye8/admin-ui';
import { ViewProps as Props } from '@eye8/admin/components/delete-modal/presenter';

export const DeleteModalView = ({ isOpen, onClose, onConfirm, isLoading = false, error, ...props }: Props) => {
  const intl = useIntl();
  const onConfirmClick = React.useCallback(() => onConfirm(), [onConfirm]);

  return (
    <Modal isOpen={isOpen} {...props}>
      <ModalBackground onClick={onClose} />
      <ModalContent>
        {error ? (
          <Message color="is-danger">
            <Message.Header>
              {intl.formatMessage({ id: 'common.error' })}
              <ModalCard.Close onClick={onClose} />
            </Message.Header>
            <Message.Body>{intl.formatMessage({ id: error })}</Message.Body>
          </Message>
        ) : (
          <ModalCard>
            <ModalCard.Head>
              <ModalCard.Title>{intl.formatMessage({ id: 'common.deleteApproval' })}</ModalCard.Title>
              <ModalCard.Close onClick={onClose} />
            </ModalCard.Head>
            <ModalCard.Foot>
              <Button color="is-primary" onClick={onConfirmClick} loading={isLoading} disabled={!!error}>
                {intl.formatMessage({ id: 'common.yes' })}
              </Button>
              <Button color="is-danger" onClick={onClose}>
                {intl.formatMessage({ id: 'common.no' })}
              </Button>
            </ModalCard.Foot>
          </ModalCard>
        )}
      </ModalContent>
    </Modal>
  );
};
