import React from 'react';
import { useIntl } from 'react-intl';

import { IntlField } from '../../../components';

import { CHARACTERISTIC_NAME_FIELD_KEY } from './presenter';


const Fields = () => {
  const intl = useIntl();

  return (
    <IntlField
      key_={CHARACTERISTIC_NAME_FIELD_KEY}
      label={intl.formatMessage({
        id: 'AdminCharacteristics.nameInput.label',
      })}
      placeholder={intl.formatMessage({
        id: 'AdminCharacteristics.nameInput.placeholder',
      })}
    />
  );
};

export default Fields;
