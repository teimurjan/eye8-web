/** @jsx jsx */
import { css, jsx, ClassNames } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import React from 'react';

import { Popover, IPopoverProps } from '@eye8/client-ui';
import { mediaQueries } from '@eye8/shared/styles';

export interface ITooltipContentProps {
  children?: React.ReactNode;
}

const TooltipContent = React.forwardRef<HTMLDivElement, ITooltipContentProps>(({ children }, ref) => {
  const theme = useTheme<ClientUITheme>();

  return (
    <div
      ref={ref}
      css={css`
        background: ${theme.tooltipBackgroundColor};
        padding: 5px 10px;
        max-width: 300px;
        color: ${theme.textBrightColor};

        @media ${mediaQueries.maxWidth768} {
          display: none;
        }
      `}
    >
      {children}
    </div>
  );
});

export type IProps<T extends HTMLElement> = IPopoverProps<T>;

const Index = <T extends HTMLElement>({ children, ...props }: IProps<T>) => {
  const theme = useTheme<ClientUITheme>();
  const contentRef = React.useRef<HTMLDivElement>(null);

  return (
    <ClassNames>
      {({ css: css_ }) => (
        <Popover
          {...props}
          delay={200}
          arrowClassName={css_`
            background: ${theme.tooltipBackgroundColor};
            
            @media ${mediaQueries.maxWidth768} {
              display: none;
            }
          `}
          mouseOutsideOffset={10}
          refsToInclude={[contentRef]}
          openOnHover
          hasArrow
        >
          <TooltipContent ref={contentRef}>{children}</TooltipContent>
        </Popover>
      )}
    </ClassNames>
  );
};

export default Index;
