
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'react-feather';

import { UnderlinedInput, UnderlinedInputProps } from '@eye8/client-ui';
import { IconWrapper } from '@eye8/shared/components';
import { useBoolean } from '@eye8/shared/hooks';
import { IconSize } from '@eye8/shared/styles';

export type Props = UnderlinedInputProps;

const PasswordInput = (props: UnderlinedInputProps) => {
  const theme = useTheme() as ClientUITheme;
  const { value: visible, toggle } = useBoolean();

  return (
    <UnderlinedInput
      type={visible ? 'text' : 'password'}
      append={
        <span
          css={css`
            position: absolute;
            right: 7.5px;
            bottom: 7.5px;
            color: ${theme.textColor};
            cursor: pointer;
          `}
          onClick={toggle}
        >
          <IconWrapper>
            {visible ? <EyeIcon size={IconSize.Medium} /> : <EyeOffIcon size={IconSize.Medium} />}
          </IconWrapper>
        </span>
      }
      {...props}
    />
  );
};

export default PasswordInput;
