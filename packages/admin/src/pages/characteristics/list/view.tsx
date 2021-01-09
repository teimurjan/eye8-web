/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { LinkButton, NoDataAvailable, Section } from '@eye8/admin-ui';
import { AdminTable, IntlRenderer } from '@eye8/admin/components/table';
import { ViewProps as Props } from '@eye8/admin/pages/characteristics/list/presenter';

export const NewCharacteristicButton = () => {
  const intl = useIntl();

  return (
    <LinkButton to="/admin/characteristics/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminCharacteristics.notFound.cta' })}
    </LinkButton>
  );
};

const NoCharacteristicsAvialable = () => {
  const intl = useIntl();

  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminCharacteristics.notFound.title' })}
      description={intl.formatMessage({
        id: 'AdminCharacteristics.notFound.description',
      })}
      CTA={<NewCharacteristicButton />}
    />
  );
};

const renderNoData = () => <NoCharacteristicsAvialable />;

type Characteristic = Props['characteristics'][0];

export const AdminCharacteristicsListView = ({ characteristics, isLoading, isDataLoaded }: Props) => {
  const intl = useIntl();

  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminTable<Characteristic>
        pathPrefix="/admin/characteristics"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={characteristics}
        renderNoData={renderNoData}
      >
        <AdminTable.Col<Characteristic> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<Characteristic>
          key_="name"
          title={intl.formatMessage({ id: 'AdminCharacteristics.names' })}
          renderer={new IntlRenderer()}
        />
      </AdminTable>

      {isDataLoaded && characteristics.length > 0 && <NewCharacteristicButton />}
    </Section>
  );
};
