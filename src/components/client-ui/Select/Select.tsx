/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faCaretDown, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Popover, RenderTrigger } from 'src/components/client-ui/Popover/Popover';
import { useForceUpdate } from 'src/hooks/useForceUpdate';
import { useScrollPosition } from 'src/hooks/useScrollPosition';
import { mediaQueries } from 'src/styles/media';

const VERTICAL_PADDING_PX = 7.5;
const HORIZONTAL_PADDING_PX = 2.5;

interface IOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  children: React.ReactNode;
  searchQuery?: string;
  selected?: boolean;
}

const SelectOption = ({ color, searchQuery, children, selected, ...props }: IOptionProps) => {
  const theme = useTheme<ClientUITheme>();
  return (
    <Popover.Item Component="div" {...props}>
      {children}
      {selected && (
        <FontAwesomeIcon
          css={css`
            margin-left: 7.5px;
          `}
          icon={faCheck}
          color={theme.successColor}
        />
      )}
    </Popover.Item>
  );
};

export interface ISelectTriggerProps {
  placeholder: string;
  onClick: React.MouseEventHandler;
  isOpen: boolean;
  clear?: () => void;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  value: {
    node?: React.ReactNode;
    searchQuery?: string;
  };
}

export const SelectTrigger = React.forwardRef<HTMLDivElement, ISelectTriggerProps>(
  ({ value, onClick, isOpen, placeholder }, ref) => {
    const theme = useTheme<ClientUITheme>();

    return (
      <div
        className={classNames({ open: isOpen, empty: !value.node })}
        ref={ref}
        tabIndex={1}
        css={css`
          color: ${theme.textColor};
          border-bottom: 1px solid ${theme.borderColor};
          padding: ${VERTICAL_PADDING_PX}px ${HORIZONTAL_PADDING_PX}px;
          cursor: pointer;
          transition: border-bottom 300ms;
          width: auto;
          position: relative;

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
      >
        {value.node ?? placeholder}
        <FontAwesomeIcon
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
          icon={faCaretDown}
        />
      </div>
    );
  },
);

type ITriggerComponentType<T extends HTMLElement> = React.ComponentType<ISelectTriggerProps & React.RefAttributes<T>>;

const getSelectTriggerRenderer = <T extends HTMLElement>(
  TriggerComponent: ITriggerComponentType<T>,
  props: Omit<ISelectTriggerProps, 'onClick' | 'isOpen'>,
): RenderTrigger<T> => ({ toggle, ref, isOpen }) =>
  React.createElement(TriggerComponent, {
    ref,
    onClick: toggle,
    isOpen,
    ...props,
  });

type OptionChild = React.ReactElement<IOptionProps>;

export interface IProps<T extends HTMLElement> {
  children: Array<OptionChild>;
  className?: string;
  value?: string;
  onChange?: (value?: string) => void;
  placeholder: string;
  TriggerComponent: ITriggerComponentType<T>;
  onLoadMore?: () => void;
  isLoading?: boolean;
  append?: React.ReactNode;
  clear?: () => void;
  hasSearch?: boolean;
}

const getSelectedOptionChild = <T extends HTMLElement>({ children, value }: Pick<IProps<T>, 'children' | 'value'>) => {
  let selectedOptionChild: OptionChild | undefined;
  React.Children.forEach(children, child => {
    if (child.props.value === value) {
      selectedOptionChild = child;
    }
  });

  return selectedOptionChild;
};

const LOAD_MORE_SCROLL_OFFSET = 100;
const hasScrolledToLoad = (el: HTMLElement, scrollTop: number) => {
  const { scrollHeight, clientHeight } = el;
  return scrollHeight - scrollTop - LOAD_MORE_SCROLL_OFFSET <= clientHeight;
};

export const Select = <T extends HTMLElement>({
  children,
  onChange,
  className,
  value,
  placeholder,
  TriggerComponent,
  onLoadMore,
  isLoading,
  append,
  clear,
  hasSearch,
}: IProps<T>) => {
  const intl = useIntl();
  const popoverContentRef = React.useRef<HTMLDivElement>(null);
  const selectedOptionChild = getSelectedOptionChild<T>({ children, value });
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

  const onSearch = hasSearch ? setSearchQuery : undefined;
  const onPopoverExited = () => onSearch && onSearch('');

  const filteredChildren = children.filter(child =>
    hasSearch && child.props.searchQuery && searchQuery.trim().length > 0
      ? child.props.searchQuery.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
      : true,
  );

  return (
    <div
      className={className}
      css={css`
        display: flex;
        align-items: center;
        width: 300px;
        max-width: 100%;

        @media ${mediaQueries.maxWidth768} {
          width: 100%;
        }
      `}
    >
      <div
        css={css`
          flex: 1;
        `}
      >
        <Popover
          placement="bottom-start"
          offset={[0, 1]}
          /* In order to popoverContentRef be set */
          onEnter={update}
          renderTrigger={getSelectTriggerRenderer(TriggerComponent, {
            value: {
              node: selectedOptionChild ? selectedOptionChild.props.children : undefined,
              searchQuery: selectedOptionChild ? selectedOptionChild.props.searchQuery : undefined,
            },
            searchQuery,
            placeholder,
            clear: selectedOptionChild ? clear : undefined,
            onSearch,
          })}
          onExited={onPopoverExited}
          closeOnClick
        >
          <Popover.Content
            ref={popoverContentRef}
            css={css`
              padding: 0;
              max-height: 300px;
              overflow: auto;
              width: 300px;
              max-width: 100%;
              position: relative;
            `}
          >
            {React.Children.map(filteredChildren, child =>
              React.cloneElement(child, {
                ...child.props,
                selected: child.props.value === value,
                onClick: () => {
                  onChange && onChange(child.props.value as string | undefined);
                },
              }),
            )}
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
