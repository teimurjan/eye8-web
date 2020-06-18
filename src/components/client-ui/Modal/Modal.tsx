/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import { Tooltip } from 'src/components/client-ui/Tooltip/Tooltip';

interface IProps extends React.HTMLProps<HTMLOrSVGElement> {}

export const ModalClose: React.FC<IProps> = ({ className, onClick }) => {
  return (
    <Tooltip
      offset={[0, -10]}
      placement="left"
      renderTrigger={({ open, ref }) => (
        <span
          css={css`
            padding: 20px;
            cursor: pointer;
            position: absolute;
            top: 0;
            right: 10px;
          `}
          ref={ref}
          onMouseEnter={open}
          className={className}
        >
          <FontAwesomeIcon icon={faTimes} onClick={onClick} />
        </span>
      )}
    >
      esc
    </Tooltip>
  );
};
