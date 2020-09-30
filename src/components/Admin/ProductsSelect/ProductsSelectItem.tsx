/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { Subtitle } from 'src/components/admin-ui/Subtitle/Subtitle';
import { ProductSelectContainer } from 'src/components/common-ui/ProductSelect/ProductSelectContainer';

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
              <FontAwesomeIcon
                size="sm"
                css={css`
                  margin-left: 5px;
                  display: inline-block;
                  vertical-align: baseline;
                `}
                icon={faExternalLinkAlt}
              />
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
