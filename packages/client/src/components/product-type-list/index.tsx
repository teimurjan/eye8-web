/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { CategoryListResponseItem } from '@eye8/api/category';
import { ProductTypeListResponseItem, ProductTypeListResponseMeta } from '@eye8/api/product-type';
import { ErrorLayout, NotFound, Pagination, Title, Container, Grid } from '@eye8/client-ui';
import { ProductTypeCard } from '@eye8/client/components/product-type-card';
import { LoaderLayout } from '@eye8/shared/components';
import { mediaQueries } from '@eye8/shared/styles';

export interface Props {
  productTypes: ProductTypeListResponseItem[];
  category?: CategoryListResponseItem;
  meta?: ProductTypeListResponseMeta;
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
}: Props) => {
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
        <Grid.Row>
          {productTypes.map((productType) => (
            <Grid.Col key={productType.id} xs={6} sm={6} md={4} lg={3}>
              <ProductTypeCard productType={productType} />
            </Grid.Col>
          ))}
        </Grid.Row>
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
