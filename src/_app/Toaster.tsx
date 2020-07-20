import { ClassNames } from '@emotion/core';
import * as React from 'react';

import { MessageToast } from 'src/components/Toast/MessageToast';
import { ToastContainer } from 'src/components/Toast/ToastContainer';
import { mediaQueries } from 'src/styles/media';

export const Toaster = () => (
  <ClassNames>
    {({ css: css_ }) => (
      <ToastContainer
        className={css_`
          &:not(:empty) {
            padding: 10px 20px;
          }

          position: fixed;
          top: 0;
          right: 0;
          z-index: 200;

          @media ${mediaQueries.maxWidth768} {
            width: 100%;

            &:not(:empty) {
              padding: 10px;
            }
          }
        `}
        Component={MessageToast}
      />
    )}
  </ClassNames>
);
