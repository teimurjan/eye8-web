/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { ReactRouterLinkButton } from 'src/components/admin-ui/LinkButton/LinkButton';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminTable } from 'src/components/Admin/AdminTable';
import { IViewProps as IProps } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListPresenter';

export const NewPromoCodeButton = () => {
  const intl = useIntl();

  return (
    <ReactRouterLinkButton to="/admin/promoCodes/new" color="is-primary">
      {intl.formatMessage({ id: 'AdminPromoCodes.notFound.cta' })}
    </ReactRouterLinkButton>
  );
};

enum ArchivedButtonState {
  Active,
  Idle,
}

const ArchivedButton = ({ state }: { state: ArchivedButtonState }) => {
  const intl = useIntl();

  return state === ArchivedButtonState.Active ? (
    <ReactRouterLinkButton to="/admin/promoCodes">
      {intl.formatMessage({ id: 'common.showCurrent' })}
    </ReactRouterLinkButton>
  ) : (
    <ReactRouterLinkButton to="/admin/promoCodes?deleted=true">
      {intl.formatMessage({ id: 'common.showArchived' })}
    </ReactRouterLinkButton>
  );
};

type PromoCode = IProps['promoCodes'][0];

export const AdminPromoCodesListView = ({ promoCodes, isLoading, isDataLoaded, showDeleted }: IProps) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminTable<PromoCode>
        hideSubheader={true}
        pathPrefix="/admin/promoCodes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={promoCodes}
        renderNoData={() => (
          <NoDataAvailable
            title={intl.formatMessage({ id: 'AdminPromoCodes.notFound.title' })}
            CTA={showDeleted ? <ArchivedButton state={ArchivedButtonState.Active} /> : <NewPromoCodeButton />}
          />
        )}
        intl={intl}
        showDeleted={showDeleted}
      >
        <AdminTable.Col<PromoCode> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<PromoCode> key_="value" title={intl.formatMessage({ id: 'AdminPromoCodes.value' })} />
        <AdminTable.Col<PromoCode> key_="discount" title={intl.formatMessage({ id: 'AdminPromoCodes.discount' })} />
        <AdminTable.Col<PromoCode> key_="amount" title={intl.formatMessage({ id: 'AdminPromoCodes.amount' })} />
        <AdminTable.Col<PromoCode>
          key_="is_active"
          title={intl.formatMessage({ id: 'AdminPromoCodes.active' })}
          render={(value) => (value.is_active ? '✅' : '❌')}
        />
        <AdminTable.Col<PromoCode>
          key_="disable_on_use"
          title={intl.formatMessage({ id: 'AdminPromoCodes.disableOnUse' })}
          render={(value) => (value.disable_on_use ? '✅' : '❌')}
        />
      </AdminTable>

      {isDataLoaded && promoCodes.length > 0 && (
        <div
          css={css`
            display: flex;
            justify-content: space-between;
          `}
        >
          <NewPromoCodeButton />
          <ArchivedButton state={showDeleted ? ArchivedButtonState.Active : ArchivedButtonState.Idle} />
        </div>
      )}
    </Section>
  );
};
