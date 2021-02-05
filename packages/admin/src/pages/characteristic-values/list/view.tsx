/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';

import { Table, IntlRenderer, CharacteristicRenderer } from '../../../components';

import { ViewProps as Props } from './presenter';

export const NewCharacteristicValueButton = () => {
  const intl = useIntl();

  return (
    <LinkButton to="/admin/characteristicValues/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminCharacteristicValues.notFound.cta' })}
    </LinkButton>
  );
};

const NoCharacteristicValuesAvialable = () => {
  const intl = useIntl();

  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminCharacteristicValues.notFound.title' })}
      description={intl.formatMessage({
        id: 'AdminCharacteristicValues.notFound.description',
      })}
      CTA={<NewCharacteristicValueButton />}
    />
  );
};

const renderNoData = () => <NoCharacteristicValuesAvialable />;

type CharacteristicValue = Props['characteristicValues'][0];

const AdminCharacteristicValuesListView = ({ characteristicValues, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();

  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <Table<CharacteristicValue>
        pathPrefix="/admin/characteristicValues"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={characteristicValues}
        renderNoData={renderNoData}
      >
        <Table.Col<CharacteristicValue> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <Table.Col<CharacteristicValue>
          key_="name"
          title={intl.formatMessage({ id: 'AdminCharacteristicValues.names' })}
          renderer={new IntlRenderer()}
        />
        <Table.Col<CharacteristicValue>
          key_="characteristic"
          title={intl.formatMessage({ id: 'AdminCharacteristicValues.characteristic' })}
          renderer={new CharacteristicRenderer(intl.locale)}
        />
      </Table>

      {isDataLoaded && characteristicValues.length > 0 && <NewCharacteristicValueButton />}
    </Section>
  );
};

export default AdminCharacteristicValuesListView;
