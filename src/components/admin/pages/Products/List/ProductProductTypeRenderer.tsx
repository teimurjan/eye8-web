/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { Table } from 'src/components/admin-ui/Table/Table';
import { IRenderer } from 'src/components/admin/table/AdminTable';
import { Tooltip } from 'src/components/client-ui/Tooltip/Tooltip';
import { formatMediaURL } from 'src/utils/url';

type BaseRenderer = IRenderer<IProductListResponseItem>;

interface IProductTypeLinkProps {
  productType: IProductListResponseItem['product_type'];
}

const ProductTypeLink = ({ productType }: IProductTypeLinkProps) => {
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
