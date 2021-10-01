import { Form, Tag, Input, InputNumber, Upload, Button } from 'antd';
import { RcFile } from 'antd/lib/upload';
import React, { useCallback, useEffect, useMemo } from 'react';
import { FieldRenderProps, Field, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Wysiwyg } from '@eye8/shared/components';
import { availableLocales, isAllowedForNumberInput } from '@eye8/shared/utils';

import { getFieldName } from '../../../utils';

interface Props {
  textFieldKey: string;
  linkTextFieldKey: string;
}

const TextField = ({ input, meta, locale }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={
        <>
          {intl.formatMessage({
            id: 'AdminBanners.textInput.label',
          })}
          <Tag>{locale}</Tag>
        </>
      }
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Wysiwyg
        initialValue={input.value}
        placeholder={intl.formatMessage({
          id: 'AdminBanners.textInput.placeholder',
        })}
        onChange={input.onChange}
        onBlur={input.onBlur}
        onFocus={input.onFocus}
        hasError={showError}
      />
    </Form.Item>
  );
};

const LinkTextField = ({ input, meta, locale }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={
        <>
          {intl.formatMessage({
            id: 'AdminBanners.linkTextInput.label',
          })}
          <Tag>{locale}</Tag>
        </>
      }
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input placeholder={intl.formatMessage({ id: 'AdminBanners.linkTextInput.placeholder' })} {...input} />
    </Form.Item>
  );
};

const LinkField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminBanners.linkInput.label',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input placeholder={intl.formatMessage({ id: 'AdminBanners.linkInput.placeholder' })} {...input} />
    </Form.Item>
  );
};

const ImageField = ({ input, meta }: FieldRenderProps<string | RcFile>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  const { submitSucceeded } = useFormState();

  const thumbUrl = useMemo(() => {
    if (!input.value) {
      return undefined;
    }
    if (typeof input.value === 'string') {
      return input.value;
    }

    return URL.createObjectURL(input.value);
  }, [input]);

  const cleanupThumbUrl = useCallback(() => {
    if (thumbUrl) {
      URL.revokeObjectURL(thumbUrl);
    }
  }, [thumbUrl]);

  useEffect(() => {
    console.log(submitSucceeded)
    if (submitSucceeded) {
      cleanupThumbUrl();
    }
  }, [submitSucceeded, cleanupThumbUrl]);

  const fileList = useMemo(() => {
    if (!input.value) {
      return [];
    }
    if (typeof input.value === 'string') {
      return [{ uid: input.value, name: input.value, url: input.value, thumbUrl }];
    }

    return [{ ...input.value, thumbUrl }];
  }, [input, thumbUrl]);

  const beforeUpload = useCallback(
    (file: RcFile) => {
      cleanupThumbUrl();
      input.onChange(file);
      return false;
    },
    [input, cleanupThumbUrl],
  );

  const onRemove = useCallback(() => {
    cleanupThumbUrl();
    input.onChange(undefined);
  }, [input, cleanupThumbUrl]);

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminProductTypes.image',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Upload accept="image/*" listType="picture" fileList={fileList} beforeUpload={beforeUpload} onRemove={onRemove}>
        <Button>{intl.formatMessage({ id: 'common.chooseImage' })}</Button>
      </Upload>
    </Form.Item>
  );
};

const TextColorField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminBanners.textColorInput.label',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input placeholder={intl.formatMessage({ id: 'AdminBanners.textColorInput.placeholder' })} {...input} />
    </Form.Item>
  );
};

const OffsetField = ({ input, meta, label }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={label}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <InputNumber
        {...input}
        onChange={(value) => {
          if (isAllowedForNumberInput(value)) {
            input.onChange(value);
          }
        }}
      />
    </Form.Item>
  );
};

const AdminBannerFields = ({ textFieldKey, linkTextFieldKey }: Props) => {
  const intl = useIntl();

  return (
    <>
      {availableLocales.map((locale) => (
        <Field
          key={getFieldName(textFieldKey, locale)}
          name={getFieldName(textFieldKey, locale)}
          component={TextField}
          locale={locale}
        />
      ))}
      {availableLocales.map((locale) => (
        <Field
          key={getFieldName(linkTextFieldKey, locale)}
          name={getFieldName(linkTextFieldKey, locale)}
          component={LinkTextField}
          locale={locale}
        />
      ))}
      <Field key="image" name="image" component={ImageField} />
      <Field key="link" name="link" component={LinkField} />
      <Field key="text_color" name="text_color" component={TextColorField} />
      <Field
        key="text_top_offset"
        name="text_top_offset"
        render={OffsetField}
        label={intl.formatMessage({ id: 'AdminBanners.topOffsetInput.label' })}
      />
      <Field
        key="text_bottom_offset"
        name="text_bottom_offset"
        render={OffsetField}
        label={intl.formatMessage({ id: 'AdminBanners.bottomOffsetInput.label' })}
      />
      <Field
        key="text_left_offset"
        name="text_left_offset"
        render={OffsetField}
        label={intl.formatMessage({ id: 'AdminBanners.leftOffsetInput.label' })}
      />
      <Field
        key="text_right_offset"
        name="text_right_offset"
        render={OffsetField}
        label={intl.formatMessage({ id: 'AdminBanners.rightOffsetInput.label' })}
      />
    </>
  );
};

export default AdminBannerFields;
