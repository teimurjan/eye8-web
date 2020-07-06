/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Drawer } from 'src/components/client-ui/Drawer/Drawer';
import { UnderlinedInput } from 'src/components/client-ui/Form/UnderlinedInput/UnderlinedInput';
import { LinkPassingProps } from 'src/components/client-ui/LinkPassingProps/LinkPassingProps';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
import { Popover } from 'src/components/client-ui/Popover/Popover';
import { Tag } from 'src/components/client-ui/Tag/Tag';
import { WithIcon } from 'src/components/client-ui/WithIcon/WithIcon';
import { IViewProps as IProps } from 'src/components/Client/Search/SearchPresenter';
import { useBoolean } from 'src/hooks/useBoolean';
import { useDebounce } from 'src/hooks/useDebounce';
import { mediaQueries } from 'src/styles/media';
import { formatMediaURL } from 'src/utils/url';

const inputCSS = css`
  width: 300px !important;
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
    <WithIcon ref={ref} icon={faSearch} hideTextOnMobile {...props}>
      {intl.formatMessage({ id: 'common.search' })}
    </WithIcon>
  );
});

export const SearchView: React.FC<IProps> = ({
  categories,
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
    e => setSearchValue(e.currentTarget.value),
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
        {categories.length > 0 &&
          categories.map(category => (
            <Popover.Item
              Component={LinkPassingProps}
              key={category.id}
              as={`/categories/${category.slug}/products`}
              href="/categories/[id]/products"
              passHref
              css={css`
                display: block;
              `}
            >
              {category.name} <Tag>{intl.formatMessage({ id: 'common.category' })}</Tag>
            </Popover.Item>
          ))}
        {productTypes.length > 0 &&
          productTypes.map(productType => (
            <Popover.Item
              Component={LinkPassingProps}
              key={productType.id}
              as={`/products/${productType.slug}`}
              href="/products/[slug]"
              css={css`
                overflow: hidden;
                text-overflow: ellipsis;
                display: block;
              `}
            >
              <img
                alt={productType.name}
                css={css`
                  width: 30px;
                  height: 30px;
                  vertical-align: middle;
                  margin-right: 0.25rem;
                `}
                src={formatMediaURL(productType.image)}
              />{' '}
              {productType.name}
            </Popover.Item>
          ))}
        {categories.length === 0 && productTypes.length === 0 && (
          <Popover.Item Component="div">{intl.formatMessage({ id: 'common.noResults' })}</Popover.Item>
        )}
      </React.Fragment>
    );
  }, [categories, error, intl, isLoading, productTypes]);

  return (
    <>
      <Anchor onClick={open} noHoverOnTouch>
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
