/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { Dropdown } from 'src/components/admin-ui/Dropdown/Dropdown';
import { DropdownItem } from 'src/components/admin-ui/DropdownItem/DropdownItem';
import { Input } from 'src/components/admin-ui/Input/Input';
import { Modal } from 'src/components/admin-ui/Modal/Modal';
import { ModalBackground } from 'src/components/admin-ui/ModalBackground/ModalBackground';
import { ModalCard } from 'src/components/admin-ui/ModalCard/ModalCard';
import { ModalContent } from 'src/components/admin-ui/ModalContent/ModalContent';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
import { IViewProps as IProps } from 'src/components/common-ui/ProductSelect/ProductSelectPresenter';
import {
  ProductTypePreview,
  IProps as IProductTypePreviewProps,
} from 'src/components/common-ui/ProductSelect/ProductTypePreview';
import { useDebounce } from 'src/hooks/useDebounce';
import { mediaQueries } from 'src/styles/media';
import { formatMediaURL } from 'src/utils/url';

const dropdownCSS = css`
  width: 300px;
  max-width: 100%;

  @media ${mediaQueries.maxWidth768} {
    width: 100%;
  }
`;

export const ProductSelectView: React.FC<IProps> = ({
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
  const productTypePreviewAction: IProductTypePreviewProps['action'] = React.useCallback(
    (product) => {
      onChange(product);
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
