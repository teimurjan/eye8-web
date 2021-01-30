/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { Dropdown, DropdownItem, Input, Modal, ModalBackground, ModalCard, ModalContent } from '@eye8/admin-ui';
import { LoaderLayout } from '@eye8/shared/components';
import { useDebounce } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';
import { formatMediaURL } from '@eye8/shared/utils';

import ProductTypePreview, { Props as ProductTypePreviewProps } from '../product-type-preview';

import { ViewProps as Props } from './presenter';

const dropdownCSS = css`
  width: 300px;
  max-width: 100%;

  @media ${mediaQueries.maxWidth768} {
    width: 100%;
  }
`;

const ProductSelectView: React.FC<Props> = ({
  className,
  productTypes,
  isLoading,
  error,
  onSearchValueChange,
  selectProductType,
  selectedProductType,
  onChange,
  placeholder,
}) => {
  const intl = useIntl();
  const [searchValue, setSearchValue] = React.useState('');
  const onSearchChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (e) => setSearchValue(e.currentTarget.value),
    [],
  );
  const close = React.useCallback(() => selectProductType(undefined), [selectProductType]);
  const productTypePreviewAction: ProductTypePreviewProps['action'] = React.useCallback(
    (product) => {
      onChange(product);
      setSearchValue('');
      close();
    },
    [close, onChange],
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
      return intl.formatMessage({ id: error });
    }

    return (
      <React.Fragment>
        {productTypes.length > 0 &&
          productTypes.map((productType) => (
            <DropdownItem
              onClick={() => selectProductType(productType)}
              css={css`
                overflow: hidden;
                text-overflow: ellipsis;
              `}
              key={productType.id}
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
            </DropdownItem>
          ))}
        {productTypes.length === 0 && (
          <DropdownItem elementType="div">{intl.formatMessage({ id: 'common.noResults' })}</DropdownItem>
        )}
      </React.Fragment>
    );
  }, [error, intl, isLoading, productTypes, selectProductType]);

  return (
    <React.Fragment>
      <Dropdown
        css={css`
          ${dropdownCSS};
        `}
        className={className}
        menuClassName={`css-${dropdownCSS.name}`}
        trigger={({ open }) => (
          <Input
            css={dropdownCSS}
            onFocus={open}
            placeholder={placeholder || intl.formatMessage({ id: 'ProductSelect.placeholder' })}
            onChange={onSearchChange}
            value={searchValue}
          />
        )}
      >
        {entity}
      </Dropdown>
      <Modal
        css={css`
          z-index: 41;
        `}
        isOpen={!!selectedProductType}
      >
        <ModalBackground onClick={close} />
        <ModalContent
          css={css`
            width: 90%;
          `}
        >
          <ModalCard
            css={css`
              width: 100%;
            `}
          >
            <ModalCard.Body>
              {selectedProductType && (
                <ProductTypePreview action={productTypePreviewAction} id={selectedProductType.id} />
              )}
            </ModalCard.Body>
          </ModalCard>
        </ModalContent>
      </Modal>
    </React.Fragment>
  );
};

export default ProductSelectView;
