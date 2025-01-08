import { Response } from 'express';
import { SessionDocument } from 'src/db/schemas/Session.schema';

export const setupSession = (res: Response, session: SessionDocument) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });
};
