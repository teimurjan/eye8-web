/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { ChevronDown as ChevronDownIcon, X as XIcon } from 'react-feather';

import { Button, Tag } from '@eye8/admin-ui';
import { IconWrapper, SelectTriggerProps } from '@eye8/shared/components';
import { useBoolean } from '@eye8/shared/hooks';
import { IconSize, mediaQueries } from '@eye8/shared/styles';
import { noop } from '@eye8/shared/utils';

const TRIGGER_CLASSNAME = 'select-trigger';
const TRIGGER_SELECTOR = `.${TRIGGER_CLASSNAME}`;

export default React.forwardRef<HTMLDivElement, SelectTriggerProps>(
  (
    { isOpen, searchQuery, onClick = noop, onFocus, placeholder, change, clearable, onSearch, selectedOptions },
    ref,
  ) => {
    const theme = useTheme<AdminUITheme>();
    const { value: isFocused, setPositive: focus, setNegative: blur } = useBoolean();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
      (e) => {
        onSearch && onSearch(e.currentTarget.value);
      },
      [onSearch],
    );

    const onSearchKeyDown: React.KeyboardEventHandler<HTMLInputElement> = React.useCallback(
      (e) => {
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
      (e) => {
        if (!isFocused) {
          inputRef.current?.focus();
        }
        onClick(e);
      },
      [onClick, inputRef, isFocused],
    );

    const onFocus_: React.FocusEventHandler = React.useCallback(
      (e) => {
        focus();
        onFocus(e);
      },
      [onFocus, focus],
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
        className={TRIGGER_CLASSNAME}
        ref={ref}
        css={css`
          cursor: pointer;
          width: auto;
          position: relative;

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
            min-height: 2.25em;

            ${TRIGGER_SELECTOR}:not([data-empty='true'])[data-clearable='true'] > & {
              padding-left: 58px;
            }
          `}
        >
          {selectedOptions.map((option) => (
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

              ${TRIGGER_SELECTOR}[data-empty='true'] & {
                flex: 1;
              }

              ${TRIGGER_SELECTOR}[data-searchable='false'] & {
                caret-color: transparent;
              }
            `}
            size={isEmpty ? undefined : inputSize}
            placeholder={isEmpty ? placeholder : undefined}
            onChange={onSearchChange}
            onFocus={onFocus_}
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
            <IconWrapper>
              <XIcon size={IconSize.Medium} />
            </IconWrapper>
          </Button>
        )}
        <span
          css={css`
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            color: ${theme.info};
            transition: transform 300ms;
            z-index: 1;

            ${TRIGGER_SELECTOR}[data-open='true'] > & {
              transform: translateY(-50%), rotate(180deg);
            }
          `}
        >
          <ChevronDownIcon size={IconSize.Medium} />
        </span>
      </div>
    );
  },
);
