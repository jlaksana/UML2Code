/* eslint-disable import/prefer-default-export */
const setDocumentTitle = (title: string) => {
  if (process.env.NODE_ENV === 'development') {
    document.title = `(DEV) ${title} - UML2Code`;
    return;
  }
  document.title = `${title} - UML2Code`;
};

export { setDocumentTitle };
