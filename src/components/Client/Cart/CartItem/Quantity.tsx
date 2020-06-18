/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useIntl } from 'react-intl';

import { Button } from 'src/components/client-ui/Button/Button';
import { HelpText } from 'src/components/client-ui/HelpText/HelpText';
import { Title } from 'src/components/client-ui/Title/Title';
import { preventDefault } from 'src/utils/dom';

interface IProps {
  count: number;
  allowedCount: number;
  onAddClick: () => void;
  onRemoveClick: () => void;
}

export const Quantity = ({ count, allowedCount, onAddClick, onRemoveClick }: IProps) => {
  const intl = useIntl();

  return (
    <div
      css={css`
        padding-top: 1rem;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
        `}
      >
        <Button circled size="mini" onClick={preventDefault(onRemoveClick)}>
          <FontAwesomeIcon icon={faMinus} />
        </Button>
        <Title
          size={6}
          css={css`
            margin: 0 15px;
          `}
        >
          {count}
        </Title>
        <Button circled size="mini" onClick={preventDefault(onAddClick)}>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
      {count > allowedCount && (
        <HelpText color="danger">
          {intl.formatMessage({ id: 'Cart.onlySomeAvailable' }, { quantity: allowedCount })}
        </HelpText>
      )}
    </div>
  );
};
