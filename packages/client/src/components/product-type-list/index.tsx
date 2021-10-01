
import { css } from '@emotion/react';
import { useIntl } from 'react-intl';

import { Category, ProductType, PaginationMeta } from '@eye8/api';
import { ErrorLayout, NotFound, Pagination, Title, Container, Grid } from '@eye8/client-ui';
import { LoaderLayout } from '@eye8/shared/components';
import { mediaQueries } from '@eye8/shared/styles';

import ProductTypeCard from '../product-type-card';

export interface Props {
  productTypes: ProductType[];
  category?: Category;
  meta?: PaginationMeta;
  error?: string;
  isLoading: boolean;
  onPageChange?: (page: number) => void;
  filter?: React.ReactNode;
}

const ProductTypesList = ({ filter, isLoading, error, productTypes, meta, onPageChange, category }: Props) => {
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

export default ProductTypesList;
