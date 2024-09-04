class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

enum ServiceErrorType {
  ConflictError = 'Conflict',
  NotFoundError = 'NotFound',
  InternalServerError = 'InternalServerError',
  UnauthorizedError = 'UnauthorizedError',
  ValidationError = 'ValidationError',
}

class ServiceError extends Error {
  public readonly type: ServiceErrorType;

  constructor(message: string, type: ServiceErrorType) {
    super(message);
    this.name = 'ServiceError';
    this.type = type;
  }
}
const ConflictError = ServiceErrorType.ConflictError;
const NotFoundError = ServiceErrorType.NotFoundError;
const InternalServerError = ServiceErrorType.InternalServerError;
const UnauthorizedError = ServiceErrorType.UnauthorizedError;
const ValidationError = ServiceErrorType.ValidationError;


export {
  DomainError,
  RepositoryError,
  ServiceError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  ValidationError
};

