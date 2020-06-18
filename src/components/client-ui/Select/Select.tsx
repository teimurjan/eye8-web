/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import * as React from 'react';

import { Popover, RenderTrigger } from 'src/components/client-ui/Popover/Popover';

const VERTICAL_PADDING_PX = 7.5;
const HORIZONTAL_PADDING_PX = 2.5;

interface IOptionProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string;
  children: React.ReactNode;
}

const SelectOption = (props: IOptionProps) => <Popover.Item Component="div" {...props} />;

interface ISelectTriggerProps {
  title?: React.ReactNode;
  placeholder: string;
  onClick: React.MouseEventHandler;
  isOpen: boolean;
}

const SelectTrigger = React.forwardRef<HTMLDivElement, ISelectTriggerProps>(
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

const getSelectTriggerRenderer = (
  props: Omit<ISelectTriggerProps, 'onClick' | 'isOpen'>,
): RenderTrigger<HTMLDivElement> => ({ isOpen, open, ref }) => (
  <SelectTrigger ref={ref} isOpen={isOpen} onClick={open} {...props} />
);

type OptionChild = React.ReactElement<IOptionProps>;

export interface IProps {
  children: Array<OptionChild>;
  className?: string;
  value?: string;
  onChange?: (value?: string) => void;
  placeholder: string;
}

const getSelectedOptionChild = ({ children, value }: Pick<IProps, 'children' | 'value'>) => {
  let selectedOptionChild: OptionChild | undefined;
  React.Children.forEach(children, child => {
    if (child.props.value === value) {
      selectedOptionChild = child;
    }
  });

  return selectedOptionChild;
};

export const Select = ({ children, onChange, className, value, placeholder }: IProps) => {
  const selectedOptionChild = getSelectedOptionChild({ children, value });

  return (
    <div
      className={className}
      css={css`
        display: flex;
        align-items: center;
        width: 300px;
        max-width: 100%;
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
          renderTrigger={getSelectTriggerRenderer({
            title: selectedOptionChild ? selectedOptionChild.props.children : undefined,
            placeholder,
          })}
        >
          {({ close }) => (
            <Popover.Content
              css={css`
                padding: 0;
                max-height: 300px;
                overflow: auto;
              `}
            >
              {React.Children.map(children, child =>
                React.cloneElement(child, {
                  ...child.props,
                  onClick: () => {
                    onChange && onChange(child.props.value as string | undefined);
                    close();
                  },
                }),
              )}
            </Popover.Content>
          )}
        </Popover>
      </div>
    </div>
  );
};

Select.Option = SelectOption;
