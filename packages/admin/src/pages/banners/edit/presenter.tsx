import { History } from 'history';
import React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from '@eye8/admin/components/intl-field';
import { ContextValue as AdminBannersStateContextValue } from '@eye8/admin/state/banners';
import { IBannerListRawIntlResponseItem } from '@eye8/api/banner';
import { IBannerService } from '@eye8/service/banner';
import { availableLocales, SchemaValidator } from '@eye8/shared/utils';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  service: IBannerService;
  history: History;
  bannerId: number;
  adminBannersState: AdminBannersStateContextValue['state'];
}

interface IFormValues {
  texts: {
    [key: string]: string;
  };
  link_texts: {
    [key: string]: string;
  };
  link?: string;
  text_color?: string;
  image: string;
  text_top_offset?: string;
  text_left_offset?: string;
  text_right_offset?: string;
  text_bottom_offset?: string;
}

export interface IViewProps {
  isOpen: boolean;
  edit: (values: IFormValues) => void;
  error?: string;
  close: () => void;
  validate?: (values: IFormValues) => object | Promise<object>;
  isLoading: boolean;
  isUpdating: boolean;
  preloadingError?: string;
  initialValues?: Partial<IFormValues>;
}

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
        parent_banner_id: yup.number().nullable(true),
      },
    ),
  ),
);

export const AdminBannersEditPresenter: React.FC<IProps> = ({
  history,
  adminBannersState: { set: setBannerToState },
  service,
  View,
  bannerId,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [banner, setBanner] = React.useState<IBannerListRawIntlResponseItem | undefined>(undefined);
  const [isUpdating, setUpdating] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);
  const [preloadingError, setPreloadingError] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const banner = await service.getOneRawIntl(bannerId);
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

  const edit: IViewProps['edit'] = React.useCallback(
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
        const banner = await service.edit(bannerId, formattedValues);
        setBannerToState(banner);
        setUpdating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setUpdating(false);
      }
    },
    [bannerId, close, service, setBannerToState],
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
    <View
      isOpen={true}
      edit={edit}
      error={error}
      isUpdating={isUpdating}
      isLoading={isLoading}
      close={close}
      validate={validator.validate}
      initialValues={initialValues}
      preloadingError={preloadingError}
    />
  );
};
