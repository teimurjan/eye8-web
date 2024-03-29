/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { Form, FormRenderProps, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Button, HelpText, Message, Modal, ModalBackground, ModalCard, ModalContent } from '@eye8/admin-ui';
import { LoaderLayout } from '@eye8/shared/components';
import { useDebounce, useMedia } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';
import { arePropsEqual, defaultCompare, pointerCompare } from '@eye8/shared/utils';

export interface Props<T> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: T) => void;
  isLoading?: boolean;
  isPreloading?: boolean;
  validate?: (values: T) => object | Promise<object>;
  globalError?: string;
  fields: React.ReactNode;
  title: string;
  formID: string;
  submitText?: string;
  cancelText?: string;
  initialValues?: Partial<T>;
  preloadingError?: string;
  wide?: boolean;
  onChange?: (values: T) => void;
}

interface MemoizedFormProps<T extends {}> {
  id: string;
  fields: Props<T>['fields'];
  globalError: Props<T>['globalError'];
  handleSubmit: FormRenderProps['handleSubmit'];
}

const MemoizedForm = React.memo(
  <T extends {}>({ id, handleSubmit, fields, globalError }: MemoizedFormProps<T>) => {
    const intl = useIntl();

    return (
      <form id={id} onSubmit={handleSubmit}>
        {fields}
        <div
          css={css`
            text-align: center;
          `}
        >
          {globalError && <HelpText type="is-danger">{intl.formatMessage({ id: globalError })}</HelpText>}
        </div>
      </form>
    );
  },
  (prevProps, nextProps) =>
    arePropsEqual(prevProps, nextProps, { id: defaultCompare, globalError: defaultCompare, fields: pointerCompare }),
);

interface InnerFormProps<T> {
  title: Props<T>['title'];
  onClose: Props<T>['onClose'];
  isPreloading?: Props<T>['isPreloading'];
  formID: Props<T>['formID'];
  fields: Props<T>['fields'];
  globalError?: Props<T>['globalError'];
  submitText?: Props<T>['submitText'];
  cancelText?: Props<T>['cancelText'];
  isLoading?: Props<T>['isLoading'];
  className?: string;
  onChange?: Props<T>['onChange'];
}

const InnerForm = <T extends {}>({
  handleSubmit,
  title,
  onClose,
  isPreloading,
  formID,
  fields,
  globalError,
  submitText,
  cancelText,
  isLoading,
  className,
  onChange,
}: FormRenderProps<T> & InnerFormProps<T>) => {
  const { values, dirty } = useFormState<T>();

  const intl = useIntl();

  const debouncedValues = useDebounce(values, 5000);
  React.useEffect(() => {
    if (dirty && onChange) {
      onChange(debouncedValues);
    }
  }, [debouncedValues, dirty, onChange]);

  return (
    <ModalCard className={className}>
      <ModalCard.Head>
        <ModalCard.Title>{title}</ModalCard.Title>
        <ModalCard.Close onClick={onClose} />
      </ModalCard.Head>
      <ModalCard.Body>
        {isPreloading ? (
          <LoaderLayout />
        ) : (
          <MemoizedForm id={formID} handleSubmit={handleSubmit} fields={fields} globalError={globalError} />
        )}
      </ModalCard.Body>
      <ModalCard.Foot>
        <Button form={formID} type="submit" color="is-primary" loading={isLoading || isPreloading}>
          {submitText || intl.formatMessage({ id: 'common.submit' })}
        </Button>
        <Button color="is-danger" onClick={onClose}>
          {cancelText || intl.formatMessage({ id: 'common.cancel' })}
        </Button>
      </ModalCard.Foot>
    </ModalCard>
  );
};

const ModalForm = <T extends {}>(props: Props<T>) => {
  const intl = useIntl();

  const modalCSS = useMedia(
    [mediaQueries.minWidth1024],
    [
      css`
        width: 90vw;
        margin: 0;
      `,
    ],
    css`
      width: 100%;
      margin: 0;
    `,
  );

  const { isOpen, onClose, preloadingError, validate } = props;

  return (
    <Modal isOpen={isOpen}>
      <ModalBackground onClick={onClose} />
      <ModalContent css={props.wide ? modalCSS : undefined}>
        {preloadingError ? (
          <Message color="is-danger">
            <Message.Header>
              {intl.formatMessage({ id: 'common.error' })}
              <ModalCard.Close onClick={onClose} />
            </Message.Header>
            <Message.Body>{intl.formatMessage({ id: preloadingError })}</Message.Body>
          </Message>
        ) : (
          <Form<T>
            css={props.wide ? modalCSS : undefined}
            validate={validate}
            component={InnerForm as React.FC<FormRenderProps<T>>}
            {...props}
            initialValues={props.initialValues as T}
          />
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalForm;
