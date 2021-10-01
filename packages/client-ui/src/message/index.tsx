
import { css } from '@emotion/react';
import classNames from 'classnames';
import { useTheme } from '@emotion/react';
import React from 'react';
import { X as XIcon } from 'react-feather';

import { IconWrapper } from '@eye8/shared/components';
import { IconSize } from '@eye8/shared/styles';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'default' | 'primary' | 'error';
  size?: 'default' | 'large';
  onCloseClick?: React.MouseEventHandler;
}

const Message = ({ color = 'default', size = 'default', onCloseClick, children, className, ...props }: Props) => {
  const theme = useTheme() as ClientUITheme;

  return (
    <div
      className={classNames(className, color, size)}
      css={css`
        padding: 10px 15px;
        position: relative;
        max-width: 100%;
        min-width: 300px;

        &.default {
          color: ${theme.messageDefaultTextColor};
          background: ${theme.messageDefaultBackgroundColor};
        }

        &.primary {
          color: ${theme.messagePrimaryTextColor};
          background: ${theme.messagePrimaryBackgroundColor};
        }

        &.error {
          color: ${theme.messageDangerTextColor};
          background: ${theme.messageDangerBackgroundColor};
        }
      `}
      {...props}
    >
      {children}
      {onCloseClick && (
        <span
          css={css`
            position: absolute;
            top: -2.5px;
            right: 0;
            padding: 5px 10px;
            cursor: pointer;
            color: inherit;

            .default > & {
              color: ${theme.messageDefaultTextColor};
            }
            .primary > & {
              color: ${theme.messagePrimaryTextColor};
            }
            .error > & {
              color: ${theme.messageDangerTextColor};
            }
          `}
        >
          <IconWrapper>
            <XIcon size={IconSize.Small} onClick={onCloseClick} />
          </IconWrapper>
        </span>
      )}
    </div>
  );
};

export default Message;
