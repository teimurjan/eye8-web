/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { ExternalLink as ExternalLinkIcon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { Subtitle } from 'src/components/admin-ui/Subtitle/Subtitle';
import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { ProductSelectContainer } from 'src/components/common-ui/ProductSelect/ProductSelectContainer';
import { IconSizes } from 'src/styles/icon';

interface IProps {
  id?: number;
  name: string;
  onChange: (product: IProductListResponseItem) => void;
  footer: React.ReactNode;
}

export const ProductsSelectItem = ({ id, name, onChange, footer }: IProps) => {
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
            <Link to={`/admin/products/edit/${id}`}>
              <IconWrapper
                css={css`
                  margin-left: 5px;
                `}
              >
                <ExternalLinkIcon size={IconSizes.Small} />
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
