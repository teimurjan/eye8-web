/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Table } from '@eye8/admin-ui';
import { Renderer } from '@eye8/admin/components/table';
import { ProductListResponseItem } from '@eye8/api/product';
import { Tooltip } from '@eye8/shared/components';
import { formatMediaURL } from '@eye8/shared/utils';

type BaseRenderer = Renderer<ProductListResponseItem>;

interface ProductTypeLinkProps {
  productType: ProductListResponseItem['product_type'];
}

const ProductTypeLink = ({ productType }: ProductTypeLinkProps) => {
  const intl = useIntl();
  return (
    <Tooltip<HTMLAnchorElement>
      renderTrigger={({ open, ref }) => (
        <Link
          innerRef={ref}
          onMouseEnter={open}
          css={css`
            vertical-align: middle;
          `}
          to={`/admin/productTypes/edit/${productType.id}`}
        >
          {productType.name}
        </Link>
      )}
    >
      {intl.formatMessage({ id: 'common.clickToEdit' })}
    </Tooltip>
  );
};

export class ProductProductTypeRenderer implements BaseRenderer {
  public renderHeader: BaseRenderer['renderHeader'] = (title: string, { componentKey }) => (
    <Table.HeadCell key={componentKey}>{title}</Table.HeadCell>
  );

  public renderSubheader: BaseRenderer['renderSubheader'] = ({ componentKey }) => <Table.HeadCell key={componentKey} />;

  public renderEntity: BaseRenderer['renderEntity'] = (product, { colKey: _, componentKey }) => (
    <Table.Cell
      key={componentKey}
      css={css`
        justify-content: center;
      `}
    >
      <img
        alt={product.product_type.name}
        css={css`
          max-width: 50px;
          margin-right: 10px;
          vertical-align: middle;
        `}
        src={formatMediaURL(product.product_type.image)}
      />
      <ProductTypeLink productType={product.product_type} />
    </Table.Cell>
  );
}
