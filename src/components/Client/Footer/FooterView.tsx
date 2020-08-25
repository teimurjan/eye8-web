/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { WithIcon } from 'src/components/client-ui/WithIcon/WithIcon';
import { mediaQueries } from 'src/styles/media';
import { safeDocument } from 'src/utils/dom';

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
              text-align: center;
              font-weight: bold;
            `}
          >
            {intl.formatMessage({ id: 'Footer.copy' }, { year: new Date().getFullYear() })}
          </div>

          <div
            css={css`
              display: flex;
            `}
          >
            <Anchor
              plain
              href="https://www.instagram.com/eye8_collection/"
              rel="noopener noreferrer"
              target="_blank"
              weight={Anchor.Weight.Bold}
            >
              <WithIcon icon={faInstagram}>Instagram</WithIcon>
            </Anchor>
          </div>
        </div>
      </Container>
    </footer>
  );
};
