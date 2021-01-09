/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { Search as SearchIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Anchor, UnderlinedInput, LinkPassingProps, Subtitle, WithIcon } from '@eye8/client-ui';
import { ViewProps as Props } from '@eye8/client/components/search/presenter';
import { Popover, Drawer, LoaderLayout } from '@eye8/shared/components';
import { useBoolean, useDebounce } from '@eye8/shared/hooks';
import { IconSize, mediaQueries } from '@eye8/shared/styles';
import { formatMediaURL } from '@eye8/shared/utils';

const inputCSS = css`
  width: 400px !important;
  max-width: 100%;

  @media ${mediaQueries.maxWidth768} {
    width: 90vw !important;
  }
`;

const contentCSS = css`
  ${inputCSS};
  padding: 0;
`;

const SearchTrigger = React.forwardRef<HTMLSpanElement>((props, ref) => {
  const intl = useIntl();
  return (
    <WithIcon ref={ref} icon={<SearchIcon size={IconSize.Medium} />} hideTextOnMobile {...props}>
      {intl.formatMessage({ id: 'common.search' })}
    </WithIcon>
  );
});

export const SearchView: React.FC<Props> = ({
  productTypes,
  isLoading,
  error,
  onSearchValueChange,
  isOpen,
  open,
  close,
}) => {
  const { value: drawerOpened, setPositive: setDrawerOpened, setNegative: setDrawerClosed } = useBoolean();
  const theme = useTheme<ClientUITheme>();
  const intl = useIntl();
  const [searchValue, setSearchValue] = React.useState('');
  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (e) => setSearchValue(e.currentTarget.value),
    [],
  );

  const debouncedSearchValue = useDebounce(searchValue, 500);
  React.useEffect(() => {
    onSearchValueChange(debouncedSearchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const entity = React.useMemo(() => {
    if (isLoading) {
      return <LoaderLayout />;
    }
    if (error) {
      return <Popover.Item Component="div">{intl.formatMessage({ id: error })}</Popover.Item>;
    }

    return (
      <React.Fragment>
        {productTypes.length > 0 &&
          productTypes.map((productType) => (
            <Popover.Item
              Component={LinkPassingProps}
              key={productType.id}
              as={`/products/${productType.slug}`}
              href="/products/[slug]"
              css={css`
                overflow: hidden;
                text-overflow: ellipsis;
                display: flex;
                align-items: center;
              `}
            >
              <img
                alt={productType.name}
                css={css`
                  width: 50px;
                  height: 50px;
                  margin-right: 12px;
                `}
                src={formatMediaURL(productType.image)}
              />{' '}
              <Subtitle size={5}>{productType.name}</Subtitle>
            </Popover.Item>
          ))}
        {productTypes.length === 0 && (
          <Popover.Item Component="div">{intl.formatMessage({ id: 'common.noResults' })}</Popover.Item>
        )}
      </React.Fragment>
    );
  }, [error, intl, isLoading, productTypes]);

  return (
    <>
      <Anchor onClick={open} noHoverOnTouch weight={Anchor.Weight.Bold}>
        <SearchTrigger />
      </Anchor>
      <Drawer
        isOpen={isOpen}
        close={close}
        fromSide="top"
        onEnter={setDrawerClosed}
        onEntered={setDrawerOpened}
        onExit={setDrawerClosed}
        lockScroll={false}
        fixed={true}
      >
        <div
          css={css`
            width: 100%;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: ${theme.backgroundPrimaryColor};
          `}
        >
          <Popover<HTMLInputElement>
            offset={[0, 0]}
            forceClose={searchValue === '' || !drawerOpened}
            renderTrigger={({ ref, open }) => (
              <UnderlinedInput
                autoFocus
                autoFocusDelay={500}
                css={inputCSS}
                containerRef={ref}
                onFocus={open}
                placeholder={intl.formatMessage({ id: 'Search.searchFor' })}
                onChange={onSearchChange}
                value={searchValue}
                data-mousetrap
              />
            )}
          >
            <Popover.Content css={contentCSS}>{entity}</Popover.Content>
          </Popover>
        </div>
      </Drawer>
    </>
  );
};
