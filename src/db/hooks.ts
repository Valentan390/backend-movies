import {
  CallbackError,
  CallbackWithoutResultAndOptionalError,
  Document,
  Query,
} from 'mongoose';

export const handleSaveError = <T extends Document>(
  error: CallbackError & { code?: number; name?: string; status?: number },
  doc: T,
  next: CallbackWithoutResultAndOptionalError,
) => {
  console.error(`Error occurred during save: ${error.message}`);
  const { code, name } = error;
  error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
  next();
};

export const setUpdateSettings = function <T extends Document>(
  this: Query<T, T>,
  next: CallbackWithoutResultAndOptionalError,
) {
  console.log('Applying update settings: runValidators and new: true');
  this.setOptions({ runValidators: true, new: true });
  next();
};
