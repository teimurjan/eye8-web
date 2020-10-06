/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';

import { useMedia } from 'src/hooks/useMedia';
import { mediaQueries } from 'src/styles/media';

interface IProps {
  maxHeight: number;
  mobileMaxHeight?: number;
  children: React.ReactNode;
}

export const ScrollableContainer = ({ maxHeight, mobileMaxHeight = maxHeight, children }: IProps) => {
  const maxHeight_ = useMedia([mediaQueries.maxHeight700], [mobileMaxHeight], maxHeight);
  return (
    <div
      css={css`
        background: linear-gradient(white 30%, rgba(255, 255, 255, 0)),
          linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%,
          linear-gradient(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0)),
          linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.05)) 0 100%;
        background-repeat: no-repeat;
        background-color: white;
        background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
        /* Opera doesn't support this in the shorthand */
        background-attachment: local, local, scroll, scroll;
      `}
      style={{ maxHeight: maxHeight_, overflow: 'auto' }}
    >
      {children}
    </div>
  );
};
