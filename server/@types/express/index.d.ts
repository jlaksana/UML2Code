declare global {
  namespace Express {
    export interface Request {
      diagramId: string;
    }
  }
}

export {};
