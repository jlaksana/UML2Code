import { CounterModel } from './models/diagram.model';

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function getNextSequence() {
  const id = 'diagramId';
  const ret = await CounterModel.findByIdAndUpdate(
    id,
    { $inc: { seq: 1 } },
    { new: true }
  );
  if (!ret) {
    await CounterModel.create({ _id: id, seq: 1000 });
    return 1000;
  }
  return ret.seq;
}

export function removeWhitespace(str: string) {
  return str.replace(/\s/g, '');
}
