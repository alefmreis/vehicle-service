/* eslint-disable @typescript-eslint/no-explicit-any */

import { Response } from 'express';
import { ConflictError, DomainError, InternalServerError, NotFoundError, RepositoryError, ServiceError, UnauthorizedError, ValidationError } from '../../utils/Error';

class BaseController {
  public onSuccess(data: any, response: Response): Response {
    response.status(200);
    response.json({
      data
    });

    return response;
  }

  public onCreated(data: any, response: Response): Response {
    response.status(201);
    response.json({
      data
    });

    return response;
  }

  public onError(error: any, response: Response) {
    if (error instanceof DomainError) {
      const domainError = error as DomainError;

      response.status(500);
      response.json({ error: { message: domainError.message }, data: null });
      return response;
    }

    if (error instanceof RepositoryError) {
      const repositoryError = error as RepositoryError;

      response.status(500);
      response.json({ error: { message: repositoryError.message }, data: null });
      return response;
    }

    if (error instanceof ServiceError) {
      const svcError = error as ServiceError;

      switch (svcError.type) {
        case ConflictError:
          response.status(409);
          response.json({ error: { message: error.message }, data: null });
          break;
        case NotFoundError:
          response.status(404);
          response.json({ error: { message: error.message }, data: null });
          break;
        case InternalServerError:
          response.status(500);
          response.json({ error: { message: error.message }, data: null });
          break;
        case UnauthorizedError:
          response.status(401);
          response.json({ error: { message: error.message }, data: null });
          break;
        case ValidationError:
          response.status(422);
          response.json({ error: { message: error.message }, data: null });
          break;
      }

      return response;
    }

    response.status(500);
    response.json({ error: { message: error.message }, data: null });
    return response;

  }
}

export = BaseController