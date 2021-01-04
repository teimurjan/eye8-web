/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { Instagram as InstagramIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Container } from '@eye8/admin-ui/index';
import { Anchor, WithIcon } from '@eye8/client-ui';
import { IconSize, mediaQueries } from '@eye8/shared/styles';
import { safeDocument } from '@eye8/shared/utils';

export const FOOTER_DESKTOP_VERTICAL_PADDING_PX = 35;
export const FOOTER_MOBILE_VERTICAL_PADDING_PX = 15;

export const getFooterHeight = () => {
  return safeDocument((d) => {
    const footer = d.querySelector('footer');
    if (footer) {
      return footer.clientHeight;
    }
  }, 0);
};

export const FooterView = () => {
  const intl = useIntl();
  const theme = useTheme<ClientUITheme>();

  return (
    <footer
      css={css`
        padding: ${FOOTER_DESKTOP_VERTICAL_PADDING_PX}px 0 15px 0;
        box-sizing: border-box;

        @media ${mediaQueries.maxWidth768} {
          padding: ${FOOTER_MOBILE_VERTICAL_PADDING_PX}px 10px;
        }
      `}
    >
      <Container>
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <div
            css={css`
              color: ${theme.textColor};
              text-align: center;
              font-weight: bold;
            `}
          >
            {intl.formatMessage(
              { id: 'Footer.copy' },
              { year: new Date().getFullYear(), shopName: process.env.SHOP_NAME },
            )}
          </div>

          <div
            css={css`
              display: flex;
            `}
          >
            <Anchor
              plain
              href={process.env.INSTAGRAM_URL}
              rel="noopener noreferrer"
              target="_blank"
              weight={Anchor.Weight.Bold}
            >
              <WithIcon icon={<InstagramIcon size={IconSize.Medium} />}>Instagram</WithIcon>
            </Anchor>
          </div>
        </div>
      </Container>
    </footer>
  );
};
