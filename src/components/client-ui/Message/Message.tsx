/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';

export interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'default' | 'primary' | 'error';
  size?: 'default' | 'large';
  onCloseClick?: React.MouseEventHandler;
}

export const Message: React.FC<IProps> = ({
  color = 'default',
  size = 'default',
  onCloseClick,
  children,
  className,
  ...props
}) => {
  const theme = useTheme<ClientUITheme>();

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
            top: 0;
            right: 5px;
            padding: 2.5px 5px;
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
          <FontAwesomeIcon size="sm" icon={faTimes} onClick={onCloseClick} />
        </span>
      )}
    </div>
  );
};
