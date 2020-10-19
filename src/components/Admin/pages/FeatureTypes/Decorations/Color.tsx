/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { Circle as CircleIcon } from 'react-feather';

import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { IconSizes } from 'src/styles/icon';

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
        <CircleIcon size={IconSizes.Small} />
      </IconWrapper>
      <IconWrapper
        css={css`
          margin-right: 5px;
          color: ${theme.success};
        `}
      >
        <CircleIcon size={IconSizes.Small} />
      </IconWrapper>
      <IconWrapper
        css={css`
          margin-right: 5px;
          color: ${theme.info};
        `}
      >
        <CircleIcon size={IconSizes.Small} />
      </IconWrapper>
    </span>
  );
};
