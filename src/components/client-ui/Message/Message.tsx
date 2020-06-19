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

        &.large {
          max-width: 100%;
          min-width: 300px;
          padding: 15px;
        }

        &.default {
          border-left: 5px solid ${theme.borderColor};
          color: ${theme.textColor};
          background: ${theme.backgroundPrimaryColor};
        }

        &.primary {
          border-left: 5px solid ${theme.primaryColor};
          color: ${theme.textColor};
          background: ${theme.backgroundPrimaryColor};
        }

        &.error {
          border-left: 5px solid ${theme.dangerColor};
          color: ${theme.textOnDangerColor};
          background: ${theme.backgroundDangerColor};
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
            padding: 2.5px;
            cursor: pointer;
            color: inherit;
          `}
        >
          <FontAwesomeIcon icon={faTimes} onClick={onCloseClick} />
        </span>
      )}
    </div>
  );
};
