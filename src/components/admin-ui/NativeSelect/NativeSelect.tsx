/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import * as React from 'react';
import { IntlShape, injectIntl } from 'react-intl';

import { HelpText } from 'src/components/admin-ui/HelpText/HelpText';

export interface IProps<T = boolean> {
  children: Array<React.ReactElement<typeof Option>>;
  className?: string;
  wrapperClassName?: string;
  isMultiple?: T;
  size?: number;
  value?: T extends true ? string[] : string;
  onChange?: (e: React.SyntheticEvent<HTMLSelectElement>) => any;
}

export const NativeSelect = injectIntl(
  ({
    children,
    wrapperClassName,
    intl,
    onChange,
    isMultiple = false,
    size,
    className,
    value,
  }: IProps & { intl: IntlShape }) => (
    <div
      css={css`
        display: flex;
        align-items: center;
      `}
    >
      <div
        css={css`
          flex: 1;
        `}
        className={classNames('select', wrapperClassName, {
          'is-multiple': isMultiple,
        })}
      >
        <select
          css={css`
            width: 100%;
          `}
          className={className}
          size={size}
          onChange={onChange}
          multiple={isMultiple}
          value={isMultiple ? value || [] : value}
        >
          {children}
        </select>
      </div>

      {isMultiple && (
        <HelpText
          css={css`
            flex: 1;
            padding-left: 10px;
          `}
        >
          {intl.formatMessage({ id: 'NativeSelect.multipleHint' })}
        </HelpText>
      )}
    </div>
  ),
);

interface IOptionProps extends React.HTMLProps<HTMLOptionElement> {
  children?: React.ReactNode;
}

export const NativeSelectOption = ({ children, className, ...props }: IOptionProps) => (
  <option className={className} {...props}>
    {children}
  </option>
);

export const getMultipleValuesFromChangeEvent = (e: React.SyntheticEvent<HTMLSelectElement>) => {
  const { options } = e.currentTarget;

  const values = [];

  for (let i = 0, l = options.length; i < l; i++) {
    if (options[i].selected) {
      values.push(options[i].value);
    }
  }

  return values;
};
