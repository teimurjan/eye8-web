import * as yup from 'yup';

export interface ISchemaValidator {
  validate(values: object): object;
}

export class SchemaValidator implements ISchemaValidator {
  private schema: yup.ObjectSchema<object> | yup.Lazy;
  constructor(schema: yup.ObjectSchema<object> | yup.Lazy) {
    this.schema = schema;
  }

  public validate = (values: object) => {
    try {
      this.schema.validateSync(values, { abortEarly: false });
      return {};
    } catch (e) {
      return e.inner.reduce(
        (errors: {}, innerError: yup.ValidationError) => ({
          ...errors,
          [innerError.path]: innerError.message,
        }),
        {},
      );
    }
  };
}
