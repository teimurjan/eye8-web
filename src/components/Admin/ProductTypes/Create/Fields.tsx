import * as React from 'react';
import { Field as FinalFormField, FieldRenderProps, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Field } from 'src/components/admin-ui/Field/Field';
import { FileInput } from 'src/components/admin-ui/FileInput/FileInput';
import { FormSelectField } from 'src/components/admin-ui/FormSelectField/FormSelectField';
import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { HelpText } from 'src/components/admin-ui/HelpText/HelpText';
import { Label } from 'src/components/admin-ui/Label/Label';
import { Tag } from 'src/components/admin-ui/Tag/Tag';
import { SearchableSelectTrigger } from 'src/components/admin-ui/Trigger/Trigger';
import { IntlField, IProps as IIntlFieldProps } from 'src/components/Admin/IntlField';
import { LinksInput, Link } from 'src/components/Admin/LinksInput/LinksInput';
import { WYSIWYG } from 'src/components/client-ui/WYSIWYG/WYSIWYG';
import { InstagramPost } from 'src/components/Client/InstagramPost/InstagramPost';
import { ContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { ContextValue as AdminFeatureTypesStateContextValue } from 'src/state/AdminFeatureTypesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';
import { arePropsEqual, lengthCompare, defaultCompare } from 'src/utils/propEquality';

interface IFeatureTypesSelectProps extends FieldRenderProps<string[]> {
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
}

const FeatureTypesSelect = ({ featureTypes, input, meta }: IFeatureTypesSelectProps) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormSelectField
      labelProps={{
        children: (
          <>
            {intl.formatMessage({
              id: 'AdminProductTypes.featureTypesSelect.label',
            })}
          </>
        ),
      }}
      selectProps={{
        ...input,
        multiple: true,
        options: featureTypes.map(({ id, name }) => ({
          title: name[intl.locale],
          value: id.toString(),
        })),
        TriggerComponent: SearchableSelectTrigger,
        searchable: true,
        clearable: true,
        placeholder: intl.formatMessage({ id: 'AdminProductTypes.featureTypesSelect.placeholder' }),
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const getFeatureTypesSelectRenderer = (featureTypes: AdminFeatureTypesStateContextValue['state']['entities']) => (
  fieldRenderProps: FieldRenderProps<string[]>,
) => <FeatureTypesSelect featureTypes={featureTypes} {...fieldRenderProps} />;

interface ICategoriesSelectProps extends FieldRenderProps<string[]> {
  categories: AdminCategoriesStateContextValue['state']['entities'];
}

const CategoriesSelect = ({ categories, input, meta }: ICategoriesSelectProps) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormSelectField
      labelProps={{
        children: (
          <>
            {intl.formatMessage({
              id: 'AdminProductTypes.categoriesSelect.label',
            })}
          </>
        ),
      }}
      selectProps={{
        ...input,
        multiple: true,
        options: categories.map(({ id, name }) => ({
          title: name[intl.locale],
          value: id.toString(),
        })),
        TriggerComponent: SearchableSelectTrigger,
        placeholder: intl.formatMessage({ id: 'AdminProductTypes.categoriesSelect.placeholder' }),
        searchable: true,
        clearable: true,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const getCategoriesSelectRenderer = (categories: AdminCategoriesStateContextValue['state']['entities']) => (
  fieldRenderProps: FieldRenderProps<string[]>,
) => <CategoriesSelect categories={categories} {...fieldRenderProps} />;

const ImageField = ({ input, meta }: FieldRenderProps<File>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <Field>
      <Label>{intl.formatMessage({ id: 'AdminProductTypes.image' })}</Label>
      <FileInput
        {...input}
        accept="image/*"
        placeholder={intl.formatMessage({
          id: 'common.chooseImage',
        })}
      />
      <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
    </Field>
  );
};

const DescriptionField: IIntlFieldProps['component'] = ({ input, meta, label, placeholder, locale }) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: (
          <>
            {label} <Tag color="is-primary">{locale.name}</Tag>
          </>
        ),
      }}
      renderInput={() => (
        <WYSIWYG
          initialValue={input.value}
          placeholder={placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          hasError={showError}
        />
      )}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const getID = (() => {
  let i = 0;
  return () => ++i;
})();
const InstagramLinksField = ({ input, meta }: FieldRenderProps<Link[]>) => {
  const form = useFormState();
  const links = Array.isArray(input.value) ? input.value : [];
  const initialLinks: Link[] = form.initialValues.instagram_links || [];
  const existingLinkIDs = React.useMemo(() => new Set(initialLinks.map((link) => link.id)), [initialLinks]);
  const addLink = React.useCallback(() => {
    const id = (() => {
      let id_ = getID();
      while (existingLinkIDs.has(id_)) {
        id_ = getID();
      }
      return id_;
    })();
    input.onChange([...links, { id, value: '' }]);
  }, [input, existingLinkIDs, links]);

  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{ children: intl.formatMessage({ id: 'AdminProductTypes.instagramLinks' }) }}
      renderInput={() => (
        <LinksInput
          links={links}
          onChange={input.onChange}
          renderPreview={(link) => <InstagramPost id={link.id} url={link.value} />}
          onAdd={addLink}
        />
      )}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: showError ? 'is-danger' : undefined,
      }}
    />
  );
};

export interface IFieldsProps {
  availableLocales: IntlStateContextValue['intlState']['availableLocales'];
  categories: AdminCategoriesStateContextValue['state']['entities'];
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
  nameFieldKey: string;
  descriptionFieldKey: string;
  shortDescriptionFieldKey: string;
}

export const Fields: React.SFC<IFieldsProps> = React.memo(
  ({ availableLocales, categories, featureTypes, nameFieldKey, descriptionFieldKey, shortDescriptionFieldKey }) => {
    const intl = useIntl();

    return (
      <>
        <IntlField
          key_={nameFieldKey}
          locales={availableLocales}
          label={intl.formatMessage({
            id: 'AdminProductTypes.nameInput.label',
          })}
          placeholder={intl.formatMessage({
            id: 'AdminProductTypes.nameInput.placeholder',
          })}
        />
        <IntlField
          key_={descriptionFieldKey}
          locales={availableLocales}
          label={intl.formatMessage({
            id: 'AdminProductTypes.descriptionInput.label',
          })}
          placeholder={intl.formatMessage({
            id: 'AdminProductTypes.descriptionInput.placeholder',
          })}
          component={DescriptionField}
        />
        <IntlField
          key_={shortDescriptionFieldKey}
          locales={availableLocales}
          label={intl.formatMessage({
            id: 'AdminProductTypes.shortDescriptionInput.label',
          })}
          placeholder={intl.formatMessage({
            id: 'AdminProductTypes.shortDescriptionInput.placeholder',
          })}
        />
        <FinalFormField key="instagram_links" name="instagram_links" component={InstagramLinksField} />
        <FinalFormField key="categories" name="categories" render={getCategoriesSelectRenderer(categories)} />
        <FinalFormField key="feature_types" name="feature_types" render={getFeatureTypesSelectRenderer(featureTypes)} />
        <FinalFormField key="image" name="image" component={ImageField} />
      </>
    );
  },
  (prevProps, nextProps) =>
    arePropsEqual(prevProps, nextProps, {
      nameFieldKey: defaultCompare,
      descriptionFieldKey: defaultCompare,
      shortDescriptionFieldKey: defaultCompare,
      availableLocales: lengthCompare,
      categories: lengthCompare,
      featureTypes: lengthCompare,
    }),
);
