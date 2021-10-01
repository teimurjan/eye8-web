
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import { NProgress } from '@tanem/react-nprogress';

import { useRouteChangeStatus, RouteChangeStatus } from '@eye8/shared/hooks';

const PageProgressBar = () => {
  const theme = useTheme() as ClientUITheme;
  const status = useRouteChangeStatus();
  return (
    <NProgress isAnimating={status === RouteChangeStatus.Loading}>
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
              height: 4px;
              width: 100%;
              z-index: 1000;
            `}
          ></div>
        </div>
      )}
    </NProgress>
  );
};

export default PageProgressBar;
