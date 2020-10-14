/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable, IntlRenderer } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/Characteristics/List/AdminCharacteristicsListPresenter';

export const NewCharacteristicButton = () => {
  const intl = useIntl();

  return (
    <ReactRouterLinkButton to="/admin/characteristics/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminCharacteristics.notFound.cta' })}
    </ReactRouterLinkButton>
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

type Characteristic = IProps['characteristics'][0];

export const AdminCharacteristicsListView = ({ characteristics, isLoading, isDataLoaded }: IProps) => {
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
        intl={intl}
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
