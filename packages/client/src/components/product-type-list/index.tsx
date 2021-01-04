/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import { Column, Columns, Container } from '@eye8/admin-ui/index';
import { ICategoryListResponseItem } from '@eye8/api/category';
import { IProductTypeListResponseItem, IProductTypeListResponseMeta } from '@eye8/api/product-type';
import { ErrorLayout, LoaderLayout, NotFound, Pagination, Title } from '@eye8/client-ui';
import { ProductTypeCard } from '@eye8/client/components/product-type-card';
import { mediaQueries } from '@eye8/shared/styles';

export interface IProps {
  productTypes: IProductTypeListResponseItem[];
  category?: ICategoryListResponseItem;
  meta?: IProductTypeListResponseMeta;
  error?: string;
  isLoading: boolean;
  onPageChange?: (page: number) => void;
  filter?: React.ReactNode;
}

export const ProductTypesListView = ({
  filter,
  isLoading,
  error,
  productTypes,
  meta,
  onPageChange,
  category,
}: IProps) => {
  const intl = useIntl();

  const renderContent = () => {
    if (isLoading) {
      return <LoaderLayout />;
    }

    if (error) {
      return <ErrorLayout>{intl.formatMessage({ id: error })}</ErrorLayout>;
    }

    if (productTypes.length === 0) {
      return <NotFound title={intl.formatMessage({ id: 'common.empty' })} />;
    }

    return (
      <div
        css={css`
          margin-top: 10px;
          width: 100%;
        `}
      >
        <Columns className="is-multiline is-mobile">
          {productTypes.map((productType) => (
            <Column
              key={productType.id}
              className={
                filter
                  ? classNames('is-half-mobile', 'is-one-third-desktop', 'is-one-quarter-widescreen')
                  : classNames('is-half-mobile', 'is-one-quarter-desktop', 'is-one-fifths-widescreen')
              }
            >
              <ProductTypeCard productType={productType} />
            </Column>
          ))}
        </Columns>
        {meta && meta.pages_count > 1 && (
          <Pagination
            css={css`
              margin-top: 20px;
            `}
            length={meta.pages_count}
            page={meta.page}
            onChange={onPageChange}
          />
        )}
      </div>
    );
  };

  return (
    <Container>
      {category && (
        <Title
          css={css`
            margin: 20px 0 10px;
          `}
          size={3}
          tag={1}
        >
          {category.name}
        </Title>
      )}

      <div
        css={css`
          display: flex;

          @media ${mediaQueries.maxWidth768} {
            flex-direction: column;
            align-items: center;
          }
        `}
      >
        {filter}

        {renderContent()}
      </div>
    </Container>
  );
};
