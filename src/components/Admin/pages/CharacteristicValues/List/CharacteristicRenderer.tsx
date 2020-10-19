import * as React from 'react';

import { ICharacteristicValueListRawIntlResponseItem } from 'src/api/CharacteristicValueAPI';
import { Table } from 'src/components/admin-ui/Table/Table';
import { IRenderer } from 'src/components/admin/AdminTable';

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
