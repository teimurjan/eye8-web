import * as yup from 'yup';

import { logError } from '@eye8/shared/utils';

export interface SchemaValidator {
  validate(values: object): object;
}

export default class implements SchemaValidator {
  private schema: yup.ObjectSchema<object> | yup.Lazy;
  constructor(schema: yup.ObjectSchema<object> | yup.Lazy) {
    this.schema = schema;
  }

  public validate = (values: object) => {
    try {
      this.schema.validateSync(values, { abortEarly: false });
      return {};
    } catch (e) {
      logError(e);
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
