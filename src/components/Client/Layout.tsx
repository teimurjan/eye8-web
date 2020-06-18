/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

import { NAVBAR_HEIGHT_PX, NAVBAR_HEIGHT_MOBILE_PX } from 'src/components/client-ui/Navbar/Navbar';
import { FooterView } from 'src/components/Client/Footer/FooterView';
import { HeaderContainer } from 'src/components/Client/Header/HeaderContainer';
import { mediaQueries } from 'src/styles/media';

export const Layout: React.FC = ({ children }) => (
  <React.Fragment>
    <HeaderContainer />
    <div
      css={css`
        padding-top: ${NAVBAR_HEIGHT_PX}px;
        min-height: calc(100vh - ${NAVBAR_HEIGHT_PX}px);
        padding-bottom: 40px;

        @media ${mediaQueries.maxWidth768} {
          padding-top: ${NAVBAR_HEIGHT_MOBILE_PX}px;
          min-height: calc(100vh - ${NAVBAR_HEIGHT_MOBILE_PX}px);
        }
      `}
    >
      {children}
    </div>
    <FooterView />
  </React.Fragment>
);
