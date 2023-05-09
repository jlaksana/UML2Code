function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

// eslint-disable-next-line import/prefer-default-export
export { getErrorMessage };
