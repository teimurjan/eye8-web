/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Toggle } from '@eye8/client-ui';
import { Theme } from '@eye8/shared/utils';

import { ViewProps as Props } from './presenter';

const ThemeToggleView = ({ onThemeChange, theme }: Props) => {
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

export default ThemeToggleView;
