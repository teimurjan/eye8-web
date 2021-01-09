/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { ExternalLink as ExternalLinkIcon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Subtitle } from '@eye8/admin-ui';
import { ProductSelectContainer } from '@eye8/admin/components/product-select/container';
import { ProductListResponseItem } from '@eye8/api/product';
import { IconWrapper } from '@eye8/shared/components';
import { IconSize } from '@eye8/shared/styles';

interface Props {
  id?: number;
  name: string;
  onChange: (product: ProductListResponseItem) => void;
  footer: React.ReactNode;
}

export const ProductsSelectItem = ({ id, name, onChange, footer }: Props) => {
  const intl = useIntl();
  const theme = useTheme<AdminUITheme>();

  return (
    <div
      css={css`
        margin: 10px 0;
        padding: 10px;
        background: ${theme.light};
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <span>
          <Subtitle
            css={css`
              margin: 0 !important;
            `}
            size={5}
          >
            {name}
          </Subtitle>{' '}
          {id && (
            <Link to={`/admin/pages/products/edits/edit/${id}`}>
              <IconWrapper
                css={css`
                  margin-left: 5px;
                `}
              >
                <ExternalLinkIcon size={IconSize.Small} />
              </IconWrapper>
            </Link>
          )}
        </span>
        <ProductSelectContainer
          placeholder={intl.formatMessage({ id: 'AdminPromoCodes.anotherProduct.placeholder' })}
          onChange={onChange}
        />
      </div>
      {footer}
    </div>
  );
};
