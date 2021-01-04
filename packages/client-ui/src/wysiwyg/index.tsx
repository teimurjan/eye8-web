/** @jsx jsx */
import { Global, css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';

import { LoaderLayout } from '@eye8/client-ui';

export interface IProps {
  className?: string;
  placeholder?: string;
  onChange?: (serializedContent: string) => void;
  onBlur?: (e?: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (e?: React.FocusEvent<HTMLElement>) => void;
  hasError?: boolean;
  initialValue?: string;
}

interface IEditor {
  getData: () => string;
}

const CKEditorLazy = React.lazy(async () => {
  const CKEditor = (await import('@ckeditor/ckeditor5-react')).default;
  const ClassicEditor = (await import('@ckeditor/ckeditor5-build-classic')).default;

  return { default: (props: any) => <CKEditor editor={ClassicEditor} {...props} /> };
});

const Wysiwyg = ({ onChange, onBlur, onFocus, initialValue, placeholder, hasError }: IProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div className="content">
      <Global
        styles={css`
          .ck.ck-content {
            height: 300px;
            border-color: ${hasError ? `${theme.dangerColor} !important` : undefined};
          }
        `}
      />
      <React.Suspense fallback={<LoaderLayout />}>
        <CKEditorLazy
          config={{
            toolbar: {
              items: [
                'heading',
                'bold',
                'italic',
                'link',
                'bulletedList',
                'numberedList',
                'insertTable',
                '|',
                'undo',
                'redo',
              ],
            },
            placeholder,
          }}
          data={initialValue}
          onChange={(_: any, editor: IEditor) => {
            const data = editor.getData();
            onChange && onChange(data);
          }}
          onBlur={onBlur}
          onFocus={onFocus}
        />
      </React.Suspense>
    </div>
  );
};

export default Wysiwyg;
