/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { Button, FormTextField } from '@eye8/admin-ui';
import { useDebounce } from '@eye8/shared/hooks';

export type Link = { id: number; value: string };

export interface Props {
  links: Link[];
  onChange: (value: Link[]) => void;
  onAdd: () => void;
  renderPreview: (link: Link) => React.ReactNode;
}

const LinksInput = ({ links, onChange, onAdd, renderPreview }: Props) => {
  const intl = useIntl();

  const change = React.useCallback(
    (linkToChange: Link) => {
      const newValue = links.map((link_) => (link_.id === linkToChange.id ? linkToChange : link_));
      onChange(newValue);
    },
    [links, onChange],
  );

  const remove = React.useCallback(
    (linkToRemove: Link) => {
      const newValue = links.filter((link_) => linkToRemove.id !== link_.id);
      onChange(newValue);
    },
    [links, onChange],
  );

  const debouncedLinks = useDebounce(links, 1000);

  return (
    <>
      {links.map((link) => (
        <FormTextField
          key={link.id}
          fieldProps={{ className: 'has-addons' }}
          inputProps={{
            value: link.value,
            onChange: (e) => change({ ...link, value: e.currentTarget.value }),
          }}
          controlProps={{ className: 'is-expanded' }}
          addons={<Button onClick={() => remove(link)}>{intl.formatMessage({ id: 'common.remove' })}</Button>}
        />
      ))}
      <Button
        css={css`
          margin-bottom: 10px;
        `}
        onClick={onAdd}
      >
        {intl.formatMessage({ id: 'common.add' })}
      </Button>
      <div
        css={css`
          display: flex;
          width: 100%;
          overflow-x: auto;
        `}
      >
        {debouncedLinks.map((link) => (
          <React.Fragment key={link.id}>{renderPreview(link)}</React.Fragment>
        ))}
      </div>
    </>
  );
};

export default LinksInput;
