import React from 'react';

import { Table } from '@eye8/admin-ui';
import { CharacteristicValueListRawIntlResponseItem } from '@eye8/api/characteristic-value';

import { Renderer } from '../table';

type BaseRenderer = Renderer<CharacteristicValueListRawIntlResponseItem>;

class CharacteristicRenderer implements BaseRenderer {
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

export default CharacteristicRenderer;
