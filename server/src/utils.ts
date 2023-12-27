export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function removeWhitespace(str: string) {
  return str.replace(/\s/g, '');
}
