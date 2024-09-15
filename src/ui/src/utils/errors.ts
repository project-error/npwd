import { AxiosError } from 'axios';

export const handleClientError = (error: unknown) => {
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An error occurred';
};
