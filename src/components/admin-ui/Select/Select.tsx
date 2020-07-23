/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { Button } from 'src/components/admin-ui/Button/Button';
import { Input } from 'src/components/admin-ui/Input/Input';
import { ISelectTriggerProps } from 'src/components/client-ui/Select/Select';
import { useBoolean } from 'src/hooks/useBoolean';

export const SelectTrigger = React.forwardRef<HTMLDivElement, ISelectTriggerProps>(
  ({ isOpen, searchQuery, onClick, placeholder, clear, onSearch, value }, ref) => {
    const theme = useTheme<AdminUITheme>();
    const { value: isFocused, setPositive: focus, setNegative: blur } = useBoolean();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
      e => {
        onSearch && onSearch(e.currentTarget.value);
      },
      [onSearch],
    );

    const query = (isFocused && onSearch ? searchQuery : value.searchQuery) ?? '';

    const onClick_: React.MouseEventHandler = React.useCallback(
      e => {
        if (!isFocused) {
          inputRef.current?.focus();
        }
        onClick(e);
      },
      [onClick, inputRef, isFocused],
    );

    return (
      <div
        data-open={classNames({ open: isOpen })}
        ref={ref}
        css={css`
          cursor: pointer;
          width: auto;
          position: relative;
        `}
        onClick={onClick_}
      >
        <Input
          ref={inputRef}
          data-empty={!query}
          data-focused={isFocused}
          data-clearable={!!clear}
          data-searchable={!!onSearch}
          css={css`
            transition: padding-left 300ms;

            &:not([data-empty='true'])[data-focused='false'][data-clearable='true'] {
              padding-left: 44px;
            }

            &[data-searchable='false'] {
              caret-color: transparent;
            }
          `}
          onFocus={focus}
          onBlur={blur}
          placeholder={placeholder}
          onChange={onSearchChange}
          value={query}
        />
        {clear && !isFocused && (
          <Button
            onClick={clear}
            css={css`
              cursor: pointer;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
            `}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        )}
        <FontAwesomeIcon
          css={css`
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: ${theme.info};
            transition: transform 300ms;

            [data-open='true'] > & {
              transform: rotate(180deg);
            }
          `}
          icon={faCaretDown}
        />
      </div>
    );
  },
);
