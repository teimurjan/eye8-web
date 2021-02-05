import React from 'react';
import { useIntl } from 'react-intl';

import { IntlField } from '../../../components';

import { FEATURE_TYPE_NAME_FIELD_KEY } from './presenter';

const Fields = () => {
  const intl = useIntl();
  return (
    <IntlField
      key_={FEATURE_TYPE_NAME_FIELD_KEY}
      label={intl.formatMessage({
        id: 'AdminFeatureTypes.nameInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminFeatureTypes.nameInput.placeholder',
      })}
    />
  );
};

export default Fields;
