import React from 'react';

import { Table } from '@eye8/admin-ui';
import { Product } from '@eye8/api';

import { Renderer } from '../table';

type BaseRenderer = Renderer<Product>;

class ProductFeaturesRenderer implements BaseRenderer {
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

export default ProductFeaturesRenderer;
