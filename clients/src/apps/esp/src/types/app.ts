/**
 * Structed schema for API results.
 */
export type ApiResultType<T = undefined> =
  | ({
      /**
       * Succes message returned from the API.
       */
      readonly message: string;
      /**
       * Indicates a successful API call.
       */
      readonly success: true;
    } & (T extends undefined ? {} : { readonly data: NonNullable<T> }))
  | {
      /**
       * Error message returned from the API.
       */
      readonly message: string;
      /**
       * Indicates a failed API call.
       */
      readonly success: false;
      /**
       * Optional detail about the error.
       */
      readonly detail?: string;
    };
