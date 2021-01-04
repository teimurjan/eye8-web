/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { ChevronDown as ChevronDownIcon } from 'react-feather';

import { ISelectOption, IconWrapper } from '@eye8/client-ui';
import { IconSize } from '@eye8/shared/styles';

const VERTICAL_PADDING_PX = 7.5;
const LEFT_PADDING_PX = 2.5;
const RIGHT_PADDING_PX = 24;

export interface IProps {
  placeholder?: string;
  onClick?: React.MouseEventHandler;
  onFocus: React.FocusEventHandler;
  isOpen: boolean;
  change: (options: Array<ISelectOption>) => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  selectedOptions: Array<ISelectOption>;
  clearable?: boolean;
}

export type ITriggerComponentType<T extends HTMLElement> = React.ComponentType<IProps & React.RefAttributes<T>>;

export default React.forwardRef<HTMLDivElement, IProps>(
  ({ selectedOptions, onFocus, onClick, isOpen, placeholder }, ref) => {
    const theme = useTheme<ClientUITheme>();

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
