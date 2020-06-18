/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SyncLoader from 'react-spinners/SyncLoader';
import Transition from 'react-transition-group/Transition';

import { useModalScrollLock } from 'src/hooks/useModalScrollLock';
import { PAGE_LOADER_ID, safeDocument } from 'src/utils/dom';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive: boolean;
  timeout?: number;
}

interface ILoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  timeout: number;
  status: string;
  color?: string;
}

const getCSS = (timeout: number, shouldShow: boolean) => (theme: AdminUITheme) => css`
  transition: opacity ${timeout}ms ease-in-out;
  opacity: ${shouldShow ? 1 : 0.01};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  height: 100vh;
  background: rgba(200, 200, 200, 0.3);
  backdrop-filter: blur(5px);
  top: 0;
  z-index: 777;

  > div {
    border-width: 5px;
    border-color: ${theme.light} ${theme.light} transparent ${theme.light};
    z-index: 778;
  }
`;

const Loader = ({ status, timeout, className, color, ...props }: ILoaderProps) => {
  useModalScrollLock();
  const theme = useTheme<AdminUITheme>();

  const shouldShow = status === 'entering' || status === 'entered';

  return (
    <div id={PAGE_LOADER_ID} css={getCSS(timeout, shouldShow)} className={className} {...props}>
      <SyncLoader color={color || theme.primary} sizeUnit="px" size={20} loading={true} />
    </div>
  );
};

export const PageLoader = ({ isActive, timeout = 500, ...props }: IProps) =>
  safeDocument(
    d =>
      ReactDOM.createPortal(
        <Transition in={isActive} timeout={timeout} unmountOnExit={true}>
          {status => <Loader timeout={timeout} status={status} {...props} />}
        </Transition>,
        d.body,
      ),
    null,
  );
