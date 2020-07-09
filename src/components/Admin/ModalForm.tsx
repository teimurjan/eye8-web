/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { Form, FormRenderProps, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Button } from 'src/components/admin-ui/Button/Button';
import { HelpText } from 'src/components/admin-ui/HelpText/HelpText';
import { Message } from 'src/components/admin-ui/Message/Message';
import { Modal } from 'src/components/admin-ui/Modal/Modal';
import { ModalBackground } from 'src/components/admin-ui/ModalBackground/ModalBackground';
import { ModalCard } from 'src/components/admin-ui/ModalCard/ModalCard';
import { ModalContent } from 'src/components/admin-ui/ModalContent/ModalContent';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
import { useDebounce } from 'src/hooks/useDebounce';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';
import { arePropsEqual, defaultCompare } from 'src/utils/propEquality';

export interface IProps<T> {
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

interface IMemoizedFormProps<T extends {}> {
  id: string;
  fields: IProps<T>['fields'];
  globalError: IProps<T>['globalError'];
  handleSubmit: FormRenderProps['handleSubmit'];
}

const MemoizedForm = React.memo(
  <T extends {}>({ id, handleSubmit, fields, globalError }: IMemoizedFormProps<T>) => {
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
    arePropsEqual(prevProps, nextProps, { id: defaultCompare, globalError: defaultCompare, fields: defaultCompare }),
);

interface IInnerFormProps<T> {
  title: IProps<T>['title'];
  onClose: IProps<T>['onClose'];
  isPreloading?: IProps<T>['isPreloading'];
  formID: IProps<T>['formID'];
  fields: IProps<T>['fields'];
  globalError?: IProps<T>['globalError'];
  submitText?: IProps<T>['submitText'];
  cancelText?: IProps<T>['cancelText'];
  isLoading?: IProps<T>['isLoading'];
  className?: string;
  onChange?: IProps<T>['onChange'];
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
}: FormRenderProps<T> & IInnerFormProps<T>) => {
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

export const ModalForm = <T extends {}>(props: IProps<T>) => {
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
