/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';

import { NAVBAR_HEIGHT_PX, NAVBAR_HEIGHT_MOBILE_PX } from '@eye8/client-ui';
import { FooterView, getFooterHeight } from '@eye8/client/components/footer';
import { HeaderContainer } from '@eye8/client/components/header/container';
import { useLazyInitialization } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';

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
