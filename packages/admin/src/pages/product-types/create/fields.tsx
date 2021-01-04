import React from 'react';
import { Field as FinalFormField, FieldRenderProps, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Field, FileInput, FormSelectField, FormTextField, HelpText, Label, Tag, Trigger } from '@eye8/admin-ui/index';
import { IntlField, IProps as IIntlFieldProps } from '@eye8/admin/components/intl-field';
import { LinksInput, Link } from '@eye8/admin/components/links-input';
import { ContextValue as AdminCategoriesStateContextValue } from '@eye8/admin/state/categories';
import { ContextValue as AdminCharacteristicValuesStateContextValue } from '@eye8/admin/state/characteristic-values';
import { ContextValue as AdminFeatureTypesStateContextValue } from '@eye8/admin/state/feature-types';
import { Wysiwyg } from '@eye8/client-ui';
import { InstagramPost } from '@eye8/client/components/instagram-post';
import { arePropsEqual, lengthCompare, defaultCompare } from '@eye8/shared/utils';

interface ICharacteristicValuesSelectProps extends FieldRenderProps<string[]> {
  characteristicValues: AdminCharacteristicValuesStateContextValue['state']['entities'];
}

const CharacteristicValuesSelect = ({ characteristicValues, input, meta }: ICharacteristicValuesSelectProps) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormSelectField
      labelProps={{
        children: (
          <>
            {intl.formatMessage({
              id: 'AdminProductTypes.characteristicValuesSelect.label',
            })}
          </>
        ),
      }}
      selectProps={{
        ...input,
        multiple: true,
        options: characteristicValues.map(({ id, name, characteristic }) => ({
          title: `${characteristic.name[intl.locale]}: ${name[intl.locale]}`,
          value: id.toString(),
        })),
        TriggerComponent: Trigger,
        searchable: true,
        clearable: true,
        placeholder: intl.formatMessage({ id: 'AdminProductTypes.characteristicValuesSelect.placeholder' }),
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

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
        TriggerComponent: Trigger,
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
        TriggerComponent: Trigger,
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
            {label} <Tag color="is-primary">{locale}</Tag>
          </>
        ),
      }}
      renderInput={() => (
        <Wysiwyg
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
  categories: AdminCategoriesStateContextValue['state']['entities'];
  featureTypes: AdminFeatureTypesStateContextValue['state']['entities'];
  characteristicValues: AdminCharacteristicValuesStateContextValue['state']['entities'];
  nameFieldKey: string;
  descriptionFieldKey: string;
  shortDescriptionFieldKey: string;
}

export const Fields: React.SFC<IFieldsProps> = React.memo(
  ({ categories, featureTypes, nameFieldKey, descriptionFieldKey, shortDescriptionFieldKey, characteristicValues }) => {
    const intl = useIntl();

    return (
      <>
        <IntlField
          key_={nameFieldKey}
          label={intl.formatMessage({
            id: 'AdminProductTypes.nameInput.label',
          })}
          placeholder={intl.formatMessage({
            id: 'AdminProductTypes.nameInput.placeholder',
          })}
        />
        <IntlField
          key_={descriptionFieldKey}
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
          label={intl.formatMessage({
            id: 'AdminProductTypes.shortDescriptionInput.label',
          })}
          placeholder={intl.formatMessage({
            id: 'AdminProductTypes.shortDescriptionInput.placeholder',
          })}
        />
        <FinalFormField key="instagram_links" name="instagram_links" component={InstagramLinksField} />
        <FinalFormField key="categories" name="categories" component={CategoriesSelect} categories={categories} />
        <FinalFormField
          key="feature_types"
          name="feature_types"
          component={FeatureTypesSelect}
          featureTypes={featureTypes}
        />
        <FinalFormField
          key="characteristic_values"
          name="characteristic_values"
          component={CharacteristicValuesSelect}
          characteristicValues={characteristicValues}
        />
        <FinalFormField key="image" name="image" component={ImageField} />
      </>
    );
  },
  (prevProps, nextProps) =>
    arePropsEqual(prevProps, nextProps, {
      nameFieldKey: defaultCompare,
      descriptionFieldKey: defaultCompare,
      shortDescriptionFieldKey: defaultCompare,
      categories: lengthCompare,
      featureTypes: lengthCompare,
    }),
);