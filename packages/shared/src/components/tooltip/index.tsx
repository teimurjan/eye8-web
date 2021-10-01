
import { css, ClassNames, useTheme } from '@emotion/react';
import React from 'react';

import { PopoverProps, Popover } from '@eye8/shared/components';
import { mediaQueries } from '@eye8/shared/styles';

export interface TooltipContentProps {
  children?: React.ReactNode;
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(({ children }, ref) => {
  const theme = useTheme() as ClientUITheme;

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

export type Props<T extends HTMLElement> = PopoverProps<T>;

const Tooltip = <T extends HTMLElement>({ children, ...props }: Props<T>) => {
  const theme = useTheme() as ClientUITheme;
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

export default Tooltip;
