
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import React from 'react';

import { mediaQueries } from '@eye8/shared/styles';

export interface Props extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export const NAVBAR_HEIGHT_PX = 100;
export const NAVBAR_HEIGHT_MOBILE_PX = 92;

const Navbar = ({ children, className, ...props }: Props) => {
  const theme = useTheme() as ClientUITheme;

  return (
    <nav
      css={css`
        display: flex;
        align-items: center;
        position: fixed;
        box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.15), 0 8px 8px 0 rgba(0, 0, 0, 0.05);
        background-color: ${theme.headerBackgroundColor};
        z-index: 1;
        height: ${NAVBAR_HEIGHT_PX}px;
        width: 100%;

        @media ${mediaQueries.maxWidth768} {
          height: ${NAVBAR_HEIGHT_MOBILE_PX}px;
        }
      `}
      className={className}
      {...props}
    >
      {children}
    </nav>
  );
};

interface SectionProps {
  className?: string;
  children: React.ReactNode;
}

const Section = ({ className, children }: SectionProps) => (
  <div
    className={className}
    css={css`
      display: flex;
      justify-content: center;
      align-items: center;

      & > * {
        margin-left: 20px;
      }

      @media ${mediaQueries.maxWidth768} {
        margin-right: 10px;

        & > * {
          margin-left: 7.5px;
        }
      }
    `}
  >
    {children}
  </div>
);

Navbar.Section = Section;

export default Navbar;
