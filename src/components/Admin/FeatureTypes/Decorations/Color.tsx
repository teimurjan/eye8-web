/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from 'emotion-theming';

export const ColorDecoration = () => {
  const theme = useTheme<AdminUITheme>();
  return (
    <span>
      <FontAwesomeIcon
        css={css`
          margin-right: 5px;
        `}
        color={theme.danger}
        icon={faCircle}
      />
      <FontAwesomeIcon
        css={css`
          margin-right: 5px;
        `}
        color={theme.success}
        icon={faCircle}
      />
      <FontAwesomeIcon color={theme.info} icon={faCircle} />
    </span>
  );
};
