/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

import { NAVBAR_HEIGHT_PX, NAVBAR_HEIGHT_MOBILE_PX } from 'src/components/client-ui/Navbar/Navbar';
import { FooterView, getFooterHeight } from 'src/components/client/Footer/FooterView';
import { HeaderContainer } from 'src/components/client/Header/HeaderContainer';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { mediaQueries } from 'src/styles/media';

export const Layout: React.FC = ({ children }) => {
  const { value: style } = useLazyInitialization({ minHeight: `calc(100vh - ${getFooterHeight()}px)` }, {});
  return (
    <React.Fragment>
      <HeaderContainer />
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
      <FooterView />
    </React.Fragment>
  );
};
