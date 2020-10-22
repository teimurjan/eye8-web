/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import classNames from 'classnames';
import { useIntl } from 'react-intl';

import { ICategoryListResponseItem } from 'src/api/CategoryAPI';
import { IProductTypeListResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { Column } from 'src/components/admin-ui/Column/Column';
import { Columns } from 'src/components/admin-ui/Columns/Columns';
import { Container } from 'src/components/admin-ui/Container/Container';
import { ErrorLayout } from 'src/components/client-ui/ErrorLayout/ErrorLayout';
import { LoaderLayout } from 'src/components/client-ui/LoaderLayout/LoaderLayout';
import { NotFound } from 'src/components/client-ui/NotFound/NotFound';
import { Pagination } from 'src/components/client-ui/Pagination/Pagination';
import { Title } from 'src/components/client-ui/Title/Title';
import { ProductTypeCard } from 'src/components/client/ProductType/ProductTypeCard/ProductTypeCard';
import { mediaQueries } from 'src/styles/media';

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