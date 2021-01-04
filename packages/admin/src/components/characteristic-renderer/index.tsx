import React from 'react';

import { Table } from '@eye8/admin-ui/index';
import { IRenderer } from '@eye8/admin/components/table';
import { ICharacteristicValueListRawIntlResponseItem } from '@eye8/api/characteristic-value';

type BaseRenderer = IRenderer<ICharacteristicValueListRawIntlResponseItem>;

export class CharacteristicRenderer implements BaseRenderer {
  private locale: string;

  constructor(locale: string) {
    this.locale = locale;
  }

  public renderHeader: BaseRenderer['renderHeader'] = (title: string, { componentKey }) => (
    <Table.HeadCell key={componentKey}>{title}</Table.HeadCell>
  );

  public renderSubheader: BaseRenderer['renderSubheader'] = ({ componentKey }) => <Table.HeadCell key={componentKey} />;

  public renderEntity: BaseRenderer['renderEntity'] = (characteristicValue, { colKey: _, componentKey }) => (
    <Table.Cell key={componentKey}>{characteristicValue.characteristic.name[this.locale]}</Table.Cell>
  );
}
