/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import { useIntl } from 'react-intl';

import { Container } from 'src/components/admin-ui/Container/Container';
import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { WithIcon } from 'src/components/client-ui/WithIcon/WithIcon';
import { mediaQueries } from 'src/styles/media';

export const FooterView = () => {
  const intl = useIntl();

  return (
    <footer
      css={css`
        margin-top: 1rem;
        padding: 15px 0 !important;
        box-sizing: content-box;

        @media ${mediaQueries.maxWidth768} {
          padding: 15px 10px;
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
            <Anchor plain href="https://www.instagram.com/eye8_collection/" rel="noopener noreferrer" target="_blank">
              <WithIcon icon={faInstagram}>Instagram</WithIcon>
            </Anchor>
          </div>
        </div>
      </Container>
    </footer>
  );
};
