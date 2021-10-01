
import { css } from '@emotion/react';
import React from 'react';

import { useMedia } from '@eye8/shared/hooks';
import { mediaQueries } from '@eye8/shared/styles';

export interface Props {
  maxHeight: number;
  mobileMaxHeight?: number;
  children: React.ReactNode;
}

const ScrollableContainer = ({ mobileMaxHeight, maxHeight, children }: Props) => {
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

export default ScrollableContainer;
