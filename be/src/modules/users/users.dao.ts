import { model, Model } from 'mongoose';
import { HttpStatusCode } from 'axios';
import { RestApiException } from '../../utils';
import { ICreateUserPayload, IUpdateUserPayload, IUser } from './users.types';
import { ILoginPayload } from '../auth';

export class UsersDao {
  public static readonly INSTANCE_NAME = 'usersDao';
  private readonly model: Model<IUser>;

  constructor () {
    this.model = model<IUser>('users');
  }

  async authenticate ({ username, password }: ILoginPayload): Promise<IUser | null> {
    return this.model.findOne({
      $or: [
        { username },
        { email: username }
      ],
      password,
      archived: false
    }).select('-password').exec();
  }

  async get (userId: string): Promise<IUser | null> {
    return this.model.findOne({ _id: userId, archived: false }).select('-password').exec();
  }

  async getByUsername (username: string): Promise<IUser | null> {
    return this.model.findOne({ username, archived: false }).select('-password').exec();
  }

  async getByEmail (email: string): Promise<IUser | null> {
    return this.model.findOne({ email, archived: false }).select('-password').exec();
  }

  async getAll (): Promise<IUser[]> {
    return this.model.find({ archived: false }).exec();
  }

  async create (payload: ICreateUserPayload): Promise<IUser> {
    return this.model.create({ ...payload });
  }

  async update (payload: IUpdateUserPayload & { id: string, password?: string }): Promise<IUser> {
    const user = await this.model.findById(payload.id).exec();
    if (!user) {
      throw new RestApiException('User not found', HttpStatusCode.NotFound);
    }
    user.username = payload.username ?? user.username;
    user.email = payload.email ?? user.email;
    user.fullname = payload.fullname ?? user.fullname;
    user.password = payload.password ?? user.password;
    await user.save();

    return user;
  }

  async delete (userId: string): Promise<string> {
    const deletedUser = await this.model.findOneAndUpdate({ _id: userId }, { archived: true }).exec();
    if (!deletedUser) {
      throw new RestApiException('User not found', HttpStatusCode.NotFound);
    }
    return deletedUser._id;
  }
}
