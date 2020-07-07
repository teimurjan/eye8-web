/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Button } from 'src/components/client-ui/Button/Button';
import { Drawer } from 'src/components/client-ui/Drawer/Drawer';
import { useBoolean } from 'src/hooks/useBoolean';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';

interface IFilterItemProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: React.MouseEventHandler;
}

interface IFilterItemGroupProps {
  title: string;
  children: React.ReactElement<IFilterItemProps> | Array<React.ReactElement<IFilterItemProps>>;
}

interface IProps {
  className?: string;
  title?: string;
  children: React.ReactElement<IFilterItemGroupProps> | Array<React.ReactElement<IFilterItemGroupProps>>;
}

export const Filter = ({ className, title, children }: IProps) => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();
  const isMobile = useMedia([mediaQueries.maxWidth768], [true], false);
  const { value: lazyIsMobile, isInitialized } = useLazyInitialization(isMobile, false);
  const { value: isOpen, setNegative: close, setPositive: open } = useBoolean();

  const filter = (
    <div className={className}>
      <h6
        css={css`
          font-weight: bold;
          margin-bottom: 10px;
        `}
      >
        {title || intl.formatMessage({ id: 'common.filter' })}
      </h6>
      {children}
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

const FilterItemGroup = ({ title, children }: IFilterItemGroupProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
      css={css`
        border-top: 1px solid ${theme.borderColor};
        padding: 10px 0;
      `}
    >
      <h6
        css={css`
          font-weight: bold;
          margin-bottom: 15px;
        `}
      >
        {title}
      </h6>
      {children}
    </div>
  );
};

const OUTER_CIRCLE_SIZE_PX = 24;
const INNER_CIRCLE_SIZE_PX = 14;
const FilterItem = ({ children, active, onClick }: IFilterItemProps) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
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
      `}
    >
      {children}
    </div>
  );
};

Filter.Item = FilterItem;
Filter.ItemGroup = FilterItemGroup;
