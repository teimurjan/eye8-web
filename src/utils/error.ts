import * as util from 'util';

export const makeCustomError = (message: string) =>
  class {
    public message?: string;
    public name: string;
    constructor() {
      Error.captureStackTrace(this, this.constructor);
      this.message = message;
      this.name = this.constructor.name;
      util.inherits(this.constructor, Error);
    }
  };
