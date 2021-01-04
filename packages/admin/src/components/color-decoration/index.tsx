/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { Circle as CircleIcon } from 'react-feather';

import { IconWrapper } from '@eye8/client-ui';
import { IconSize } from '@eye8/shared/styles';

export const ColorDecoration = () => {
  const theme = useTheme<AdminUITheme>();
  return (
    <span>
      <IconWrapper
        css={css`
          margin-right: 5px;
          color: ${theme.danger};
        `}
      >
        <CircleIcon size={IconSize.Small} />
      </IconWrapper>
      <IconWrapper
        css={css`
          margin-right: 5px;
          color: ${theme.success};
        `}
      >
        <CircleIcon size={IconSize.Small} />
      </IconWrapper>
      <IconWrapper
        css={css`
          margin-right: 5px;
          color: ${theme.info};
        `}
      >
        <CircleIcon size={IconSize.Small} />
      </IconWrapper>
    </span>
  );
};
