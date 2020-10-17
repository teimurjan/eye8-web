import * as React from 'react';
import { useIntl } from 'react-intl';

import { Button } from 'src/components/admin-ui/Button/Button';
import { Message } from 'src/components/admin-ui/Message/Message';
import { Modal } from 'src/components/admin-ui/Modal/Modal';
import { ModalBackground } from 'src/components/admin-ui/ModalBackground/ModalBackground';
import { ModalCard } from 'src/components/admin-ui/ModalCard/ModalCard';
import { ModalContent } from 'src/components/admin-ui/ModalContent/ModalContent';
import { IViewProps as IProps } from 'src/components/Admin/DeleteModal/DeleteModalPresenter';

export const DeleteModalView = ({ isOpen, onClose, onConfirm, isLoading = false, error, ...props }: IProps) => {
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
