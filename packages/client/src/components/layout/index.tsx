
import { css } from '@emotion/react';
import React from 'react';

import { NAVBAR_HEIGHT_PX, NAVBAR_HEIGHT_MOBILE_PX } from '@eye8/client-ui';
import { useLazyInitialization } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';

import Footer, { getFooterHeight } from '../footer';
import Header from '../header';

const Layout: React.FC = ({ children }) => {
  const { value: style } = useLazyInitialization({ minHeight: `calc(100vh - ${getFooterHeight()}px)` }, {});
  return (
    <React.Fragment>
      <Header />
      <div
        css={css`
          padding-top: ${NAVBAR_HEIGHT_PX}px;

          @media ${mediaQueries.maxWidth768} {
            padding-top: ${NAVBAR_HEIGHT_MOBILE_PX}px;
          }
        `}
        style={style}
      >
        {children}
      </div>
      <Footer />
    </React.Fragment>
  );
};

export default Layout;
