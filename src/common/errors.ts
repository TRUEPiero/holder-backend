class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    public description?: string
  ) {
    super(code);
  }
}

class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity}_NOT_FOUND`, 404, `${entity} not found`);
  }
}

class NotCreatedError extends AppError {
  constructor(entity: string) {
    super(`${entity}_NOT_CREATED`, 404, `${entity} not created`);
  }
}

class NotUpdatedError extends AppError {
  constructor(entity: string) {
    super(`${entity}_NOT_UPDATED`, 404, `${entity} not updated`);
  }
}

class NotDeletedError extends AppError {
  constructor(entity: string) {
    super(`${entity}_NOT_DELETED`, 404, `${entity} not deleted`);
  }
}

class AccessDeniedError extends AppError {
  constructor() {
    super('ACCESS_DENIED', 403, 'Access denied');
  }
}



export {
  AppError,
  NotFoundError,
  NotCreatedError,
  NotUpdatedError,
  NotDeletedError,
  AccessDeniedError,
  
}