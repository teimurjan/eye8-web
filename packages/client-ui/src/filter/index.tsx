/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { useIntl } from 'react-intl';

import { Button, Title } from '@eye8/client-ui';
import { Drawer } from '@eye8/shared/components';
import { useLazyInitialization, useMedia, useBoolean } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';

interface FilterItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler;
  squared?: boolean;
}

interface FilterItemGroupProps {
  title: string;
  children: React.ReactElement<FilterItemProps> | Array<React.ReactElement<FilterItemProps>>;
}

type FilterItenGroupChild = React.ReactElement<FilterItemGroupProps> | null;

export interface Props {
  className?: string;
  title?: string;
  children: FilterItenGroupChild | FilterItenGroupChild[];
  disabled?: boolean;
  onReset?: () => void;
}

const Filter = ({ className, title, children, disabled, onReset }: Props) => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: lazyIsMobile, isInitialized } = useLazyInitialization(isMobile, false);
  const { value: isOpen, setNegative: close, setPositive: open } = useBoolean();

  const filter = (
    <div
      css={css`
        &[data-disabled='true'] {
          pointer-events: none;
        }
      `}
      className={className}
      data-disabled={disabled}
    >
      <Title
        size={6}
        css={css`
          margin-bottom: 10px;
        `}
      >
        {title || intl.formatMessage({ id: 'common.filter' })}
      </Title>
      {children}

      {onReset && (
        <Button size="small" onClick={onReset}>
          {intl.formatMessage({ id: 'common.reset' })}
        </Button>
      )}
    </div>
  );

  if (!isInitialized) {
    return null;
  }

  return lazyIsMobile ? (
    <>
      <Button
        css={css`
          width: 100px !important;
          margin-top: 10px;
          align-self: flex-start;
        `}
        size="mini"
        color="dark"
        onClick={open}
      >
        {title || intl.formatMessage({ id: 'common.filter' })}
      </Button>
      <Drawer
        css={css`
          background: ${theme.backgroundPrimaryColor};
          padding: 10px 20px;

          & ~ span > .fa-times {
            color: ${theme.textBrightColor};
          }

          overflow: auto;
        `}
        backdrop
        isOpen={isOpen}
        close={close}
        fromSide="left"
        fixed
      >
        {filter}
      </Drawer>
    </>
  ) : (
    filter
  );
};

const FilterItemGroup = ({ title, children }: FilterItemGroupProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
      css={css`
        border-top: 1px solid ${theme.borderColor};
        padding: 10px 0;
      `}
    >
      <Title
        size={6}
        css={css`
          font-weight: bold;
          margin-bottom: 15px;
        `}
      >
        {title}
      </Title>
      {children}
    </div>
  );
};

const OUTER_CIRCLE_SIZE_PX = 20;
const INNER_CIRCLE_SIZE_PX = 12;
const FilterItem = ({ children, active, onClick, squared }: FilterItemProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
      className={classNames({ squared })}
      onClick={onClick}
      data-active={active}
      css={css`
        padding-left: 40px;
        position: relative;
        color: ${theme.textSecondaryColor};
        line-height: 1.25;
        margin-bottom: 15px;
        cursor: pointer;
        font-weight: 500;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: ${OUTER_CIRCLE_SIZE_PX}px;
          height: ${OUTER_CIRCLE_SIZE_PX}px;
          border-radius: 50%;
          border: 1px solid ${theme.borderColor};
        }

        &::after {
          content: '';
          position: absolute;
          left: ${(OUTER_CIRCLE_SIZE_PX - INNER_CIRCLE_SIZE_PX) / 2}px;
          top: 50%;
          transform: translateY(-50%);
          width: ${INNER_CIRCLE_SIZE_PX}px;
          height: ${INNER_CIRCLE_SIZE_PX}px;
          border-radius: 50%;
          background: ${theme.borderColor};
          transition: opacity 150ms;
          opacity: 0;
        }

        &[data-active='true']::after {
          opacity: 1;
        }

        &.squared::after,
        &.squared::before {
          border-radius: 0;
        }
      `}
    >
      {children}
    </div>
  );
};

Filter.Item = FilterItem;
Filter.ItemGroup = FilterItemGroup;

export default Filter;
