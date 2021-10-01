
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import { Instagram as InstagramIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Container, Anchor, WithIcon } from '@eye8/client-ui';
import { IconSize, mediaQueries } from '@eye8/shared/styles';
import { safeDocument } from '@eye8/shared/utils';

export const FOOTER_DESKTOP_VERTICAL_PADDING_PX = 35;
export const FOOTER_MOBILE_VERTICAL_PADDING_PX = 15;

const TikTokIcon = ({ color }: { color?: string }) => {
  const colors = {
    blue: '#25F4EE',
    pink: '#FE2C55',
    black: '#000',
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={19} viewBox="0 0 29 32">
      <g fillRule="nonzero">
        <path
          d="M11.77 12.33v-1.22a9.003 9.003 0 00-1.28-.11 9.49 9.49 0 00-5.44 17.28 9.48 9.48 0 016.72-15.95z"
          fill={color ?? colors.blue}
        />
        <path
          d="M12 26.15A4.34 4.34 0 0016.33 22V1.31h3.78A7.09 7.09 0 0120 0h-5.17v20.67a4.34 4.34 0 01-4.33 4.18 4.4 4.4 0 01-2-.5 4.34 4.34 0 003.5 1.8zM27.17 8.33V7.18A7.06 7.06 0 0123.26 6a7.17 7.17 0 003.91 2.33z"
          fill={color ?? colors.blue}
        />
        <path
          d="M23.26 6a7.12 7.12 0 01-1.77-4.7h-1.38A7.16 7.16 0 0023.26 6zM10.49 16.17a4.34 4.34 0 00-2 8.18A4.33 4.33 0 0112 17.48a4.56 4.56 0 011.28.2v-5.26a9.08 9.08 0 00-1.28-.1h-.23v4a4.45 4.45 0 00-1.28-.15z"
          fill={color ?? colors.pink}
        />
        <path
          d="M27.17 8.33v4A12.27 12.27 0 0120 10v10.51A9.51 9.51 0 0110.49 30a9.41 9.41 0 01-5.44-1.72 9.49 9.49 0 0016.44-6.46V11.34a12.29 12.29 0 007.18 2.3V8.49a7.33 7.33 0 01-1.5-.16z"
          fill={color ?? colors.pink}
        />
        <path
          d="M20 20.51V10a12.27 12.27 0 007.18 2.3v-4A7.17 7.17 0 0123.26 6a7.16 7.16 0 01-3.15-4.7h-3.78V22a4.34 4.34 0 01-7.85 2.37 4.34 4.34 0 012-8.18 4.45 4.45 0 011.28.2v-4a9.48 9.48 0 00-6.72 16A9.41 9.41 0 0010.49 30 9.51 9.51 0 0020 20.51z"
          fill={color ?? colors.black}
        />
      </g>
    </svg>
  );
};

export const getFooterHeight = () => {
  return safeDocument((d) => {
    const footer = d.querySelector('footer');
    if (footer) {
      return footer.clientHeight;
    }
  }, 0);
};

const FooterView = () => {
  const intl = useIntl();
  const theme = useTheme() as ClientUITheme;

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
              css={css`
                margin-right: 20px;
              `}
              plain
              href={process.env.INSTAGRAM_URL}
              rel="noopener noreferrer"
              target="_blank"
              weight={Anchor.Weight.Bold}
            >
              <WithIcon icon={<InstagramIcon size={IconSize.Medium} />}>Instagram</WithIcon>
            </Anchor>
            <Anchor
              plain
              href={process.env.TIKTOK_URL}
              rel="noopener noreferrer"
              target="_blank"
              weight={Anchor.Weight.Bold}
            >
              <WithIcon icon={<TikTokIcon color="currentColor" />}>TikTok</WithIcon>
            </Anchor>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default FooterView;
