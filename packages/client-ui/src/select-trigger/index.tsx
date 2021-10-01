
import { css } from '@emotion/react';
import classNames from 'classnames';
import { useTheme } from '@emotion/react';
import React from 'react';
import { ChevronDown as ChevronDownIcon } from 'react-feather';

import { IconWrapper, SelectTriggerProps } from '@eye8/shared/components';
import { IconSize } from '@eye8/shared/styles';

const VERTICAL_PADDING_PX = 7.5;
const LEFT_PADDING_PX = 2.5;
const RIGHT_PADDING_PX = 24;

export default React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  ({ selectedOptions, onFocus, onClick, isOpen, placeholder }, ref) => {
    const theme = useTheme() as ClientUITheme;

    return (
      <div
        className={classNames({ open: isOpen, empty: selectedOptions.length === 0 })}
        ref={ref}
        tabIndex={1}
        css={css`
          color: ${theme.textColor};
          border-bottom: 1px solid ${theme.borderColor};
          padding: ${VERTICAL_PADDING_PX}px ${RIGHT_PADDING_PX}px ${VERTICAL_PADDING_PX}px ${LEFT_PADDING_PX}px;
          cursor: pointer;
          transition: border-bottom 300ms;
          width: auto;
          position: relative;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &.empty {
            color: ${theme.textFadedColor};
          }

          &:active,
          &:focus {
            border-bottom: 1px solid ${theme.primaryColor};
            outline: none;
          }
        `}
        onClick={onClick}
        onFocus={onFocus}
      >
        {selectedOptions.length > 0 ? selectedOptions[0].name : placeholder}
        <IconWrapper
          css={css`
            position: absolute;
            right: 10px;
            top: 12.5px;
            color: ${theme.primaryColor};
            transition: transform 300ms;

            .open > & {
              transform: rotate(180deg);
            }
          `}
        >
          <ChevronDownIcon size={IconSize.Medium} />
        </IconWrapper>
      </div>
    );
  },
);
