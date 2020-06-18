/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { NProgress } from '@tanem/react-nprogress';
import { useTheme } from 'emotion-theming';

import { useRouteChangeStatus, Status } from 'src/hooks/useRouteChangeStatus';

export const PageProgressBar = () => {
  const theme = useTheme<ClientUITheme>();
  const status = useRouteChangeStatus();
  return (
    <NProgress isAnimating={status === Status.Loading}>
      {({ isFinished, progress, animationDuration }) => (
        <div
          data-finished={isFinished}
          style={{ transition: `opacity ${animationDuration}ms linear` }}
          css={css`
            opacity: 1;
            pointer-events: none;

            &[data-finished='true'] {
              opacity: 0;
            }
          `}
        >
          <div
            style={{ transition: `margin-left ${animationDuration}ms linear`, marginLeft: `${(-1 + progress) * 100}%` }}
            css={css`
              background: ${theme.primaryColor};
              position: fixed;
              top: 0;
              left: 0;
              height: 2px;
              width: 100%;
              z-index: 1000;
            `}
          ></div>
        </div>
      )}
    </NProgress>
  );
};
