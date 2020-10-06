/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable, IntlRenderer } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/CharacteristicValues/List/AdminCharacteristicValuesListPresenter';
import { CharacteristicRenderer } from 'src/components/Admin/CharacteristicValues/List/CharacteristicRenderer';

export const NewCharacteristicValueButton = () => {
  const intl = useIntl();

  return (
    <ReactRouterLinkButton to="/admin/characteristicValues/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminCharacteristicValues.notFound.cta' })}
    </ReactRouterLinkButton>
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

type CharacteristicValue = IProps['characteristicValues'][0];

export const AdminCharacteristicValuesListView = ({
  characteristicValues,
  locales,
  isLoading,
  isDataLoaded,
}: IProps) => {
  const intl = useIntl();

  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminTable<CharacteristicValue>
        pathPrefix="/admin/characteristicValues"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={characteristicValues}
        renderNoData={renderNoData}
        intl={intl}
      >
        <AdminTable.Col<CharacteristicValue> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<CharacteristicValue>
          key_="name"
          title={intl.formatMessage({ id: 'AdminCharacteristicValues.names' })}
          renderer={new IntlRenderer(locales)}
        />
        <AdminTable.Col<CharacteristicValue>
          key_="characteristic"
          title={intl.formatMessage({ id: 'AdminCharacteristicValues.characteristic' })}
          renderer={new CharacteristicRenderer(intl.locale)}
        />
      </AdminTable>

      {isDataLoaded && characteristicValues.length > 0 && <NewCharacteristicValueButton />}
    </Section>
  );
};