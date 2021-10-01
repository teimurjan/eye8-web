import { ClassNames } from '@emotion/react';
import { useTheme } from '@emotion/react';
import classNames from 'classnames';
import times from 'lodash/times';
import React from 'react';

import { mediaQueries } from '@eye8/shared/styles';

export interface Props {
  children?: React.ReactNode | string;
  size: 1 | 2 | 3 | 4 | 5 | 6;
  tag?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const fontSizes = {
  1: 48,
  2: 36,
  3: 26,
  4: 22,
  5: 18,
  6: 14,
};

const mobileFontSizes = {
  1: 32,
  2: 28,
  3: 24,
  4: 20,
  5: 16,
  6: 14,
};

const Subtitle = ({ children, size, tag = size, className }: Props) => {
  const theme = useTheme() as ClientUITheme;
  return (
    <ClassNames>
      {({ css }) =>
        React.createElement(
          `h${tag}`,
          {
            className: classNames(
              className,
              `size-${size}`,
              css`
                color: ${theme.textSecondaryColor};
                font-weight: 500;

                ${times(6)
                  .map((i) => {
                    const sizeI = i + 1;
                    const fontSize = fontSizes[sizeI];
                    return `
                    &.size-${sizeI} {
                      font-size: ${fontSize}px;

                      @media ${mediaQueries.maxWidth768} {
                        font-size: ${mobileFontSizes[size]}px;
                      }
                    }
                  `;
                  })
                  .join('\n')}
              `,
            ),
          },
          children,
        )
      }
    </ClassNames>
  );
};

export default Subtitle;
