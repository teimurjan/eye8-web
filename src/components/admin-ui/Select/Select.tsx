/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { Input } from 'src/components/admin-ui/Input/Input';
import { ISelectTriggerProps } from 'src/components/client-ui/Select/Select';
import { useBoolean } from 'src/hooks/useBoolean';

export const SelectTrigger = React.forwardRef<HTMLDivElement, ISelectTriggerProps>(
  ({ searchQuery, onClick, placeholder, clear, onSearch, value }, ref) => {
    const theme = useTheme<AdminUITheme>();
    const { value: isFocused, setPositive: focus, setNegative: blur } = useBoolean();

    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
      e => {
        onSearch && onSearch(e.currentTarget.value);
      },
      [onSearch],
    );

    const onBlur = React.useCallback(() => {
      blur();
      onSearch && onSearch('');
    }, [onSearch, blur]);

    const query = (isFocused && onSearch ? searchQuery : value.searchQuery) ?? '';

    return (
      <div
        ref={ref}
        css={css`
          cursor: pointer;
          width: auto;
          position: relative;
        `}
        onClick={onClick}
      >
        <Input
          data-empty={!query}
          data-focused={isFocused}
          data-clearable={!!clear}
          data-searchable={!!onSearch}
          css={css`
            transition: padding-left 300ms;

            &:not([data-empty='true'])[data-focused='false'][data-clearable='true'] {
              padding-left: 30px;
            }

            &[data-searchable='false'] {
              caret-color: transparent;
            }
          `}
          onFocus={focus}
          onBlur={onBlur}
          placeholder={placeholder}
          onChange={onSearchChange}
          value={query}
        />
        {clear && !isFocused && (
          <span
            onClick={clear}
            css={css`
              cursor: pointer;
              position: absolute;
              left: 10px;
              top: 7px;
            `}
          >
            <FontAwesomeIcon icon={faTimes} />
          </span>
        )}
        <FontAwesomeIcon
          css={css`
            position: absolute;
            right: 10px;
            top: 10px;
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
