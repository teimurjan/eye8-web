import { Modal, Alert, Typography } from 'antd';
import React from 'react';
import { Form as ReactFinalForm, FormRenderProps, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { useDebounce } from '@eye8/shared/hooks';
import { arePropsEqual, defaultCompare, pointerCompare } from '@eye8/shared/utils';

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
        {globalError && <Typography.Text type="danger">{intl.formatMessage({ id: globalError })}</Typography.Text>}
      </form>
    );
  },
  (prevProps, nextProps) =>
    arePropsEqual(prevProps, nextProps, { id: defaultCompare, globalError: defaultCompare, fields: pointerCompare }),
);

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

interface FormProps<T> {
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

const Form = <T extends {}>({
  handleSubmit,
  formID,
  fields,
  globalError,
  onChange,
}: FormRenderProps<T> & FormProps<T>) => {
  const { values, dirty } = useFormState<T>();

  const debouncedValues = useDebounce(values, 5000);
  React.useEffect(() => {
    if (dirty && onChange) {
      onChange(debouncedValues);
    }
  }, [debouncedValues, dirty, onChange]);

  return <MemoizedForm id={formID} handleSubmit={handleSubmit} fields={fields} globalError={globalError} />;
};

const ModalForm = <T extends {}>(props: Props<T>) => {
  const intl = useIntl();

  const {
    title,
    isOpen,
    onClose,
    isLoading,
    isPreloading,
    preloadingError,
    validate,
    submitText,
    cancelText,
    wide,
  } = props;

  return (
    <Modal
      title={title}
      visible={isOpen}
      onCancel={onClose}
      okButtonProps={{
        form: props.formID,
        htmlType: 'submit',
      }}
      confirmLoading={isLoading || isPreloading}
      okText={submitText || intl.formatMessage({ id: 'common.submit' })}
      cancelText={cancelText || intl.formatMessage({ id: 'common.cancel' })}
      width={wide ? '90vw' : undefined}
    >
      {preloadingError ? (
        <Alert message={preloadingError} type="error" />
      ) : (
        <ReactFinalForm<T>
          validate={validate}
          component={Form as React.FC<FormRenderProps<T>>}
          {...props}
          initialValues={props.initialValues as T}
        />
      )}
    </Modal>
  );
};

export default ModalForm;
