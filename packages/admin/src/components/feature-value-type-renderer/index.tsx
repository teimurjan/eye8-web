import React from 'react';

import { Table } from '@eye8/admin-ui';
import { Renderer } from '@eye8/admin/components/table';
import { FeatureValueListRawIntlResponseItem } from '@eye8/api/feature-value';

type BaseRenderer = Renderer<FeatureValueListRawIntlResponseItem>;

export class FeatureValueTypeRenderer implements BaseRenderer {
  private locale: string;

  constructor(locale: string) {
    this.locale = locale;
  }

  public renderHeader: BaseRenderer['renderHeader'] = (title: string, { componentKey }) => (
    <Table.HeadCell key={componentKey}>{title}</Table.HeadCell>
  );

  public renderSubheader: BaseRenderer['renderSubheader'] = ({ componentKey }) => <Table.HeadCell key={componentKey} />;

  public renderEntity: BaseRenderer['renderEntity'] = (featureValue, { colKey: _, componentKey }) => (
    <Table.Cell key={componentKey}>{featureValue.feature_type.name[this.locale]}</Table.Cell>
  );
}
