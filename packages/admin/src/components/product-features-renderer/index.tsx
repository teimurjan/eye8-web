import React from 'react';

import { Table } from '@eye8/admin-ui/index';
import { IRenderer } from '@eye8/admin/components/table';
import { IProductListResponseItem } from '@eye8/api/product';

type BaseRenderer = IRenderer<IProductListResponseItem>;

export class ProductFeaturesRenderer implements BaseRenderer {
  public renderHeader: BaseRenderer['renderHeader'] = (title: string, { componentKey }) => (
    <Table.HeadCell key={componentKey}>{title}</Table.HeadCell>
  );

  public renderSubheader: BaseRenderer['renderSubheader'] = ({ componentKey }) => <Table.HeadCell key={componentKey} />;

  public renderEntity: BaseRenderer['renderEntity'] = (product, { colKey: _, componentKey }) => (
    <Table.Cell key={componentKey}>
      {product.feature_values.map((featureValue) => (
        <React.Fragment key={featureValue.id}>
          <b>{featureValue.feature_type.name}</b>: {featureValue.name}
          <br />
        </React.Fragment>
      ))}
    </Table.Cell>
  );
}
