import { AppError } from "@common/errors";

export const errorHandler = async ({ error, set }: any) => {
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