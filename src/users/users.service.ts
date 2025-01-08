import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Session, SessionDocument } from 'src/db/schemas/Session.schema';
import { User, UserDocument } from 'src/db/schemas/User.schema';
import * as bcrypt from 'bcrypt';
import { createSession } from 'src/utils/createSession';
import { IPayload, IRefreshSession } from 'src/types/interfase';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Session.name) private sessionModel: Model<Session>,
  ) {}

  async register(payload: IPayload): Promise<UserDocument> {
    const { email, password } = payload;

    const user: User = await this.userModel.findOne({ email });

    if (user) {
      throw new ConflictException('Email already exist');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    return await this.userModel.create({ ...payload, password: hashPassword });
  }

  async login(payload: IPayload): Promise<SessionDocument> {
    const { email, password } = payload;

    const user: UserDocument = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      throw new UnauthorizedException('Email or password invalid');
    }

    await this.sessionModel.deleteOne({ userId: user._id });

    const newSession = createSession();

    return await this.sessionModel.create({
      userId: user._id,
      ...newSession,
    });
  }

  async refreshSession({
    sessionId,
    refreshToken,
  }: IRefreshSession): Promise<SessionDocument> {
    const oldSession = await this.sessionModel.findOne({
      _id: sessionId,
      refreshToken,
    });

    if (!oldSession) {
      throw new UnauthorizedException('Session not found');
    }

    if (Date.now() > oldSession.refreshTokenValidUntil.getTime()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.sessionModel.deleteOne({ _id: sessionId });

    const newSession = createSession();

    return await this.sessionModel.create({
      userId: oldSession.userId,
      ...newSession,
    });
  }

  async logout(
    sessionId: mongoose.Types.ObjectId,
  ): Promise<mongoose.mongo.DeleteResult> {
    return await this.sessionModel.deleteOne({ _id: sessionId });
  }

  async findSession(
    filter: mongoose.RootFilterQuery<Session>,
  ): Promise<SessionDocument | null> {
    return await this.sessionModel.findOne(filter);
  }

  async findUser(
    filter: mongoose.RootFilterQuery<User>,
  ): Promise<UserDocument | null> {
    return await this.userModel.findOne(filter);
  }
}
