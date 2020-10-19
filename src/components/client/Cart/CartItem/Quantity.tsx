/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Plus as PlusIcon, Minus as MinusIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { Button } from 'src/components/client-ui/Button/Button';
import { HelpText } from 'src/components/client-ui/HelpText/HelpText';
import { IconWrapper } from 'src/components/client-ui/IconWrapper/IconWrapper';
import { Title } from 'src/components/client-ui/Title/Title';
import { IconSizes } from 'src/styles/icon';
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
          <IconWrapper>
            <MinusIcon size={IconSizes.Small} />
          </IconWrapper>
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
          <IconWrapper>
            <PlusIcon size={IconSizes.Small} />
          </IconWrapper>
        </Button>
      </div>
      {count > allowedCount && (
        <HelpText color={HelpText.Color.Danger}>
          {intl.formatMessage({ id: 'Cart.onlySomeAvailable' }, { quantity: allowedCount })}
        </HelpText>
      )}
    </div>
  );
};
