/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
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
}

const SelectOption = ({ color, ...props }: IOptionProps) => <Popover.Item Component="div" {...props} />;

export interface ISelectTriggerProps {
  title?: React.ReactNode;
  placeholder: string;
  onClick: React.MouseEventHandler;
  isOpen: boolean;
  clear?: () => void;
}

export const SelectTrigger = React.forwardRef<HTMLDivElement, ISelectTriggerProps>(
  ({ title, onClick, isOpen, placeholder }, ref) => {
    const theme = useTheme<ClientUITheme>();

    return (
      <div
        className={classNames({ open: isOpen, empty: !title })}
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
        {title ? title : placeholder}
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
}: IProps<T>) => {
  const intl = useIntl();
  const popoverContentRef = React.useRef<HTMLDivElement>(null);
  const selectedOptionChild = getSelectedOptionChild<T>({ children, value });
  const { update, dep } = useForceUpdate();

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
  }, [popoverContentRef, isLoading, onLoadMore, scrollPos, dep]);

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
            title: selectedOptionChild ? selectedOptionChild.props.children : undefined,
            placeholder,
            clear: selectedOptionChild ? clear : undefined,
          })}
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
            {React.Children.map(children, child =>
              React.cloneElement(child, {
                ...child.props,
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
