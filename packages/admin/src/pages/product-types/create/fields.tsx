import React from 'react';
import { Field as FinalFormField, FieldRenderProps, useFormState } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Field, FileInput, FormSelectField, FormTextField, HelpText, Label, Tag, SelectTrigger } from '@eye8/admin-ui';
import { InstagramPost } from '@eye8/client/components';
import { Wysiwyg } from '@eye8/shared/components';
import { arePropsEqual, lengthCompare, defaultCompare } from '@eye8/shared/utils';

import { LinksInput, LinksInputProps, IntlField, IntlFieldProps } from '../../../components';
import { AdminFeatureTypesState, AdminCharacteristicValuesState, AdminCategoriesState } from '../../../state';

interface CharacteristicValuesSelectProps extends FieldRenderProps<string[]> {
  characteristicValues: AdminCharacteristicValuesState['entities'];
}

const CharacteristicValuesSelect = ({ characteristicValues, input, meta }: CharacteristicValuesSelectProps) => {
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
        TriggerComponent: SelectTrigger,
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

interface FeatureTypesSelectProps extends FieldRenderProps<string[]> {
  featureTypes: AdminFeatureTypesState['entities'];
}

const FeatureTypesSelect = ({ featureTypes, input, meta }: FeatureTypesSelectProps) => {
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
        TriggerComponent: SelectTrigger,
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

interface CategoriesSelectProps extends FieldRenderProps<string[]> {
  categories: AdminCategoriesState['entities'];
}

const CategoriesSelect = ({ categories, input, meta }: CategoriesSelectProps) => {
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
        TriggerComponent: SelectTrigger,
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

const DescriptionField: IntlFieldProps['component'] = ({ input, meta, label, placeholder, locale }) => {
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
const InstagramLinksField = ({ input, meta }: FieldRenderProps<LinksInputProps['links']>) => {
  const form = useFormState();
  const links = Array.isArray(input.value) ? input.value : [];
  const initialLinks: LinksInputProps['links'] = form.initialValues.instagram_links || [];
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

export interface FieldsProps {
  categories: AdminCategoriesState['entities'];
  featureTypes: AdminFeatureTypesState['entities'];
  characteristicValues: AdminCharacteristicValuesState['entities'];
  nameFieldKey: string;
  descriptionFieldKey: string;
  shortDescriptionFieldKey: string;
}

const Fields: React.SFC<FieldsProps> = React.memo(
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

export default Fields;
