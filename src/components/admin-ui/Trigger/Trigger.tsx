/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faCaretDown, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { Button } from 'src/components/admin-ui/Button/Button';
import { Tag } from 'src/components/admin-ui/Tag/Tag';
import { ISelectTriggerProps } from 'src/components/client-ui/Select/Trigger';
import { useBoolean } from 'src/hooks/useBoolean';
import { mediaQueries } from 'src/styles/media';

const clearIconVisibleSelector = `.select-trigger:not([data-empty='true'])[data-clearable='true']`;
export const SearchableSelectTrigger = React.forwardRef<HTMLDivElement, ISelectTriggerProps>(
  ({ isOpen, searchQuery, onClick, placeholder, change, clearable, onSearch, selectedOptions }, ref) => {
    const theme = useTheme<AdminUITheme>();
    const { value: isFocused, setPositive: focus, setNegative: blur } = useBoolean();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
      e => {
        onSearch && onSearch(e.currentTarget.value);
      },
      [onSearch],
    );

    const onSearchKeyDown: React.KeyboardEventHandler<HTMLInputElement> = React.useCallback(
      e => {
        if (searchQuery === '' && (e.keyCode === 8 || e.charCode === 8)) {
          const newOptions = [...selectedOptions];
          newOptions.pop();
          change(newOptions);
        }
      },
      [searchQuery, selectedOptions, change],
    );

    const query = React.useMemo(() => {
      return isFocused && onSearch && typeof searchQuery === 'string' ? searchQuery : '';
    }, [searchQuery, isFocused, onSearch]);

    const onClick_: React.MouseEventHandler = React.useCallback(
      e => {
        if (!isFocused) {
          inputRef.current?.focus();
        }
        onClick(e);
      },
      [onClick, inputRef, isFocused],
    );

    const isEmpty = selectedOptions.length === 0;
    const dataAttributes = {
      'data-empty': isEmpty,
      'data-focused': isFocused,
      'data-clearable': clearable,
      'data-searchable': !!onSearch,
      'data-open': isOpen,
    };

    const inputSize = (query.length ? query.length : 1) * 2;

    return (
      <div
        {...dataAttributes}
        className="select-trigger"
        ref={ref}
        css={css`
          cursor: pointer;
          width: auto;
          position: relative;
          min-width: 300px;

          @media ${mediaQueries.maxWidth768} {
            width: 100%;
          }
        `}
        onClick={onClick_}
      >
        <div
          className="input"
          css={css`
            height: auto;
            transition: padding-left 300ms;
            padding-right: 24px;
            overflow: hidden;
            display: flex;
            flex-wrap: wrap;

            ${clearIconVisibleSelector} > & {
              padding-left: 44px;
            }

            .select-trigger[data-searchable='false'] & > {
              caret-color: transparent;
            }
          `}
        >
          {selectedOptions.map(option => (
            <Tag
              css={css`
                margin-right: 2.5px;
              `}
              color="is-light"
            >
              {option.name}
            </Tag>
          ))}
          <input
            ref={inputRef}
            css={css`
              border: none;
              outline: none;
              font-size: 1rem;

              .select-trigger[data-empty='true'] & {
                flex: 1;
              }
            `}
            size={isEmpty ? undefined : inputSize}
            placeholder={isEmpty ? placeholder : undefined}
            onChange={onSearchChange}
            onFocus={focus}
            onBlur={blur}
            value={query}
            onKeyDown={onSearchKeyDown}
          />
        </div>
        {clearable && !isEmpty && (
          <Button
            onClick={() => change([])}
            css={css`
              cursor: pointer;
              position: absolute;
              left: 0;
              top: 50%;
              transform: translateY(-50%);
              z-index: 1;
              height: 100%;
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
            z-index: 1;

            .select-trigger[data-open='true'] > & {
              transform: translateY(-50%), rotate(180deg);
            }
          `}
          icon={faCaretDown}
        />
      </div>
    );
  },
);
