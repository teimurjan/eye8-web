/** @jsx jsx */
import { Global, css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';

interface IProps {
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

export const WYSIWYG: React.SFC<IProps> = ({ onChange, onBlur, onFocus, initialValue, placeholder, hasError }) => {
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
