/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { NextRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';

import { Anchor, Button, Menu } from '@eye8/client-ui';
import { useBoolean } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';

import { ViewProps as Props } from './presenter';

interface CategoryMenuItemProps {
  active: boolean;
  as: string;
  renderChildren: (renderProps: { collapsed: boolean }) => React.ReactNode;
  defaultCollpsed?: boolean;
  name: string;
  className?: string;
}

export const navItemCSS = css`
  font-weight: 500 !important;
  @media ${mediaQueries.maxWidth768} {
    font-size: 18px;
  }
`;

const CategoryMenuItem = ({
  className,
  as,
  renderChildren,
  name,
  active,
  defaultCollpsed = false,
}: CategoryMenuItemProps) => {
  const { value: collapsed, toggle } = useBoolean(defaultCollpsed);
  const intl = useIntl();

  const onToggleClick: React.MouseEventHandler = React.useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    },
    [toggle],
  );

  const children = renderChildren({ collapsed });

  return (
    <Menu.Item className={className}>
      <Anchor
        active={active}
        css={css`
          display: flex !important;
          align-items: center;
          justify-content: space-between;
          padding-right: 0.25rem !important;
          width: 100%;
          ${navItemCSS};
        `}
        as={as}
        href="/categories/[slug]/products"
      >
        {name}
        {children && (
          <Button
            onClick={onToggleClick}
            css={css`
              vertical-align: middle;
              margin-left: 10px;
            `}
            size="mini"
          >
            {collapsed ? intl.formatMessage({ id: 'common.more' }) : intl.formatMessage({ id: 'common.less' })}
          </Button>
        )}
      </Anchor>
      {children}
    </Menu.Item>
  );
};

interface CategoryMenuListProps {
  categories: Props['categories'];
  router: NextRouter;
  parentId?: number | null;
  level?: number;
  collapsed?: boolean;
}

const renderCategoryMenuList = ({
  categories,
  router,
  collapsed = false,
  parentId = null,
  level = 0,
}: CategoryMenuListProps) => {
  const parentCategories = categories.filter((category) => category.parent_category_id === parentId);
  if (parentCategories.length === 0) {
    return null;
  }

  return (
    <Menu.List collapsed={collapsed} direction="row">
      {parentCategories.map((parentCategory, i) => {
        const as = `/categories/${parentCategory.slug}/products`;
        return (
          <CategoryMenuItem
            css={css`
              margin-right: ${i !== parentCategories.length - 1 ? '20px' : undefined};
              @media ${mediaQueries.maxWidth768} {
                margin-right: 0;
              }
            `}
            key={parentCategory.id}
            active={router.asPath === as}
            as={as}
            name={parentCategory.name}
            defaultCollpsed={level > 1}
            renderChildren={({ collapsed: collapsed_ }) =>
              renderCategoryMenuList({
                categories,
                router,
                collapsed: collapsed_,
                parentId: parentCategory.id,
                level: level + 1,
              })
            }
          />
        );
      })}
    </Menu.List>
  );
};

const NavView = ({ categories, router }: Props & { router: NextRouter }) => {
  return (
    <Menu
      css={css`
        padding: 0 1.5rem;

        @media ${mediaQueries.maxWidth768} {
          width: 100%;
          padding: 0;
        }
      `}
    >
      {renderCategoryMenuList({ categories, router })}
    </Menu>
  );
};

export default NavView;
