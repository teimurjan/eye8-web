/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Toggle } from 'src/components/client-ui/Toggle/Toggle';
import { IViewProps as IProps } from 'src/components/client/ThemeToggle/ThemeTogglePresenter';
import { Theme } from 'src/storage/ThemeStorage';

export const ThemeToggleView = ({ onThemeChange, theme }: IProps) => {
  const intl = useIntl();

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      {intl.formatMessage({ id: 'theme.dark' })}
      <Toggle
        css={css`
          margin-left: 7.5px;
        `}
        size={Toggle.Size.Small}
        onChange={onThemeChange}
        initialChecked={theme === Theme.Dark}
      />
    </div>
  );
};
