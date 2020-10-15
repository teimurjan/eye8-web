/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminButtonsGroup } from 'src/components/Admin/AdminButtonsGroup';
import { AdminTable, BooleanRenderer, PriceRenderer } from 'src/components/Admin/AdminTable';
import { DeletedButton } from 'src/components/Admin/DeletedButton';
import { NewButton } from 'src/components/Admin/NewButton';
import { IViewProps as IProps } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListPresenter';

type PromoCode = IProps['promoCodes'][0];

const NewPromoCodeButton = () => {
  const intl = useIntl();
  return (
    <NewButton pathPrefix="/admin/promoCodes">{intl.formatMessage({ id: 'AdminPromoCodes.notFound.cta' })}</NewButton>
  );
};

const NoPromoCodesAvialable = ({ showDeleted }: Pick<IProps, 'showDeleted'>) => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminPromoCodes.notFound.title' })}
      CTA={
        showDeleted ? (
          <DeletedButton state={DeletedButton.State.Active} pathPrefix="/admin/promoCodes" />
        ) : (
          <NewPromoCodeButton />
        )
      }
    />
  );
};

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
        renderNoData={() => <NoPromoCodesAvialable showDeleted={showDeleted} />}
        intl={intl}
        showDeleted={showDeleted}
      >
        <AdminTable.Col<PromoCode> key_="id" title={intl.formatMessage({ id: 'common.ID' })} />
        <AdminTable.Col<PromoCode> key_="value" title={intl.formatMessage({ id: 'AdminPromoCodes.value' })} />
        <AdminTable.Col<PromoCode>
          key_="discount"
          title={intl.formatMessage({ id: 'common.discount' })}
          render={(product) => `${product.discount}%`}
        />
        <AdminTable.Col<PromoCode>
          key_="amount"
          title={intl.formatMessage({ id: 'AdminPromoCodes.amount' })}
          renderer={new PriceRenderer()}
        />
        <AdminTable.Col<PromoCode>
          key_="is_active"
          title={intl.formatMessage({ id: 'AdminPromoCodes.active' })}
          renderer={new BooleanRenderer()}
        />
        <AdminTable.Col<PromoCode>
          key_="disable_on_use"
          title={intl.formatMessage({ id: 'AdminPromoCodes.disableOnUse' })}
          renderer={new BooleanRenderer()}
        />
        <AdminTable.Col<PromoCode>
          key_="is_deleted"
          title={intl.formatMessage({ id: 'common.deleted' })}
          renderer={new BooleanRenderer()}
        />
      </AdminTable>

      {isDataLoaded && promoCodes.length > 0 && (
        <AdminButtonsGroup>
          <NewPromoCodeButton />
          <DeletedButton
            state={showDeleted ? DeletedButton.State.Active : DeletedButton.State.Idle}
            pathPrefix="/admin/promoCodes"
          />
        </AdminButtonsGroup>
      )}
    </Section>
  );
};
