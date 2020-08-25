import { History } from 'history';
import * as React from 'react';
import * as yup from 'yup';

import { getFieldName, parseFieldName } from 'src/components/Admin/IntlField';
import * as schemaValidator from 'src/components/SchemaValidator';
import { useLazy } from 'src/hooks/useLazy';
import { IBannerService } from 'src/services/BannerService';
import { ContextValue as AdminBannersStateContextValue } from 'src/state/AdminBannersState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps extends IntlStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  service: IBannerService;
  history: History;
  adminBannersState: AdminBannersStateContextValue['state'];
}

export interface IViewProps {
  isOpen: boolean;
  create: (values: {
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
  }) => void;
  isCreating: boolean;
  error?: string;
  close: () => void;
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  validate?: (values: object) => object | Promise<object>;
}

export const BANNER_TEXT_FIELD_KEY = 'text';
export const BANNER_LINK_TEXT_FIELD_KEY = 'link_text';

export const AdminBannersCreatePresenter: React.FC<IProps> = ({
  intlState,
  history,
  adminBannersState: { add: addBanner },
  service,
  View,
}) => {
  const [error, setError] = React.useState<string | undefined>(undefined);
  const [isCreating, setCreating] = React.useState(false);

  const makeValidator = React.useCallback(
    () =>
      new schemaValidator.SchemaValidator(
        yup.object().shape(
          intlState.availableLocales.reduce(
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
      ),
    [intlState],
  );

  const validator = useLazy({
    make: makeValidator,
    trigger: intlState.availableLocales.length,
  });

  const close = React.useCallback(() => history.push('/admin/banners'), [history]);

  const create: IViewProps['create'] = React.useCallback(
    async (values) => {
      setCreating(true);

      const formattedValues = Object.keys(values).reduce(
        (acc, fieldName) => {
          const { key, id } = parseFieldName(fieldName);
          if (key === BANNER_TEXT_FIELD_KEY) {
            return {
              ...acc,
              texts: { ...acc.texts, [id]: values[fieldName] },
            };
          }
          if (key === BANNER_LINK_TEXT_FIELD_KEY) {
            return {
              ...acc,
              link_texts: { ...acc.link_texts, [id]: values[fieldName] },
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
        const category = await service.create(formattedValues);
        addBanner(category);
        setCreating(false);
        close();
      } catch (e) {
        setError('errors.common');
        setCreating(false);
      }
    },
    [addBanner, close, service],
  );

  return (
    <View
      isOpen={true}
      create={create}
      error={error}
      isCreating={isCreating}
      close={close}
      availableLocales={intlState.availableLocales}
      validate={(validator || { validate: undefined }).validate}
    />
  );
};
