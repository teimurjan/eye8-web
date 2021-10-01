import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router';
import * as yup from 'yup';

import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm} from '../../../components';
import { useAdminBannersState } from '../../../state';
import { getFieldName, parseFieldName } from '../../../utils';
import AdminBannerFields from '../fields';

export const BANNER_TEXT_FIELD_KEY = 'text';
export const BANNER_LINK_TEXT_FIELD_KEY = 'link_text';

const validator = new SchemaValidator(
  yup.object().shape(
    availableLocales.reduce(
      (acc, locale) => ({
        ...acc,
        [getFieldName(BANNER_TEXT_FIELD_KEY, locale)]: yup.string(),
        [getFieldName(BANNER_LINK_TEXT_FIELD_KEY, locale)]: yup.string(),
      }),
      {
        link: yup.string(),
        image: yup.mixed().required('common.errors.field.empty'),
      },
    ),
  ),
);

const AdminBannersCreate = () => {
  const intl = useIntl();
  const history = useHistory();

  const {
    di: {
      service: { banner: bannerService },
    },
  } = useDI();

  const { add: addBanner } = useAdminBannersState();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const close = React.useCallback(() => history.push('/admin/banners'), [history]);

  const create = React.useCallback(
    async (values) => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, locale } = parseFieldName(fieldName);
          if (key === BANNER_TEXT_FIELD_KEY) {
            return {
              ...acc,
              texts: { ...acc.texts, [locale]: values[fieldName] },
            };
          }
          if (key === BANNER_LINK_TEXT_FIELD_KEY) {
            return {
              ...acc,
              link_texts: { ...acc.link_texts, [locale]: values[fieldName] },
            };
          }

          return acc;
        },
        {
          texts: {},
          link_texts: {},
          link: values.link ? values.link : null,
          text_color: values.text_color ? values.text_color : null,
          image: values.image,
          text_top_offset: values.text_top_offset ? parseInt(values.text_top_offset, 10) : null,
          text_bottom_offset: values.text_bottom_offset ? parseInt(values.text_bottom_offset, 10) : null,
          text_left_offset: values.text_left_offset ? parseInt(values.text_left_offset, 10) : null,
          text_right_offset: values.text_right_offset ? parseInt(values.text_right_offset, 10) : null,
        },
      );

      try {
        const banner = await bannerService.create(formattedValues);
        addBanner(banner);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addBanner, close, bannerService],
  );

  return (
    <ModalForm
      isOpen
      formID="adminBannersCreateForm"
      onSubmit={create}
      onClose={close}
      isLoading={isCreating}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminBanners.create.title' })}
      fields={<AdminBannerFields textFieldKey={BANNER_TEXT_FIELD_KEY} linkTextFieldKey={BANNER_LINK_TEXT_FIELD_KEY} />}
      validate={validator.validate}
      wide
    />
  );
};

export default AdminBannersCreate;
