/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import times from 'lodash/times';

import { Button } from '@eye8/client-ui';

export interface Props {
  length: number;
  page: number;
  onChange?: (page: number) => void;
  className?: string;
}

const Pagination = ({ className, length, page, onChange }: Props) => {
  return (
    <div
      className={className}
      css={css`
        display: flex;
      `}
    >
      {times(length).map((i) => (
        <Button
          key={i}
          css={css`
            margin: 0 10px;
          `}
          active={i + 1 === page}
          circled
          onClick={onChange ? () => onChange(i + 1) : undefined}
        >
          {i + 1}
        </Button>
      ))}
    </div>
  );
};

export default Pagination;
