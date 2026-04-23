import { AppError } from "@common/errors";

export const errorHandler = async ({ error, code, set }: any) => {
    if (code === 'VALIDATION') {
      set.status = 422
      return {
        code: 'VALIDATION_ERROR',
        description: error.message
      }
    };

    if(code === 'NOT_FOUND') {
      set.status = 404
      return {
        code: 'NOT_FOUND',
        description: "Method or path not found"
      }
    }

    if (error instanceof AppError) {
      set.status = error.status;
      return {
        code: error.code,
        description: error.description
      };
    }

    console.error(error);

    set.status = 500;
    return {
      code: 'INTERNAL_ERROR',
      description: 'Unexpected error'
    };
};