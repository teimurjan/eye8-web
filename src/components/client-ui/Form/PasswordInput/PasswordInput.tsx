/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { Eye as EyeIcon, EyeOff as EyeOffIcon } from 'react-feather';

import {
  UnderlinedInput,
  IProps as IUnderlinedInputProps,
} from 'src/components/client-ui/Form/UnderlinedInput/UnderlinedInput';
import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { useBoolean } from 'src/hooks/useBoolean';
import { IconSizes } from 'src/styles/icon';

export interface IProps<T> {
  Component: React.FC<T> | React.ComponentClass<T>;
  getComponentProps: (args: { visible: boolean; toggle: () => void }) => T;
}

export const PasswordInput = <T extends object>({ Component, getComponentProps }: IProps<T>) => {
  const { value: visible, toggle } = useBoolean();
  return <Component {...getComponentProps({ visible, toggle })} />;
};

export const PasswordUnderlinedInput = (props: IUnderlinedInputProps) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <PasswordInput<IUnderlinedInputProps>
      Component={UnderlinedInput}
      getComponentProps={({ toggle, visible }) => ({
        ...props,
        type: visible ? 'text' : 'password',
        append: (
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
              {visible ? <EyeIcon size={IconSizes.Medium} /> : <EyeOffIcon size={IconSizes.Medium} />}
            </IconWrapper>
          </span>
        ),
      })}
    />
  );
};
