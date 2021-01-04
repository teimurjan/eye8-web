/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { Check as CheckIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { IconWrapper, Popover, ISelectTriggerComponentType } from '@eye8/client-ui';
import { useForceUpdate, useScrollPosition } from '@eye8/shared/hooks';
import { IconSize, mediaQueries } from '@eye8/shared/styles';
import { reactChildrenFind } from '@eye8/shared/utils';

export interface IOption {
  value?: string;
  children: React.ReactNode;
  name?: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler;
  className?: string;
}

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

const SelectOption = ({ className, children, selected, value, onClick }: IOption) => {
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

export type OptionChild = React.ReactElement<IOption>;

export type SingleValue = string | undefined;
export type MultipleValue = string[];
export type Value = MultipleValue | SingleValue;

export interface IProps<T extends HTMLElement> {
  children: Array<OptionChild>;
  className?: string;
  value: Value;
  onChange?: (value: Value) => void;
  placeholder?: string;
  TriggerComponent: ISelectTriggerComponentType<T>;
  onLoadMore?: () => void;
  isLoading?: boolean;
  append?: React.ReactNode;
  clearable?: boolean;
  searchable?: boolean;
  multiple?: boolean;
  size?: Size;
}

const getSelectedOptions = <T extends HTMLElement>({ children, value }: Pick<IProps<T>, 'children' | 'value'>) => {
  if (Array.isArray(value)) {
    return value.reduce<IOption[]>((acc, optionValue) => {
      const childFound = reactChildrenFind(children, (child) => child.props.value === optionValue);
      return childFound ? [...acc, childFound.props] : acc;
    }, []);
  }

  const childFound = reactChildrenFind(children, (child) => child.props.value === value);
  return childFound ? [childFound.props] : [];
};

const LOAD_MORE_SCROLL_OFFSET = 100;
const hasScrolledToLoad = (el: HTMLElement, scrollTop: number) => {
  const { scrollHeight, clientHeight } = el;
  return scrollHeight - scrollTop - LOAD_MORE_SCROLL_OFFSET <= clientHeight;
};

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
}: IProps<T>) => {
  const intl = useIntl();
  const popoverContentRef = React.useRef<HTMLDivElement>(null);
  const selectedOptions = getSelectedOptions<T>({ children, value });
  const { update, dep } = useForceUpdate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const scrollPos = useScrollPosition(popoverContentRef);

  React.useEffect(() => {
    if (
      popoverContentRef.current &&
      hasScrolledToLoad(popoverContentRef.current, scrollPos.top) &&
      onLoadMore &&
      !isLoading
    ) {
      onLoadMore();
    }
  }, [popoverContentRef, isLoading, onLoadMore, scrollPos, dep, searchQuery]);

  const onSearch = searchable ? setSearchQuery : undefined;
  const onPopoverExited = () => onSearch && onSearch('');

  const filteredChildren = children.filter((child) =>
    searchable && child.props.name && searchQuery.trim().length > 0
      ? child.props.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
      : true,
  );

  const makeOnClick = (child: OptionChild) => () => {
    if (!onChange) {
      return;
    }

    let nextValue: Value = child.props.value;
    if (multiple && child.props.value) {
      const castedValue = value as MultipleValue;
      const selected = castedValue.includes(child.props.value);
      nextValue = selected
        ? castedValue.filter((optionValue) => optionValue !== child.props.value)
        : [...castedValue, child.props.value];
    }

    onChange(nextValue);
  };

  const triggerOnChange = React.useCallback(
    (options: Array<IOption>) => {
      if (!onChange) {
        return;
      }

      onChange(multiple ? options.map((option) => option.value!) : options[0]?.value);
    },
    [onChange, multiple],
  );

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
          /* In order to popoverContentRef be set */
          onEnter={update}
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
          onExited={onPopoverExited}
          closeOnClick={!multiple}
          preventOverflow
          widthSameAsReference
        >
          <Popover.Content
            ref={popoverContentRef}
            style={{ width: size }}
            css={css`
              padding: 0;
              max-height: 300px;
              overflow: auto;
              position: relative;
              ${baseSelectCSS};
            `}
          >
            {React.Children.map(filteredChildren, (child) => {
              const selected = Array.isArray(value) ? value.includes(child.props.value!) : child.props.value === value;

              return React.cloneElement(child, {
                ...child.props,
                selected,
                onClick: makeOnClick(child),
              });
            })}
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
