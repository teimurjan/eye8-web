/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Toggle } from '@eye8/client-ui';
import { IViewProps as IProps } from '@eye8/client/components/theme-toggle/presenter';
import { Theme } from '@eye8/storage/theme';

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
