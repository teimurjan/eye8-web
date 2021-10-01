
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import { Circle as CircleIcon } from 'react-feather';

import { IconWrapper } from '@eye8/shared/components';
import { IconSize } from '@eye8/shared/styles';

const ColorDecoration = () => {
  const theme = useTheme() as AdminUITheme;
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

export default ColorDecoration;
