/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { ISelectTriggerProps } from 'src/components/client-ui/Select/Select';

const VERTICAL_PADDING_PX = 5;
const HORIZONTAL_PADDING_PX = 7.5;

export const SelectTrigger = React.forwardRef<HTMLDivElement, ISelectTriggerProps>(
  ({ title, onClick, isOpen, placeholder, clear }, ref) => {
    const theme = useTheme<AdminUITheme>();

    return (
      <div
        ref={ref}
        className={classNames({ open: isOpen, empty: !title })}
        tabIndex={1}
        css={css`
          border: 1px solid ${theme.greyLight};
          color: ${theme.greyDark};
          padding: ${VERTICAL_PADDING_PX}px ${HORIZONTAL_PADDING_PX}px;
          cursor: pointer;
          transition: border 300ms;
          width: auto;
          position: relative;
          box-shadow: inset 0 1px 2px rgba(10, 10, 10, 0.1);
          border-radius: 4px;

          &.empty {
            color: ${theme.greyLight};
          }

          &:active,
          &:focus {
            border: 1px solid ${theme.greyDark};
            outline: none;
          }
        `}
        onClick={onClick}
      >
        {clear && (
          <span
            onClick={clear}
            css={css`
              margin-right: 10px;
              cursor: pointer;
            `}
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>
        )}
        {title ? title : placeholder}
        <FontAwesomeIcon
          css={css`
            position: absolute;
            right: 10px;
            top: 9px;
            color: ${theme.info};
            transition: transform 300ms;

            .open > & {
              transform: rotate(180deg);
            }
          `}
          icon={faCaretDown}
        />
      </div>
    );
  },
);
