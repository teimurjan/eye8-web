/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { Check as CheckIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { IconWrapper, Popover } from '@eye8/shared/components';
import { useSelect } from '@eye8/shared/hooks';
import { IconSize, mediaQueries } from '@eye8/shared/styles';

export interface OptionProps {
  value?: string;
  children: React.ReactNode;
  name?: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
}

export type OptionChild = React.ReactElement<OptionProps>;

export type SingleValue = string | undefined;
export type MultipleValue = string[];
export type Value = MultipleValue | SingleValue;

export interface TriggerProps {
  placeholder?: string;
  onClick?: React.MouseEventHandler;
  onFocus: React.FocusEventHandler;
  isOpen: boolean;
  change: (options: Array<OptionProps>) => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  selectedOptions: Array<OptionProps>;
  clearable?: boolean;
}

export type TriggerComponentType<T extends HTMLElement> = React.ComponentType<
  TriggerProps & React.RefAttributes<T>
>;

const SelectOptionCheckedFlag = () => {
  const theme = useTheme<ClientUITheme>();

  return (
    <IconWrapper
      css={css`
        margin-left: auto;
        color: ${theme.primaryColor};
      `}
    >
      <CheckIcon size={IconSize.Medium} />
    </IconWrapper>
  );
};

const SelectOption = ({ className, children, selected, value, onClick }: OptionProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <Popover.Item
      css={css`
        display: flex;
        align-items: center;

        &[data-selected='true'] {
          font-weight: bold;
          background: ${theme.backgroundSelectedColor};
        }
      `}
      className={className}
      data-selected={selected}
      data-value={value}
      onClick={onClick}
      Component="div"
    >
      {children}
      {selected && <SelectOptionCheckedFlag />}
    </Popover.Item>
  );
};

SelectOption.CheckedFlag = SelectOptionCheckedFlag;

export interface Props<T extends HTMLElement> {
  children: Array<OptionChild>;
  className?: string;
  value: Value;
  onChange?: (value: Value) => void;
  placeholder?: string;
  TriggerComponent: TriggerComponentType<T>;
  onLoadMore?: () => void;
  isLoading?: boolean;
  append?: React.ReactNode;
  clearable?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  size?: Size;
}

enum Size {
  Large = 500,
  Medium = 400,
  Small = 300,
}

const baseSelectCSS = css`
  max-width: 100%;

  @media ${mediaQueries.maxWidth768} {
    width: 100%;
  }
`;

const Select = <T extends HTMLElement>({
  children,
  onChange,
  className,
  value,
  placeholder,
  TriggerComponent,
  onLoadMore,
  isLoading,
  append,
  clearable,
  searchable,
  multiple = false,
  size = Size.Medium,
}: Props<T>) => {
  const intl = useIntl();
  const {
    triggerOnChange,
    onOpen,
    onClose,
    onSearch,
    selectedOptions,
    children: updatedChildren,
    searchQuery,
    optionsContainerRef,
  } = useSelect({
    children,
    onChange,
    onLoadMore,
    searchable,
    value,
    isLoading,
    multiple,
  });

  return (
    <div
      className={className}
      style={{ width: size }}
      css={css`
        display: flex;
        align-items: center;
        ${baseSelectCSS};
      `}
    >
      <div
        css={css`
          width: 100%;
        `}
      >
        <Popover<T>
          placement="bottom-start"
          offset={[0, 1]}
          onEnter={onOpen}
          renderTrigger={({ toggle, ref, isOpen }) =>
            React.createElement(TriggerComponent, {
              ref,
              onFocus: toggle,
              isOpen,
              selectedOptions,
              searchQuery,
              placeholder,
              change: triggerOnChange,
              onSearch,
              clearable,
            })
          }
          onExited={onClose}
          closeOnClick={!multiple}
          preventOverflow
          widthSameAsReference
        >
          <Popover.Content
            ref={optionsContainerRef}
            style={{ width: size }}
            css={css`
              padding: 0;
              max-height: 300px;
              overflow: auto;
              position: relative;
              ${baseSelectCSS};
            `}
          >
            {updatedChildren}
            {isLoading && (
              <Select.Option>
                {intl.formatMessage({ id: 'common.loading' })}{' '}
                <span role="img" aria-label="...">
                  ⌛
                </span>
              </Select.Option>
            )}
          </Popover.Content>
          {append}
        </Popover>
      </div>
    </div>
  );
};

Select.Option = SelectOption;
Select.Size = Size;

export default Select;
