// Error handling utilities

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export const handleApiError = (error: any): AppError => {
  if (error.response) {
    const status = error.response.status;
    const message = error.response.data?.message || error.message;
    
    switch (status) {
      case 400:
        return new ValidationError(message);
      case 401:
        return new UnauthorizedError(message);
      case 404:
        return new NotFoundError(message);
      default:
        return new AppError(message, status);
    }
  }
  
  if (error.request) {
    return new NetworkError();
  }
  
  return new AppError(error.message || 'An unexpected error occurred');
};

export const getErrorMessage = (error: AppError): string => {
  const errorMessages: Record<string, string> = {
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    VALIDATION_ERROR: 'Please check your input and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
  };
  
  return errorMessages[error.code || ''] || error.message;
};
