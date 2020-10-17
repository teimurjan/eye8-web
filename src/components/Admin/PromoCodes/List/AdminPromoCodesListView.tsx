/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { useIntl } from 'react-intl';

import { Checkbox } from 'src/components/admin-ui/Checkbox/Checkbox';
import { NoDataAvailable } from 'src/components/admin-ui/NoDataAvailable/NoDataAvaiable';
import { Section } from 'src/components/admin-ui/Section/Section';
import { AdminFiltersSection } from 'src/components/Admin/AdminFiltersSection';
import { AdminTable, BooleanRenderer, PriceRenderer } from 'src/components/Admin/AdminTable';
import { NewButton } from 'src/components/Admin/NewButton';
import { IViewProps as IProps } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListPresenter';

type PromoCode = IProps['promoCodes'][0];

const NewPromoCodeButton = () => {
  const intl = useIntl();
  return (
    <NewButton pathPrefix="/admin/promoCodes">{intl.formatMessage({ id: 'AdminPromoCodes.notFound.cta' })}</NewButton>
  );
};

const NoPromoCodesAvialable = ({ isDeletedMode }: Pick<IProps, 'isDeletedMode'>) => {
  const intl = useIntl();
  return (
    <NoDataAvailable
      title={intl.formatMessage({ id: 'AdminPromoCodes.notFound.title' })}
      CTA={<NewPromoCodeButton />}
    />
  );
};

export const AdminPromoCodesListView = ({
  promoCodes,
  isLoading,
  isDataLoaded,
  isDeletedMode,
  onDeletedModeChange,
}: IProps) => {
  const intl = useIntl();
  return (
    <Section
      css={css`
        width: 100%;
      `}
    >
      <AdminFiltersSection>
        <Checkbox
          label={intl.formatMessage({ id: 'common.isDeletedMode' })}
          onChange={onDeletedModeChange}
          checked={isDeletedMode}
        />
      </AdminFiltersSection>

      <AdminTable<PromoCode>
        hideSubheader={true}
        pathPrefix="/admin/promoCodes"
        isLoading={isLoading}
        isDataLoaded={isDataLoaded}
        entities={promoCodes}
        renderNoData={() => <NoPromoCodesAvialable isDeletedMode={isDeletedMode} />}
        isDeletedMode={isDeletedMode}
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

      {isDataLoaded && promoCodes.length > 0 && <NewPromoCodeButton />}
    </Section>
  );
};
