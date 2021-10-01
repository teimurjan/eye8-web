import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';
import * as yup from 'yup';

import { useAdminBannersState } from '@eye8/admin/state';
import { Banner } from '@eye8/api';
import { useDI } from '@eye8/di';
import { SchemaValidator, availableLocales } from '@eye8/shared/utils';

import { ModalForm } from '../../../components';
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
        image: yup.mixed().nullable(false),
      },
    ),
  ),
);

const AdminBannersEditPresenter = () => {
  const intl = useIntl();
  const history = useHistory();
  const { id: bannerIdStr } = useParams<{ id: string }>();
  const bannerId = parseInt(bannerIdStr, 10);

  const {
    di: {
      service: { banner: bannerService },
    },
  } = useDI();
  const { set: setBannerToState } = useAdminBannersState();

  const [error, setError] = React.useState<string | undefined>(undefined);
  const [banner, setBanner] = React.useState<Banner<true> | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const banner = await bannerService.getOneRawIntl(bannerId);
        if (banner) {
          setBanner(banner);
        } else {
          setPreloadingError('AdminBanners.notFound');
        }
      } catch (e) {
        setPreloadingError('errors.common');
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = React.useCallback(() => history.push('/admin/banners'), [history]);

  const edit = React.useCallback(
    async (values) => {
      setUpdating(true);

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
          image: values.image,
          link: values.link ? values.link : null,
          text_color: values.text_color ? values.text_color : null,
          text_top_offset: values.text_top_offset ? parseInt(values.text_top_offset, 10) : null,
          text_bottom_offset: values.text_bottom_offset ? parseInt(values.text_bottom_offset, 10) : null,
          text_left_offset: values.text_left_offset ? parseInt(values.text_left_offset, 10) : null,
          text_right_offset: values.text_right_offset ? parseInt(values.text_right_offset, 10) : null,
        },
      );

      try {
        const banner = await bannerService.edit(bannerId, formattedValues);
        setBannerToState(banner);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [bannerId, close, bannerService, setBannerToState],
  );

  const initialValues = React.useMemo(() => {
    if (banner) {
      return {
        ...availableLocales.reduce(
          (acc, locale) => ({
            ...acc,
            [getFieldName(BANNER_TEXT_FIELD_KEY, locale)]: banner.text[locale],
            [getFieldName(BANNER_LINK_TEXT_FIELD_KEY, locale)]: banner.link_text[locale],
          }),
          {},
        ),
        image: banner.image,
        link: banner.link,
        text_color: banner.text_color,
        text_top_offset: banner.text_top_offset,
        text_bottom_offset: banner.text_bottom_offset,
        text_left_offset: banner.text_left_offset,
        text_right_offset: banner.text_right_offset,
      };
    }

    return {};
  }, [banner]);

  return (
    <ModalForm
      isOpen
      formID="adminBannersEditForm"
      onSubmit={edit}
      onClose={close}
      isPreloading={isLoading}
      isLoading={isUpdating}
      preloadingError={preloadingError}
      globalError={error && intl.formatMessage({ id: error })}
      title={intl.formatMessage({ id: 'AdminBanners.edit.title' })}
      fields={<AdminBannerFields textFieldKey={BANNER_TEXT_FIELD_KEY} linkTextFieldKey={BANNER_LINK_TEXT_FIELD_KEY} />}
      validate={validator.validate}
      initialValues={initialValues}
      wide
    />
  );
};

export default AdminBannersEditPresenter;
