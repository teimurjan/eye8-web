import * as React from 'react';
import { File as FileIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { formatMediaURL } from 'src/utils/url';

interface IProps extends Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'value'> {
  showPreview?: boolean;
  defaultValue?: string;
  onChange: (file: File | undefined) => void;
  value?: File | string;
}

const Filename = ({ file }: { file: IProps['value'] }) => {
  if (typeof file === 'string') {
    return <span className="file-name">{file}</span>;
  }

  if (file && file.name) {
    return <span className="file-name">{file.name}</span>;
  }

  return null;
};

export const FileInput: React.SFC<IProps> = ({ placeholder, value, showPreview = true, onChange, accept }) => {
  const intl = useIntl();
  const [previewURL, setPreviewURL] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!value) return;

    if (typeof value === 'string') {
      setPreviewURL(formatMediaURL(value));
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewURL(url);

    return () => URL.revokeObjectURL(url);
  }, [value]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (e) => {
      if (onChange) {
        onChange(e.target.files ? e.target.files[0] : undefined);
      }
    },
    [onChange],
  );

  return (
    <div className="file-container">
      <div className="file has-name is-fullwidth">
        <label className="file-label">
          <input className="file-input" type="file" onChange={handleChange} accept={accept} />
          <span className="file-cta">
            <span className="file-icon">
              <FileIcon />
            </span>
            <span className="file-label">{placeholder}</span>
          </span>
          <Filename file={value} />
        </label>
      </div>
      {showPreview && previewURL && <img alt={intl.formatMessage({ id: 'FileInput.alt' })} src={previewURL} />}
    </div>
  );
};
